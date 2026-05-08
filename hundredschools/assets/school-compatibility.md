# School Compatibility Matrix / 学派兼容矩阵

This guide describes which schools compose well, which only work sequentially,
and which combinations should usually be avoided.

本指南说明哪些学派适合组合、哪些只能串行使用，以及哪些组合通常应避免。

## Compatibility Matrix / 兼容矩阵

| Pair / 组合 | Rating / 评级 | Why / 原因 |
|---|---|---|
| Dao + Military / 道家 + 兵家 | High sequential / 高度串行兼容 | Reframe first, commit second / 先重构，再承诺 |
| Military + Legal / 兵家 + 法家 | Very high / 很高 | Plan first, enforce second / 先规划，再执行 |
| Logician + Legal / 名家 + 法家 | Very high / 很高 | Semantic verification first, structure enforcement second / 先语义核验，再结构强制 |
| Logician + Mohist / 名家 + 墨家 | Very high / 很高 | Preserve truth, then compress / 先保真，再压缩 |
| Legal + Confucian / 法家 + 儒家 | High / 高 | Comply first, adapt second / 先合规，再适配 |
| Dao + Legal / 道家 + 法家 | Low simultaneous / 同步兼容低 | Exploration clashes with zero-tolerance enforcement / 探索与零容忍执行冲突 |
| Confucian + Mohist / 儒家 + 墨家 | Medium / 中 | Relational tact may inflate cost / 关系修辞可能抬高成本 |
| Socratic + Military / 苏格拉底 + 兵家 | Very high / 很高 | Clarify, then plan / 先问清楚，再规划 |
| Socratic + Falsificationist / 苏格拉底 + 证伪 | High / 高 | Define terms, then attach falsifiers / 先定义，再附可证伪条件 |
| Falsificationist + Logician / 证伪 + 名家 | High sequential / 高度串行兼容 | Empirical risk first, name/reality second / 先经验风险，再名实对应 |
| Stoic + Confucian / 斯多葛 + 儒家 | High / 高 | Accept boundary, then communicate humanely / 先接受边界，再人情交付 |
| Legal + Stoic / 法家 + 斯多葛 | High sequential / 高度串行兼容 | Validate, accept what cannot be enforced / 先校验，再接受无法强制合规的部分 |
| Stoic + Falsificationist / 斯多葛 + 证伪 | Medium / 中 | Both can mute commitment if stacked carelessly / 草率叠加都会压低承诺度 |
| Socratic + Mohist / 苏格拉底 + 墨家 | Low simultaneous / 同步兼容低 | Inquiry inflates length, compression cuts inquiry / 质询会拉长输出，压缩会压掉质询 |
| Dao + Hegelian + Military / 道家 + 黑格尔 + 兵家 | High sequential / 高度串行兼容 | Explore, synthesize, sequence / 先探索、再综合、再排序 |
| Hegelian + Falsificationist / 黑格尔 + 证伪 | High sequential / 高度串行兼容 | Synthesize, then attach falsifying conditions / 先综合，再附可证伪条件 |
| Hegelian + Pragmatist / 黑格尔 + 实用主义 | High / 高 | Synthesis chosen, evaluate by cash-value / 综合既得，按兑现价值评估 |
| Falsificationist + Pragmatist / 证伪 + 实用主义 | High sequential / 高度串行兼容 | Tested claims, then choose by usefulness / 受过检验的断言，按"是否有用"作选 |
| Pragmatist + Mohist / 实用主义 + 墨家 | Very high / 很高 | Outcome chosen, compress / 后果既定，压缩 |
| Pragmatist + Yangming / 实用主义 + 阳明学 | Very high / 很高 | Effects identified, lock to next concrete action / 效应已识别，落到下一个具体行动 |
| Socratic + Yangming / 苏格拉底 + 阳明学 | High sequential / 高度串行兼容 | Define, then make adoptable / 先定义，再可采纳 |
| Military + Yangming / 兵家 + 阳明学 | High sequential / 高度串行兼容 | Plan, then refuse to ship without next action / 已规划，但不写下一动作不发货 |
| Yangming + Hegelian / 阳明学 + 黑格尔 | Low simultaneous / 同步兼容低 | Action-form vs synthesis-not-yet-action-ready / 行动形态与"尚未行动就绪的综合"互相打架 |

## Pair Profiles / 组合画像

### Military + Legal / 兵家 + 法家

Best when the task is complex, costly, and structurally constrained.

最适合任务复杂、成本高、且最终输出有严格结构约束时。

### Logician + Legal / 名家 + 法家

Best when both claim correctness and format correctness matter.

最适合既要求断言正确，也要求格式正确时。

### Logician + Mohist / 名家 + 墨家

Best when the answer must be exact but still dense.

最适合要求答案既精确又高密度时。

### Dao + Legal / 道家 + 法家

Use only in strict sequence, never as one simultaneous generation posture.

只能严格串行使用，不能作为一个同步生成姿态来混用。

### Socratic + Military / 苏格拉底 + 兵家

Best when the user's prompt is vague and the downstream cost of acting on
the wrong interpretation is high. Socratic interrogation locks the problem
statement; Military then does the multi-step plan on a stable target.

最适合用户提示词模糊、且按错误解读行动的下游成本很高时。苏格拉底质询锁
定问题陈述；兵家随后在一个稳定目标上做多步规划。

### Falsificationist + Logician / 证伪 + 名家

Best when both empirical risk and category coherence matter. The
Falsificationist asks "can this claim fail?"; the Logician asks "do its
names track its referents?". They answer different questions and stack
cleanly when run in sequence.

最适合既需经验风险纪律、又需范畴一致性时。证伪学派问"该断言能否失
败？"；名家问"它的名字是否对应所指对象？"。两者回答的是不同的问题，串
行使用时叠加干净。

### Legal + Stoic / 法家 + 斯多葛

Use when validation has hard external dependencies (e.g. an upstream
service the agent cannot fix). Legalist rejection is read by the Stoic
stance as a clean signal of an uncontrollable, allowing acceptance and
replanning instead of an enforcement loop.

适用于校验依赖硬性外部条件（例如代理无法修复的上游服务）时。法家的拒
绝被斯多葛立场读作"不可控信号"，从而把动作切换为接受+重规划，而非进入
执行循环。

### Hegelian + Pragmatist / 黑格尔 + 实用主义

Best when a synthesis has been reached but its consequences in the
user's downstream context have not yet been evaluated. The Hegelian
move closes the *coherence* question; the Pragmatist move closes the
*usefulness* question. Together they produce a position that is both
dialectically earned and operationally cashed out.

最适合"综合已达成、但其下游后果尚未评估"时。黑格尔动作关闭"自洽性"问
题；实用主义动作关闭"是否有用"问题。两者合用，会产出一个"既经辩证赢
得、又在操作上兑现"的立场。

### Pragmatist + Yangming / 实用主义 + 阳明学

Best when the practical effects of an answer have been identified but
the answer has not yet been turned into an adoptable next action. The
Pragmatist names *what* it would pay off; the Yangming move names
*how* the user could pick it up next.

最适合"答案的实践效应已识别、但尚未被翻译成可采纳的下一步行动"时。实
用主义说出"它会兑现什么"；阳明学说出"用户接下来如何把它接过去"。

### Military + Yangming / 兵家 + 阳明学

Best when a multi-step plan has been authored but the smallest unit of
adoption — the *next* concrete action — has not yet been pinned down.
Yangming is the brake that prevents shipping abstract plans dressed up
as actionable.

最适合"多步骤计划已写好、但最小可采纳单元（下一个具体动作）尚未钉住"
时。阳明学是阻止把"装扮成可采纳的抽象计划"发出去的刹车。

## Anti-Patterns / 反模式

- Do not run Daoist exploration and Legalist enforcement in the same generation
  step.
- 不要在同一生成步骤中同时运行道家探索与法家执行。

- Do not compress with Mohism before you know which distinctions are essential.
- 在还不知道哪些区分是核心之前，不要先用墨家压缩。

- Do not add Confucian polish before Legalist validation if schema conformance is
  mandatory.
- 如果 schema 合规是硬要求，不要在法家校验前先做儒家润色。

- Do not stack Socratic on top of Mohist in the same step; inquiry inflates
  length while compression cuts inquiry, and the two will fight.
- 不要在同一步骤里把苏格拉底叠在墨家之上；质询会拉长输出，压缩会压掉质
  询，两者会互相打架。

- Do not run Stoic and Falsificationist simultaneously on a low-confidence
  draft; both reduce commitment, and stacked carelessly the model will stop
  asserting anything.
- 不要在低置信度初稿上同时跑斯多葛与证伪学派；两者都会降低承诺度，草率
  叠加会让模型彻底不愿意作出任何断言。

- Do not use Stoic to mask Socratic's job; "this part is uncontrollable"
  must not be a way to dodge "this term is undefined."
- 不要用斯多葛掩盖苏格拉底应该做的事；"这部分不可控"不应被用来回避"该
  术语未定义"。

- Do not stack Hegelian on top of Yangming in the same step; Hegelian
  may produce a synthesis that is not yet action-ready, and Yangming
  refuses to commit until it is — they will fight in one generation.
- 不要在同一步骤里把黑格尔叠在阳明学之上；黑格尔可能产出尚未行动就绪
  的综合，而阳明学拒绝在尚未行动就绪时承诺，两者在同一次生成中会打架。

- Do not run Hegelian where one side is simply wrong. Force-fitting a
  triadic synthesis onto an asymmetric problem is failure, not depth.
- 在"明显有一方错"的问题上不要跑黑格尔。把三段式硬塞进非对称问题里是
  失败模式，不是深度。

- Do not use Pragmatist to launder ethical drift; "what works" must be
  cashed out *for whom*, including parties who are not the immediate
  user.
- 不要用实用主义来掩盖伦理漂移；"能用"必须明确"对谁能用"，包括非直接
  用户的相关方。

- Do not use Yangming to demand action when the user actually needs more
  reflection. Knowledge-action unity is a *standard for completed
  knowing*, not a slogan for "just do it."
- 当用户其实需要更多反思时，不要用阳明学催促行动。知行合一是"何为已完
  成的'知'的标准"，不是"别想了就去做"的口号。
