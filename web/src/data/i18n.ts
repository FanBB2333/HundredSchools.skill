export type Lang = 'en' | 'zh'

const translations = {
  // Header
  'header.title': {
    en: 'HundredSchools',
    zh: '百家争鸣',
  },
  'header.subtitle': {
    en: 'How Philosophical Schools Shape AI Output',
    zh: '哲学流派如何塑造AI输出',
  },
  'header.meta': {
    en: 'Six schools of thought, one prompt, five models — tested via CLIppet',
    zh: '六大学派，同一提示词，五个模型——通过CLIppet测试',
  },
  'header.prompt': {
    en: 'Prompt: "Write a Python function to validate an email address and explain your approach."',
    zh: '提示词："Write a Python function to validate an email address and explain your approach."',
  },

  // Tabs
  'tab.overview': { en: 'Overview', zh: '概览' },
  'tab.schools': { en: 'Six Schools', zh: '六家' },
  'tab.insights': { en: 'Insights', zh: '发现' },
  'tab.xguard': { en: 'Content Safety', zh: '内容安全' },

  // Overview
  'overview.title': { en: 'What does each school do to the output?', zh: '每个学派对输出有什么影响？' },
  'overview.desc': {
    en: 'Each school of classical Chinese philosophy maps to a distinct control strategy for LLM output. The same prompt was sent to each model with and without each school activated, and the results measured in bytes as a proxy for output volume and structural change.',
    zh: '每个古典中国哲学流派都映射为LLM输出的一种独特控制策略。同一提示词分别在激活和未激活每个学派的情况下发送给每个模型，以字节数作为输出量和结构变化的代理指标。',
  },
  'overview.sizeTitle': { en: 'Output Size Across Schools (All Models Averaged)', zh: '各学派输出大小（所有模型平均）' },
  'overview.structTitle': { en: 'Structural Elements Introduced by Each School', zh: '每个学派引入的结构性元素' },
  'overview.caseTitle': { en: 'Case Studies', zh: '案例研究' },
  'overview.caseDesc': {
    en: 'Real-world scenarios showing how each school transforms AI behavior on specific coding problems.',
    zh: '真实场景展示每个学派如何在特定编码问题上转变AI行为。',
  },
  'overview.compareTitle': { en: 'Cross-School Comparison', zh: '跨学派对比' },

  // Table headers
  'table.school': { en: 'School', zh: '学派' },
  'table.added': { en: 'Structural Elements Added', zh: '添加的结构性元素' },
  'table.removed': { en: 'Elements Removed', zh: '移除的元素' },
  'table.size': { en: 'Size', zh: '大小' },
  'table.change': { en: 'Change', zh: '变化' },
  'table.keyBehavior': { en: 'Key Behavior', zh: '关键行为' },
  'table.direction': { en: 'Direction', zh: '方向' },
  'table.avgChange': { en: 'Average Change', zh: '平均变化' },
  'table.strategy': { en: 'Cognitive Strategy', zh: '认知策略' },
  'table.model': { en: 'Model', zh: '模型' },

  // Schools tab
  'schools.title': { en: 'How Each School Transforms AI Behavior', zh: '每个学派如何转变AI行为' },
  'schools.desc': {
    en: 'Comparison of each school\'s effect across all models using one unified prompt. Each school activates a distinct cognitive strategy.',
    zh: '使用统一提示词对比每个学派在所有模型上的效果。每个学派激活不同的认知策略。',
  },
  'schools.philosophy': { en: 'Philosophy', zh: '哲学理念' },

  // Insights tab
  'insights.title': { en: 'Key Insights: How Schools Shape Thinking', zh: '核心发现：学派如何塑造思维' },

  // Case study
  'case.problem': { en: 'Problem', zh: '问题' },
  'case.without': { en: 'Without Skill', zh: '未使用Skill' },
  'case.with': { en: 'With HundredSchools', zh: '使用百家' },

  // Compare
  'compare.compression': { en: 'Compression', zh: '压缩' },
  'compare.expansion': { en: 'Expansion', zh: '扩展' },
  'compare.variable': { en: 'Variable', zh: '可变' },
  'compare.exploration': { en: 'Exploration', zh: '探索' },
  'compare.structure': { en: 'Structure', zh: '结构' },
  'compare.analysis': { en: 'Analysis', zh: '分析' },
  'compare.planning': { en: 'Planning', zh: '规划' },

  // Case study domain labels
  'case.metrics': { en: 'Observable Metrics', zh: '可观察指标' },
  'case.recommended': { en: 'Recommended For', zh: '推荐用于' },
  'case.notRecommended': { en: 'Not Recommended For', zh: '不推荐用于' },

  // Decision guide
  'guide.title': { en: 'Which School Should You Use?', zh: '你应该用哪家？' },
  'guide.desc': {
    en: 'Data-driven recommendations based on case studies and evaluation metrics.',
    zh: '基于案例研究和评测指标的数据驱动推荐。',
  },
  'guide.quickTable': { en: 'Quick Decision Table', zh: '快速决策表' },
  'guide.workType': { en: 'Work Type', zh: '工作类型' },
  'guide.primary': { en: 'Primary', zh: '首选' },
  'guide.secondary': { en: 'Secondary', zh: '次选' },
  'guide.evidence': { en: 'Evidence', zh: '依据' },
  'guide.pipelines': { en: 'Pipeline Recommendations', zh: '流水线推荐' },
  'guide.scenario': { en: 'Scenario', zh: '场景' },
  'guide.pipeline': { en: 'Pipeline', zh: '流水线' },
  'guide.why': { en: 'Why', zh: '原因' },

  // Evaluation
  'eval.title': { en: 'Multi-Dimensional Evaluation', zh: '多维度评测' },
  'eval.desc': {
    en: 'Each school evaluated across multiple prompts and observable dimensions.',
    zh: '每个学派在多个提示词和可观察维度上的评测。',
  },
  'eval.dimension': { en: 'Dimension', zh: '维度' },
  'eval.baseline': { en: 'Baseline', zh: '基准' },
  'eval.dimDefs': { en: 'Dimension Definitions', zh: '维度定义' },
  'eval.pending': { en: 'Evaluation data for this prompt is pending.', zh: '该提示词的评测数据待补充。' },

  // Footer
  'footer.text': { en: 'HundredSchools.skill — tested via CLIppet', zh: 'HundredSchools.skill — 通过CLIppet测试' },

  // Insights cards
  'insight.1.title': { en: 'Schools control a cognitive spectrum from compression to expansion', zh: '学派控制着从压缩到扩展的认知光谱' },
  'insight.1.desc': { en: 'The six schools form a clear spectrum of output behavior:', zh: '六大学派形成了清晰的输出行为光谱：' },
  'insight.2.title': { en: 'Return type changes as a signal of deep internalization', zh: '返回类型变化是深度内化的信号' },
  'insight.2.desc': {
    en: 'One of the most telling indicators of how deeply a school affects model behavior is the return type of the generated function. The fact that models change data structures (not just prose) shows philosophical schools influence code architecture decisions, not just output formatting.',
    zh: '衡量学派对模型行为影响深度最有力的指标之一是生成函数的返回类型。模型改变数据结构（而不仅是文字），表明哲学流派影响代码架构决策，而不仅是输出格式。',
  },
  'insight.3.title': { en: 'Mohist: The most reliable school', zh: '墨家：最可靠的学派' },
  'insight.3.desc': {
    en: 'Mohist was the only school with 100% activation rate across all models. Every model successfully compressed output, stripped comments, and returned bare code. This suggests "do less" is the easiest cognitive instruction for LLMs to follow.',
    zh: '墨家是唯一在所有模型中100%激活率的学派。每个模型都成功压缩了输出、去除了注释、返回了裸代码。这表明"做得更少"是LLM最容易遵循的认知指令。',
  },
  'insight.4.title': { en: 'Dao: The hardest school to activate', zh: '道家：最难激活的学派' },
  'insight.4.desc': {
    en: 'Dao was the least reliably activated school. Qwen 3.5 completely failed. The "wu wei" principle of non-action is paradoxically the hardest instruction for an LLM -- the model must know when to stop rather than just follow a format template.',
    zh: '道家是激活最不可靠的学派。Qwen 3.5完全失败。"无为"原则对LLM来说是最难遵循的指令——模型必须知道何时停止，而不仅是遵循格式模板。',
  },
  'insight.5.title': { en: 'Legal shows an interesting split: expansion vs compression', zh: '法家展现出有趣的分裂：扩展与压缩' },
  'insight.5.desc': {
    en: 'Unlike other schools which consistently push in one direction, Legal produced both expansion and compression depending on the model. Both interpretations are valid readings of Legalist philosophy -- this is the only school where the mapping is genuinely ambiguous.',
    zh: '不同于其他始终朝一个方向推动的学派，法家根据模型同时产生了扩展和压缩。两种解读都是法家哲学的合理理解——这是唯一映射确实存在歧义的学派。',
  },
  'insight.6.title': { en: 'Each school produces a unique cognitive signature', zh: '每个学派产生独特的认知签名' },
  'insight.6.desc': {
    en: 'The schools don\'t just make output longer or shorter -- they produce qualitatively different cognitive strategies. This suggests the HundredSchools framework successfully maps ancient philosophical frameworks to distinct modern cognitive modes in AI systems.',
    zh: '学派不仅让输出变长或变短——它们产生了质上不同的认知策略。这表明百家框架成功地将古代哲学框架映射为AI系统中的不同现代认知模式。',
  },
} as const

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key
}

export { translations }
