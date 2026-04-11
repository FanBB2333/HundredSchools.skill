import type { SchoolId } from './schools'

export interface CaseStudy {
  id: number
  school: SchoolId
  titleEn: string
  titleZh: string
  problemEn: string
  problemZh: string
  code?: string
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
]
