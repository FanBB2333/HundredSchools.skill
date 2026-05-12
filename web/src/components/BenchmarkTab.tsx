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

const SCHOOL_ORDER: PreQinSchool[] = [
  'mohist', 'dao', 'confucian', 'legal', 'military', 'logician',
]

const SCHOOL_LABELS: Record<string, { en: string; zh: string }> = {
  mohist:       { en: 'Mohist',     zh: '墨家' },
  military:     { en: 'Military',   zh: '兵家' },
  dao:          { en: 'Daoist',     zh: '道家' },
  legal:        { en: 'Legalist',   zh: '法家' },
  confucian:    { en: 'Confucian',  zh: '儒家' },
  logician:     { en: 'Logician',   zh: '名家' },
  neutral_long: { en: 'Neutral+',   zh: '中性长' },
  baseline:     { en: 'Baseline',   zh: '基准' },
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

// school colors borrowed from existing palette (SchoolDot)
const SCHOOL_COLORS: Record<PreQinSchool, string> = {
  mohist:    '#5B7B9A',
  dao:       '#7BAFD4',
  confucian: '#C49A6C',
  legal:     '#A8526C',
  military:  '#6E8B3D',
  logician:  '#8E7CC3',
}

const MODEL_COLORS = ['#7BAFD4', '#E5A86A', '#85C192', '#C49A6C', '#A8526C', '#8E7CC3']

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

/** Δ vs baseline, pooled across the 4 fully-covered Qwen sizes (0.8B/2B/4B/9B) */
function pooledDelta(school: PreQinSchool, benchmark: Benchmark): number | null {
  const presets = QWEN_MODELS.filter(m => ['0.8B', '2B', '4B', '9B'].includes(m.short))
  const ds: number[] = []
  for (const m of presets) {
    const base = get(m.id, benchmark, 'baseline')
    const c   = get(m.id, benchmark, school)
    if (base && c) ds.push(deltaNum(c.acc, base.acc))
  }
  if (!ds.length) return null
  return ds.reduce((a, b) => a + b, 0) / ds.length
}

// ── sub-components ──────────────────────────────────────────────────────────────

/** Pooled school × benchmark Δ heat-table (averaged across 4 Qwen sizes) */
function PooledHeatTable({ lang }: { lang: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-28">
              {lang === 'zh' ? '学派' : 'School'}
            </th>
            {BENCH_ORDER.map(b => (
              <th key={b} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[80px]">
                <div>{BENCH_LABELS[b][lang as 'en' | 'zh']}</div>
                <div className="text-[10px] text-muted-foreground/70">{BENCH_LABELS[b].cap[lang as 'en' | 'zh']}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHOOL_ORDER.map(s => (
            <tr key={s} className="border-b last:border-0">
              <td className="py-1.5 pr-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <SchoolDot school={s} />
                  {SCHOOL_LABELS[s][lang as 'en' | 'zh']}
                </span>
              </td>
              {BENCH_ORDER.map(b => {
                const d = pooledDelta(s, b)
                if (d == null) return <td key={b} className="text-center py-1.5 px-2 text-muted-foreground/40">—</td>
                return (
                  <td key={b} className={`text-center py-1.5 px-2 font-mono rounded ${cellBg(d)}`}>
                    <span className={deltaColor(d)}>
                      {d > 0 ? '+' : ''}{d.toFixed(1)}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-muted-foreground">
        {lang === 'zh'
          ? '单位：百分点（pp）相对 baseline，跨 0.8B/2B/4B/9B 四个 Qwen 规模取均值。绿=改进，橙=略降，红=显著下降。'
          : 'Δ vs baseline (pp), averaged across Qwen 0.8B/2B/4B/9B. Green = improvement; red = large drop.'}
      </p>
    </div>
  )
}

/** Per-preset accuracy heat-table for a single benchmark across all conditions */
function PerSizeTable({ benchmark, lang }: { benchmark: Benchmark; lang: string }) {
  const presets = QWEN_MODELS
  const conditions = ['baseline', 'neutral_long', ...SCHOOL_ORDER] as const
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-3 font-medium text-muted-foreground w-28">
              {lang === 'zh' ? '条件' : 'Condition'}
            </th>
            {presets.map(m => (
              <th key={m.id} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[80px]">
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
                  {(SCHOOL_ORDER as readonly string[]).includes(c) && <SchoolDot school={c as SchoolId} />}
                  {c === 'baseline' || c === 'neutral_long'
                    ? SCHOOL_LABELS[c][lang as 'en' | 'zh']
                    : SCHOOL_LABELS[c][lang as 'en' | 'zh']}
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
  const presets = QWEN_MODELS.filter(m => ['0.8B', '2B', '4B', '9B'].includes(m.short))
  const chartData = presets.map(m => {
    const row: Record<string, number | string> = { size: m.short }
    const base = get(m.id, benchmark, 'baseline')
    if (base) row['baseline'] = base.acc * 100
    for (const s of SCHOOL_ORDER) {
      const r = get(m.id, benchmark, s)
      if (r) row[s] = r.acc * 100
    }
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="size" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={42} />
        <Tooltip
          formatter={(v, n) => [`${Number(v).toFixed(1)}%`, SCHOOL_LABELS[String(n)]?.[lang as 'en' | 'zh'] ?? String(n)]}
        />
        <Legend
          iconSize={10}
          wrapperStyle={{ fontSize: 10 }}
          formatter={(v) => SCHOOL_LABELS[String(v)]?.[lang as 'en' | 'zh'] ?? String(v)}
        />
        <Line type="monotone" dataKey="baseline" stroke="#000" strokeDasharray="4 4" strokeWidth={2} dot={{ r: 3 }} />
        {SCHOOL_ORDER.map(s => (
          <Line key={s} type="monotone" dataKey={s} stroke={SCHOOL_COLORS[s]} strokeWidth={1.7} dot={{ r: 2.5 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/** Δ-vs-baseline grouped bar chart for all schools across Qwen sizes, one benchmark */
function DeltaChart({ benchmark, lang }: { benchmark: Benchmark; lang: string }) {
  const presets = QWEN_MODELS.filter(m => ['0.8B', '2B', '4B', '9B'].includes(m.short))
  const chartData = SCHOOL_ORDER.map(s => {
    const row: Record<string, number | string> = {
      school: SCHOOL_LABELS[s][lang as 'en' | 'zh'],
    }
    presets.forEach(m => {
      const base = get(m.id, benchmark, 'baseline')
      const cond = get(m.id, benchmark, s)
      if (base && cond) row[m.short] = deltaNum(cond.acc, base.acc)
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReBarChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="school" tick={{ fontSize: 10 }} />
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
      const deltas = SCHOOL_ORDER.map(s => pooledDelta(s, b)).filter(v => v != null) as number[]
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
          name={SCHOOL_LABELS[school][lang as 'en' | 'zh']}
          dataKey="value"
          stroke={SCHOOL_COLORS[school]}
          fill={SCHOOL_COLORS[school]}
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

/** Per-school strength profile: radar + best/worst + one-line application recommendation */
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
      {SCHOOL_ORDER.map(s => {
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
                {SCHOOL_LABELS[s][lang as 'en' | 'zh']}
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

// ── main component ──────────────────────────────────────────────────────────────
export function BenchmarkTab() {
  const { lang } = useLang()
  const [selectedBench, setSelectedBench] = useState<Benchmark>('bbh')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">
          {lang === 'zh' ? '通用能力基准测试' : 'General-Capability Benchmarks'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === 'zh'
            ? '6 个先秦学派 system prompt × 6 个评测集 × 最多 6 个模型规模。MMLU/BBH/TruthfulQA/HumanEval 仅覆盖 Qwen3.5 全系列；GSM8K/IFEval 额外覆盖 27B 与 Gemma4-E2B。共 224 条 (preset, benchmark, condition) 记录。'
            : '6 Pre-Qin school system prompts × 6 benchmarks × up to 6 model presets. MMLU/BBH/TruthfulQA/HumanEval cover Qwen3.5 0.8B–9B; GSM8K/IFEval additionally include 27B and Gemma4-E2B. 224 (preset, benchmark, condition) cells in total.'}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {lang === 'zh'
            ? '注：9B HumanEval baseline=4.88% 显著异常（neutral_long=44.51%），其上的 +70pp 学派增益部分来自 baseline 偏低，需用 neutral_long 作为参照。'
            : 'Note: 9B HumanEval baseline = 4.88% (vs neutral_long = 44.51%) is an outlier; the +70 pp school gains there are partly a baseline artifact — use neutral_long as the reference.'}
        </p>
      </div>

      {/* Pooled heat-table */}
      <AnimatedCard index={0}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '学派 × 评测集 — Δ vs baseline 总览（聚合 0.8B/2B/4B/9B）'
                : 'School × Benchmark — Δ vs baseline overview (pooled across 0.8B/2B/4B/9B)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PooledHeatTable lang={lang} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* School strength profile grid */}
      <AnimatedCard index={1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh'
                ? '每学派强弱画像 — rank-normalized 雷达 + 推荐应用域'
                : 'Per-school Strength Profile — rank-normalized radar + suggested application'}
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
      <AnimatedCard index={2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-3 flex-wrap">
              <span>
                {lang === 'zh' ? '模型规模扩展曲线' : 'Scaling curve (accuracy vs model size)'}
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
                ? '黑色虚线 = baseline（无 system prompt）。彩色实线 = 各学派。注意 9B 是先秦学派的 "甜点"，多数线在该处接近或超过 baseline。'
                : 'Black dashed = baseline (no system prompt). Coloured solid = each school. 9B is the sweet spot — most schools meet or beat baseline there.'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Per-size table & delta chart for current benchmark */}
      <AnimatedCard index={3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {BENCH_LABELS[selectedBench][lang as 'en' | 'zh']}
              {' — '}
              {lang === 'zh' ? '按模型规模分组的 Δ' : 'Δ vs baseline by model size'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DeltaChart benchmark={selectedBench} lang={lang} />
            <PerSizeTable benchmark={selectedBench} lang={lang} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Key findings (full data) */}
      <AnimatedCard index={4}>
        <div className="rounded-lg border-l-4 border-[#8EA8C5] bg-[#8EA8C5]/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground">
            {lang === 'zh' ? '核心发现（基于完整数据）' : 'Key Findings (full sweep)'}
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-foreground/80 list-disc list-inside">
            {lang === 'zh' ? (
              <>
                <li><strong>墨家</strong> 是唯一在 <strong>BBH 上正向</strong> 的学派（聚合 +2.15 pp，9B 上 +14.19 pp）。"节用 / 直接判决"与短答案逻辑判断完美匹配；代价是 GSM8K −15.88 pp（数学链被截断）。</li>
                <li><strong>道家</strong> 是 <strong>全方位最稳</strong> 的"通用 prompt"：IFEval 损失最小（−1.04 pp），TruthfulQA 微正（+0.12 pp），HumanEval +23.63 pp。BBH 是其唯一明显短板。</li>
                <li><strong>法家</strong> 在 TruthfulQA 上最高（+0.98 pp，抑制编造），但 IFEval 跌得最重（−21.48 pp，27B 上 −31.24 pp）—— "零容忍"机制击穿了开放式指令遵从。</li>
                <li><strong>儒家</strong> 在 GSM8K 上损失最小（−4.28 pp），且 9B 上 HumanEval 增益 <strong>+76.83 pp</strong>，是整组数据里所有 (学派, 评测集) 中最大的单点增益。</li>
                <li><strong>名家</strong> 在 BBH 上反直觉地最差（聚合 −30.78 pp，9B 上跌至 8.40%，几乎随机）。<strong>"对逻辑的元分析" ≠ "做逻辑"</strong> 是本数据里最反直觉的发现。</li>
                <li><strong>9B 是先秦学派的甜点</strong>：跨学派看，0.8B/2B 学派指令"理解不到位"小幅负向，4B 开始出现过度遵从，而 9B 上多数学派 IFEval/TruthfulQA/HumanEval 都正向。规模—prompt 服从度呈倒 U 形曲线。</li>
                <li><strong>HumanEval 几乎所有学派都被显著抬升（+17~+24 pp）</strong>。但 9B baseline HumanEval = 4.88% 显著异常（neutral_long = 44.51%），引用增益时需用 neutral_long 作为参照，否则会高估约 40 pp。</li>
                <li><strong>MMLU 几乎不动</strong>，说明它对 prompt 风格不敏感，不适合作为"学派效应"探针。<strong>BBH 才是学派最大区分度的 benchmark</strong>（从 mohist +2.15 到 military −30.95，分化 33 pp）。</li>
              </>
            ) : (
              <>
                <li><strong>Mohist</strong> is the only school <strong>positive on BBH</strong> (pooled +2.15 pp, 9B +14.19 pp). “Jié-yòng / direct judgment” fits short-answer logic; cost: GSM8K −15.88 pp (reasoning chain gets truncated).</li>
                <li><strong>Dao</strong> is the <strong>most stable general-purpose</strong> prompt: smallest IFEval drop (−1.04 pp), TruthfulQA ≈ 0 (+0.12 pp), HumanEval +23.63 pp. BBH is its only real weakness.</li>
                <li><strong>Legal</strong> tops TruthfulQA (+0.98 pp, anti-fabrication), but suffers the worst IFEval drop (−21.48 pp pooled; −31.24 pp on 27B) — zero-tolerance breaks open-ended instruction following.</li>
                <li><strong>Confucian</strong> has the smallest GSM8K loss (−4.28 pp) and an enormous 9B HumanEval gain of <strong>+76.83 pp</strong> — the single largest (school, benchmark) gain in the dataset.</li>
                <li><strong>Logician</strong> is counter-intuitively the worst on BBH (pooled −30.78 pp; 9B falls to 8.40%, near random). <strong>“Meta-analysis about logic” ≠ “doing logic”</strong> — the most surprising finding here.</li>
                <li><strong>9B is the sweet spot</strong> for Pre-Qin schools: small models under-comply, 4B starts to over-comply (esp. on BBH), and 9B is where most schools recover IFEval/TruthfulQA/HumanEval to or above baseline — an inverted-U over scale.</li>
                <li><strong>HumanEval is lifted by almost every school (+17 to +24 pp pooled)</strong>. But 9B baseline HumanEval = 4.88% is anomalous (neutral_long = 44.51%); use neutral_long as the reference or you’ll over-credit schools by ~40 pp.</li>
                <li><strong>MMLU barely moves</strong>, so it’s a poor probe of school effects. <strong>BBH is the highest-variance benchmark across schools</strong> (Mohist +2.15 → Military −30.95, spread of 33 pp).</li>
              </>
            )}
          </ul>
        </div>
      </AnimatedCard>

      {/* Recommendations */}
      <AnimatedCard index={5}>
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
                ? '任务感知路由（task-aware router）——把 6 个学派当成候选 system prompt 池，按任务类型选择。短答案 → 墨家；通用 → 道家；事实核查 → 法家；代码 → 道家 / 儒家。理论上无需训练即可在中段任务上拿到 5~15 pp 提升。'
                : 'Task-aware router — treat the 6 schools as a candidate system-prompt pool, pick by task type. Short-answer → Mohist; general → Dao; fact-checking → Legal; code → Dao / Confucian. ~5–15 pp gains at zero training cost.'}
            </p>
            <p>
              <strong>{lang === 'zh' ? '高价值研究：' : 'High-ROI research: '}</strong>
              {lang === 'zh'
                ? '(1) "格式效应 vs 思想效应"对照实验——将冗长学派 prompt 改为 "内部思考 + 仅输出答案" 的两段式，验证后续 8 学派的崩溃是否消失；(2) Mohist vs Logician 在 BBH 上为何反向——activation patching / circuit tracing 是直接抓手；(3) inverted-U scaling 的拟合：Δ_school(N) = α(N)·quality − β(N)·over_following。'
                : '(1) Disentangle format effect from content effect — rewrite verbose schools as "think internally, output only the answer" and see if the 8 later-school collapses vanish; (2) explain why Mohist and Logician diverge on BBH via activation patching / circuit tracing; (3) fit the inverted-U: Δ_school(N) = α(N)·quality − β(N)·over_following.'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {lang === 'zh'
                ? '完整报告：docs/school-effects-report.md ｜ 图与 CSV：docs/figures/ + experiments/analysis/out/'
                : 'Full report: docs/school-effects-report.md  |  Figures & CSVs: docs/figures/ + experiments/analysis/out/'}
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}
