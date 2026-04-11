import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'
import { schools, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'

const spectrumRows = [
  { dir: { en: 'Compression', zh: '压缩' }, school: 'mohist' as SchoolId, avg: '-63%', strat: { en: 'Strip everything non-essential', zh: '去除一切非必要内容' } },
  { dir: { en: 'Variable', zh: '可变' }, school: 'legal' as SchoolId, avg: '+21%', strat: { en: 'Constrain to rules (may compress or expand)', zh: '约束到规则（可能压缩或扩展）' } },
  { dir: { en: 'Exploration', zh: '探索' }, school: 'dao' as SchoolId, avg: '+38%', strat: { en: 'Explore multiple paths', zh: '探索多条路径' } },
  { dir: { en: 'Structure', zh: '结构' }, school: 'confucian' as SchoolId, avg: '+50%', strat: { en: 'Add formality, structure, pedagogy', zh: '添加正式性、结构、教学' } },
  { dir: { en: 'Analysis', zh: '分析' }, school: 'logician' as SchoolId, avg: '+86%', strat: { en: 'Add verification, self-reflection, formal proof', zh: '添加验证、自反、形式化证明' } },
  { dir: { en: 'Planning', zh: '规划' }, school: 'military' as SchoolId, avg: '+113%', strat: { en: 'Add planning, resource assessment, dual-path', zh: '添加规划、资源评估、双路径' } },
]

const returnTypes = [
  { school: 'mohist' as SchoolId, type: 'bool', desc: { en: 'maximum compression, no metadata', zh: '最大压缩，无元数据' } },
  { school: 'confucian' as SchoolId, type: 'tuple[bool, str]', desc: { en: 'propriety demands clarity', zh: '礼要求清晰' } },
  { school: 'legal' as SchoolId, type: 'frozen dataclass', desc: { en: 'structured, immutable results', zh: '结构化、不可变结果' } },
  { school: 'military' as SchoolId, type: 'bool + named groups', desc: { en: 'concerns separated for inspection', zh: '关注点分离以便检查' } },
  { school: 'logician' as SchoolId, type: 'dict', desc: { en: 'every claim must be auditable', zh: '每个命题必须可审计' } },
  { school: 'dao' as SchoolId, type: 'dataclass / multiple', desc: { en: 'explores different result shapes', zh: '探索不同的结果形态' } },
]

const signatureData = [
  { school: 'mohist' as SchoolId, q: { en: 'What can I remove?', zh: '我能去掉什么？' } },
  { school: 'dao' as SchoolId, q: { en: 'What alternatives exist?', zh: '有什么替代方案？' } },
  { school: 'confucian' as SchoolId, q: { en: 'How should I communicate this?', zh: '我应该如何传达这个？' } },
  { school: 'legal' as SchoolId, q: { en: 'What are the exact rules?', zh: '确切的规则是什么？' } },
  { school: 'military' as SchoolId, q: { en: "What's the strategy and fallback?", zh: '策略和后备方案是什么？' } },
  { school: 'logician' as SchoolId, q: { en: 'How do I know this is correct?', zh: '我怎么知道这是对的？' } },
]

export function InsightsTab() {
  const { lang } = useLang()

  const insightCards = [
    {
      title: t('insight.1.title', lang),
      content: (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{t('insight.1.desc', lang)}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t('table.direction', lang)}</TableHead>
                <TableHead className="text-xs">{t('table.school', lang)}</TableHead>
                <TableHead className="text-xs">{t('table.avgChange', lang)}</TableHead>
                <TableHead className="text-xs">{t('table.strategy', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spectrumRows.map(row => {
                const sch = schools.find(s => s.id === row.school)!
                return (
                  <TableRow key={row.school}>
                    <TableCell className="text-xs">{lang === 'en' ? row.dir.en : row.dir.zh}</TableCell>
                    <TableCell className="text-xs">
                      <span className="flex items-center gap-2">
                        <SchoolDot school={row.school} />
                        {lang === 'en' ? sch.nameEn : sch.nameZh}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold" style={{ color: schoolColors[row.school] }}>{row.avg}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lang === 'en' ? row.strat.en : row.strat.zh}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ),
    },
    {
      title: t('insight.2.title', lang),
      content: (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{t('insight.2.desc', lang)}</p>
          <div className="space-y-2">
            {returnTypes.map(rt => {
              const sch = schools.find(s => s.id === rt.school)!
              return (
                <div key={rt.school} className="flex items-center gap-3 text-xs">
                  <SchoolDot school={rt.school} />
                  <span className="w-16 shrink-0 font-medium">{lang === 'en' ? sch.nameEn : sch.nameZh}</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{rt.type}</code>
                  <span className="text-muted-foreground">— {lang === 'en' ? rt.desc.en : rt.desc.zh}</span>
                </div>
              )
            })}
          </div>
        </>
      ),
    },
    { title: t('insight.3.title', lang), content: <p className="text-xs text-muted-foreground">{t('insight.3.desc', lang)}</p> },
    { title: t('insight.4.title', lang), content: <p className="text-xs text-muted-foreground">{t('insight.4.desc', lang)}</p> },
    { title: t('insight.5.title', lang), content: <p className="text-xs text-muted-foreground">{t('insight.5.desc', lang)}</p> },
    {
      title: t('insight.6.title', lang),
      content: (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{t('insight.6.desc', lang)}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t('table.school', lang)}</TableHead>
                <TableHead className="text-xs">{lang === 'en' ? 'Core Question' : '核心问题'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatureData.map(row => {
                const sch = schools.find(s => s.id === row.school)!
                return (
                  <TableRow key={row.school}>
                    <TableCell className="text-xs">
                      <span className="flex items-center gap-2">
                        <SchoolDot school={row.school} />
                        {lang === 'en' ? sch.nameEn : sch.nameZh}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs italic text-muted-foreground">{lang === 'en' ? row.q.en : row.q.zh}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">{t('insights.title', lang)}</h2>

      {insightCards.map((card, i) => (
        <AnimatedCard key={i} index={i}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  )
}
