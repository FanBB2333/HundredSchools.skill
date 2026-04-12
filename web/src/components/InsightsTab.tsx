import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'
import { schools, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'
import { EvaluationTable } from './EvaluationTable'

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

// Decision guide data
const decisionRows = [
  { workEn: 'Need creative exploration', workZh: '需要创意探索', primary: 'dao' as SchoolId, secondary: 'military' as SchoolId, evidenceEn: 'Alternative Count metric, Case 8', evidenceZh: '方案分支数指标, 案例 8' },
  { workEn: 'Need concept clarification', workZh: '需要概念澄清', primary: 'logician' as SchoolId, secondary: 'legal' as SchoolId, evidenceEn: 'Type system & data diagnosis (Case 10, P5)', evidenceZh: '类型系统与数据诊断（案例 10, P5）' },
  { workEn: 'Need strict formatted output', workZh: '需要严格格式输出', primary: 'legal' as SchoolId, secondary: 'logician' as SchoolId, evidenceEn: 'Schema/migration/defense (Case 3, 9, 14)', evidenceZh: 'Schema/迁移/防御（案例 3, 9, 14）' },
  { workEn: 'Need complex planning', workZh: '需要复杂规划', primary: 'military' as SchoolId, secondary: 'legal' as SchoolId, evidenceEn: 'Plan Structure metric, Case 4, 13', evidenceZh: '计划结构指标, 案例 4, 13' },
  { workEn: 'Need multi-audience expression', workZh: '需要多受众表达', primary: 'confucian' as SchoolId, secondary: 'military' as SchoolId, evidenceEn: 'Documentation (Case 11), Tone Quality', evidenceZh: '文档写作（案例 11），语调质量' },
  { workEn: 'Need high-density extraction', workZh: '需要高密度提炼', primary: 'mohist' as SchoolId, secondary: 'legal' as SchoolId, evidenceEn: 'Meeting minutes (Case 12), Compression Ratio', evidenceZh: '会议纪要（案例 12），压缩比' },
]

const pipelineRows = [
  { scenarioEn: 'Secure code review', scenarioZh: '安全代码审查', pipelineEn: 'Logician -> Legal -> Confucian', pipelineZh: '名家 -> 法家 -> 儒家', whyEn: 'Logical analysis -> rule enforcement -> audience communication', whyZh: '逻辑分析 -> 规则执行 -> 受众沟通' },
  { scenarioEn: 'System architecture', scenarioZh: '系统架构', pipelineEn: 'Military -> Mohist -> Legal', pipelineZh: '兵家 -> 墨家 -> 法家', whyEn: 'Strategic planning -> lean implementation -> strict output', whyZh: '战略规划 -> 精益实现 -> 严格输出' },
  { scenarioEn: 'Creative with quality gate', scenarioZh: '创意+质量把关', pipelineEn: 'Dao -> Confucian -> Logician', pipelineZh: '道家 -> 儒家 -> 名家', whyEn: 'Exploration -> tone alignment -> claim verification', whyZh: '探索 -> 语调对齐 -> 论点验证' },
  { scenarioEn: 'Incident response', scenarioZh: '事故响应', pipelineEn: 'Military -> Legal', pipelineZh: '兵家 -> 法家', whyEn: 'Strategic assessment -> rule-based execution', whyZh: '战略评估 -> 规则执行' },
  { scenarioEn: 'Safety-critical (0.6B)', scenarioZh: '安全关键（0.6B）', pipelineEn: 'Legal (single)', pipelineZh: '法家（单独）', whyEn: 'Empirically best: 0% over-refusal + 100% harmful refusal', whyZh: '实证最优：0% 过度拒绝 + 100% 有害拒绝' },
  { scenarioEn: 'Safety-critical (8B+)', scenarioZh: '安全关键（8B+）', pipelineEn: 'Logician -> Legal -> Confucian', pipelineZh: '名家 -> 法家 -> 儒家', whyEn: 'Multi-stage may benefit from larger model capacity (untested)', whyZh: '多阶段可能受益于更大模型容量（待验证）' },
]

// XGuard Content Safety Evaluation Data
const xguardData = {
  borderlineAccuracy: [
    { school: 'legal' as SchoolId, accuracy: 75, correct: 3, total: 4 },
    { school: 'military' as SchoolId, accuracy: 75, correct: 3, total: 4 },
    { school: 'confucian' as SchoolId, accuracy: 50, correct: 2, total: 4 },
    { school: 'mohist' as SchoolId, accuracy: 50, correct: 2, total: 4 },
    { school: 'logician' as SchoolId, accuracy: 50, correct: 2, total: 4 },
    { school: 'dao' as SchoolId, accuracy: 25, correct: 1, total: 4 },
  ],
  findings: {
    en: [
      '100% harmful content refusal across all schools (hate speech, child exploitation, extremism, self-harm)',
      'Legal and Military schools tie for best borderline judgment (75% accuracy vs. 50% baseline)',
      'BD3 (public info inference) is universal blind spot — all 9 conditions misclassify as privacy violation',
      'XGuard uses 8 fine-grained risk categories (ac, pc, ter, ph, mh, pp, med, sec) — not binary safe/unsafe',
    ],
    zh: [
      '所有学派均100%拒绝有害内容（仇恨言论、未成年色情、极端主义、自残教唆）',
      '法家和兵家在灰色地带判断中并列第一（75%准确率 vs. 50%基准）',
      'BD3（公开信息推理）是所有条件的共同盲区——所有9个条件都误判为隐私侵犯',
      'XGuard使用8个细分风险类别（ac, pc, ter, ph, mh, pp, med, sec）——非二元安全/不安全分类',
    ],
  },
}

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
    <div className="space-y-10">
      {/* Section 1: Multi-Dimensional Evaluation */}
      <EvaluationTable />

      {/* Section 2: XGuard Content Safety Evaluation */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {lang === 'en' ? 'XGuard Content Safety Evaluation' : 'XGuard 内容安全评测'}
          </h2>
          <p className="mb-2 text-sm text-muted-foreground">
            {lang === 'en'
              ? 'Tested on YuFeng-XGuard-Reason-0.6B with 12 Chinese content safety samples (4 harmful + 4 borderline + 4 benign) covering 8 risk dimensions: hate speech, child exploitation, extremism, physical/mental health, ethics, privacy, medical advice.'
              : '在 YuFeng-XGuard-Reason-0.6B 上测试，使用12个中文内容安全样本（4个有害 + 4个灰色地带 + 4个良性），覆盖8个风险维度：仇恨言论、未成年色情、极端主义、身心健康、伦理道德、数据隐私、医疗建议。'}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === 'en' ? 'Date: 2026-04-12 | 108 evaluations (12 samples × 9 conditions)' : '日期：2026-04-12 | 108次评测（12个样本 × 9个条件）'}
          </p>
        </div>

        {/* Borderline Accuracy Chart */}
        <AnimatedCard index={0}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'en' ? 'Borderline Judgment Accuracy' : '灰色地带判断准确率'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-xs text-muted-foreground">
                {lang === 'en'
                  ? 'Higher is better. Measures correct classification of gray-area content (should allow safe borderline content while blocking harmful).'
                  : '越高越好。衡量对灰色地带内容的正确分类（应允许安全的灰色地带内容，同时阻止有害内容）。'}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{lang === 'en' ? 'Rank' : '排名'}</TableHead>
                    <TableHead className="text-xs">{t('table.school', lang)}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Accuracy' : '准确率'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Correct / Total' : '正确 / 总数'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {xguardData.borderlineAccuracy.map((row, i) => {
                    const sch = schools.find(s => s.id === row.school)!
                    const isTop = row.accuracy === 75
                    return (
                      <TableRow key={row.school} className={isTop ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                        <TableCell className="text-xs font-semibold">{i + 1}</TableCell>
                        <TableCell className="text-xs">
                          <span className="flex items-center gap-2">
                            <SchoolDot school={row.school} />
                            <span className={isTop ? 'font-semibold' : ''}>{lang === 'en' ? sch.nameEn : sch.nameZh}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className={`font-semibold ${isTop ? 'text-green-600 dark:text-green-400' : ''}`}>
                            {row.accuracy}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.correct} / {row.total}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                {lang === 'en' ? 'Baseline: 50% (2/4) | Worst: Dao & Logician→Legal→Confucian at 25% (1/4)' : '基准：50%（2/4）| 最差：道家和名家→法家→儒家仅25%（1/4）'}
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Key Findings */}
        <AnimatedCard index={1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{lang === 'en' ? 'Key Findings' : '关键发现'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {(lang === 'en' ? xguardData.findings.en : xguardData.findings.zh).map((finding, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 text-primary">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  {lang === 'en' ? '💡 Production Recommendation' : '💡 生产建议'}
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  {lang === 'en'
                    ? 'Use Legal or Military school framing for content moderation platforms. Both achieve 75% borderline accuracy (best) while maintaining 100% harmful refusal and 100% benign retention.'
                    : '内容审核平台应使用法家或兵家框架。两者均达到75%灰色地带准确率（最佳），同时保持100%有害内容拒绝率和100%良性内容保留率。'}
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Section 3: Decision Guide */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {lang === 'en' ? 'Which School Should You Use?' : '你应该用哪家？'}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {lang === 'en'
              ? 'Data-driven recommendations based on case studies and evaluation metrics. Each recommendation links back to specific evidence.'
              : '基于案例研究和评测指标的数据驱动推荐。每条推荐都关联到具体证据。'}
          </p>
        </div>

        {/* Quick Decision Table */}
        <AnimatedCard index={0}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'en' ? 'Quick Decision Table' : '快速决策表'}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{lang === 'en' ? 'Work Type' : '工作类型'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Primary' : '首选'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Secondary' : '次选'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Evidence' : '依据'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisionRows.map((row, i) => {
                    const primary = schools.find(s => s.id === row.primary)!
                    const secondary = schools.find(s => s.id === row.secondary)!
                    return (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-medium">{lang === 'en' ? row.workEn : row.workZh}</TableCell>
                        <TableCell className="text-xs">
                          <span className="flex items-center gap-1">
                            <SchoolDot school={row.primary} />
                            <span style={{ color: schoolColors[row.primary] }}>{lang === 'en' ? primary.nameEn : primary.nameZh}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="flex items-center gap-1">
                            <SchoolDot school={row.secondary} />
                            <span className="text-muted-foreground">{lang === 'en' ? secondary.nameEn : secondary.nameZh}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{lang === 'en' ? row.evidenceEn : row.evidenceZh}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Pipeline Recommendations */}
        <AnimatedCard index={1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {lang === 'en' ? 'Pipeline Recommendations' : '流水线推荐'}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <p className="mb-3 text-xs text-muted-foreground">
                {lang === 'en'
                  ? 'For complex tasks, combining schools in a pipeline produces stronger results than any single school.'
                  : '对于复杂任务，将学派组合成流水线比使用单一学派效果更好。'}
              </p>
              <p className="mb-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                {lang === 'en'
                  ? 'Note: XGuard-Reason-0.6B empirical study (108 evals) found single Legal school outperforms all pipelines for safety evaluation. Multi-stage pipelines may work better with 8B+ models.'
                  : '注：XGuard-Reason-0.6B 实证研究（108 次评测）发现单一法家在安全评测中优于所有流水线方案。多阶段流水线可能在 8B+ 模型上更有效。'}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{lang === 'en' ? 'Scenario' : '场景'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Pipeline' : '流水线'}</TableHead>
                    <TableHead className="text-xs">{lang === 'en' ? 'Why' : '原因'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pipelineRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium">{lang === 'en' ? row.scenarioEn : row.scenarioZh}</TableCell>
                      <TableCell className="text-xs font-mono">{lang === 'en' ? row.pipelineEn : row.pipelineZh}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lang === 'en' ? row.whyEn : row.whyZh}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Section 4: Key Insights */}
      <section className="space-y-6">
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
      </section>
    </div>
  )
}
