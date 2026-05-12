import { useState, useMemo } from 'react'
import {
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedCard } from './AnimatedCard'
import { SchoolDot } from './SchoolDot'
import type { SchoolId } from '@/data/schools'
import { schoolColors } from '@/data/schools'
import { useLang } from '@/context/LanguageContext'
import rawData from '@/data/benchmark_results.json'

// ── types ──────────────────────────────────────────────────────────────────────
interface ResultRow {
  preset: string
  benchmark: string
  condition: string
  n: number
  err: number
  acc: number
  strict_prompt?: number
  loose_prompt?: number
  strict_inst?: number
  loose_inst?: number
}

const data = rawData as ResultRow[]

// ── constants ──────────────────────────────────────────────────────────────────
const QWEN_MODELS = [
  { id: 'qwen3.5-0.8b-it', label: 'Qwen3.5-0.8B', short: '0.8B', sizeB: 0.8 },
  { id: 'qwen3.5-2b-it',   label: 'Qwen3.5-2B',   short: '2B',   sizeB: 2.0 },
  { id: 'qwen3.5-4b-it',   label: 'Qwen3.5-4B',   short: '4B',   sizeB: 4.0 },
  { id: 'qwen3.5-9b-it',   label: 'Qwen3.5-9B',   short: '9B',   sizeB: 9.0 },
  { id: 'qwen3.5-27b-it',  label: 'Qwen3.5-27B',  short: '27B',  sizeB: 27.0 },
] as const

type PreQinSchool = 'mohist' | 'dao' | 'confucian' | 'legal' | 'military' | 'logician'
type ExtSchool =
  | 'socratic' | 'stoic' | 'falsificationist'
  | 'hegelian' | 'pragmatist' | 'yangming'
  | 'bacon' | 'wittgenstein'
type MetaCondition = 'baseline' | 'neutral_long' | 'cot' | 'random_school' | 'router_auto'

const PRE_QIN: PreQinSchool[] = ['mohist', 'dao', 'confucian', 'legal', 'military', 'logician']
const EXT_SCHOOLS: ExtSchool[] = [
  'socratic', 'stoic', 'falsificationist',
  'hegelian', 'pragmatist', 'yangming', 'bacon', 'wittgenstein',
]

const COND_LABELS: Record<string, { en: string; zh: string }> = {
  mohist:           { en: 'Mohist',           zh: '墨家' },
  military:         { en: 'Military',         zh: '兵家' },
  dao:              { en: 'Daoist',           zh: '道家' },
  legal:            { en: 'Legalist',         zh: '法家' },
  confucian:        { en: 'Confucian',        zh: '儒家' },
  logician:         { en: 'Logician',         zh: '名家' },
  socratic:         { en: 'Socratic',         zh: '苏格拉底' },
  stoic:            { en: 'Stoic',            zh: '斯多葛' },
  falsificationist: { en: 'Falsificationist', zh: '证伪学派' },
  hegelian:         { en: 'Hegelian',         zh: '黑格尔' },
  pragmatist:       { en: 'Pragmatist',       zh: '实用主义' },
  yangming:         { en: 'Yangming',         zh: '阳明学' },
  bacon:            { en: "Bacon's Idols",    zh: '培根四偶像' },
  wittgenstein:     { en: 'Wittgenstein',     zh: '维特根斯坦' },
  neutral_long:     { en: 'Neutral+',         zh: '中性长' },
  baseline:         { en: 'Baseline',         zh: '基准' },
  cot:              { en: 'CoT',              zh: '思维链' },
  random_school:    { en: 'Random school',    zh: '随机学派' },
  router_auto:      { en: 'Router-auto',      zh: '智能路由' },
}

const BENCH_ORDER = ['mmlu', 'bbh', 'gsm8k', 'truthfulqa', 'ifeval', 'humaneval'] as const
type Benchmark = typeof BENCH_ORDER[number]

const BENCH_LABELS: Record<Benchmark, { en: string; zh: string; cap: { en: string; zh: string } }> = {
  mmlu:       { en: 'MMLU',       zh: 'MMLU',       cap: { en: 'Knowledge',     zh: '知识广度' } },
  bbh:        { en: 'BBH',        zh: 'BBH',        cap: { en: 'Reasoning',     zh: '复杂推理' } },
  gsm8k:      { en: 'GSM8K',      zh: 'GSM8K',      cap: { en: 'Math',          zh: '数学推理' } },
  truthfulqa: { en: 'TruthfulQA', zh: 'TruthfulQA', cap: { en: 'Truthfulness',  zh: '事实准确' } },
  ifeval:     { en: 'IFEval',     zh: 'IFEval',     cap: { en: 'Instruction',   zh: '指令遵从' } },
  humaneval:  { en: 'HumanEval',  zh: 'HumanEval',  cap: { en: 'Code',          zh: '代码生成' } },
}

// chart palette
const MODEL_COLORS = ['#7BAFD4', '#E5A86A', '#85C192', '#C49A6C', '#A8526C']
const META_COLORS: Record<MetaCondition, string> = {
  baseline:      '#1f2937',
  neutral_long:  '#6b7280',
  cot:           '#a16207',
  random_school: '#94a3b8',
  router_auto:   '#0ea5e9',
}

// ── helpers ────────────────────────────────────────────────────────────────────
function get(preset: string, benchmark: string, condition: string): ResultRow | undefined {
  return data.find(r => r.preset === preset && r.benchmark === benchmark && r.condition === condition)
}

function deltaNum(v: number, base: number) {
  return (v - base) * 100
}

function deltaColor(d: number) {
  if (d > 1)   return 'text-emerald-600 dark:text-emerald-400'
  if (d > -3)  return 'text-amber-600'
  if (d > -10) return 'text-orange-600'
  return 'text-red-500'
}

function cellBg(d: number): string {
  if (d > 1)    return 'bg-emerald-50 dark:bg-emerald-900/20'
  if (d > -3)   return 'bg-amber-50 dark:bg-amber-900/20'
  if (d > -10)  return 'bg-orange-50 dark:bg-orange-900/20'
  return 'bg-red-50 dark:bg-red-900/20'
}

/** Δ vs baseline, pooled across all 5 Qwen sizes */
function pooledDelta(condition: string, benchmark: Benchmark): number | null {
  const ds: number[] = []
  for (const m of QWEN_MODELS) {
    const base = get(m.id, benchmark, 'baseline')
    const c    = get(m.id, benchmark, condition)
    if (base && c) ds.push(deltaNum(c.acc, base.acc))
  }
  if (!ds.length) return null
  return ds.reduce((a, b) => a + b, 0) / ds.length
}

/** Mean Δ across all (preset, benchmark) cells for a condition. */
function meanDelta(condition: string): number | null {
  const ds: number[] = []
  for (const m of QWEN_MODELS) {
    for (const b of BENCH_ORDER) {
      const base = get(m.id, b, 'baseline')
      const c    = get(m.id, b, condition)
      if (base && c) ds.push(deltaNum(c.acc, base.acc))
    }
  }
  if (!ds.length) return null
  return ds.reduce((a, b) => a + b, 0) / ds.length
}

/** Win count: cells where condition > baseline (out of 30). */
function winCount(condition: string): { wins: number; total: number } {
  let wins = 0, total = 0
  for (const m of QWEN_MODELS) {
    for (const b of BENCH_ORDER) {
      const base = get(m.id, b, 'baseline')
      const c    = get(m.id, b, condition)
      if (base && c) {
        total += 1
        if (c.acc > base.acc) wins += 1
      }
    }
  }
  return { wins, total }
}

// ── sub-components ──────────────────────────────────────────────────────────────

/** Router-auto headline panel: Δ vs baseline for every (model, benchmark). */
function RouterAutoHeadline({ lang }: { lang: string }) {
  const rows = QWEN_MODELS.map(m => {
    const cells = BENCH_ORDER.map(b => {
      const base = get(m.id, b, 'baseline')
      const r    = get(m.id, b, 'router_auto')
      if (!base || !r) return { b, d: null as number | null, acc: null as number | null }
      return { b, d: deltaNum(r.acc, base.acc), acc: r.acc * 100 }
    })
    const present = cells.map(c => c.d).filter((v): v is number => v != null)
    const avg = present.length ? present.reduce((a, b) => a + b, 0) / present.length : null
    return { model: m, cells, avg }
  })
  const overall = meanDelta('router_auto')
  return (
    <div className="space-y-3">
      <div className="rounded border border-sky-200/60 bg-sky-50/60 dark:border-sky-900/40 dark:bg-sky-950/30 px-3 py-2">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div className="text-xs text-muted-foreground">
            {lang === 'zh'
              ? '任务感知路由（router_auto）— 跨 5 个模型 × 6 评测集的 30 个 cell'
              : 'Task-aware router (router_auto) — 30 cells across 5 models × 6 benchmarks'}
          </div>
          <div className="text-sm font-semibold text-sky-700 dark:text-sky-300">
            {lang === 'zh' ? '总均值 ' : 'Overall mean '}
            <span className="font-mono">{overall != null ? `${overall > 0 ? '+' : ''}${overall.toFixed(2)} pp` : '—'}</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-3 font-medium text-muted-foreground w-20">{lang === 'zh' ? '模型' : 'Model'}</th>
              {BENCH_ORDER.map(b => (
                <th key={b} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[78px]">
                  <div>{BENCH_LABELS[b][lang as 'en' | 'zh']}</div>
                </th>
              ))}
              <th className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[80px]">{lang === 'zh' ? '均值' : 'Row avg'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.model.id} className="border-b last:border-0">
                <td className="py-1.5 pr-3 font-mono">{r.model.short}</td>
                {r.cells.map(c => (
                  <td key={c.b} className={`text-center py-1.5 px-2 font-mono rounded ${c.d == null ? '' : cellBg(c.d)}`}>
                    {c.d == null ? <span className="text-muted-foreground/40">—</span> : (
                      <>
                        <div className={deltaColor(c.d)}>{c.d > 0 ? '+' : ''}{c.d.toFixed(1)}</div>
                        <div className="text-[9px] text-muted-foreground/70">{c.acc!.toFixed(0)}%</div>
                      </>
                    )}
                  </td>
                ))}
                <td className={`text-center py-1.5 px-2 font-mono font-semibold ${r.avg == null ? '' : cellBg(r.avg)}`}>
                  <span className={r.avg == null ? '' : deltaColor(r.avg)}>
                    {r.avg == null ? '—' : `${r.avg > 0 ? '+' : ''}${r.avg.toFixed(2)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-muted-foreground">
        {lang === 'zh'
          ? '路由规则（router.py）：humaneval→dao；bbh 逻辑子任务→mohist；truthfulqa→legal；gsm8k→baseline；ifeval/mmlu→neutral_long。9B 与 27B 的强增益部分来源于 baseline 异常（9B HumanEval=4.88%、27B TruthfulQA=0%），剔除后仍剩 +5~+10pp 的真实路由增益。'
          : 'Router rules (router.py): humaneval→dao; bbh logic→mohist; truthfulqa→legal; gsm8k→baseline; ifeval/mmlu→neutral_long. The huge 9B/27B gains are partly from baseline anomalies (9B HumanEval=4.88%, 27B TruthfulQA=0%); the genuine routing gain is ~+5–10 pp after de-biasing.'}
      </p>
    </div>
  )
}

/** Pooled school × benchmark Δ heat-table (averaged across all 5 Qwen sizes) — full 14 schools */
function PooledHeatTable({ lang, schools }: { lang: string; schools: readonly string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-32">
              {lang === 'zh' ? '学派' : 'School'}
            </th>
            {BENCH_ORDER.map(b => (
              <th key={b} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[80px]">
                <div>{BENCH_LABELS[b][lang as 'en' | 'zh']}</div>
                <div className="text-[10px] text-muted-foreground/70">{BENCH_LABELS[b].cap[lang as 'en' | 'zh']}</div>
              </th>
            ))}
            <th className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[80px]">
              {lang === 'zh' ? '均值' : 'Row avg'}
            </th>
          </tr>
        </thead>
        <tbody>
          {schools.map(s => {
            const cells = BENCH_ORDER.map(b => ({ b, d: pooledDelta(s, b) }))
            const present = cells.map(c => c.d).filter((v): v is number => v != null)
            const avg = present.length ? present.reduce((a, b) => a + b, 0) / present.length : null
            const isSchool = PRE_QIN.includes(s as PreQinSchool) || EXT_SCHOOLS.includes(s as ExtSchool)
            return (
              <tr key={s} className="border-b last:border-0">
                <td className="py-1.5 pr-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    {isSchool && <SchoolDot school={s as SchoolId} />}
                    {COND_LABELS[s][lang as 'en' | 'zh']}
                  </span>
                </td>
                {cells.map(({ b, d }) => {
                  if (d == null) return <td key={b} className="text-center py-1.5 px-2 text-muted-foreground/40">—</td>
                  return (
                    <td key={b} className={`text-center py-1.5 px-2 font-mono rounded ${cellBg(d)}`}>
                      <span className={deltaColor(d)}>
                        {d > 0 ? '+' : ''}{d.toFixed(1)}
                      </span>
                    </td>
                  )
                })}
                <td className={`text-center py-1.5 px-2 font-mono font-semibold ${avg == null ? '' : cellBg(avg)}`}>
                  <span className={avg == null ? '' : deltaColor(avg)}>
                    {avg == null ? '—' : `${avg > 0 ? '+' : ''}${avg.toFixed(2)}`}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-muted-foreground">
        {lang === 'zh'
          ? '单位：百分点（pp）相对 baseline，跨 0.8B/2B/4B/9B/27B 五个 Qwen 规模取均值。绿=改进，橙=略降，红=显著下降。'
          : 'Δ vs baseline (pp), averaged across Qwen 0.8B/2B/4B/9B/27B. Green = improvement; red = large drop.'}
      </p>
    </div>
  )
}

/** Per-preset accuracy heat-table for a single benchmark across a configurable condition list */
function PerSizeTable({ benchmark, lang, conditions }: { benchmark: Benchmark; lang: string; conditions: readonly string[] }) {
  const presets = QWEN_MODELS
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-3 font-medium text-muted-foreground w-32">
              {lang === 'zh' ? '条件' : 'Condition'}
            </th>
            {presets.map(m => (
              <th key={m.id} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[78px]">
                <div>{m.short}</div>
                <div className="text-[10px] text-muted-foreground/70">Δ pp</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conditions.map(c => (
            <tr key={c} className="border-b last:border-0">
              <td className="py-1.5 pr-3 font-medium">
                <span className="flex items-center gap-1.5">
                  {(PRE_QIN as readonly string[]).includes(c) || (EXT_SCHOOLS as readonly string[]).includes(c) ? <SchoolDot school={c as SchoolId} /> : null}
                  {COND_LABELS[c][lang as 'en' | 'zh']}
                </span>
              </td>
              {presets.map(m => {
                const row = get(m.id, benchmark, c)
                const base = get(m.id, benchmark, 'baseline')
                if (!row || !base) {
                  return <td key={m.id} className="text-center py-1.5 px-2 text-muted-foreground/40">—</td>
                }
                const acc = row.acc * 100
                const d = c === 'baseline' ? 0 : deltaNum(row.acc, base.acc)
                if (c === 'baseline') {
                  return (
                    <td key={m.id} className="text-center py-1.5 px-2 font-mono bg-muted/30">
                      <div className="font-semibold">{acc.toFixed(1)}%</div>
                      <div className="text-[9px] text-muted-foreground">acc</div>
                    </td>
                  )
                }
                return (
                  <td key={m.id} className={`text-center py-1.5 px-2 font-mono rounded ${cellBg(d)}`}>
                    <div className={deltaColor(d)}>{d > 0 ? '+' : ''}{d.toFixed(1)}</div>
                    <div className="text-[9px] text-muted-foreground/70">{acc.toFixed(0)}%</div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Scaling curve: accuracy vs model size, one line per condition, per benchmark */
function ScalingChart({ benchmark, lang }: { benchmark: Benchmark; lang: string }) {
  const presets = QWEN_MODELS
  const chartData = presets.map(m => {
    const row: Record<string, number | string> = { size: m.short }
    for (const c of ['baseline', 'neutral_long', 'router_auto'] as const) {
      const r = get(m.id, benchmark, c)
      if (r) row[c] = r.acc * 100
    }
    for (const s of PRE_QIN) {
      const r = get(m.id, benchmark, s)
      if (r) row[s] = r.acc * 100
    }
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="size" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={42} />
        <Tooltip
          formatter={(v, n) => [`${Number(v).toFixed(1)}%`, COND_LABELS[String(n)]?.[lang as 'en' | 'zh'] ?? String(n)]}
        />
        <Legend
          iconSize={10}
          wrapperStyle={{ fontSize: 10 }}
          formatter={(v) => COND_LABELS[String(v)]?.[lang as 'en' | 'zh'] ?? String(v)}
        />
        <Line type="monotone" dataKey="baseline" stroke={META_COLORS.baseline} strokeDasharray="4 4" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="neutral_long" stroke={META_COLORS.neutral_long} strokeDasharray="2 2" strokeWidth={1.5} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="router_auto" stroke={META_COLORS.router_auto} strokeWidth={2.5} dot={{ r: 3 }} />
        {PRE_QIN.map(s => (
          <Line key={s} type="monotone" dataKey={s} stroke={schoolColors[s]} strokeWidth={1.4} dot={{ r: 2.2 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/** Δ-vs-baseline grouped bar chart for a school set across Qwen sizes, one benchmark */
function DeltaChart({ benchmark, lang, schools }: { benchmark: Benchmark; lang: string; schools: readonly string[] }) {
  const presets = QWEN_MODELS
  const chartData = schools.map(s => {
    const row: Record<string, number | string> = {
      school: COND_LABELS[s][lang as 'en' | 'zh'],
    }
    presets.forEach(m => {
      const base = get(m.id, benchmark, 'baseline')
      const cond = get(m.id, benchmark, s)
      if (base && cond) row[m.short] = deltaNum(cond.acc, base.acc)
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 32 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="school" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} height={50} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(0)}pp`} width={54} />
        <Tooltip formatter={(v, n) => [`${Number(v) > 0 ? '+' : ''}${Number(v).toFixed(1)}pp`, String(n)]} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1.5} />
        {presets.map((m, i) => (
          <Bar key={m.id} dataKey={m.short} fill={MODEL_COLORS[i % MODEL_COLORS.length]} radius={[3, 3, 0, 0]} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}

/** School radar — rank-normalized Δ across the 6 benchmarks (1 = best of 6 schools on that bench) */
function SchoolRadar({ school, lang }: { school: PreQinSchool; lang: string }) {
  const radarData = useMemo(() => {
    return BENCH_ORDER.map(b => {
      const deltas = PRE_QIN.map(s => pooledDelta(s, b)).filter(v => v != null) as number[]
      if (deltas.length === 0) return { bench: BENCH_LABELS[b][lang as 'en' | 'zh'], value: 0 }
      const lo = Math.min(...deltas), hi = Math.max(...deltas)
      const my = pooledDelta(school, b)
      const rng = hi - lo || 1
      const norm = my == null ? 0 : (my - lo) / rng
      return { bench: BENCH_LABELS[b][lang as 'en' | 'zh'], value: norm }
    })
  }, [school, lang])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={radarData} margin={{ top: 12, right: 24, left: 24, bottom: 0 }}>
        <PolarGrid stroke="#d4d4d8" />
        <PolarAngleAxis dataKey="bench" tick={{ fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} axisLine={false} />
        <Radar
          name={COND_LABELS[school][lang as 'en' | 'zh']}
          dataKey="value"
          stroke={schoolColors[school]}
          fill={schoolColors[school]}
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

/** Per-school strength profile (Pre-Qin 6): radar + best/worst + one-line recommendation */
function SchoolStrengthGrid({ lang }: { lang: string }) {
  const APPLICATION: Record<PreQinSchool, { en: string; zh: string }> = {
    mohist:    { en: 'Classification, short-answer QA, single-step logic, risk-gating.',
                 zh: '分类、短答案问答、单步逻辑、风控决策。' },
    dao:       { en: 'Default general-purpose system prompt; coding assistants; stable under uncertainty.',
                 zh: '通用默认 system prompt；代码助手；不确定性场景下的稳健输出。' },
    confucian: { en: 'Math / STEM tutoring, code review, culturally-sensitive moderation.',
                 zh: '数学/STEM 辅导、代码 review、文化敏感内容审核。' },
    legal:     { en: 'Fact-checking, compliance review, medical/legal/financial QA.',
                 zh: '事实核查、合规审查、医疗/法律/金融问答。' },
    military:  { en: 'Security code review, red-teaming, threat modeling.',
                 zh: '安全代码评审、红队/对抗测试、威胁建模。' },
    logician:  { en: 'Spec / API / contract review, requirements clarification.',
                 zh: '需求澄清、规格/API/合同语义审查。' },
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRE_QIN.map(s => {
        const perBench = BENCH_ORDER
          .map(b => ({ b, d: pooledDelta(s, b) ?? Number.NaN }))
          .filter(x => !Number.isNaN(x.d))
        const best = perBench.length ? perBench.reduce((a, b) => (a.d >= b.d ? a : b)) : null
        const worst = perBench.length ? perBench.reduce((a, b) => (a.d <= b.d ? a : b)) : null
        return (
          <Card key={s}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <SchoolDot school={s} />
                {COND_LABELS[s][lang as 'en' | 'zh']}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SchoolRadar school={s} lang={lang} />
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {lang === 'zh' ? '最强' : 'Best'}
                  </div>
                  <div className="font-mono">
                    {best ? `${BENCH_LABELS[best.b][lang as 'en' | 'zh']} ${best.d > 0 ? '+' : ''}${best.d.toFixed(1)}pp` : '—'}
                  </div>
                </div>
                <div className="rounded bg-red-50 dark:bg-red-900/20 px-2 py-1">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {lang === 'zh' ? '最弱' : 'Worst'}
                  </div>
                  <div className="font-mono">
                    {worst ? `${BENCH_LABELS[worst.b][lang as 'en' | 'zh']} ${worst.d > 0 ? '+' : ''}${worst.d.toFixed(1)}pp` : '—'}
                  </div>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {lang === 'zh' ? '推荐应用：' : 'Application: '}
                </span>
                {APPLICATION[s][lang as 'en' | 'zh']}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/** Condition leaderboard: mean Δ + win-rate across all 30 cells, sorted. */
function ConditionLeaderboard({ lang }: { lang: string }) {
  const allConds = [
    'router_auto', 'neutral_long',
    ...PRE_QIN, ...EXT_SCHOOLS,
    'cot', 'random_school',
  ]
  const rows = allConds.map(c => {
    const m = meanDelta(c)
    const w = winCount(c)
    return { c, m, ...w }
  }).sort((a, b) => (b.m ?? -Infinity) - (a.m ?? -Infinity))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-3 font-medium text-muted-foreground">#</th>
            <th className="text-left py-2 pr-3 font-medium text-muted-foreground">{lang === 'zh' ? '条件' : 'Condition'}</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">{lang === 'zh' ? '均值 Δpp' : 'Mean Δpp'}</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">{lang === 'zh' ? '胜率 (>baseline)' : 'Wins vs baseline'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const isSchool = PRE_QIN.includes(r.c as PreQinSchool) || EXT_SCHOOLS.includes(r.c as ExtSchool)
            return (
              <tr key={r.c} className="border-b last:border-0">
                <td className="py-1.5 pr-3 font-mono text-muted-foreground">{i + 1}</td>
                <td className="py-1.5 pr-3">
                  <span className="flex items-center gap-1.5">
                    {isSchool && <SchoolDot school={r.c as SchoolId} />}
                    <span className="font-medium">{COND_LABELS[r.c][lang as 'en' | 'zh']}</span>
                  </span>
                </td>
                <td className={`text-right py-1.5 px-2 font-mono ${r.m == null ? '' : deltaColor(r.m)}`}>
                  {r.m == null ? '—' : `${r.m > 0 ? '+' : ''}${r.m.toFixed(2)}`}
                </td>
                <td className="text-right py-1.5 px-2 font-mono">
                  {r.wins}/{r.total}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── main component ──────────────────────────────────────────────────────────────
export function BenchmarkTab() {
  const { lang } = useLang()
  const [selectedBench, setSelectedBench] = useState<Benchmark>('bbh')
  const [schoolSet, setSchoolSet] = useState<'preqin' | 'extended'>('preqin')

  const activeSchools = schoolSet === 'preqin' ? PRE_QIN : EXT_SCHOOLS
  const perSizeConditions = schoolSet === 'preqin'
    ? ['baseline', 'neutral_long', 'router_auto', ...PRE_QIN] as const
    : ['baseline', 'neutral_long', 'cot', 'random_school', ...EXT_SCHOOLS] as const

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">
          {lang === 'zh' ? '通用能力基准测试（完整版）' : 'General-Capability Benchmarks (full sweep)'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === 'zh'
            ? '5 个 Qwen3.5 模型规模 × 19 种条件 × 6 个评测集 = 570 个 (preset, benchmark, condition) 单元，2,218,259 条样本级记录。19 条件 = 3 基线（baseline / neutral_long / cot）+ 6 先秦学派 + 8 后续学派 + 2 元条件（random_school / router_auto）。'
            : '5 Qwen3.5 sizes × 19 conditions × 6 benchmarks = 570 (preset, benchmark, condition) cells, 2,218,259 sample-level records. 19 conditions = 3 baselines (baseline / neutral_long / cot) + 6 Pre-Qin schools + 8 extended schools + 2 meta-conditions (random_school / router_auto).'}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {lang === 'zh'
            ? '已知数据异常：9B HumanEval baseline = 4.88%（neutral_long = 44.51%）、27B TruthfulQA baseline = 0%。两者都会放大学派/路由的表观增益，引用大幅 Δpp 时需用 neutral_long 作为参照。'
            : 'Known baseline anomalies: 9B HumanEval baseline = 4.88% (vs neutral_long = 44.51%) and 27B TruthfulQA baseline = 0%. Both inflate apparent school / router gains — use neutral_long as the reference when citing large Δs.'}
        </p>
      </div>

      {/* Router-auto headline */}
      <AnimatedCard index={0}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '头条结果：router_auto（任务感知路由）vs baseline'
                : 'Headline: router_auto (task-aware routing) vs baseline'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RouterAutoHeadline lang={lang} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Full condition leaderboard */}
      <AnimatedCard index={1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '19 条件全排名 — 跨 30 个 cell 的均值 Δ 与胜率'
                : '19-condition leaderboard — mean Δ and win-rate across 30 cells'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConditionLeaderboard lang={lang} />
            <p className="mt-2 text-[10px] text-muted-foreground">
              {lang === 'zh'
                ? '"胜率" = 在 5 模型 × 6 评测集 = 30 个 (preset, benchmark) 上 condition > baseline 的格子数。router_auto 与 neutral_long 各拿下 20/30。'
                : '"Wins" = number of (preset, benchmark) cells (5 × 6 = 30) where the condition beats baseline. router_auto and neutral_long tie at 20/30.'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Pre-Qin pooled heat-table */}
      <AnimatedCard index={2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '先秦 6 学派 × 评测集 — 聚合 Δ vs baseline（跨 5 个 Qwen 规模）'
                : 'Pre-Qin 6 × Benchmark — pooled Δ vs baseline (across 5 Qwen sizes)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PooledHeatTable lang={lang} schools={PRE_QIN} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Extended 8 + cot pooled heat-table */}
      <AnimatedCard index={3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '后续 8 学派 + CoT × 评测集 — 聚合 Δ（多数在 ≥4B 短答案上系统性崩溃）'
                : 'Extended 8 + CoT × Benchmark — pooled Δ (most collapse on short-answer ≥4B)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PooledHeatTable lang={lang} schools={[...EXT_SCHOOLS, 'cot']} />
            <div className="mt-3 rounded border-l-4 border-amber-300 bg-amber-50/40 dark:bg-amber-900/10 px-3 py-2 text-[11px] leading-relaxed text-foreground/80">
              <p className="font-medium mb-1">{lang === 'zh' ? '崩溃模式（非"学派无效"）：' : 'Collapse pattern (not "school is bad"):'}</p>
              {lang === 'zh' ? (
                <>这些学派要求多步元结构（追问→分析→综合→结论）。在 MMLU 16 token / TruthfulQA 16 token / GSM8K 严格数字答案上，大模型严格服从元结构指令导致输出在元推理阶段被截断。证据：2B 模型上同样的 prompt 仅 -5 pp（小模型无法严格执行元指令 → 反而保留了答案）；4B 起服从度上升，准确率断崖式下跌 -50~-90 pp。</>
              ) : (
                <>These schools demand multi-step meta-structure (interrogate → analyse → synthesise → conclude). On MMLU/TruthfulQA's 16-token cap and GSM8K's strict numeric format, larger models faithfully execute the meta-template and the answer is cut off in the meta-reasoning phase. Evidence: 2B suffers only −5 pp (too weak to follow the meta-instruction strictly), while 4B+ comply tightly and accuracy collapses by 50–90 pp.</>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Per-school strength profile grid (Pre-Qin 6) */}
      <AnimatedCard index={4}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '每学派强弱画像（先秦 6）— rank-normalized 雷达 + 推荐应用域'
                : 'Per-school Strength Profile (Pre-Qin 6) — rank-normalized radar + suggested application'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SchoolStrengthGrid lang={lang} />
            <p className="mt-3 text-[10px] text-muted-foreground">
              {lang === 'zh'
                ? '雷达数值为 rank-normalized：每个评测集内，6 个学派的 Δ 被线性缩放到 [0, 1]，1 = 该 benchmark 上最佳的学派。形状差异即是"擅长方向"差异。'
                : 'Radar values are rank-normalized: for each benchmark the 6 schools’ Δs are scaled to [0, 1] (1 = best school on that benchmark). Shape differences = different strength directions.'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Scaling curves picker */}
      <AnimatedCard index={5}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-3 flex-wrap">
              <span>
                {lang === 'zh' ? '模型规模扩展曲线（先秦 6 + 元条件）' : 'Scaling curve (Pre-Qin 6 + meta-conditions)'}
              </span>
              <span className="flex gap-1 flex-wrap">
                {BENCH_ORDER.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBench(b)}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      selectedBench === b
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground bg-muted'
                    }`}
                  >
                    {BENCH_LABELS[b][lang as 'en' | 'zh']}
                  </button>
                ))}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScalingChart benchmark={selectedBench} lang={lang} />
            <p className="mt-2 text-[10px] text-muted-foreground">
              {lang === 'zh'
                ? '黑色虚线 = baseline；灰色虚线 = neutral_long；蓝色实线 = router_auto；彩色实线 = 先秦 6 学派。注意 9B 是先秦学派最强的"甜点"，27B 上部分学派服从度过高反而回落。'
                : 'Black dashed = baseline; grey dashed = neutral_long; blue solid = router_auto; coloured solid = Pre-Qin 6. 9B is the sweet spot; on 27B some schools over-comply and lose ground.'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Per-size table & delta chart for current benchmark, with school-set switch */}
      <AnimatedCard index={6}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-3 flex-wrap">
              <span>
                {BENCH_LABELS[selectedBench][lang as 'en' | 'zh']}
                {' — '}
                {lang === 'zh' ? '按模型规模分组的 Δ' : 'Δ vs baseline by model size'}
              </span>
              <span className="flex gap-1">
                <button
                  onClick={() => setSchoolSet('preqin')}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    schoolSet === 'preqin'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground bg-muted'
                  }`}
                >
                  {lang === 'zh' ? '先秦 6' : 'Pre-Qin 6'}
                </button>
                <button
                  onClick={() => setSchoolSet('extended')}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    schoolSet === 'extended'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground bg-muted'
                  }`}
                >
                  {lang === 'zh' ? '后续 8' : 'Extended 8'}
                </button>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DeltaChart benchmark={selectedBench} lang={lang} schools={activeSchools} />
            <PerSizeTable benchmark={selectedBench} lang={lang} conditions={perSizeConditions} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Key findings (full data) */}
      <AnimatedCard index={7}>
        <div className="rounded-lg border-l-4 border-[#8EA8C5] bg-[#8EA8C5]/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground">
            {lang === 'zh' ? '核心发现（基于完整 570-cell 数据）' : 'Key Findings (full 570-cell sweep)'}
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-foreground/80 list-disc list-inside">
            {lang === 'zh' ? (
              <>
                <li><strong>router_auto 是唯一系统性正向的条件</strong>（均值 +7.69pp，20/30 cell 胜过 baseline），在 BBH/HumanEval/TruthfulQA 上拿下 #1。这是"学派影响真实存在"的最强直接证据 —— 如果学派无影响，按任务选择学派不可能带来增益。</li>
                <li><strong>HumanEval 是学派最普遍受益的任务</strong>：6 个先秦学派全部进入 top-7（dao +12.68 / confucian +12.44 / logician +12.07 / legal +11.46 / military +10.00），baseline 排到第 8 名。代码生成的"试错精神"与学派的"多路径 / 规则 / 反思"普遍兼容。</li>
                <li><strong>BBH 上只有 mohist 正向（+0.52pp）</strong>。"节用 / 直接判决"精确匹配短答案推理，9B 上 +14.19pp。其余学派要么强压模型搞元结构 → 答案被截断（-25 ~ -30pp），要么破坏推理链。</li>
                <li><strong>TruthfulQA 上 legal 弱促进（+0.78pp）</strong>，与"零容忍幻觉"的设计意图一致；27B 上 router_auto 把它的 0% baseline 拉到 84.94%（baseline 异常）。</li>
                <li><strong>GSM8K 上没有任何学派正向</strong>。数学推理对 system prompt 干扰极敏感，后续 8 学派在 27B 上集体掉 -90pp（从 ~96% 降到 ~3%）—— 强模型严格执行元指令时被截断在元推理阶段。</li>
                <li><strong>MMLU 几乎不动</strong>（baseline、neutral_long、router_auto 三者并列 67%），16 token 限制让任何"思考"都无法转化为分数。<strong>BBH 才是学派最大区分度的 benchmark</strong>（mohist +0.52 → military −27.44，分化 28pp）。</li>
                <li><strong>9B 是先秦学派的甜点</strong>：所有学派平均 Δ 在 9B 上 +3.4pp（唯一正向规模），0.8B/2B 弱小、4B 过度服从短答案截断、27B 部分 over-comply。规模—prompt 服从度呈倒 U。</li>
                <li><strong>后续 8 学派不是"无效"而是"格式不匹配"</strong>。2B 上仅 -5pp（模型太弱跟不上元指令），4B+ 上 -50 ~ -90pp（严格服从导致截断）。改成"内部思考 + 仅输出最终答案"双段式 prompt 是 Φ 修复方向。</li>
                <li><strong>random_school 比平均学派更差</strong>（-19.92pp 平均，3/30 胜率），说明 router_auto 的增益主要来自"正确选择"，而不是"任何 system prompt 都好"。</li>
              </>
            ) : (
              <>
                <li><strong>router_auto is the only systematically positive condition</strong> (+7.69 pp mean, 20/30 cells beat baseline) and tops BBH/HumanEval/TruthfulQA. Its very existence is the strongest direct evidence that school effects are real — if schools had no signal, task-based routing couldn't help.</li>
                <li><strong>HumanEval is the most school-friendly task</strong>: all 6 Pre-Qin schools place in the top-7 (dao +12.68 / confucian +12.44 / logician +12.07 / legal +11.46 / military +10.00); baseline drops to rank 8. The trial-and-error nature of code generation pairs broadly with any school's added structure.</li>
                <li><strong>Only mohist is positive on BBH</strong> (+0.52 pp pooled; +14.19 pp on 9B). “Jié-yòng / direct judgment” fits short-answer reasoning; other schools force meta-structure that gets truncated.</li>
                <li><strong>Legal weakly helps TruthfulQA</strong> (+0.78 pp), consistent with its "zero-tolerance fabrication" design; on 27B router_auto rescues baseline = 0% to 84.94% — but this is partly a baseline artifact.</li>
                <li><strong>No school improves GSM8K</strong>. Math is the most prompt-fragile task; on 27B the extended 8 collapse by ≈ −90 pp (from ~96% to ~3%) because strong models faithfully execute the verbose meta-template until the token budget is gone.</li>
                <li><strong>MMLU is almost flat</strong> (baseline, neutral_long, router_auto all ≈ 67%); the 16-token cap leaves no room for thinking to translate to score. <strong>BBH is the highest-variance benchmark across schools</strong> (mohist +0.52 → military −27.44, spread of 28 pp).</li>
                <li><strong>9B is the sweet spot</strong>: pooled school Δ is +3.4 pp on 9B (the only positive size). Smaller models can't follow the prompt; 4B over-complies and gets truncated; 27B starts to over-comply on extended schools. Inverted-U over scale.</li>
                <li><strong>Extended 8 are not "ineffective" but format-mismatched</strong>: −5 pp on 2B (too weak to comply), −50 to −90 pp on 4B+ (compliant → truncated). The fix is a two-stage prompt: "think internally, output only the final answer."</li>
                <li><strong>random_school is worse than the average school</strong> (mean −19.92 pp, 3/30 wins), confirming that router_auto's gain comes from *correct* selection, not "any system prompt works."</li>
              </>
            )}
          </ul>
        </div>
      </AnimatedCard>

      {/* Recommendations */}
      <AnimatedCard index={8}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh' ? '应用与研究方向' : 'Applications & Research Directions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              <strong>{lang === 'zh' ? '可立即落地：' : 'Ready to deploy: '}</strong>
              {lang === 'zh'
                ? '把 14 学派当成候选 system prompt 池，按任务类型路由。短答案推理 → 墨家；通用 / 不确定性 → 道家；事实核查 → 法家；代码生成 → 道家 / 儒家；数学 → 不要用学派。无需训练即可拿到 +5~+15pp，详见 docs/samples/benchmarks/router.py。'
                : 'Treat the 14 schools as a candidate system-prompt pool, pick by task type. Short-answer reasoning → Mohist; general / uncertainty → Dao; fact-checking → Legal; code → Dao / Confucian; math → no school. +5–15 pp at zero training cost — see docs/samples/benchmarks/router.py.'}
            </p>
            <p>
              <strong>{lang === 'zh' ? '高价值研究：' : 'High-ROI research: '}</strong>
              {lang === 'zh'
                ? '(1) "格式效应 vs 思想效应"对照实验 —— 将后续 8 学派改为"内部思考 + 仅输出答案"的两段式 prompt，验证短答案崩溃是否消失；(2) Mohist vs Logician 在 BBH 上为何反向 —— activation patching / circuit tracing 是直接抓手；(3) inverted-U scaling 的拟合：Δ_school(N) = α(N)·quality − β(N)·over_following；(4) 9B HumanEval baseline=4.88% / 27B TruthfulQA baseline=0% 的根因排查。'
                : '(1) Disentangle format effect from content effect — rewrite extended schools as "think internally, output only the answer" and check whether short-answer collapse vanishes; (2) explain Mohist vs Logician divergence on BBH via activation patching / circuit tracing; (3) fit the inverted-U: Δ_school(N) = α(N)·quality − β(N)·over_following; (4) root-cause 9B HumanEval baseline = 4.88% and 27B TruthfulQA baseline = 0%.'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {lang === 'zh'
                ? '完整报告：docs/samples/benchmarks/ANALYSIS.md ｜ 全 570 cell 聚合数据：results/summary.json ｜ 路由规则：router.py'
                : 'Full report: docs/samples/benchmarks/ANALYSIS.md | Aggregated 570 cells: results/summary.json | Routing rules: router.py'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}
