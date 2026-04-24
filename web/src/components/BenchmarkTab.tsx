import { useState } from 'react'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
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
const MODELS = [
  { id: 'qwen3.5-0.8b-it', label: 'Qwen3.5-0.8B', short: '0.8B' },
  { id: 'qwen3.5-2b-it',   label: 'Qwen3.5-2B',   short: '2B' },
  { id: 'gemma4-e2b-it',   label: 'Gemma4-E2B',   short: 'G4-E2B' },
]

const SCHOOL_ORDER: (SchoolId | 'neutral_long')[] = [
  'mohist', 'military', 'dao', 'legal', 'confucian', 'logician', 'neutral_long',
]

const SCHOOL_LABELS: Record<string, { en: string; zh: string }> = {
  mohist:       { en: 'Mohist',     zh: '墨家' },
  military:     { en: 'Military',   zh: '兵家' },
  dao:          { en: 'Daoist',     zh: '道家' },
  legal:        { en: 'Legalist',   zh: '法家' },
  confucian:    { en: 'Confucian',  zh: '儒家' },
  logician:     { en: 'Logician',   zh: '名家' },
  neutral_long: { en: 'Neutral+',   zh: '中性长' },
}

const BENCH_LABELS: Record<string, { en: string; zh: string }> = {
  gsm8k:  { en: 'GSM8K (Math)', zh: 'GSM8K 数学推理' },
  ifeval: { en: 'IFEval (Instruction-Following)', zh: 'IFEval 指令跟随' },
}

// muted colour for neutral_long
const neutralColor = '#B0A8A0'
const modelColors = ['#7BAFD4', '#E5A86A', '#85C192']

// ── helpers ────────────────────────────────────────────────────────────────────
function get(preset: string, benchmark: string, condition: string): ResultRow | undefined {
  return data.find(r => r.preset === preset && r.benchmark === benchmark && r.condition === condition)
}

function pct(v: number) {
  return (v * 100).toFixed(1)
}

function deltaNum(v: number, base: number) {
  return (v - base) * 100
}

function deltaColor(d: number) {
  if (d > 1)  return 'text-emerald-600 dark:text-emerald-400'
  if (d > -3) return 'text-amber-600'
  return 'text-red-500'
}

function cellBg(d: number): string {
  if (d > 1)    return 'bg-emerald-50 dark:bg-emerald-900/20'
  if (d > -3)   return 'bg-amber-50 dark:bg-amber-900/20'
  if (d > -10)  return 'bg-orange-50 dark:bg-orange-900/20'
  return 'bg-red-50 dark:bg-red-900/20'
}

// ── sub-components ──────────────────────────────────────────────────────────────

/** Baseline accuracy bar chart for one benchmark across all models */
function BaselineChart({ benchmark, lang }: { benchmark: string; lang: string }) {
  const chartData = MODELS.map((m, i) => {
    const row = get(m.id, benchmark, 'baseline')
    return { name: m.label, value: row ? row.acc * 100 : 0, color: modelColors[i] }
  })

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ReBarChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={42} />
        <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, lang === 'zh' ? '准确率' : 'Accuracy']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  )
}

/** Δ-vs-baseline grouped bar chart for all schools across models, one benchmark */
function DeltaChart({ benchmark, lang }: { benchmark: string; lang: string }) {
  const chartData = SCHOOL_ORDER.map(s => {
    const row: Record<string, number | string> = {
      school: lang === 'zh' ? SCHOOL_LABELS[s].zh : SCHOOL_LABELS[s].en,
    }
    MODELS.forEach(m => {
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
        {MODELS.map((m, i) => (
          <Bar key={m.id} dataKey={m.short} fill={modelColors[i]} radius={[3, 3, 0, 0]} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}

/** Heat-table: rows = schools, cols = model × benchmark cells showing Δ */
function HeatTable({ lang }: { lang: string }) {
  const benchmarks = ['gsm8k', 'ifeval']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-24">
              {lang === 'zh' ? '学派' : 'School'}
            </th>
            {MODELS.map(m => benchmarks.map(b => (
              <th key={`${m.id}-${b}`} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[70px]">
                <div>{m.short}</div>
                <div className="text-[10px] text-muted-foreground/70">{b.toUpperCase()}</div>
              </th>
            )))}
          </tr>
        </thead>
        <tbody>
          {SCHOOL_ORDER.map(s => (
            <tr key={s} className="border-b last:border-0">
              <td className="py-1.5 pr-4">
                <span className="flex items-center gap-1.5 font-medium">
                  {s !== 'neutral_long' && <SchoolDot school={s as SchoolId} />}
                  {s === 'neutral_long' && (
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: neutralColor }} />
                  )}
                  {lang === 'zh' ? SCHOOL_LABELS[s].zh : SCHOOL_LABELS[s].en}
                </span>
              </td>
              {MODELS.map(m => benchmarks.map(b => {
                const base = get(m.id, b, 'baseline')
                const cond = get(m.id, b, s)
                if (!base || !cond) return <td key={`${m.id}-${b}`} className="text-center py-1.5 px-2 text-muted-foreground/40">—</td>
                const d = deltaNum(cond.acc, base.acc)
                return (
                  <td key={`${m.id}-${b}`} className={`text-center py-1.5 px-2 font-mono rounded ${cellBg(d)}`}>
                    <span className={deltaColor(d)}>
                      {d > 0 ? '+' : ''}{d.toFixed(1)}
                    </span>
                  </td>
                )
              }))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-muted-foreground">
        {lang === 'zh'
          ? '单位：百分点（pp）相对于baseline条件。正值=提升，负值=下降。'
          : 'Values in percentage points (pp) relative to baseline. Positive = improvement over baseline.'}
      </p>
    </div>
  )
}

/** Baseline accuracy table across models × benchmarks */
function BaselineTable({ lang }: { lang: string }) {
  const benchmarks = ['gsm8k', 'ifeval']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              {lang === 'zh' ? '模型' : 'Model'}
            </th>
            {benchmarks.map(b => (
              <th key={b} className="text-center py-2 px-3 font-medium text-muted-foreground">
                {lang === 'zh' ? BENCH_LABELS[b].zh : BENCH_LABELS[b].en}
              </th>
            ))}
            {/* IFEval 4-metric avg */}
            <th className="text-center py-2 px-3 font-medium text-muted-foreground">
              {lang === 'zh' ? 'IFEval 4指标均值' : 'IFEval 4-metric avg'}
            </th>
          </tr>
        </thead>
        <tbody>
          {MODELS.map((m, i) => {
            const gsm = get(m.id, 'gsm8k', 'baseline')
            const ife = get(m.id, 'ifeval', 'baseline')
            const avg4 = ife
              ? ((ife.strict_prompt ?? 0) + (ife.loose_prompt ?? 0) + (ife.strict_inst ?? 0) + (ife.loose_inst ?? 0)) / 4
              : null
            return (
              <tr key={m.id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium" style={{ color: modelColors[i] }}>{m.label}</td>
                <td className="text-center py-2 px-3 font-mono">
                  {gsm ? <span className="font-semibold">{pct(gsm.acc)}%</span> : '—'}
                </td>
                <td className="text-center py-2 px-3 font-mono">
                  {ife ? <span>{pct(ife.acc)}%</span> : '—'}
                  {ife && <span className="text-muted-foreground ml-1">(strict-P)</span>}
                </td>
                <td className="text-center py-2 px-3 font-mono">
                  {avg4 ? <span>{pct(avg4)}%</span> : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** IFEval 4-metric breakdown for a single model */
function IFEvalBreakdown({ modelId, lang }: { modelId: string; lang: string }) {
  const metrics = ['strict_prompt', 'loose_prompt', 'strict_inst', 'loose_inst'] as const
  const metricLabels: Record<string, { en: string; zh: string }> = {
    strict_prompt: { en: 'Strict Prompt', zh: '严格-提示' },
    loose_prompt:  { en: 'Loose Prompt',  zh: '宽松-提示' },
    strict_inst:   { en: 'Strict Inst.',  zh: '严格-指令' },
    loose_inst:    { en: 'Loose Inst.',   zh: '宽松-指令' },
  }

  const chartData = SCHOOL_ORDER.concat(['baseline' as any]).map(s => {
    const row = get(modelId, 'ifeval', s)
    if (!row) return null
    const entry: Record<string, number | string> = {
      school: lang === 'zh' ? (SCHOOL_LABELS[s] ?? { zh: 'Baseline' }).zh : (SCHOOL_LABELS[s] ?? { en: 'Baseline' }).en,
    }
    metrics.forEach(k => { entry[k] = (row[k] ?? 0) * 100 })
    return entry
  }).filter(Boolean)

  const metricColors = ['#7BAFD4', '#E5A86A', '#85C192', '#C4908A']

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReBarChart data={chartData as any[]} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="school" tick={{ fontSize: 9 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={42} />
        <Tooltip formatter={(v, n) => [`${Number(v).toFixed(1)}%`, String(n)]} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
        {metrics.map((k, i) => (
          <Bar key={k} dataKey={k} name={lang === 'zh' ? metricLabels[k].zh : metricLabels[k].en} fill={metricColors[i]} radius={[2, 2, 0, 0]} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}

// ── main component ──────────────────────────────────────────────────────────────
export function BenchmarkTab() {
  const { lang } = useLang()
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">
          {lang === 'zh' ? 'Phase 1 通用能力基准测试' : 'Phase 1 General-Capability Benchmarks'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === 'zh'
            ? '在 GSM8K（数学推理，1319题）和 IFEval（指令跟随，541题）上，对比 8 种学派条件 × 3 个模型的准确率。推理环境：vLLM 0.19.1，RTX 3090 Ti。'
            : 'Accuracy on GSM8K (math reasoning, 1319 items) and IFEval (instruction-following, 541 items) across 8 school conditions × 3 models. Inference: vLLM 0.19.1 on RTX 3090 Ti.'}
        </p>
      </div>

      {/* Baseline comparison */}
      <AnimatedCard index={0}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh' ? '基准线准确率（无学派系统提示）' : 'Baseline Accuracy (no school system prompt)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <BaselineTable lang={lang} />
            <div className="grid gap-6 sm:grid-cols-2">
              {['gsm8k', 'ifeval'].map(b => (
                <div key={b}>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {lang === 'zh' ? BENCH_LABELS[b].zh : BENCH_LABELS[b].en}
                  </p>
                  <BaselineChart benchmark={b} lang={lang} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Heat table */}
      <AnimatedCard index={1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'zh' ? '学派效果热力表（Δ vs baseline，单位 pp）' : 'School-Effect Heat Table (Δ vs baseline, pp)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HeatTable lang={lang} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Delta charts per benchmark */}
      {(['gsm8k', 'ifeval'] as const).map((b, i) => (
        <AnimatedCard key={b} index={2 + i}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'zh' ? BENCH_LABELS[b].zh : BENCH_LABELS[b].en}
                {' — '}
                {lang === 'zh' ? '各学派 Δ-vs-baseline（pp）' : 'School Δ-vs-baseline (pp)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DeltaChart benchmark={b} lang={lang} />
            </CardContent>
          </Card>
        </AnimatedCard>
      ))}

      {/* Per-model IFEval 4-metric breakdown */}
      <AnimatedCard index={4}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-3 flex-wrap">
              <span>
                {lang === 'zh' ? 'IFEval 4 指标详解' : 'IFEval 4-Metric Breakdown'}
              </span>
              <span className="flex gap-2">
                {MODELS.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      selectedModel === m.id
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground bg-muted'
                    }`}
                    style={selectedModel === m.id ? { background: modelColors[i] } : {}}
                  >
                    {m.label}
                  </button>
                ))}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IFEvalBreakdown modelId={selectedModel} lang={lang} />
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Key findings */}
      <AnimatedCard index={5}>
        <div className="rounded-lg border-l-4 border-[#8EA8C5] bg-[#8EA8C5]/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground">
            {lang === 'zh' ? '核心发现' : 'Key Findings'}
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-foreground/80 list-disc list-inside">
            {lang === 'zh' ? (
              <>
                <li><strong>墨家</strong>在所有模型上对 GSM8K 影响最大（−7.96 pp 至 −28.20 pp），触发跳过 CoT 的推理模式，损害数学准确率。</li>
                <li><strong>兵家</strong>在 Qwen3.5-0.8B 上导致 −35.10 pp 的 GSM8K 骤降，表明小模型无力用"计划块"同时解题。</li>
                <li><strong>Gemma4-E2B</strong> 对学派引导更鲁棒：GSM8K 最大降幅仅 −7.96 pp，IFEval 最大降幅 −5.91 pp，远优于 Qwen3.5-2B（最差 −19.41 pp）。</li>
                <li><strong>法家/儒家</strong>在 Qwen3.5 上严重损害指令跟随能力（−12 至 −19 pp），可能因过度关注规则框架而忽略了实际指令要求。</li>
                <li>IFEval 4 指标均值：0.8B ≈ 56.7%，2B ≈ 70.5%（论文值 72.5%，误差 &lt;2 pp），Gemma4 ≈ 76.8%——基准可信。</li>
              </>
            ) : (
              <>
                <li><strong>Mohist</strong> causes the largest GSM8K drop across all models (−7.96 to −28.20 pp), triggering a CoT-skipping mode that hurts math accuracy.</li>
                <li><strong>Military</strong> causes −35.10 pp GSM8K collapse on Qwen3.5-0.8B — small models cannot sustain planning blocks while solving math.</li>
                <li><strong>Gemma4-E2B</strong> is much more robust: max GSM8K drop −7.96 pp, max IFEval drop −5.91 pp, vs Qwen3.5-2B worst −19.41 pp on IFEval.</li>
                <li><strong>Legalist/Confucian</strong> heavily damage instruction-following on Qwen3.5 (−12 to −19 pp), likely because they redirect attention to rule-framing over actual instruction compliance.</li>
                <li>IFEval 4-metric avg: 0.8B ≈ 56.7%, 2B ≈ 70.5% (paper 72.5%, within 2 pp), Gemma4 ≈ 76.8% — baselines are credible.</li>
              </>
            )}
          </ul>
        </div>
      </AnimatedCard>
    </div>
  )
}
