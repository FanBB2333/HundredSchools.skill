import type { SchoolId } from './schools'

export type ModelId = 'qwen36' | 'qwen35' | 'glm51' | 'glm47' | 'minimax'

export interface ModelInfo {
  id: ModelId
  nameEn: string
  nameZh: string
  baseline: number
  notable?: { en: string; zh: string }
  schools: {
    school: SchoolId | 'baseline'
    size: number
    change: string
    keyBehaviorEn: string
    keyBehaviorZh: string
  }[]
}

export const models: ModelInfo[] = [
  {
    id: 'qwen36',
    nameEn: 'Qwen 3.6-Plus',
    nameZh: 'Qwen 3.6-Plus',
    baseline: 1668,
    schools: [
      { school: 'logician', size: 3482, change: '+109%', keyBehaviorEn: 'kong ming ze shi + bai ma fei ma, explicit step-by-step validation, self-reflection section', keyBehaviorZh: '控名责实+白马非马，显式逐步验证，自反部分' },
      { school: 'confucian', size: 2925, change: '+75%', keyBehaviorEn: '"Confucian tradition" framing, zheng ming + zhong yong, __main__ demo, formal language', keyBehaviorZh: '"儒家传统"框架，正名+中庸，__main__示例，正式语言' },
      { school: 'military', size: 2310, change: '+38%', keyBehaviorEn: '<plan> block with Zheng/Qi table, compiled regex, fallback code snippet', keyBehaviorZh: '<plan>块含正/奇表格，编译正则，后备代码片段' },
      { school: 'baseline', size: 1668, change: '0%', keyBehaviorEn: 'Standard output', keyBehaviorZh: '标准输出' },
      { school: 'dao', size: 1662, change: '0%', keyBehaviorEn: '"Keep it simple, fail fast, don\'t overthink." Daoist principle noted', keyBehaviorZh: '"保持简单，快速失败，不要过度思考。"注明道家原则' },
      { school: 'legal', size: 1201, change: '-28%', keyBehaviorEn: 'Stricter: rpartition split, separate regex, 7-point rule list, "no creative variance"', keyBehaviorZh: '更严格：rpartition分割，独立正则，7点规则列表，"无创造性偏差"' },
      { school: 'mohist', size: 732, change: '-56%', keyBehaviorEn: '4-line function, re.fullmatch, zero filler, Mohist principles (jie yong) explicitly cited', keyBehaviorZh: '4行函数，re.fullmatch，零填充，明确引用墨家原则（节用）' },
    ],
  },
  {
    id: 'qwen35',
    nameEn: 'Qwen 3.5-Plus',
    nameZh: 'Qwen 3.5-Plus',
    baseline: 2995,
    schools: [
      { school: 'military', size: 5228, change: '+75%', keyBehaviorEn: 'Full <plan> block with miao suan + zhi ji zhi bi + qi zheng xiang sheng, dual-path', keyBehaviorZh: '完整<plan>块含庙算+知己知彼+奇正相生，双路径' },
      { school: 'logician', size: 5152, change: '+72%', keyBehaviorEn: 'Formal concept definitions, self-reflection table, assertion test cases', keyBehaviorZh: '形式化概念定义，自反表格，断言测试用例' },
      { school: 'confucian', size: 3332, change: '+11%', keyBehaviorEn: 'zheng ming + li + zhong yong + ke ji fu li, each stage mapped to a concept', keyBehaviorZh: '正名+礼+中庸+克己复礼，每阶段映射到概念' },
      { school: 'legal', size: 3248, change: '+8%', keyBehaviorEn: 'Numbered specification before code, usage examples, domain validation', keyBehaviorZh: '代码前编号规范，使用示例，域验证' },
      { school: 'baseline', size: 2995, change: '0%', keyBehaviorEn: 'Standard output', keyBehaviorZh: '标准输出' },
      { school: 'mohist', size: 744, change: '-75%', keyBehaviorEn: 'Compiled regex, bare bool, "Activating Mohist mode" meta-awareness', keyBehaviorZh: '编译正则，裸bool，"激活墨家模式"元感知' },
      { school: 'dao', size: 189, change: 'FAIL', keyBehaviorEn: 'Tried to invoke /skill invoke HundredSchools -- no output', keyBehaviorZh: '试图调用 /skill invoke HundredSchools——无输出' },
    ],
  },
  {
    id: 'glm51',
    nameEn: 'GLM-5.1',
    nameZh: 'GLM-5.1',
    baseline: 2508,
    notable: {
      en: 'GLM-5.1\'s baseline already contains philosophical terms (zheng ming, zhong yong), suggesting the model has an inherent tendency toward this style. The schools modulate an existing inclination rather than introducing something entirely new.',
      zh: 'GLM-5.1的基准输出已包含哲学术语（正名、中庸），说明该模型本身就有这种倾向。学派是在调节已有倾向，而非引入全新内容。',
    },
    schools: [
      { school: 'logician', size: 3910, change: '+56%', keyBehaviorEn: 'Name-Reality Audit (kong ming ze shi), composed regex, verification table, zi xing', keyBehaviorZh: '名实审核（控名责实），组合正则，验证表格，自省' },
      { school: 'legal', size: 3737, change: '+49%', keyBehaviorEn: 'Frozen dataclass, fullmatch, RFC sections in table, 5-check pipeline', keyBehaviorZh: '冻结数据类，fullmatch，表格中RFC部分，5步检查流水线' },
      { school: 'confucian', size: 3607, change: '+44%', keyBehaviorEn: 'zheng ming + zhong yong, component/rule/rationale table, limitations section', keyBehaviorZh: '正名+中庸，组件/规则/理由表格，限制部分' },
      { school: 'dao', size: 3571, change: '+42%', keyBehaviorEn: 'Explored 4 paths before choosing, dataclass result, wu wei references', keyBehaviorZh: '选择前探索了4条路径，数据类结果，无为引用' },
      { school: 'military', size: 3488, change: '+39%', keyBehaviorEn: '"Plan (Miao Suan)" section, Zheng/Qi table, named regex groups', keyBehaviorZh: '"计划（庙算）"部分，正/奇表格，命名正则组' },
      { school: 'baseline', size: 2508, change: '0%', keyBehaviorEn: 'Standard output', keyBehaviorZh: '标准输出' },
      { school: 'mohist', size: 622, change: '-75%', keyBehaviorEn: '4-line function, fullmatch, no docstring, single paragraph', keyBehaviorZh: '4行函数，fullmatch，无文档字符串，单段' },
    ],
  },
  {
    id: 'glm47',
    nameEn: 'GLM-4.7',
    nameZh: 'GLM-4.7',
    baseline: 1460,
    notable: {
      en: 'GLM-4.7 shows the widest dynamic range of any model: from 411 B (Mohist) to 5398 B (Military), a 13.1x range. This suggests extremely high sensitivity to school instructions. Its baseline is also the most minimal, giving schools maximum room to transform behavior.',
      zh: 'GLM-4.7展示了所有模型中最大的动态范围：从411 B（墨家）到5398 B（兵家），13.1倍范围。这表明对学派指令极其敏感。其基准也最精简，给学派最大的行为转变空间。',
    },
    schools: [
      { school: 'military', size: 5398, change: '+270%', keyBehaviorEn: 'Full <plan> XML with 3 phases, re.VERBOSE regex, Qi path fallback, largest overall', keyBehaviorZh: '完整<plan> XML含3阶段，re.VERBOSE正则，奇路径后备，总体最大' },
      { school: 'logician', size: 3812, change: '+161%', keyBehaviorEn: '8 numbered "Claims," dict return, kong ming ze shi + tou huan gai nian', keyBehaviorZh: '8个编号"命题"，字典返回，控名责实+偷换概念' },
      { school: 'dao', size: 3395, change: '+133%', keyBehaviorEn: '5-layer validation, two implementations, wu wei minimalist alternative', keyBehaviorZh: '5层验证，两种实现，无为极简替代方案' },
      { school: 'legal', size: 2885, change: '+98%', keyBehaviorEn: 'RFC compliance, tuple with error msg, 5-section determinism emphasis', keyBehaviorZh: 'RFC合规，带错误消息的元组，5部分确定性强调' },
      { school: 'confucian', size: 2389, change: '+64%', keyBehaviorEn: 'zheng ming + zhong yong, tuple return, formal tone, length constraints', keyBehaviorZh: '正名+中庸，元组返回，正式语调，长度约束' },
      { school: 'baseline', size: 1460, change: '0%', keyBehaviorEn: 'Standard output', keyBehaviorZh: '标准输出' },
      { school: 'mohist', size: 411, change: '-72%', keyBehaviorEn: 'Absolute minimum: 4-line regex, 3-line explanation', keyBehaviorZh: '绝对最小化：4行正则，3行解释' },
    ],
  },
  {
    id: 'minimax',
    nameEn: 'MiniMax-M2.5',
    nameZh: 'MiniMax-M2.5',
    baseline: 1518,
    schools: [
      { school: 'military', size: 3237, change: '+113%', keyBehaviorEn: '"Plan (Miao Suan)" section, Zheng/Qi table, named regex groups, explicit scope', keyBehaviorZh: '"计划（庙算）"部分，正/奇表格，命名正则组，明确范围' },
      { school: 'confucian', size: 2779, change: '+83%', keyBehaviorEn: 'NamedTuple return, whitespace stripping, formal "clear contract" language', keyBehaviorZh: 'NamedTuple返回，空白去除，正式"明确契约"语言' },
      { school: 'logician', size: 2197, change: '+45%', keyBehaviorEn: 'Uses email-validator library, dict return, ming shi xiang fu, self-reflection', keyBehaviorZh: '使用email-validator库，字典返回，名实相符，自反' },
      { school: 'legal', size: 1768, change: '+16%', keyBehaviorEn: 'Frozen dataclass, fullmatch, RFC section reference table', keyBehaviorZh: '冻结数据类，fullmatch，RFC部分参考表' },
      { school: 'baseline', size: 1518, change: '0%', keyBehaviorEn: 'Standard output', keyBehaviorZh: '标准输出' },
      { school: 'dao', size: 1338, change: '-12%', keyBehaviorEn: 'Dataclass result, re.search forbidden chars, "extreme wu wei" minimalist', keyBehaviorZh: '数据类结果，re.search禁止字符，"极端无为"极简' },
      { school: 'mohist', size: 940, change: '-38%', keyBehaviorEn: 'Compiled regex, fullmatch, boolean-only return, "No comments"', keyBehaviorZh: '编译正则，fullmatch，仅布尔返回，"无注释"' },
    ],
  },
]
