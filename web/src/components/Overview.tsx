import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'
import { schools, averageSizeData, structuralElements, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { caseStudies } from '@/data/case-studies'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart } from './BarChart'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'
import { OutputComparison } from './OutputComparison'
import { SchoolMatrix } from './SchoolMatrix'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Cognitive spectrum data for cross-school comparison
const spectrumData = [
  { school: 'mohist' as SchoolId, dirEn: 'Compression', dirZh: '压缩', avg: '-63%', stratEn: 'Strip everything non-essential', stratZh: '去除一切非必要内容' },
  { school: 'legal' as SchoolId, dirEn: 'Variable', dirZh: '可变', avg: '+21%', stratEn: 'Constrain to rules (may compress or expand)', stratZh: '约束到规则（可能压缩或扩展）' },
  { school: 'dao' as SchoolId, dirEn: 'Exploration', dirZh: '探索', avg: '+38%', stratEn: 'Explore multiple paths', stratZh: '探索多条路径' },
  { school: 'confucian' as SchoolId, dirEn: 'Structure', dirZh: '结构', avg: '+50%', stratEn: 'Add formality, structure, pedagogy', stratZh: '添加正式性、结构、教学' },
  { school: 'logician' as SchoolId, dirEn: 'Analysis', dirZh: '分析', avg: '+86%', stratEn: 'Add verification, self-reflection, formal proof', stratZh: '添加验证、自反、形式化证明' },
  { school: 'military' as SchoolId, dirEn: 'Planning', dirZh: '规划', avg: '+113%', stratEn: 'Add planning, resource assessment, dual-path', stratZh: '添加规划、资源评估、双路径' },
]

const signatureData = [
  { school: 'mohist' as SchoolId, questionEn: 'What can I remove?', questionZh: '我能去掉什么？' },
  { school: 'dao' as SchoolId, questionEn: 'What alternatives exist?', questionZh: '有什么替代方案？' },
  { school: 'confucian' as SchoolId, questionEn: 'How should I communicate this?', questionZh: '我应该如何传达这个？' },
  { school: 'legal' as SchoolId, questionEn: 'What are the exact rules?', questionZh: '确切的规则是什么？' },
  { school: 'military' as SchoolId, questionEn: "What's the strategy and fallback?", questionZh: '策略和后备方案是什么？' },
  { school: 'logician' as SchoolId, questionEn: 'How do I know this is correct?', questionZh: '我怎么知道这是对的？' },
]

export function Overview() {
  const { lang } = useLang()
  const [expandedCase, setExpandedCase] = useState<number | null>(null)

  const barData = averageSizeData.map(d => ({
    label: d.label,
    value: d.size,
    school: d.school,
  }))

  return (
    <div className="space-y-10">
      {/* School effect cards */}
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">{t('overview.title', lang)}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{t('overview.desc', lang)}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school, i) => (
            <AnimatedCard key={school.id} index={i}>
              <Card className="h-full border-l-4" style={{ borderLeftColor: school.color }}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <SchoolDot school={school.id} />
                    <span>{lang === 'en' ? school.nameEn : school.nameZh}</span>
                    <span className="text-xs text-muted-foreground">
                      {lang === 'en' ? school.principle : school.principleZh}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {lang === 'en' ? school.philosophyEn : school.philosophyZh}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground">
                      {lang === 'en' ? 'Average change' : '平均变化'}
                    </span>
                    <span className="font-semibold" style={{ color: school.color }}>
                      {school.avgChange}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Size bar chart */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">{t('overview.sizeTitle', lang)}</h2>
        <AnimatedCard index={0}>
          <Card>
            <CardContent className="pt-6">
              <BarChart data={barData} />
              <p className="mt-3 text-[11px] text-muted-foreground">
                {lang === 'en'
                  ? '* Dao average excludes Qwen 3.5 failure (189 bytes)'
                  : '* 道家平均值排除Qwen 3.5失败（189字节）'}
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Output Transformation — side-by-side code comparison */}
      <OutputComparison />

      {/* Cross-School Behavior Matrix */}
      <SchoolMatrix />

      {/* Structural elements table */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">{t('overview.structTitle', lang)}</h2>
        <AnimatedCard index={0}>
          <Card>
            <CardContent className="pt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">{t('table.school', lang)}</TableHead>
                    <TableHead>{t('table.added', lang)}</TableHead>
                    <TableHead>{t('table.removed', lang)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {structuralElements.map(row => {
                    const school = schools.find(s => s.id === row.school)!
                    return (
                      <TableRow key={row.school}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            <SchoolDot school={row.school} />
                            {lang === 'en' ? school.nameEn : school.nameZh}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{row.added}</TableCell>
                        <TableCell className="text-xs">{row.removed}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Case Studies */}
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">{t('overview.caseTitle', lang)}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{t('overview.caseDesc', lang)}</p>

        <div className="space-y-3">
          {caseStudies.map((cs, i) => {
            const school = schools.find(s => s.id === cs.school)!
            const isExpanded = expandedCase === cs.id

            return (
              <AnimatedCard key={cs.id} index={i}>
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setExpandedCase(isExpanded ? null : cs.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <SchoolDot school={cs.school} />
                      {lang === 'en' ? cs.titleEn : cs.titleZh}
                    </span>
                    <motion.span
                      className="text-muted-foreground text-xs"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t px-4 py-4">
                          <p className="mb-2 text-xs text-muted-foreground">
                            <strong>{lang === 'en' ? 'Problem' : '问题'}:</strong>{' '}
                            {lang === 'en' ? cs.problemEn : cs.problemZh}
                          </p>
                          {cs.code && (
                            <pre className="mb-3 rounded bg-muted/50 p-3 text-[11px] font-mono leading-relaxed">
                              {cs.code}
                            </pre>
                          )}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-28 text-xs">{lang === 'en' ? 'Aspect' : '方面'}</TableHead>
                                <TableHead className="text-xs">{t('case.without', lang)}</TableHead>
                                <TableHead className="text-xs" style={{ color: schoolColors[cs.school] }}>
                                  {t('case.with', lang)} ({lang === 'en' ? school.nameEn : school.nameZh})
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cs.comparison.map((c, j) => (
                                <TableRow key={j}>
                                  <TableCell className="text-xs font-medium">
                                    {lang === 'en' ? c.aspectEn : c.aspectZh}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {lang === 'en' ? c.withoutEn : c.withoutZh}
                                  </TableCell>
                                  <TableCell className="text-xs">
                                    {lang === 'en' ? c.withEn : c.withZh}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </AnimatedCard>
            )
          })}
        </div>
      </section>

      {/* Cross-School Comparison */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">{t('overview.compareTitle', lang)}</h2>

        {/* Cognitive Spectrum */}
        <AnimatedCard index={0} className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'en' ? 'Cognitive Spectrum' : '认知光谱'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {spectrumData.map((item, i) => {
                  const school = schools.find(s => s.id === item.school)!
                  return (
                    <motion.div
                      key={item.school}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2 text-xs"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.05 }}
                    >
                      <SchoolDot school={item.school} />
                      <span className="w-14 shrink-0 font-medium">
                        {lang === 'en' ? school.nameEn : school.nameZh}
                      </span>
                      <span className="w-16 shrink-0 text-muted-foreground">
                        {lang === 'en' ? item.dirEn : item.dirZh}
                      </span>
                      <span className="w-10 shrink-0 font-semibold" style={{ color: schoolColors[item.school] }}>
                        {item.avg}
                      </span>
                      <span className="text-muted-foreground">
                        {lang === 'en' ? item.stratEn : item.stratZh}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Cognitive Signatures */}
        <AnimatedCard index={1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'en' ? 'Each School\'s Core Question' : '每个学派的核心问题'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {signatureData.map((item, i) => {
                  const school = schools.find(s => s.id === item.school)!
                  return (
                    <motion.div
                      key={item.school}
                      className="flex items-start gap-2 rounded-lg border p-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.06 }}
                    >
                      <SchoolDot school={item.school} className="mt-1" />
                      <div>
                        <p className="text-xs font-medium">
                          {lang === 'en' ? school.nameEn : school.nameZh}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground italic">
                          {lang === 'en' ? item.questionEn : item.questionZh}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>
    </div>
  )
}
