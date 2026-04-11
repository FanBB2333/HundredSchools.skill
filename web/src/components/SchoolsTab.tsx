import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'
import { schools, schoolResults } from '@/data/schools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from './BarChart'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'

export function SchoolsTab() {
  const { lang } = useLang()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">{t('schools.title', lang)}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{t('schools.desc', lang)}</p>
      </div>

      {schoolResults.map((sr, i) => {
        const school = schools.find(s => s.id === sr.school)!
        const barData = sr.results.map(r => ({
          label: r.model,
          value: r.size,
          school: sr.school,
          suffix: `${r.size} B (${r.change})`,
        }))

        return (
          <AnimatedCard key={sr.school} index={i}>
            <Card className="border-l-4" style={{ borderLeftColor: school.color }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <SchoolDot school={sr.school} />
                  {lang === 'en' ? school.nameEn : school.nameZh}
                  <span className="font-normal text-muted-foreground">
                    — {lang === 'en' ? school.principle : school.principleZh}
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  <strong>{lang === 'en' ? 'Philosophy' : '哲学理念'}:</strong>{' '}
                  {lang === 'en' ? school.philosophyEn : school.philosophyZh}
                </p>
              </CardHeader>
              <CardContent>
                <BarChart data={barData} />
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {lang === 'en' ? sr.universalBehaviorEn : sr.universalBehaviorZh}
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
        )
      })}
    </div>
  )
}
