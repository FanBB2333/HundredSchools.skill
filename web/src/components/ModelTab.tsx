import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'
import { schools } from '@/data/schools'
import type { ModelInfo } from '@/data/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart } from './BarChart'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'

function changeBadgeVariant(change: string): string {
  if (change === 'FAIL') return 'bg-red-100 text-red-700'
  if (change.startsWith('-')) return 'bg-emerald-50 text-emerald-700'
  const num = parseInt(change)
  if (num <= 20) return 'bg-amber-50 text-amber-700'
  if (num <= 60) return 'bg-orange-50 text-orange-700'
  return 'bg-red-50 text-red-700'
}

export function ModelTab({ model }: { model: ModelInfo }) {
  const { lang } = useLang()

  const barData = model.schools.map(s => ({
    label: s.school === 'baseline'
      ? 'Baseline'
      : (schools.find(sc => sc.id === s.school)?.nameEn ?? s.school),
    value: s.size,
    school: s.school,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          {model.nameEn} — {lang === 'en' ? 'School Effects' : '学派效果'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === 'en'
            ? `How each philosophical school transforms ${model.nameEn}'s output on the same email validation prompt.`
            : `每个哲学流派如何转变${model.nameZh}在同一邮件验证提示词上的输出。`}
        </p>
      </div>

      <AnimatedCard index={0}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {lang === 'en' ? 'Output Size by School' : '各学派输出大小'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={barData} />
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard index={1}>
        <Card>
          <CardContent className="pt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">{t('table.school', lang)}</TableHead>
                  <TableHead className="w-16">{t('table.size', lang)}</TableHead>
                  <TableHead className="w-20">{t('table.change', lang)}</TableHead>
                  <TableHead>{t('table.keyBehavior', lang)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {model.schools
                  .filter(s => s.school !== 'baseline')
                  .map(s => {
                    const sch = schools.find(sc => sc.id === s.school)
                    if (!sch) return null
                    return (
                      <TableRow key={s.school}>
                        <TableCell>
                          <span className="flex items-center gap-2 text-xs font-medium">
                            <SchoolDot school={sch.id} />
                            {lang === 'en' ? sch.nameEn : sch.nameZh}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{s.size} B</TableCell>
                        <TableCell>
                          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${changeBadgeVariant(s.change)}`}>
                            {s.change}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {lang === 'en' ? s.keyBehaviorEn : s.keyBehaviorZh}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedCard>

      {model.notable && (
        <AnimatedCard index={2}>
          <div className="rounded-lg border-l-4 border-[#8EA8C5] bg-[#8EA8C5]/5 p-4">
            <p className="text-xs leading-relaxed text-foreground/80">
              <strong>{lang === 'en' ? 'Notable:' : '值得注意：'}</strong>{' '}
              {lang === 'en' ? model.notable.en : model.notable.zh}
            </p>
          </div>
        </AnimatedCard>
      )}
    </div>
  )
}
