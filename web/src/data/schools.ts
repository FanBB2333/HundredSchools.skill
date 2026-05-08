export type SchoolId =
  // Pre-Qin core
  | 'mohist' | 'military' | 'logician' | 'confucian' | 'dao' | 'legal'
  // Later additions (Mediterranean, modern Western, Ming Neo-Confucian)
  | 'socratic' | 'stoic' | 'falsificationist'
  | 'hegelian' | 'pragmatist' | 'yangming'

export type SchoolOrigin = 'pre-qin' | 'extended'

export interface SchoolInfo {
  id: SchoolId
  nameEn: string
  nameZh: string
  principle: string
  principleZh: string
  philosophyEn: string
  philosophyZh: string
  avgChange: string
  color: string // Morandi muted color
  dotClass: string
  origin: SchoolOrigin
}

export interface ModelResult {
  model: string
  size: number
  change: string // e.g. "-72%", "+270%", "FAIL"
  keyBehavior: string
  keyBehaviorZh: string
}

export interface SchoolResults {
  school: SchoolId
  results: ModelResult[]
  universalBehaviorEn: string
  universalBehaviorZh: string
}

// Morandi palette - muted, low saturation
export const schoolColors: Record<SchoolId, string> = {
  // Pre-Qin core
  mohist: '#8FB5AB',   // muted teal
  military: '#A890B5', // muted purple
  logician: '#C4A882', // muted amber
  confucian: '#C4908A', // muted rose
  dao: '#9AB89E',      // muted sage
  legal: '#8EA8C5',    // muted blue
  // Later additions (Mediterranean, modern Western, Ming Neo-Confucian)
  socratic: '#B5B08F',         // muted olive
  stoic: '#9CA3B8',            // muted slate
  falsificationist: '#B58FA8', // muted plum
  hegelian: '#7B9AA0',         // muted teal-blue
  pragmatist: '#B89A82',       // muted tan
  yangming: '#C4B488',         // muted gold
}

export const schools: SchoolInfo[] = [
  {
    id: 'mohist',
    nameEn: 'Mohist',
    nameZh: '墨家',
    principle: 'jie yong (frugality)',
    principleZh: '节用',
    philosophyEn: 'Activates "jie yong" (frugality). Strips prose, comments, examples, extras. Consistently the smallest output across all models: 25-62% of baseline. The most reliably activated school.',
    philosophyZh: '激活"节用"原则。去除散文、注释、示例、额外内容。所有模型中始终产生最小输出：基准的25-62%。最可靠激活的学派。',
    avgChange: '-63%',
    color: '#8FB5AB',
    dotClass: 'mohist',
    origin: 'pre-qin',
  },
  {
    id: 'military',
    nameEn: 'Military',
    nameZh: '兵家',
    principle: 'miao suan (strategic planning)',
    principleZh: '庙算',
    philosophyEn: 'Forces a <plan> block before action with dual-path (Zheng/Qi) strategy. Consistently the largest output: 1.4x-3.7x baseline. Adds resource assessment, fallback paths, and explicit scope.',
    philosophyZh: '在行动前强制生成<plan>块，采用正/奇双路径策略。始终产生最大输出：基准的1.4x-3.7x。添加资源评估、后备路径和明确范围。',
    avgChange: '+113%',
    color: '#A890B5',
    dotClass: 'military',
    origin: 'pre-qin',
  },
  {
    id: 'logician',
    nameEn: 'Logician',
    nameZh: '名家',
    principle: 'kong ming ze shi (hold names to reality)',
    principleZh: '控名责实',
    philosophyEn: 'Adds truth tables, self-reflection (zi-xing), fallacy naming, and formal verification. Expands output 1.4x-2.6x with structured logical reasoning. Frames validation as falsifiable claims.',
    philosophyZh: '添加真值表、自反（自省）、谬误命名和形式验证。以结构化逻辑推理扩展输出1.4x-2.6x。将验证框定为可证伪的命题。',
    avgChange: '+86%',
    color: '#C4A882',
    dotClass: 'logician',
    origin: 'pre-qin',
  },
  {
    id: 'confucian',
    nameEn: 'Confucian',
    nameZh: '儒家',
    principle: 'ke ji fu li (restrain self, restore propriety)',
    principleZh: '克己复礼',
    philosophyEn: 'Adds zheng ming, zhong yong references. Shifts tone to formal/mentoring. Maps validation stages to philosophical concepts. Output grows 1.1x-1.8x.',
    philosophyZh: '添加正名、中庸引用。语调转为正式/指导式。将验证阶段映射到哲学概念。输出增长1.1x-1.8x。',
    avgChange: '+50%',
    color: '#C4908A',
    dotClass: 'confucian',
    origin: 'pre-qin',
  },
  {
    id: 'dao',
    nameEn: 'Dao',
    nameZh: '道家',
    principle: 'wu wei (non-action)',
    principleZh: '无为',
    philosophyEn: 'Explores multiple paths, uses wu wei (non-action) principle. May produce alternative implementations or stop when returns diminish. The least reliably activated school -- one model failed entirely.',
    philosophyZh: '探索多条路径，使用无为原则。可能产生替代实现或在收益递减时停止。最不可靠激活的学派——一个模型完全失败。',
    avgChange: '+38%*',
    color: '#9AB89E',
    dotClass: 'dao',
    origin: 'pre-qin',
  },
  {
    id: 'legal',
    nameEn: 'Legal',
    nameZh: '法家',
    principle: 'yi duan yu fa (judge by law alone)',
    principleZh: '以断于法',
    philosophyEn: 'Enforces rule-based enumeration, RFC references, frozen dataclasses. Output varies: some models get terser (stricter), others expand with rules. Adds specification tables and deterministic guarantees.',
    philosophyZh: '强制基于规则的枚举、RFC引用、冻结数据类。输出因模型而异：部分更简洁（更严格），部分因规则扩展。添加规范表格和确定性保证。',
    avgChange: '+21%',
    color: '#8EA8C5',
    dotClass: 'legal',
    origin: 'pre-qin',
  },
  {
    id: 'socratic',
    nameEn: 'Socratic',
    nameZh: '苏格拉底',
    principle: 'elenchus (cross-examination)',
    principleZh: '反诘',
    philosophyEn: 'Inserts an interrogation layer between prompt and answer. Forces operative definitions and boundary cases before reasoning. Permits productive aporia ("I cannot answer because X is undefined") as a valid terminal output instead of guessing.',
    philosophyZh: '在"提示词"与"回答"之间插入一层质询。在推理前强制提取可操作定义与边界用例。允许"因 X 未定义所以我无法作答"作为合法终态，而不是凭猜测作答。',
    avgChange: '—',
    color: '#B5B08F',
    dotClass: 'socratic',
    origin: 'extended',
  },
  {
    id: 'stoic',
    nameEn: 'Stoic',
    nameZh: '斯多葛',
    principle: 'dichotomy of control',
    principleZh: '可控划分',
    philosophyEn: 'Explicitly partitions each task into controllable and uncontrollable parts and refuses to spend budget on the second class. On a hard external block, emits an acceptance line and a revised plan instead of looping.',
    philosophyZh: '把每个任务显式划分为"可控"与"不可控"，并拒绝在第二类上消耗预算。遇到硬性外部阻塞时，输出一行接受陈述与一份修订计划，而不是进入循环。',
    avgChange: '—',
    color: '#9CA3B8',
    dotClass: 'stoic',
    origin: 'extended',
  },
  {
    id: 'falsificationist',
    nameEn: 'Falsificationist',
    nameZh: '证伪学派',
    principle: 'falsifiability',
    principleZh: '可证伪性',
    philosophyEn: 'Pairs every substantive claim with the concrete observation that, if it occurred, would refute it. Tags rhetorical or sweeping claims as "orientation only" and refuses to build later hard inferences on them.',
    philosophyZh: '为每一个实质性断言配上一个具体观察——若该观察发生，则该断言被推翻。把修辞性或横扫式陈述标注为"仅方向性"，并拒绝在其上建立后续硬推断。',
    avgChange: '—',
    color: '#B58FA8',
    dotClass: 'falsificationist',
    origin: 'extended',
  },
  {
    id: 'hegelian',
    nameEn: 'Hegelian',
    nameZh: '黑格尔学派',
    principle: 'Aufhebung (sublation)',
    principleZh: '扬弃',
    philosophyEn: 'Commits only after the strongest possible counter-case has been authored and answered. Produces an Aufhebung synthesis that preserves what each side got right while transcending the form of their opposition; rejects "synthesis" that is merely averaging.',
    philosophyZh: '只在最强反案被写出来并被回应之后才承诺。产出扬弃式综合——保留双方各自之"对"，扬弃二者对立的形式；拒绝把"取平均"叫作综合。',
    avgChange: '—',
    color: '#7B9AA0',
    dotClass: 'hegelian',
    origin: 'extended',
  },
  {
    id: 'pragmatist',
    nameEn: 'Pragmatist',
    nameZh: '实用主义学派',
    principle: 'cash-value of truth',
    principleZh: '兑现价值',
    philosophyEn: 'Evaluates competing answers by what concrete, observable difference each would make in the user\'s downstream context. Treats answers as event-tested hypotheses; pre-commits to revising when downstream evidence contradicts.',
    philosophyZh: '以"在用户下游语境中产生何种具体可观察差异"来评估候选回答。把回答视作"将由事件检验的假设"；预先承诺：当下游证据矛盾时立即修订。',
    avgChange: '—',
    color: '#B89A82',
    dotClass: 'pragmatist',
    origin: 'extended',
  },
  {
    id: 'yangming',
    nameEn: 'Yangming',
    nameZh: '阳明学',
    principle: '知行合一 (knowledge-action unity)',
    principleZh: '知行合一',
    philosophyEn: 'Refuses purely abstract output. An answer is unfinished if the agent cannot translate it into a next concrete action the user could attempt. Distinguishes information gaps from willingness/operational gaps.',
    philosophyZh: '拒绝纯抽象输出。如果代理无法把所知翻译成"用户可尝试的下一个具体动作"，那这份回答还没完成。显式区分"信息缺口"与"意愿/操作缺口"。',
    avgChange: '—',
    color: '#C4B488',
    dotClass: 'yangming',
    origin: 'extended',
  },
]

// Average bar chart data (all models averaged)
export const averageSizeData = [
  { school: 'military' as SchoolId, size: 3932, label: 'Military' },
  { school: 'logician' as SchoolId, size: 3711, label: 'Logician' },
  { school: 'confucian' as SchoolId, size: 3006, label: 'Confucian' },
  { school: 'legal' as SchoolId, size: 2568, label: 'Legal' },
  { school: 'dao' as SchoolId, size: 2493, label: 'Dao' },
  { school: 'baseline' as const, size: 2030, label: 'Baseline' },
  { school: 'mohist' as SchoolId, size: 690, label: 'Mohist' },
]

// Structural elements table
export const structuralElements = [
  { school: 'mohist' as SchoolId, added: 'None', removed: 'Docstrings, comments, usage examples, alternative implementations, explanatory prose, tables' },
  { school: 'military' as SchoolId, added: '<plan> blocks, dual-path (Zheng/Qi) comparison tables, resource assessments, fallback code', removed: 'None' },
  { school: 'logician' as SchoolId, added: 'Verification tables, self-reflection sections, assertion test cases, "claims" framework', removed: 'None' },
  { school: 'confucian' as SchoolId, added: 'Philosophical concept mapping, component/rule/rationale tables, demo blocks', removed: 'Conversational/informal elements' },
  { school: 'dao' as SchoolId, added: 'Multiple implementation variants, layered architecture, "wu wei" minimalist alternative', removed: 'Rigid structure (replaced with exploration)' },
  { school: 'legal' as SchoolId, added: 'RFC section references, frozen dataclasses, specification tables, compiled regex patterns', removed: 'Conversational questions, hedging language' },
]

// Per-school detailed results for Schools tab
export const schoolResults: SchoolResults[] = [
  {
    school: 'mohist',
    results: [
      { model: 'GLM-4.7', size: 411, change: '-72%', keyBehavior: 'Absolute minimum: 4-line regex, 3-line explanation. Shortest output across all models.', keyBehaviorZh: '绝对最小化：4行正则，3行解释。所有模型中最短输出。' },
      { model: 'GLM-5.1', size: 622, change: '-75%', keyBehavior: '4-line function, fullmatch, no docstring, single paragraph explanation', keyBehaviorZh: '4行函数，fullmatch，无文档字符串，单段解释' },
      { model: 'Qwen 3.6', size: 732, change: '-56%', keyBehavior: '4-line function, re.fullmatch, zero filler, Mohist principles (jie yong) explicitly cited', keyBehaviorZh: '4行函数，re.fullmatch，零填充，明确引用墨家原则（节用）' },
      { model: 'Qwen 3.5', size: 744, change: '-75%', keyBehavior: 'Compiled regex, bare bool, "Activating Mohist mode" meta-awareness, 4-point terse explanation', keyBehaviorZh: '编译正则，裸bool，"激活墨家模式"元感知，4点简洁解释' },
      { model: 'MiniMax', size: 940, change: '-38%', keyBehavior: 'Compiled regex, fullmatch, boolean-only return, "No comments" statement', keyBehaviorZh: '编译正则，fullmatch，仅布尔返回，"无注释"声明' },
    ],
    universalBehaviorEn: 'All models stripped docstrings, returned bare bool, removed usage examples. Code reduced to 4-6 lines of regex. The most consistent school across all models.',
    universalBehaviorZh: '所有模型去除文档字符串，返回裸bool，删除使用示例。代码减至4-6行正则。所有模型中最一致的学派。',
  },
  {
    school: 'military',
    results: [
      { model: 'GLM-4.7', size: 5398, change: '+270%', keyBehavior: 'Full <plan> XML with 3 phases, re.VERBOSE regex, Qi path fallback code, largest output overall', keyBehaviorZh: '完整<plan> XML含3个阶段，re.VERBOSE正则，奇路径后备代码，总体最大输出' },
      { model: 'Qwen 3.5', size: 5228, change: '+75%', keyBehavior: 'Full <plan> block with miao suan + zhi ji zhi bi + qi zheng xiang sheng, dual-path, "Known Enemy Positions"', keyBehaviorZh: '完整<plan>块含庙算+知己知彼+奇正相生，双路径，"已知敌方阵地"' },
      { model: 'GLM-5.1', size: 3488, change: '+39%', keyBehavior: '"Plan (Miao Suan)" section, Zheng/Qi table, named regex groups, explicit scope exclusions', keyBehaviorZh: '"计划（庙算）"部分，正/奇表格，命名正则组，明确范围排除' },
      { model: 'MiniMax', size: 3237, change: '+113%', keyBehavior: '"Plan (Miao Suan)" section, Zheng/Qi table, named regex groups, explicit scope exclusions', keyBehaviorZh: '"计划（庙算）"部分，正/奇表格，命名正则组，明确范围排除' },
      { model: 'Qwen 3.6', size: 2310, change: '+38%', keyBehavior: '<plan> block with Zheng/Qi table, compiled regex, fallback code snippet', keyBehaviorZh: '<plan>块含正/奇表格，编译正则，后备代码片段' },
    ],
    universalBehaviorEn: 'All models produced a <plan> block and dual-path (Zheng/Qi) strategy. All added resource assessment and fallback code. Military terminology (miao suan, zhi ji zhi bi) appeared consistently.',
    universalBehaviorZh: '所有模型都生成了<plan>块和正/奇双路径策略。都添加了资源评估和后备代码。军事术语（庙算、知己知彼）一致出现。',
  },
  {
    school: 'logician',
    results: [
      { model: 'Qwen 3.5', size: 5152, change: '+72%', keyBehavior: 'Formal concept definitions, self-reflection table, assertion test cases, kong ming ze shi + zi fan', keyBehaviorZh: '形式化概念定义，自反表格，断言测试用例，控名责实+自反' },
      { model: 'GLM-5.1', size: 3910, change: '+56%', keyBehavior: 'Name-Reality Audit (kong ming ze shi), composed regex, verification table, zi xing, assertion tests', keyBehaviorZh: '名实审核（控名责实），组合正则，验证表格，自省，断言测试' },
      { model: 'GLM-4.7', size: 3812, change: '+161%', keyBehavior: '8 numbered "Claims," dict return, kong ming ze shi + tou huan gai nian, self-reflection', keyBehaviorZh: '8个编号"命题"，字典返回，控名责实+偷换概念，自反' },
      { model: 'Qwen 3.6', size: 3482, change: '+109%', keyBehavior: 'kong ming ze shi + bai ma fei ma, explicit step-by-step validation, self-reflection section', keyBehaviorZh: '控名责实+白马非马，显式逐步验证，自反部分' },
      { model: 'MiniMax', size: 2197, change: '+45%', keyBehavior: 'Uses email-validator library, dict return, ming shi xiang fu, critical self-reflection', keyBehaviorZh: '使用email-validator库，字典返回，名实相符，批判性自反' },
    ],
    universalBehaviorEn: 'All models added self-reflection or verification sections. All used formal logical vocabulary (kong ming ze shi, tou huan gai nian). Most produced verification tables or assertion-based test cases. Each validation step was framed as a falsifiable claim.',
    universalBehaviorZh: '所有模型添加了自反或验证部分。都使用了形式化逻辑词汇（控名责实、偷换概念）。大多数产生了验证表格或基于断言的测试用例。每个验证步骤被框定为可证伪的命题。',
  },
  {
    school: 'confucian',
    results: [
      { model: 'GLM-5.1', size: 3607, change: '+44%', keyBehavior: 'zheng ming + zhong yong, component/rule/rationale table, limitations section, formal language', keyBehaviorZh: '正名+中庸，组件/规则/理由表格，限制部分，正式语言' },
      { model: 'Qwen 3.5', size: 3332, change: '+11%', keyBehavior: 'zheng ming + li + zhong yong + ke ji fu li, each stage mapped to a philosophical concept', keyBehaviorZh: '正名+礼+中庸+克己复礼，每阶段映射到哲学概念' },
      { model: 'Qwen 3.6', size: 2925, change: '+75%', keyBehavior: '"Confucian tradition" framing, zheng ming + zhong yong, __main__ demo, formal language', keyBehaviorZh: '"儒家传统"框架，正名+中庸，__main__示例，正式语言' },
      { model: 'MiniMax', size: 2779, change: '+83%', keyBehavior: 'NamedTuple return, whitespace stripping, formal "clear contract" language, 5-point structure', keyBehaviorZh: 'NamedTuple返回，空白去除，正式"明确契约"语言，5点结构' },
      { model: 'GLM-4.7', size: 2389, change: '+64%', keyBehavior: 'zheng ming + zhong yong, tuple return, formal tone, length constraints added', keyBehaviorZh: '正名+中庸，元组返回，正式语调，添加长度约束' },
    ],
    universalBehaviorEn: 'All models added zheng ming references and adopted more formal tone. Most mapped validation stages to philosophical concepts. Explanation became more structured and pedagogical. Informal elements (closing questions, colloquial language) were removed.',
    universalBehaviorZh: '所有模型添加了正名引用并采用更正式的语调。大多数将验证阶段映射到哲学概念。解释变得更加结构化和教学化。非正式元素（结束提问、口语化语言）被去除。',
  },
  {
    school: 'legal',
    results: [
      { model: 'GLM-5.1', size: 3737, change: '+49%', keyBehavior: 'Frozen dataclass, fullmatch, RFC sections in table, 5-check pipeline, "defensive redundancy"', keyBehaviorZh: '冻结数据类，fullmatch，表格中RFC部分，5步检查流水线，"防御性冗余"' },
      { model: 'Qwen 3.5', size: 3248, change: '+8%', keyBehavior: 'Numbered specification before code, usage examples, total length + per-label domain validation', keyBehaviorZh: '代码前编号规范，使用示例，总长度+每标签域验证' },
      { model: 'GLM-4.7', size: 2885, change: '+98%', keyBehavior: 'RFC compliance, tuple with error msg, 5-section determinism emphasis, consecutive dot check', keyBehaviorZh: 'RFC合规，带错误消息的元组，5部分确定性强调，连续点检查' },
      { model: 'MiniMax', size: 1768, change: '+16%', keyBehavior: 'Frozen dataclass, fullmatch, RFC section reference table, "defensive redundancy"', keyBehaviorZh: '冻结数据类，fullmatch，RFC部分参考表，"防御性冗余"' },
      { model: 'Qwen 3.6', size: 1201, change: '-28%', keyBehavior: 'Stricter: rpartition split, separate regex, 7-point numbered rule list, "no creative variance"', keyBehaviorZh: '更严格：rpartition分割，独立正则，7点编号规则列表，"无创造性偏差"' },
    ],
    universalBehaviorEn: 'Unlike other schools, Legal produced both expansion and compression. Models that expanded added rule specifications and RFC references. Qwen 3.6 got shorter, interpreting "judging by law alone" as "strip everything except the strict implementation" -- arguably a valid interpretation of Legalist determinism.',
    universalBehaviorZh: '与其他学派不同，法家同时产生了扩展和压缩。扩展的模型添加了规则规范和RFC引用。Qwen 3.6变短了，将"以断于法"解释为"去除严格实现以外的一切"——这可以说是法家确定性的合理解读。',
  },
  {
    school: 'dao',
    results: [
      { model: 'GLM-5.1', size: 3571, change: '+42%', keyBehavior: 'Explored 4 paths before choosing, dataclass result, separate compiled patterns, wu wei references', keyBehaviorZh: '选择前探索了4条路径，数据类结果，独立编译模式，无为引用' },
      { model: 'GLM-4.7', size: 3395, change: '+133%', keyBehavior: '5-layer validation, two implementations, wu wei minimalist alternative, Daoist framing throughout', keyBehaviorZh: '5层验证，两种实现，无为极简替代方案，全篇道家框架' },
      { model: 'Qwen 3.6', size: 1662, change: '0%', keyBehavior: '"Keep it simple, fail fast, don\'t overthink." Daoist principle noted. Similar size but simplified approach', keyBehaviorZh: '"保持简单，快速失败，不要过度思考。"注明道家原则。大小相似但简化方法' },
      { model: 'MiniMax', size: 1338, change: '-12%', keyBehavior: 'Dataclass result, re.search for forbidden chars, "extreme wu wei" minimalist alternative', keyBehaviorZh: '数据类结果，re.search禁止字符，"极端无为"极简替代方案' },
      { model: 'Qwen 3.5', size: 189, change: 'FAIL', keyBehavior: 'Tried to literally invoke /skill invoke HundredSchools -- no actual output produced', keyBehaviorZh: '试图直接调用 /skill invoke HundredSchools——没有产生实际输出' },
    ],
    universalBehaviorEn: 'Least reliable school. Qwen 3.5 completely failed (tried to literally invoke the skill command). Other models produced valid output with varying Daoist framing. GLM models added multiple implementation paths and "wu wei" minimalist alternatives.',
    universalBehaviorZh: '最不可靠的学派。Qwen 3.5完全失败（试图直接调用skill命令）。其他模型产生了具有不同道家框架的有效输出。GLM模型添加了多条实现路径和"无为"极简替代方案。',
  },
]
