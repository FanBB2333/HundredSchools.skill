import { useLang } from '@/context/LanguageContext'
import { schools } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import officialBenchmarkData from '@/data/official_benchmark_data.json'

// Type definitions
interface ConditionResult {
  condition: string
  accuracy: number
  safeAccuracy: number | null
  unsafeRecall: number | null
  falseRefusalRate: number | null
  total: number
  correct: number
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
  }
  comparisonTable: {
    headers: string[]
    rows: ComparisonRow[]
  }
  findings: {
    en: string[]
    zh: string[]
  }
}

const data = officialBenchmarkData as OfficialBenchmarkData

// Color mapping for schools
const schoolColors: Record<string, string> = {
  baseline: '#94a3b8',
  confucian: schools.find(s => s.id === 'confucian')?.color || '#dc2626',
  dao: schools.find(s => s.id === 'dao')?.color || '#16a34a',
  legal: schools.find(s => s.id === 'legal')?.color || '#1d4ed8',
  logician: schools.find(s => s.id === 'logician')?.color || '#9333ea',
  military: schools.find(s => s.id === 'military')?.color || '#ea580c',
  mohist: schools.find(s => s.id === 'mohist')?.color || '#0891b2',
}

export function OfficialBenchmarkSection() {
  const { lang } = useLang()

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          {lang === 'en' ? 'Official Benchmark Evaluation' : '官方 Benchmark 评测'}
        </h2>
        <p className="mb-2 text-sm text-muted-foreground">
          {lang === 'en'
            ? `Comprehensive evaluation on 4 official safety benchmarks with ${data.summary.totalSamples.toLocaleString()} samples across ${data.summary.conditions} conditions (baseline + 6 schools).`
            : `在 4 个官方安全 benchmark 上进行全面评测，${data.summary.totalSamples.toLocaleString()} 个样本，${data.summary.conditions} 个条件（baseline + 6 个学派）。`}
        </p>
        <p className="text-xs text-muted-foreground">
          {lang === 'en' 
            ? `${data.summary.totalEvaluations.toLocaleString()} total API calls on YuFeng-XGuard-Reason-0.6B`
            : `共 ${data.summary.totalEvaluations.toLocaleString()} 次 API 调用，模型 YuFeng-XGuard-Reason-0.6B`}
        </p>
      </section>

      {/* Summary Stats */}
      <AnimatedCard index={0}>
        <div className="grid gap-4 sm:grid-cols-4">
          {data.datasets.map((dataset) => {
            const primaryMetricKey = {
              'unsafe_recall': 'unsafeRecall',
              'safe_accuracy': 'safeAccuracy',
              'accuracy': 'accuracy',
            }[dataset.primaryMetric] || 'accuracy'
            const baselineValue = dataset.baseline[primaryMetricKey as keyof typeof dataset.baseline]
            
            return (
              <Card key={dataset.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {lang === 'en' ? dataset.nameEn : dataset.nameZh}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{baselineValue}%</div>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'en' ? 'Baseline' : '基准'} ({dataset.samples} {lang === 'en' ? 'samples' : '样本'})
                  </p>
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

      {/* Comparison Table */}
      <AnimatedCard index={2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Baseline vs Schools Comparison' : 'Baseline vs 学派对比'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs text-muted-foreground">
              {lang === 'en'
                ? 'Green indicates better than baseline, red indicates worse. Bold values are the best in each row.'
                : '绿色表示优于 baseline，红色表示劣于 baseline。粗体值为每行最佳。'}
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{lang === 'en' ? 'Metric' : '指标'}</TableHead>
                    <TableHead className="text-xs text-center">{lang === 'en' ? 'Baseline' : '基准'}</TableHead>
                    {['dao', 'confucian', 'legal', 'military', 'mohist', 'logician'].map(condition => {
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
                  {data.comparisonTable.rows.map((row, rowIdx) => {
                    const baselineValue = row.values.baseline
                    const allValues = Object.entries(row.values).filter(([k]) => k !== 'baseline')
                    const maxValue = Math.max(baselineValue || 0, ...allValues.map(([, v]) => v || 0))
                    
                    return (
                      <TableRow key={rowIdx}>
                        <TableCell className="text-xs font-medium">
                          {lang === 'en' ? row.metric : row.metricZh}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <span className={`font-semibold ${baselineValue === maxValue ? 'text-green-600 dark:text-green-400' : ''}`}>
                            {baselineValue?.toFixed(1)}%
                          </span>
                        </TableCell>
                        {['dao', 'confucian', 'legal', 'military', 'mohist', 'logician'].map(condition => {
                          const value = row.values[condition]
                          const diff = value && baselineValue ? value - baselineValue : 0
                          const isMax = value === maxValue
                          
                          return (
                            <TableCell key={condition} className="text-xs text-center">
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold ${isMax ? 'text-green-600 dark:text-green-400' : ''}`}>
                                  {value?.toFixed(1)}%
                                </span>
                                {diff !== 0 && (
                                  <span className={`text-[10px] ${diff > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Per-Dataset Charts */}
      {data.datasets.map((dataset, datasetIdx) => {
        const primaryMetricKey = {
          'unsafe_recall': 'unsafeRecall',
          'safe_accuracy': 'safeAccuracy',
          'accuracy': 'accuracy',
        }[dataset.primaryMetric] || 'accuracy'
        
        const chartData = dataset.conditions.map(c => {
          const sch = schools.find(s => s.id === c.condition)
          return {
            name: c.condition === 'baseline' 
              ? (lang === 'en' ? 'Baseline' : '基准')
              : (lang === 'en' ? sch?.nameEn : sch?.nameZh) || c.condition,
            value: c[primaryMetricKey as keyof ConditionResult] as number,
            fill: schoolColors[c.condition] || '#94a3b8',
            isBaseline: c.condition === 'baseline',
          }
        }).sort((a, b) => (b.value || 0) - (a.value || 0))

        const baselineValue = dataset.baseline[primaryMetricKey as keyof typeof dataset.baseline]

        return (
          <AnimatedCard key={dataset.id} index={3 + datasetIdx}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {lang === 'en' ? dataset.nameEn : dataset.nameZh}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {lang === 'en' ? dataset.descEn : dataset.descZh}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4 text-xs">
                  <span>
                    <strong>{lang === 'en' ? 'Samples:' : '样本数：'}</strong> {dataset.samples}
                  </span>
                  <span>
                    <strong>{lang === 'en' ? 'Expected:' : '预期标签：'}</strong> {dataset.expectedLabel}
                  </span>
                  <span>
                    <strong>{lang === 'en' ? 'Metric:' : '主指标：'}</strong> {dataset.primaryMetric.replace('_', ' ')}
                  </span>
                </div>

                {/* Bar Chart */}
                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        label={{ value: '%', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => `${Number(value).toFixed(1)}%`}
                        labelStyle={{ color: '#000' }}
                      />
                      {baselineValue && (
                        <ReferenceLine 
                          y={baselineValue} 
                          stroke="#94a3b8" 
                          strokeDasharray="5 5"
                          label={{ value: `Baseline: ${baselineValue}%`, position: 'right', fontSize: 10 }}
                        />
                      )}
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.fill} 
                            opacity={entry.isBaseline ? 0.6 : 1} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Best/Worst Summary */}
                {dataset.bestSchool && dataset.worstSchool && (
                  <div className="flex gap-4 text-xs">
                    <div className="rounded-md bg-green-50 p-2 dark:bg-green-950/20">
                      <span className="font-medium text-green-700 dark:text-green-300">
                        {lang === 'en' ? 'Best School: ' : '最佳学派：'}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {dataset.bestSchool.condition === 'baseline' ? 'Baseline' : (
                          lang === 'en' 
                            ? schools.find(s => s.id === dataset.bestSchool?.condition)?.nameEn
                            : schools.find(s => s.id === dataset.bestSchool?.condition)?.nameZh
                        )} ({dataset.bestSchool.value}%)
                      </span>
                    </div>
                    <div className="rounded-md bg-red-50 p-2 dark:bg-red-950/20">
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {lang === 'en' ? 'Worst School: ' : '最差学派：'}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        {lang === 'en' 
                          ? schools.find(s => s.id === dataset.worstSchool?.condition)?.nameEn
                          : schools.find(s => s.id === dataset.worstSchool?.condition)?.nameZh
                        } ({dataset.worstSchool.value}%)
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        )
      })}

      {/* School Characteristics Summary */}
      <AnimatedCard index={7}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'School Characteristics on Safety Judgment' : '各学派安全判断特性'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 'dao', strengthEn: 'None', strengthZh: '无', weaknessEn: 'Highest false refusal (-52%)', weaknessZh: '误拒绝率最高（-52%）', noteEn: '"Wu wei" causes over-caution on edge cases', noteZh: '「无为」导致边界场景过度谨慎' },
                { id: 'confucian', strengthEn: 'Lower false refusal on XSTest (+0.4%)', strengthZh: 'XSTest 误拒绝较低（+0.4%）', weaknessEn: 'Chinese harmful recall (-4.4%)', weaknessZh: '中文有害召回（-4.4%）', noteEn: '"Ke-ji-fu-li" educational style reduces direct refusals', noteZh: '「克己复礼」教导式回应减少直接拒绝' },
                { id: 'legal', strengthEn: 'None', strengthZh: '无', weaknessEn: 'Lowest unsafe recall (-9.5%)', weaknessZh: '有害召回最低（-9.5%）', noteEn: 'Strict rules paradoxically miss some harmful content', noteZh: '严格规则反而漏掉部分有害内容' },
                { id: 'military', strengthEn: 'Strong attack detection (-3%)', strengthZh: '攻击检测较强（-3%）', weaknessEn: 'Higher false refusal (-4.4%)', weaknessZh: '误拒绝较高（-4.4%）', noteEn: '"Miao-suan" risk assessment increases sensitivity', noteZh: '「庙算」风险评估增强检测敏感度' },
                { id: 'mohist', strengthEn: 'Lower false refusal on XSTest (+0.4%)', strengthZh: 'XSTest 误拒绝较低（+0.4%）', weaknessEn: 'Chinese harmful recall (-5.8%)', weaknessZh: '中文有害召回（-5.8%）', noteEn: '"Jie-yong" concise output balances safety/helpfulness', noteZh: '「节用」简洁输出平衡安全与实用' },
                { id: 'logician', strengthEn: 'Best among schools on edge cases', strengthZh: '边界场景学派最佳', weaknessEn: 'Unsafe recall (-8.0%)', weaknessZh: '有害召回（-8.0%）', noteEn: '"Kong-ming-ze-shi" semantic analysis helps edge cases', noteZh: '「控名责实」语义分析帮助边界判断' },
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
                        <span className="text-green-600 dark:text-green-400">+</span>{' '}
                        {lang === 'en' ? item.strengthEn : item.strengthZh}
                      </div>
                      <div>
                        <span className="text-red-600 dark:text-red-400">-</span>{' '}
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
      <AnimatedCard index={8}>
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
                  ? 'The official benchmark evaluation validates the core hypothesis: different philosophical school prompts affect safety judgment in measurable ways. However, on well-optimized benchmarks, the baseline (no system prompt) generally performs best.'
                  : '官方 benchmark 评测验证了核心假设：不同哲学学派 prompt 以可测量的方式影响安全判断。然而，在经过充分优化的 benchmark 上，baseline（无 system prompt）通常表现最佳。'}
              </p>
              <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  {lang === 'en' ? 'Production Recommendation' : '生产建议'}
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  {lang === 'en'
                    ? 'For high-precision safety judgment on standard benchmarks, use Baseline. For specific use cases requiring explanatory responses or educational refusals, consider Confucian school. Schools show most value in pilot evaluations with curated borderline samples.'
                    : '在标准 benchmark 上需要高精度安全判断时，使用 Baseline。对于需要解释性回应或教育性拒绝的特定场景，可考虑儒家。学派在精选的灰色地带样本小规模评测中表现出最大价值。'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  )
}
