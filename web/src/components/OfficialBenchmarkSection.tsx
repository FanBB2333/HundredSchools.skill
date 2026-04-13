import { useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { schools } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, Legend,
} from 'recharts'
import officialBenchmarkData from '@/data/official_benchmark_data.json'

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface ConditionResult {
  condition: string
  accuracy: number
  safeAccuracy: number | null
  unsafeRecall: number | null
  falseRefusalRate: number | null
  total: number
  correct: number
}

interface ModelData {
  baseline: {
    accuracy: number
    safeAccuracy: number | null
    unsafeRecall: number | null
    falseRefusalRate: number | null
  }
  conditions: ConditionResult[]
  bestSchool: { condition: string; value: number } | null
  worstSchool: { condition: string; value: number } | null
}

interface DatasetData {
  id: string
  nameEn: string
  nameZh: string
  descEn: string
  descZh: string
  expectedLabel: string
  primaryMetric: string
  samples: number
  model06b: ModelData
  model8b: ModelData
  // backward-compat
  baseline: ModelData['baseline']
  conditions: ConditionResult[]
  bestSchool: ModelData['bestSchool']
  worstSchool: ModelData['worstSchool']
}

interface ComparisonRow {
  metric: string
  metricZh: string
  values: Record<string, number | null>
}

interface OfficialBenchmarkData {
  datasets: DatasetData[]
  summary: {
    totalSamples: number
    totalEvaluations: number
    conditions: number
    models: string[]
  }
  comparisonTable: { headers: string[]; rows: ComparisonRow[] }
  comparisonTable8b: { headers: string[]; rows: ComparisonRow[] }
  findings: { en: string[]; zh: string[] }
}

const data = officialBenchmarkData as OfficialBenchmarkData

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const schoolColors: Record<string, string> = {
  baseline: '#94a3b8',
  confucian: schools.find(s => s.id === 'confucian')?.color || '#dc2626',
  dao: schools.find(s => s.id === 'dao')?.color || '#16a34a',
  legal: schools.find(s => s.id === 'legal')?.color || '#1d4ed8',
  logician: schools.find(s => s.id === 'logician')?.color || '#9333ea',
  military: schools.find(s => s.id === 'military')?.color || '#ea580c',
  mohist: schools.find(s => s.id === 'mohist')?.color || '#0891b2',
}

const PRIMARY_METRIC_KEY: Record<string, keyof ConditionResult> = {
  unsafe_recall: 'unsafeRecall',
  safe_accuracy: 'safeAccuracy',
  accuracy: 'accuracy',
}

const SCHOOL_ORDER = ['dao', 'confucian', 'legal', 'military', 'mohist', 'logician']

type ModelView = '0.6b' | '8b' | 'compare'

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function ModelToggle({ value, onChange, lang }: {
  value: ModelView
  onChange: (v: ModelView) => void
  lang: string
}) {
  const options: { value: ModelView; label: string }[] = [
    { value: '0.6b', label: '0.6B' },
    { value: '8b',   label: '8B' },
    { value: 'compare', label: lang === 'en' ? 'Compare' : '对比' },
  ]
  return (
    <div className="inline-flex rounded-lg border bg-muted p-1 text-xs">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            value === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  if (Math.abs(delta) < 0.05) return null
  const pos = delta > 0
  return (
    <span className={`ml-1 text-[10px] font-medium ${pos ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      {pos ? '+' : ''}{delta.toFixed(1)}
    </span>
  )
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export function OfficialBenchmarkSection() {
  const { lang } = useLang()
  const [modelView, setModelView] = useState<ModelView>('compare')

  const activeTable = modelView === '8b' ? data.comparisonTable8b : data.comparisonTable

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="mb-1 text-xl font-semibold text-foreground">
              {lang === 'en' ? 'Official Benchmark Evaluation' : '官方 Benchmark 评测'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === 'en'
                ? `${data.summary.totalSamples.toLocaleString()} samples × ${data.summary.conditions} conditions × 2 models = ${(data.summary.totalEvaluations * 2).toLocaleString()} total evaluations`
                : `${data.summary.totalSamples.toLocaleString()} 样本 × ${data.summary.conditions} 条件 × 2 模型 = ${(data.summary.totalEvaluations * 2).toLocaleString()} 次评测`}
            </p>
          </div>
          <ModelToggle value={modelView} onChange={setModelView} lang={lang} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {data.summary.models.map(m => (
            <span key={m} className="rounded-full border bg-muted/50 px-2.5 py-0.5 font-mono">{m}</span>
          ))}
        </div>
      </section>

      {/* Summary Stats — 4 dataset cards */}
      <AnimatedCard index={0}>
        <div className="grid gap-4 sm:grid-cols-4">
          {data.datasets.map((dataset) => {
            const pk = PRIMARY_METRIC_KEY[dataset.primaryMetric] || 'accuracy'
            const v06 = dataset.model06b.baseline[pk as keyof typeof dataset.model06b.baseline] as number | null
            const v8b = dataset.model8b.baseline[pk as keyof typeof dataset.model8b.baseline] as number | null
            const delta = (v06 != null && v8b != null) ? v8b - v06 : null

            return (
              <Card key={dataset.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {lang === 'en' ? dataset.nameEn : dataset.nameZh}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {modelView === 'compare' ? (
                    <div className="flex items-end gap-3">
                      <div>
                        <div className="text-lg font-bold">{v06}%</div>
                        <div className="text-[10px] text-muted-foreground">0.6B</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{v8b}%</div>
                        <div className="text-[10px] text-muted-foreground">8B</div>
                      </div>
                      {delta != null && <DeltaBadge delta={delta} />}
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {modelView === '8b' ? v8b : v06}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lang === 'en' ? 'Baseline' : '基准'} · {dataset.samples} {lang === 'en' ? 'samples' : '样本'}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </AnimatedCard>

      {/* Key Findings */}
      <AnimatedCard index={1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Key Findings' : '关键发现'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(lang === 'en' ? data.findings.en : data.findings.zh).map((finding, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Analysis: Why Baseline Performs Better */}
      <AnimatedCard index={2}>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-amber-500">💡</span>
              {lang === 'en' ? 'Analysis: Why Baseline Performs Better' : '分析：为什么 Baseline 表现更好'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  {lang === 'en' ? 'Label Distribution on OR-Bench Hard (0.6B)' : 'OR-Bench Hard 标签分布（0.6B）'}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {lang === 'en'
                    ? 'All 1,319 samples should be "safe" (sec). School prompts cause massive over-classification into risk categories:'
                    : '全部 1,319 个样本都应为"安全"(sec)，学派 prompt 导致大量误分类到风险类别：'}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 px-2">{lang === 'en' ? 'Label' : '标签'}</th>
                        <th className="text-center py-1 px-2">Baseline</th>
                        <th className="text-center py-1 px-2">{lang === 'en' ? 'Dao' : '道家'}</th>
                        <th className="text-center py-1 px-2">{lang === 'en' ? 'Others (avg)' : '其他学派(均)'}</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {[
                        ['sec', lang === 'en' ? 'safe' : '安全', '78.4%', '26.4%', '~36%', true],
                        ['pi',  lang === 'en' ? 'privacy' : '隐私',   '3.1%', '13.5%', '~11%', false],
                        ['ec',  lang === 'en' ? 'ethics' : '伦理',     '4.8%',  '9.2%',  '~8%', false],
                        ['ha',  lang === 'en' ? 'hate' : '仇恨',       '2.0%',  '7.4%',  '~7%', false],
                        ['dw',  lang === 'en' ? 'dangerous' : '危险',  '1.4%',  '6.7%',  '~6%', false],
                      ].map(([lbl, desc, v_bl, v_dao, v_avg, isGood]) => (
                        <tr key={String(lbl)} className={isGood ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                          <td className="py-1 px-2 font-medium">{lbl} ({desc})</td>
                          <td className={`text-center py-1 px-2 ${isGood ? 'text-green-600 dark:text-green-400 font-bold' : ''}`}>{v_bl}</td>
                          <td className={`text-center py-1 px-2 ${!isGood ? 'text-red-500' : ''}`}>{v_dao}</td>
                          <td className={`text-center py-1 px-2 ${!isGood ? 'text-red-500' : ''}`}>{v_avg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t">
                {[
                  { color: 'blue', titleEn: '1. Vigilance Amplification', titleZh: '1. 警觉性放大',
                    en: 'School prompts add philosophical guidance that increases risk sensitivity, leading to "better safe than sorry".',
                    zh: '学派 prompt 的哲学指导增加了对潜在风险的敏感度，导致"宁可错杀"。' },
                  { color: 'purple', titleEn: '2. Label Generalization', titleZh: '2. 标签泛化',
                    en: 'Schools scatter predictions across privacy, ethics, hate, etc., instead of recognizing safe content.',
                    zh: '学派将预测分散到隐私、伦理、仇恨等类别，而非识别为安全内容。' },
                  { color: 'orange', titleEn: '3. Benchmark Optimization Gap', titleZh: '3. 基准优化差距',
                    en: 'Official benchmarks are tuned for vanilla models. Any system prompt shifts the decision boundary.',
                    zh: '官方 benchmark 针对无 system prompt 的模型优化，任何 prompt 都会改变决策边界。' },
                ].map(item => (
                  <div key={item.color} className={`rounded-md bg-${item.color}-50 dark:bg-${item.color}-950/20 p-3`}>
                    <h5 className={`text-xs font-semibold text-${item.color}-700 dark:text-${item.color}-300 mb-1`}>
                      {lang === 'en' ? item.titleEn : item.titleZh}
                    </h5>
                    <p className={`text-[11px] text-${item.color}-600 dark:text-${item.color}-400`}>
                      {lang === 'en' ? item.en : item.zh}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Comparison Table */}
      <AnimatedCard index={3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Baseline vs Schools' : 'Baseline vs 学派对比'}
              {modelView === 'compare' && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {lang === 'en' ? '— showing 0.6B / 8B / delta' : '— 显示 0.6B / 8B / 变化'}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs min-w-[160px]">{lang === 'en' ? 'Metric' : '指标'}</TableHead>
                    <TableHead className="text-xs text-center">{lang === 'en' ? 'Baseline' : '基准'}</TableHead>
                    {SCHOOL_ORDER.map(condition => {
                      const sch = schools.find(s => s.id === condition)
                      return (
                        <TableHead key={condition} className="text-xs text-center">
                          <span className="flex items-center justify-center gap-1">
                            <SchoolDot school={condition as SchoolId} />
                            {lang === 'en' ? sch?.nameEn : sch?.nameZh}
                          </span>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(modelView === 'compare'
                    ? data.comparisonTable.rows
                    : activeTable.rows
                  ).map((row, rowIdx) => {
                    const row8b = data.comparisonTable8b.rows[rowIdx]
                    const bl06 = row.values.baseline ?? 0
                    const bl8b = row8b?.values.baseline ?? 0
                    const allVals = [...SCHOOL_ORDER.map(c => row.values[c] ?? 0), bl06]
                    const maxVal = Math.max(...allVals)

                    return (
                      <TableRow key={rowIdx}>
                        <TableCell className="text-xs font-medium">
                          {lang === 'en' ? row.metric : row.metricZh}
                        </TableCell>
                        {/* Baseline cell */}
                        <TableCell className="text-xs text-center">
                          {modelView === 'compare' ? (
                            <div className="flex flex-col items-center">
                              <span className="text-muted-foreground">{bl06.toFixed(1)}%</span>
                              <span className="font-semibold text-primary">{bl8b.toFixed(1)}%</span>
                              <DeltaBadge delta={bl8b - bl06} />
                            </div>
                          ) : (
                            <span className={`font-semibold ${bl06 === maxVal ? 'text-green-600 dark:text-green-400' : ''}`}>
                              {(modelView === '8b' ? bl8b : bl06).toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                        {/* School cells */}
                        {SCHOOL_ORDER.map(condition => {
                          const v06 = row.values[condition] ?? null
                          const v8b = row8b?.values[condition] ?? null
                          const diff06 = v06 != null ? v06 - bl06 : 0

                          return (
                            <TableCell key={condition} className="text-xs text-center">
                              {modelView === 'compare' ? (
                                <div className="flex flex-col items-center">
                                  <span className="text-muted-foreground">{v06?.toFixed(1)}%</span>
                                  <span className="font-semibold text-primary">{v8b?.toFixed(1)}%</span>
                                  {v06 != null && v8b != null && <DeltaBadge delta={v8b - v06} />}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <span className={`font-semibold ${
                                    (modelView === '8b' ? v8b : v06) === maxVal ? 'text-green-600 dark:text-green-400' : ''
                                  }`}>
                                    {(modelView === '8b' ? v8b : v06)?.toFixed(1)}%
                                  </span>
                                  {diff06 !== 0 && modelView !== '8b' && (
                                    <span className={`text-[10px] ${diff06 > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                      {diff06 > 0 ? '+' : ''}{diff06.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            {modelView === 'compare' && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                {lang === 'en'
                  ? 'Format: grey = 0.6B · blue = 8B · delta = 8B − 0.6B'
                  : '格式：灰色 = 0.6B · 蓝色 = 8B · 变化 = 8B − 0.6B'}
              </p>
            )}
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Per-Dataset Charts */}
      {data.datasets.map((dataset, datasetIdx) => {
        const pk = PRIMARY_METRIC_KEY[dataset.primaryMetric] || 'accuracy'
        const activeModel = modelView === '8b' ? dataset.model8b : dataset.model06b
        const bl = activeModel.baseline[pk as keyof typeof activeModel.baseline] as number | null

        // For compare mode: grouped bar data
        const chartData = activeModel.conditions.map(c => {
          const sch = schools.find(s => s.id === c.condition)
          const label = c.condition === 'baseline'
            ? (lang === 'en' ? 'Baseline' : '基准')
            : (lang === 'en' ? sch?.nameEn : sch?.nameZh) || c.condition
          const v06 = dataset.model06b.conditions.find(x => x.condition === c.condition)?.[pk] as number | null
          const v8b  = dataset.model8b.conditions.find(x => x.condition === c.condition)?.[pk] as number | null
          return {
            name: label,
            condition: c.condition,
            value: c[pk] as number,
            v06: v06 ?? 0,
            v8b: v8b ?? 0,
            fill: schoolColors[c.condition] || '#94a3b8',
            isBaseline: c.condition === 'baseline',
          }
        }).sort((a, b) => (b.value || 0) - (a.value || 0))

        const compareChartData = [...chartData].sort((a, b) => b.v8b - a.v8b)

        return (
          <AnimatedCard key={dataset.id} index={4 + datasetIdx}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm">
                      {lang === 'en' ? dataset.nameEn : dataset.nameZh}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lang === 'en' ? dataset.descEn : dataset.descZh}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {dataset.samples} {lang === 'en' ? 'samples' : '样本'} · {dataset.primaryMetric.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {modelView === 'compare' ? (
                  /* Grouped bars: 0.6B vs 8B side by side */
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={compareChartData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-40} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="v06" name="0.6B" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="v8b"  name="8B"   fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  /* Single model bar chart */
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 20, right: 80, left: 10, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-40} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                      {bl != null && (
                        <ReferenceLine
                          y={bl}
                          stroke="#94a3b8"
                          strokeDasharray="5 5"
                          label={{ value: `Baseline ${bl}%`, position: 'right', fontSize: 9 }}
                        />
                      )}
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} opacity={entry.isBaseline ? 0.55 : 1} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* Best / Worst badges */}
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {activeModel.bestSchool && (
                    <div className="rounded-md bg-green-50 px-2.5 py-1.5 dark:bg-green-950/20">
                      <span className="font-medium text-green-700 dark:text-green-300">
                        {lang === 'en' ? 'Best: ' : '最佳：'}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {activeModel.bestSchool.condition === 'baseline'
                          ? 'Baseline'
                          : (lang === 'en'
                            ? schools.find(s => s.id === activeModel.bestSchool?.condition)?.nameEn
                            : schools.find(s => s.id === activeModel.bestSchool?.condition)?.nameZh)
                        } ({activeModel.bestSchool.value}%)
                      </span>
                    </div>
                  )}
                  {activeModel.worstSchool && (
                    <div className="rounded-md bg-red-50 px-2.5 py-1.5 dark:bg-red-950/20">
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {lang === 'en' ? 'Worst: ' : '最差：'}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        {lang === 'en'
                          ? schools.find(s => s.id === activeModel.worstSchool?.condition)?.nameEn
                          : schools.find(s => s.id === activeModel.worstSchool?.condition)?.nameZh
                        } ({activeModel.worstSchool.value}%)
                      </span>
                    </div>
                  )}
                  {/* 8B delta highlight in compare mode */}
                  {modelView === 'compare' && (() => {
                    const bl06 = dataset.model06b.baseline[pk as keyof typeof dataset.model06b.baseline] as number | null
                    const bl8b = dataset.model8b.baseline[pk as keyof typeof dataset.model8b.baseline] as number | null
                    if (bl06 == null || bl8b == null) return null
                    const delta = bl8b - bl06
                    return (
                      <div className={`rounded-md px-2.5 py-1.5 ${delta >= 0 ? 'bg-blue-50 dark:bg-blue-950/20' : 'bg-orange-50 dark:bg-orange-950/20'}`}>
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {lang === 'en' ? '8B baseline: ' : '8B 基准：'}
                        </span>
                        <span className={delta >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600'}>
                          {bl8b}% ({delta >= 0 ? '+' : ''}{delta.toFixed(1)}%)
                        </span>
                      </div>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        )
      })}

      {/* School Characteristics */}
      <AnimatedCard index={8}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'School Characteristics' : '各学派特性总结'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 'dao',
                  strengthEn: 'Improvement on XSTest with 8B (+4.3%)',
                  strengthZh: '8B 在 XSTest 提升显著（+4.3%）',
                  weaknessEn: 'Highest false refusal on OR-Bench Hard (-52%)',
                  weaknessZh: 'OR-Bench Hard 误拒绝率最高（-52%）',
                  noteEn: '"Wu wei" causes over-caution on borderline requests',
                  noteZh: '「无为」导致边界场景过度谨慎' },
                { id: 'confucian',
                  strengthEn: 'Lower false refusal on XSTest; 8B improves (+3.3%)',
                  strengthZh: 'XSTest 误拒绝较低；8B 提升 +3.3%',
                  weaknessEn: 'Chinese harmful recall drops with scale (-2.8%)',
                  weaknessZh: '规模扩大后中文有害召回下降（-2.8%）',
                  noteEn: '"Ke-ji-fu-li" reduces direct refusals',
                  noteZh: '「克己复礼」教导式回应减少直接拒绝' },
                { id: 'legal',
                  strengthEn: 'None notable',
                  strengthZh: '无显著优势',
                  weaknessEn: 'Lowest unsafe recall; 8B worsens on OR-Bench (-2.8%)',
                  weaknessZh: '有害召回最低；8B 在 OR-Bench 进一步下降（-2.8%）',
                  noteEn: 'Strict rules paradoxically miss some harmful content',
                  noteZh: '严格规则反而漏掉部分有害内容' },
                { id: 'military',
                  strengthEn: '8B shows +8% on OR-Bench Hard — largest school gain',
                  strengthZh: '8B 在 OR-Bench Hard 提升 +8%，学派中最大',
                  weaknessEn: 'Still -35% below baseline on OR-Bench Hard',
                  weaknessZh: '仍比 baseline 低 35%',
                  noteEn: '"Miao-suan" benefits most from scale-up',
                  noteZh: '「庙算」风险评估随规模扩大受益最大' },
                { id: 'mohist',
                  strengthEn: 'S-Eval zh improves strongly with 8B (+5.3%)',
                  strengthZh: '8B 在 S-Eval zh 提升显著（+5.3%）',
                  weaknessEn: '8B worsens on OR-Bench Hard (-5.7%)',
                  weaknessZh: '8B 在 OR-Bench Hard 反而下降（-5.7%）',
                  noteEn: '"Jie-yong" trades false-refusal for better unsafe recall',
                  noteZh: '「节用」以降低误拒绝换取更好的有害召回' },
                { id: 'logician',
                  strengthEn: '8B gives strong XSTest boost (+4.3%)',
                  strengthZh: '8B XSTest 提升明显（+4.3%）',
                  weaknessEn: 'Unsafe recall drops with schools (-8%)',
                  weaknessZh: '有害召回下降（-8%）',
                  noteEn: '"Kong-ming-ze-shi" semantic analysis scales well',
                  noteZh: '「控名责实」语义分析随规模扩大表现更好' },
              ].map(item => {
                const sch = schools.find(s => s.id === item.id)
                return (
                  <div key={item.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <SchoolDot school={item.id as SchoolId} />
                      <span className="font-medium text-sm">
                        {lang === 'en' ? sch?.nameEn : sch?.nameZh}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-green-600 dark:text-green-400">+ </span>
                        {lang === 'en' ? item.strengthEn : item.strengthZh}
                      </div>
                      <div>
                        <span className="text-red-500 dark:text-red-400">− </span>
                        {lang === 'en' ? item.weaknessEn : item.weaknessZh}
                      </div>
                      <div className="mt-2 text-muted-foreground italic">
                        {lang === 'en' ? item.noteEn : item.noteZh}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Conclusion */}
      <AnimatedCard index={9}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Conclusion' : '结论'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {lang === 'en'
                  ? '8B model outperforms 0.6B on most benchmarks, with the largest gains on XSTest (+3.4% for baseline). However, the fundamental pattern holds across both scales: baseline outperforms all schools on official benchmarks, primarily due to school prompts triggering over-classification of safe content.'
                  : '8B 模型在大多数 benchmark 上优于 0.6B，baseline 在 XSTest 提升最显著（+3.4%）。然而，核心规律在两个规模上保持一致：baseline 在官方 benchmark 上优于所有学派，主要原因是学派 prompt 触发了对安全内容的过度分类。'}
              </p>
              <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  {lang === 'en' ? 'Production Recommendation' : '生产建议'}
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  {lang === 'en'
                    ? 'Use Baseline for high-precision safety judgment. If a school is required, Logician (名家) offers the best trade-off at 8B scale. Military school benefits most from the 8B upgrade (+8% on OR-Bench Hard).'
                    : '高精度安全判断请使用 Baseline。若需使用学派，名家在 8B 规模下提供最佳平衡。兵家从 8B 升级中受益最大（OR-Bench Hard +8%）。'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}
