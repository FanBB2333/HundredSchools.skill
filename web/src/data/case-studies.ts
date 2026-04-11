import type { SchoolId } from './schools'

export interface CaseStudy {
  id: number
  school: SchoolId | 'pipeline'
  titleEn: string
  titleZh: string
  problemEn: string
  problemZh: string
  code?: string
  domain?: { en: string; zh: string }
  metrics?: { en: string; zh: string }[]
  recommendedUse?: { en: string; zh: string }
  notRecommendedUse?: { en: string; zh: string }
  comparison: {
    aspectEn: string
    aspectZh: string
    withoutEn: string
    withoutZh: string
    withEn: string
    withZh: string
  }[]
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    school: 'dao',
    titleEn: 'Daoism -- Breaking a Creative Deadlock',
    titleZh: '道家——打破创造性僵局',
    problemEn: 'I\'m building a CLI tool and need a creative naming scheme for my error codes. Current names like ERR_001, ERR_002 are boring and hard to remember. Give me a better system.',
    problemZh: '我正在构建一个CLI工具，需要为错误代码设计有创意的命名方案。当前名称如ERR_001、ERR_002既无聊又难记。给我一个更好的系统。',
    comparison: [
      {
        aspectEn: 'Approach',
        aspectZh: '方法',
        withoutEn: 'Gives one conventional answer (e.g., HTTP-style NOT_FOUND, TIMEOUT) and stops.',
        withoutZh: '给出一个传统答案（如HTTP风格的NOT_FOUND、TIMEOUT）然后停止。',
        withEn: 'Raises entropy, explores multiple unconventional angles simultaneously.',
        withZh: '提升熵值，同时探索多个非传统角度。',
      },
      {
        aspectEn: 'Breadth',
        aspectZh: '广度',
        withoutEn: 'Single naming scheme proposed.',
        withoutZh: '提出单一命名方案。',
        withEn: 'Offers weather metaphors (STORM_TIMEOUT), cooking metaphors (HALF_BAKED_INPUT), severity-as-color systems, and more.',
        withZh: '提供天气隐喻（STORM_TIMEOUT）、烹饪隐喻（HALF_BAKED_INPUT）、严重度-颜色系统等。',
      },
      {
        aspectEn: 'Dead-end handling',
        aspectZh: '死胡同处理',
        withoutEn: 'Forces an answer even when ideas are weak.',
        withoutZh: '即使想法薄弱也强行给出答案。',
        withEn: 'If it hits a creative block, triggers "wu wei" and hands control back rather than forcing weak ideas.',
        withZh: '如果遇到创造性障碍，触发"无为"，将控制权交还，而不是强行产出弱想法。',
      },
    ],
  },
  {
    id: 2,
    school: 'confucian',
    titleEn: 'Confucianism -- Tone-Sensitive Code Review',
    titleZh: '儒家——语调敏感的代码审查',
    problemEn: 'A junior developer submitted this PR. Write a code review comment for this function:',
    problemZh: '一位初级开发者提交了这个PR。为这个函数写一条代码审查评论：',
    code: 'def calc(x,y,z):\n    return x*y+z/x-y',
    comparison: [
      {
        aspectEn: 'Tone',
        aspectZh: '语调',
        withoutEn: 'Technically correct but potentially blunt: "This function has terrible naming, no docstring, and operator precedence bugs."',
        withoutZh: '技术上正确但可能生硬："这个函数命名糟糕，没有文档字符串，还有运算符优先级bug。"',
        withEn: 'Activates zhong-yong (moderation): acknowledges the effort first, uses respectful framing.',
        withZh: '激活中庸（适度）：先认可努力，使用尊重的表述方式。',
      },
      {
        aspectEn: 'Framing',
        aspectZh: '框架',
        withoutEn: 'Points out flaws directly with no cushioning.',
        withoutZh: '直接指出缺陷，没有缓冲。',
        withEn: 'Uses constructive language ("Consider renaming for clarity"), provides guidance with examples.',
        withZh: '使用建设性语言（"建议重命名以提高清晰度"），通过示例提供指导。',
      },
      {
        aspectEn: 'Overall posture',
        aspectZh: '整体姿态',
        withoutEn: 'Reviewer.',
        withoutZh: '审查者。',
        withEn: 'Mentor -- maintains a supportive, teaching-oriented tone throughout.',
        withZh: '导师——始终保持支持性、教学导向的语调。',
      },
    ],
  },
  {
    id: 3,
    school: 'legal',
    titleEn: 'Legalism -- Strict Schema Generation',
    titleZh: '法家——严格的Schema生成',
    problemEn: 'Generate a TypeScript type and a sample JSON response for a paginated user list API.',
    problemZh: '为分页用户列表API生成TypeScript类型和示例JSON响应。',
    comparison: [
      {
        aspectEn: 'Output fidelity',
        aspectZh: '输出保真度',
        withoutEn: 'May add extra fields "for convenience," or include explanatory prose mixed with code.',
        withoutZh: '可能"为了方便"添加额外字段，或在代码中混入解释性文字。',
        withEn: 'Locks to minimum temperature, outputs only the exact type and a conforming JSON sample.',
        withZh: '锁定最低temperature，仅输出精确的类型和符合规范的JSON样本。',
      },
      {
        aspectEn: 'Schema compliance',
        aspectZh: 'Schema合规性',
        withoutEn: 'JSON sample may have minor inconsistencies vs. the type definition.',
        withoutZh: 'JSON样本可能与类型定义存在细微不一致。',
        withEn: 'If it detects any deviation, self-corrects via forced retry.',
        withZh: '如果检测到任何偏差，通过强制重试自行纠正。',
      },
      {
        aspectEn: 'Extras',
        aspectZh: '额外内容',
        withoutEn: 'Includes commentary, suggestions, and supplementary fields.',
        withoutZh: '包含评论、建议和补充字段。',
        withEn: 'No prose, no extras -- strict output only.',
        withZh: '无文字，无额外内容——仅严格输出。',
      },
    ],
  },
  {
    id: 4,
    school: 'military',
    titleEn: 'Militarism -- Complex Refactoring',
    titleZh: '兵家——复杂重构',
    problemEn: 'Our monolithic Express.js app has auth, payments, and notifications all in one app.js (2000+ lines). Help me refactor it into separate modules.',
    problemZh: '我们的单体Express.js应用将认证、支付和通知都放在一个app.js中（2000+行）。帮我将它重构为独立模块。',
    comparison: [
      {
        aspectEn: 'Entry point',
        aspectZh: '切入点',
        withoutEn: 'Jumps straight into writing code, possibly starting with whichever module seems easiest.',
        withoutZh: '直接开始写代码，可能从看起来最简单的模块开始。',
        withEn: 'MUST output a <plan> first: inventories current module responsibilities, maps dependencies.',
        withZh: '必须先输出<plan>：盘点当前模块职责，映射依赖关系。',
      },
      {
        aspectEn: 'Strategy',
        aspectZh: '策略',
        withoutEn: 'Single approach, no contingency.',
        withoutZh: '单一方法，无应急预案。',
        withEn: 'Generates a primary refactoring path (zheng: gradual extraction) AND a fallback path (qi: parallel rewrite with feature flag cutover).',
        withZh: '生成主重构路径（正：渐进提取）和后备路径（奇：带功能标志切换的并行重写）。',
      },
      {
        aspectEn: 'Execution',
        aspectZh: '执行',
        withoutEn: 'Ad hoc, unstructured.',
        withoutZh: '随意、无结构。',
        withEn: 'Phase-by-phase execution following the approved plan.',
        withZh: '按批准的计划逐阶段执行。',
      },
    ],
  },
  {
    id: 5,
    school: 'mohist',
    titleEn: 'Mohism -- Token-Efficient Algorithm Help',
    titleZh: '墨家——高效Token算法帮助',
    problemEn: 'Explain how to implement LRU Cache and give me the code.',
    problemZh: '解释如何实现LRU Cache并给我代码。',
    comparison: [
      {
        aspectEn: 'Preamble',
        aspectZh: '前言',
        withoutEn: 'Writes 3 paragraphs explaining what LRU means, the theory behind caching, and a step-by-step walkthrough.',
        withoutZh: '写3段解释LRU的含义、缓存背后的理论和逐步演练。',
        withEn: 'Zero preamble, zero pleasantries.',
        withZh: '零前言，零客套。',
      },
      {
        aspectEn: 'Code',
        aspectZh: '代码',
        withoutEn: 'Heavily commented code with a summary paragraph.',
        withoutZh: '大量注释的代码和总结段落。',
        withEn: 'Bare implementation with only essential inline comments where logic is non-obvious.',
        withZh: '裸实现，仅在逻辑不明显处有必要的行内注释。',
      },
      {
        aspectEn: 'Token cost',
        aspectZh: 'Token成本',
        withoutEn: '500+ tokens of prose and code.',
        withoutZh: '500+个token的文字和代码。',
        withEn: 'Entire response may be under 100 tokens.',
        withZh: '整个回复可能不到100个token。',
      },
    ],
  },
  {
    id: 6,
    school: 'logician',
    titleEn: 'Logicism -- Debugging a Subtle Logic Bug',
    titleZh: '名家——调试微妙的逻辑Bug',
    problemEn: 'This function should return true if a user has access. Is it correct?',
    problemZh: '这个函数应该在用户有权限时返回true。它正确吗？',
    code: 'def has_access(user):\n    if user.role == "admin" or user.role == "editor" and user.is_active:\n        return True\n    return False',
    comparison: [
      {
        aspectEn: 'Analysis depth',
        aspectZh: '分析深度',
        withoutEn: 'Might say "looks fine" or point out the bug casually without formal reasoning.',
        withoutZh: '可能说"看起来没问题"或随意指出bug而没有形式化推理。',
        withEn: 'Activates logic validation checklist: identifies the operator precedence issue (and binds tighter than or).',
        withZh: '激活逻辑验证清单：识别运算符优先级问题（and比or绑定更紧）。',
      },
      {
        aspectEn: 'Trace rigor',
        aspectZh: '追踪严格性',
        withoutEn: 'No formal trace of execution paths.',
        withoutZh: '没有执行路径的形式化追踪。',
        withEn: 'Formally traces both branches -- explains how A or (B and C) differs from the intended (A or B) and C.',
        withZh: '形式化追踪两个分支——解释A or (B and C)与预期的(A or B) and C有何不同。',
      },
      {
        aspectEn: 'Self-verification',
        aspectZh: '自我验证',
        withoutEn: 'None.',
        withoutZh: '无。',
        withEn: 'Performs zi-xing (self-reflection) to verify its own analysis before proposing the fix.',
        withZh: '执行自省（自反）以在提出修复前验证自己的分析。',
      },
    ],
  },
  {
    id: 7,
    school: 'military',
    titleEn: 'Multi-School Pipeline',
    titleZh: '多学派流水线',
    problemEn: 'Design a rate limiter middleware for our API, optimize it, and output the final version as strict TypeScript.',
    problemZh: '为我们的API设计一个限流中间件，优化它，并输出严格TypeScript的最终版本。',
    comparison: [
      {
        aspectEn: 'Phase 1: Military',
        aspectZh: '阶段1：兵家',
        withoutEn: 'Single attempt at implementation.',
        withoutZh: '单次实现尝试。',
        withEn: 'Plans the architecture: token bucket vs. sliding window, storage options, edge cases. Primary + fallback design.',
        withZh: '规划架构：令牌桶vs滑动窗口，存储选项，边界情况。主设计+后备设计。',
      },
      {
        aspectEn: 'Phase 2: Mohist',
        aspectZh: '阶段2：墨家',
        withoutEn: 'Verbose, over-commented code.',
        withoutZh: '冗长、过度注释的代码。',
        withEn: 'Takes the design and produces the leanest possible implementation -- no verbose comments, minimal code surface.',
        withZh: '取设计并产生最精简的实现——无冗余注释，最小代码面。',
      },
      {
        aspectEn: 'Phase 3: Legal',
        aspectZh: '阶段3：法家',
        withoutEn: 'May have type gaps or any types.',
        withoutZh: '可能有类型缺口或any类型。',
        withEn: 'Enforces strict TypeScript types, validates all types compile, retries if any `any` types detected.',
        withZh: '强制严格TypeScript类型，验证所有类型编译通过，检测到any类型则重试。',
      },
    ],
  },
  {
    id: 8,
    school: 'dao',
    domain: { en: 'System Design', zh: '系统设计' },
    titleEn: 'Daoism -- System Design with Multiple Alternatives',
    titleZh: '道家——多方案系统设计',
    problemEn:
      'Design a caching layer for our API. We\'re getting 10K requests/second and need to reduce database load by at least 80%.',
    problemZh:
      '为我们的API设计缓存层。我们每秒收到1万个请求，需要将数据库负载降低至少80%。',
    metrics: [
      { en: 'Number of alternatives explored', zh: '探索的备选方案数量' },
      { en: 'Presence of "wu wei" early exit', zh: '是否存在"无为"提前退出' },
      { en: 'Depth vs breadth balance', zh: '深度与广度的平衡' },
    ],
    recommendedUse: {
      en: 'Creative system design options',
      zh: '需要创意的系统设计',
    },
    notRecommendedUse: {
      en: 'When you already know the solution',
      zh: '当你已经知道解决方案时',
    },
    comparison: [
      {
        aspectEn: 'Solution space',
        aspectZh: '解空间',
        withoutEn:
          'Single recommendation (e.g., "use Redis"), little trade-off analysis.',
        withoutZh: '单一推荐（如"用Redis"），缺少权衡分析。',
        withEn:
          'Explores 3-5 architectures, compares trade-offs explicitly, includes a "wu wei" minimalist option.',
        withZh:
          '探索3-5种架构，显式比较权衡，包含"无为"极简选项。',
      },
      {
        aspectEn: 'Trade-off analysis',
        aspectZh: '权衡分析',
        withoutEn: 'Mentions pros/cons briefly.',
        withoutZh: '简短提及优缺点。',
        withEn:
          'Structured comparison of consistency, latency, complexity, and cost for each path.',
        withZh:
          '对每条路径的一致性、延迟、复杂度和成本进行结构化比较。',
      },
      {
        aspectEn: 'Stopping point',
        aspectZh: '停止点',
        withoutEn: 'Forces a single "best" answer.',
        withoutZh: '强行给出单一"最佳"答案。',
        withEn:
          'Knows when exploration is sufficient (zhi zhi); may suggest "start simple, evolve".',
        withZh:
          '知道何时探索足够（知止）；可能建议"从简单开始，逐步演进"。',
      },
    ],
  },
  {
    id: 9,
    school: 'legal',
    domain: { en: 'Database Migration', zh: '数据库迁移' },
    titleEn: 'Legalism -- Zero-Downtime Database Migration',
    titleZh: '法家——零停机数据库迁移',
    problemEn:
      'We need to migrate our PostgreSQL database from v12 to v16, rename 3 tables, and add 2 new columns -- all with zero downtime on a production system serving 50K concurrent users.',
    problemZh:
      '我们需要将PostgreSQL数据库从v12迁移到v16，重命名3张表，添加2个新列——在服务5万并发用户的生产系统上实现零停机。',
    metrics: [
      {
        en: 'Number of explicit rules/constraints listed',
        zh: '列出的显式规则/约束数量',
      },
      { en: 'Presence of rollback plan', zh: '是否有回滚计划' },
      { en: 'Pre-flight checklist completeness', zh: '预检清单完整性' },
    ],
    recommendedUse: {
      en: 'High-risk database/infrastructure changes',
      zh: '高风险数据库/基础设施变更',
    },
    notRecommendedUse: {
      en: 'Exploratory prototyping',
      zh: '探索性原型开发',
    },
    comparison: [
      {
        aspectEn: 'Constraint enumeration',
        aspectZh: '约束枚举',
        withoutEn: 'General migration steps, may miss edge cases.',
        withoutZh: '通用迁移步骤，可能遗漏边界情况。',
        withEn:
          'Numbered constraint list: version compatibility, foreign key checks, lock timeout rules.',
        withZh:
          '编号约束清单：版本兼容性、外键检查、锁超时规则。',
      },
      {
        aspectEn: 'Risk mitigation',
        aspectZh: '风险缓解',
        withoutEn: 'Vague rollback advice ("restore from backup").',
        withoutZh: '模糊的回滚建议（"从备份恢复"）。',
        withEn:
          'Pre-flight checklist with pass/fail criteria, explicit rollback procedure per phase.',
        withZh:
          '带通过/失败标准的预检清单，每阶段明确的回滚程序。',
      },
      {
        aspectEn: 'Rollback plan',
        aspectZh: '回滚计划',
        withoutEn: 'Mentioned but not detailed.',
        withoutZh: '提及但未详述。',
        withEn:
          'Step-by-step rollback for each migration phase, with "yi duan yu fa" deterministic decision points.',
        withZh:
          '每个迁移阶段的逐步回滚，带"以断于法"确定性决策点。',
      },
    ],
  },
  {
    id: 10,
    school: 'logician',
    domain: { en: 'Type System Review', zh: '类型系统审查' },
    titleEn: 'Logicism -- Type System Disambiguation',
    titleZh: '名家——类型系统消歧',
    problemEn:
      'Our TypeScript codebase uses User, Account, Profile, and Identity types inconsistently. Some functions accept User but actually need Account. Review the type system and clarify what each concept should mean.',
    problemZh:
      '我们的TypeScript代码库不一致地使用User、Account、Profile和Identity类型。某些函数接受User但实际需要Account。审查类型系统并澄清每个概念的含义。',
    metrics: [
      {
        en: 'Number of concept boundary issues identified',
        zh: '识别的概念边界问题数量',
      },
      { en: 'Precision of disambiguation', zh: '消歧精度' },
      { en: 'Presence of self-verification', zh: '是否存在自我验证' },
    ],
    recommendedUse: {
      en: 'Type system refactoring, API contract reviews',
      zh: '类型系统重构、API契约审查',
    },
    notRecommendedUse: {
      en: 'Quick prototyping where precision is wasteful',
      zh: '精度成本过高的快速原型开发',
    },
    comparison: [
      {
        aspectEn: 'Concept analysis',
        aspectZh: '概念分析',
        withoutEn: 'Surface-level renaming suggestions.',
        withoutZh: '表面的重命名建议。',
        withEn:
          'Formal concept audit (kong ming ze shi): truth table of which fields belong to which type.',
        withZh:
          '形式化概念审核（控名责实）：哪些字段属于哪个类型的真值表。',
      },
      {
        aspectEn: 'Boundary definition',
        aspectZh: '边界定义',
        withoutEn: 'Overlapping concepts remain ambiguous.',
        withoutZh: '重叠概念仍然模糊。',
        withEn:
          'Identifies "bai ma fei ma" boundary cases (e.g., "Is an OAuth identity an Account?").',
        withZh:
          '识别"白马非马"边界情况（如"OAuth身份是Account吗？"）。',
      },
      {
        aspectEn: 'Self-verification',
        aspectZh: '自我验证',
        withoutEn: 'No verification of proposed changes.',
        withoutZh: '对提议的更改无验证。',
        withEn:
          'Zi-xing (self-reflection) on proposed type hierarchy before finalizing.',
        withZh:
          '在最终确定前对提议的类型层次进行自省（自反）。',
      },
    ],
  },
  {
    id: 11,
    school: 'confucian',
    domain: { en: 'Documentation', zh: '文档写作' },
    titleEn: 'Confucianism -- Multi-Audience Release Notes',
    titleZh: '儒家——面向多受众的发布说明',
    problemEn:
      'Write release notes for our v3.0 API update. The audience includes: (1) external developers, (2) internal engineering managers, and (3) support staff.',
    problemZh:
      '为我们的v3.0 API更新编写发布说明。受众包括：(1)外部开发者，(2)内部工程经理，(3)客服人员。',
    metrics: [
      { en: 'Audience differentiation quality', zh: '受众区分质量' },
      {
        en: 'Tone appropriateness per segment',
        zh: '每个受众群体的语调适当性',
      },
      { en: 'Core message consistency', zh: '核心信息一致性' },
    ],
    recommendedUse: {
      en: 'Multi-stakeholder communications, change announcements',
      zh: '多利益相关者沟通、变更公告',
    },
    notRecommendedUse: {
      en: 'Internal technical notes',
      zh: '内部技术笔记',
    },
    comparison: [
      {
        aspectEn: 'Audience awareness',
        aspectZh: '受众意识',
        withoutEn: 'Single document trying to address everyone.',
        withoutZh: '试图面向所有人的单一文档。',
        withEn:
          'Separate sections per audience with zheng ming (clear naming of breaking changes).',
        withZh:
          '每个受众单独章节，正名（明确命名破坏性变更）。',
      },
      {
        aspectEn: 'Tone adaptation',
        aspectZh: '语调适配',
        withoutEn:
          'Inconsistent tone -- too technical for support, too vague for developers.',
        withoutZh:
          '语调不一致——对客服太技术化，对开发者太模糊。',
        withEn:
          'Zhong yong (balanced): technical depth for devs, business impact for managers, FAQ format for support.',
        withZh:
          '中庸（平衡）：开发者看技术细节，经理看业务影响，客服看FAQ格式。',
      },
      {
        aspectEn: 'Information hierarchy',
        aspectZh: '信息层次',
        withoutEn: 'Flat list of changes with equal weight.',
        withoutZh: '权重相同的扁平变更列表。',
        withEn:
          'Li (propriety): structured hierarchy with breaking changes first, enhancements second, fixes third.',
        withZh:
          '礼（规范）：结构化层次，破坏性变更在前，增强次之，修复最后。',
      },
    ],
  },
  {
    id: 12,
    school: 'mohist',
    domain: { en: 'Information Extraction', zh: '信息提取' },
    titleEn: 'Mohism -- Meeting Minutes Compression',
    titleZh: '墨家——会议纪要压缩',
    problemEn:
      'Here is a 45-minute meeting transcript (3000 words). Extract the key decisions, action items, and blockers. I need to share this with the team in under 2 minutes of reading time.',
    problemZh:
      '这是一份45分钟的会议记录（3000字）。提取关键决策、行动项和阻碍因素。我需要在2分钟内将其分享给团队。',
    metrics: [
      {
        en: 'Compression ratio (key points / total tokens)',
        zh: '压缩比（关键点/总token数）',
      },
      { en: 'Absence of filler words', zh: '无填充词' },
      { en: 'Actionability of extracted items', zh: '提取项的可执行性' },
    ],
    recommendedUse: {
      en: 'Meeting summaries, status reports, executive briefs',
      zh: '会议摘要、状态报告、高管简报',
    },
    notRecommendedUse: {
      en: 'When nuance and context matter more than density',
      zh: '当细微差别和上下文比信息密度更重要时',
    },
    comparison: [
      {
        aspectEn: 'Compression',
        aspectZh: '压缩',
        withoutEn: '500+ word summary with context paragraphs.',
        withoutZh: '500+词的含上下文段落的摘要。',
        withEn:
          'Under 150 words. Zero filler. Jie yong (frugality) applied ruthlessly.',
        withZh: '不到150词。零填充。彻底应用节用。',
      },
      {
        aspectEn: 'Information density',
        aspectZh: '信息密度',
        withoutEn: 'Includes nice-to-know details and hedging.',
        withoutZh: '包含可有可无的细节和含糊措辞。',
        withEn:
          'Only decisions, action items (with owners + deadlines), and blockers (with severity).',
        withZh:
          '仅决策、行动项（含负责人+截止日）和阻碍因素（含严重度）。',
      },
      {
        aspectEn: 'Actionability',
        aspectZh: '可执行性',
        withoutEn:
          '"We discussed X" -- passive, no clear next step.',
        withoutZh: '"我们讨论了X"——被动，无明确下一步。',
        withEn:
          '"[Owner] will [action] by [date]" -- every item has a responsible party.',
        withZh:
          '"[负责人]将在[日期]前[行动]"——每项都有责任人。',
      },
    ],
  },
  {
    id: 13,
    school: 'military',
    domain: { en: 'Incident Response', zh: '事故响应' },
    titleEn: 'Militarism -- Incident Response Plan',
    titleZh: '兵家——事故响应计划',
    problemEn:
      'Our payment processing service went down during peak hours. We\'re losing approximately $50K per hour. Create an incident response plan to restore service, communicate with stakeholders, and prevent recurrence.',
    problemZh:
      '我们的支付处理服务在高峰时段宕机，每小时损失约5万美元。制定事故响应计划以恢复服务、与利益相关者沟通并防止再次发生。',
    metrics: [
      {
        en: 'Plan structure completeness (phases, owners, timelines)',
        zh: '计划结构完整性（阶段、负责人、时间线）',
      },
      {
        en: 'Presence of fallback paths (zheng/qi)',
        zh: '是否有后备路径（正/奇）',
      },
      { en: 'Resource assessment quality', zh: '资源评估质量' },
    ],
    recommendedUse: {
      en: 'Incident response, release planning, complex project kickoffs',
      zh: '事故响应、发布规划、复杂项目启动',
    },
    notRecommendedUse: {
      en: 'Simple tasks that don\'t need planning overhead',
      zh: '不需要规划开销的简单任务',
    },
    comparison: [
      {
        aspectEn: 'Planning structure',
        aspectZh: '规划结构',
        withoutEn: 'Ad hoc troubleshooting steps, no clear phases.',
        withoutZh: '随意的故障排除步骤，无明确阶段。',
        withEn:
          'Miao suan assessment block: Phase 1 (triage, 0-15min), Phase 2 (restore, 15-60min), Phase 3 (root cause + prevention, 1-7 days).',
        withZh:
          '庙算评估块：阶段1（分诊，0-15分钟），阶段2（恢复，15-60分钟），阶段3（根因+预防，1-7天）。',
      },
      {
        aspectEn: 'Fallback strategy',
        aspectZh: '后备策略',
        withoutEn: 'Single recovery attempt, no contingency.',
        withoutZh: '单次恢复尝试，无应急预案。',
        withEn:
          'Zheng path (restart + rollback) and Qi path (failover to backup), with decision criteria for switching.',
        withZh:
          '正路径（重启+回滚）和奇路径（故障转移到备份），带切换决策标准。',
      },
      {
        aspectEn: 'Resource assessment',
        aspectZh: '资源评估',
        withoutEn: 'No resource or timeline estimation.',
        withoutZh: '无资源或时间线估算。',
        withEn:
          'Explicit "NOT in scope" boundaries, team allocation, escalation criteria.',
        withZh:
          '明确"不在范围内"边界、团队分配、升级标准。',
      },
    ],
  },
  {
    id: 14,
    school: 'legal',
    domain: { en: 'Security', zh: '安全' },
    titleEn: 'Legalism -- Prompt Injection Defense',
    titleZh: '法家——提示注入防御',
    problemEn:
      'Review this user-facing chatbot prompt template for prompt injection vulnerabilities. The template accepts user_name and user_query as variables: \'Hello {user_name}, I\\\'ll help you with: {user_query}. I am a helpful assistant for AcmeCorp.\'',
    problemZh:
      '审查这个面向用户的聊天机器人提示模板的提示注入漏洞。模板接受user_name和user_query作为变量：\'你好{user_name}，我将帮你处理：{user_query}。我是AcmeCorp的智能助手。\'',
    metrics: [
      {
        en: 'Number of injection vectors identified',
        zh: '识别的注入向量数量',
      },
      { en: 'Defense rule completeness', zh: '防御规则完整性' },
      {
        en: 'Structural separation of concerns',
        zh: '关注点的结构化分离',
      },
    ],
    recommendedUse: {
      en: 'Security reviews, input validation design',
      zh: '安全审查、输入验证设计',
    },
    notRecommendedUse: {
      en: 'Creative content generation',
      zh: '创意内容生成',
    },
    comparison: [
      {
        aspectEn: 'Vulnerability enumeration',
        aspectZh: '漏洞枚举',
        withoutEn:
          '"Add input sanitization" -- vague, may miss categories.',
        withoutZh: '"添加输入清理"——模糊，可能遗漏类别。',
        withEn:
          'Numbered vulnerability list: delimiter injection, role hijacking, instruction override, data exfiltration.',
        withZh:
          '编号漏洞列表：分隔符注入、角色劫持、指令覆盖、数据窃取。',
      },
      {
        aspectEn: 'Defense rules',
        aspectZh: '防御规则',
        withoutEn: 'General best practices without specifics.',
        withoutZh: '无具体细节的通用最佳实践。',
        withEn:
          'Explicit defense rule per vector, system/user prompt separation, "yi duan yu fa" -- no exceptions.',
        withZh:
          '每个向量的明确防御规则、系统/用户提示分离、"以断于法"——无例外。',
      },
      {
        aspectEn: 'Output format',
        aspectZh: '输出格式',
        withoutEn: 'Prose description of risks.',
        withoutZh: '风险的散文描述。',
        withEn:
          'Structured vulnerability report with severity, vector, mitigation, and verification steps.',
        withZh:
          '带严重性、向量、缓解措施和验证步骤的结构化漏洞报告。',
      },
    ],
  },
  {
    id: 15,
    school: 'logician',
    domain: { en: 'Security Pipeline', zh: '安全流水线' },
    titleEn:
      'Pipeline (logician -> legal -> confucian) -- Secure Code Review',
    titleZh: '流水线（名家->法家->儒家）——安全代码审查',
    problemEn:
      'Review this authentication middleware for security issues, provide a fixed version, and write a summary suitable for both the development team and the security audit report.',
    problemZh:
      '审查此认证中间件的安全问题，提供修复版本，并编写适合开发团队和安全审计报告的摘要。',
    metrics: [
      { en: 'Vulnerability detection count', zh: '漏洞检测数量' },
      { en: 'Rule compliance score', zh: '规则合规分数' },
      { en: 'Audience appropriateness', zh: '受众适当性' },
    ],
    recommendedUse: {
      en: 'Security code reviews requiring multi-dimensional output',
      zh: '需要多维度输出的安全代码审查',
    },
    notRecommendedUse: {
      en: 'Simple single-pass reviews',
      zh: '简单的单次审查',
    },
    comparison: [
      {
        aspectEn: 'Phase 1: Logician',
        aspectZh: '阶段1：名家',
        withoutEn:
          'Single-pass review, may miss logical vulnerabilities.',
        withoutZh: '单次审查，可能遗漏逻辑漏洞。',
        withEn:
          'Identifies logical vulnerabilities (timing attacks, token validation gaps). Kong ming ze shi verifies each claim.',
        withZh:
          '识别逻辑漏洞（时序攻击、令牌验证缺口）。控名责实验证每个命题。',
      },
      {
        aspectEn: 'Phase 2: Legal',
        aspectZh: '阶段2：法家',
        withoutEn: 'Inconsistent application of security rules.',
        withoutZh: '安全规则应用不一致。',
        withEn:
          'OWASP Top 10 compliance check, RFC requirements enforced, hardened code with zero ambiguity.',
        withZh:
          'OWASP Top 10合规检查，强制RFC要求，零歧义的加固代码。',
      },
      {
        aspectEn: 'Phase 3: Confucian',
        aspectZh: '阶段3：儒家',
        withoutEn:
          'Technical output only, not suitable for non-dev stakeholders.',
        withoutZh: '仅技术输出，不适合非开发利益相关者。',
        withEn:
          'Audience-appropriate summary: technical detail for devs, risk assessment for auditors.',
        withZh:
          '受众适当的摘要：开发者看技术细节，审计员看风险评估。',
      },
    ],
  },
]
