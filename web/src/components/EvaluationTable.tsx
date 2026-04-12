import { useLang } from '@/context/LanguageContext'
import { schools, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { evaluationPrompts, evaluationDimensions, evaluationScores } from '@/data/evaluations'
import type { PromptId } from '@/data/evaluations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'

const schoolOrder: (SchoolId | 'baseline')[] = ['baseline', 'mohist', 'dao', 'confucian', 'legal', 'logician', 'military']

// Heatmap color intensity based on 0-3 scale
function getHeatColor(value: number | null, maxVal: number, school: SchoolId | 'baseline'): string {
  if (value === null) return 'transparent'
  const color = school === 'baseline' ? '#B0A8A0' : schoolColors[school as SchoolId] ?? '#B0A8A0'
  const intensity = Math.min(value / maxVal, 1)
  const alpha = Math.round(intensity * 40 + 8).toString(16).padStart(2, '0')
  return `${color}${alpha}`
}

export function EvaluationTable() {
  const { lang } = useLang()
  const selectedPrompt: PromptId = 'P1' // Only P1 has data

  const prompt = evaluationPrompts.find(p => p.id === selectedPrompt)!
  const scores = evaluationScores.filter(s => s.promptId === selectedPrompt)
  
  // Compute max values per dimension for heatmap normalization
  const maxValues: Record<string, number> = {}
  evaluationDimensions.forEach(dim => {
    const values = scores.map(s => s.scores[dim.id]).filter((v): v is number => v !== null)
    maxValues[dim.id] = Math.max(...values, 1)
  })

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          {lang === 'en' ? 'Multi-Dimensional Evaluation' : '多维度评测'}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          {lang === 'en'
            ? 'Each school evaluated across multiple observable dimensions on a code generation task.'
            : '每个学派在代码生成任务的多个可观察维度上的评测。'}
        </p>
      </div>

      {/* Selected prompt info */}
      <AnimatedCard index={0}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {lang === 'en' ? prompt.domainEn : prompt.domainZh}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              {lang === 'en' ? prompt.purposeEn : prompt.purposeZh}
            </p>
            <pre className="rounded bg-muted/50 p-2 text-[11px] font-mono text-muted-foreground">
              {prompt.promptText}
            </pre>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Evaluation heatmap table */}
      <AnimatedCard index={1}>
        <Card>
          <CardContent className="overflow-x-auto pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-card w-24 text-xs">
                    {lang === 'en' ? 'Dimension' : '维度'}
                  </TableHead>
                  {schoolOrder.map(id => {
                    const s = schools.find(x => x.id === id)
                    return (
                      <TableHead key={id} className="text-xs text-center min-w-[80px]">
                        <span className="flex items-center justify-center gap-1" style={{ color: id === 'baseline' ? '#B0A8A0' : schoolColors[id as SchoolId] }}>
                          {id !== 'baseline' && <SchoolDot school={id as SchoolId} />}
                          {id === 'baseline'
                            ? (lang === 'en' ? 'Baseline' : '基准')
                            : (lang === 'en' ? s?.nameEn : s?.nameZh)}
                        </span>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationDimensions.map((dim) => (
                  <TableRow key={dim.id}>
                    <TableCell className="sticky left-0 z-10 bg-card text-xs font-medium whitespace-nowrap" title={lang === 'en' ? dim.descEn : dim.descZh}>
                      {lang === 'en' ? dim.nameEn : dim.nameZh}
                      <span className="ml-1 text-[10px] text-muted-foreground">({dim.scale})</span>
                    </TableCell>
                    {schoolOrder.map(id => {
                      const scoreRow = scores.find(s => s.school === id)
                      const value = scoreRow?.scores[dim.id] ?? null
                      return (
                        <TableCell
                          key={id}
                          className="text-xs text-center font-mono"
                          style={{
                            backgroundColor: dim.scale === 'bytes'
                              ? getHeatColor(value, maxValues[dim.id], id)
                              : getHeatColor(value, 3, id),
                          }}
                        >
                          {value !== null ? (dim.scale === 'bytes' ? value.toLocaleString() : value) : '—'}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Dimension explanations */}
      <AnimatedCard index={2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Dimension Definitions' : '维度定义'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {evaluationDimensions.map(dim => (
                <div key={dim.id} className="rounded-lg border p-2 text-xs">
                  <p className="font-medium">{lang === 'en' ? dim.nameEn : dim.nameZh} <span className="text-muted-foreground">({dim.scale})</span></p>
                  <p className="text-muted-foreground">{lang === 'en' ? dim.descEn : dim.descZh}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </section>
  )
}
