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
