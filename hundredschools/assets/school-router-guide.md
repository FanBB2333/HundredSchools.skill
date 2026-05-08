# Dynamic School Router Guide / 动态学派路由指南

This guide explains how the router should choose a school when the user does not
specify one.

本指南说明当用户未明确指定学派时，路由器应如何进行选择。

## Primary Routing Table / 一级路由表

| Control Goal / 控制目标 | Typical Signals / 常见信号 | Recommended School / 推荐学派 |
|---|---|---|
| Explore, brainstorm, reframe / 探索、发散、重构问题 | ideas, options, what if, stuck framing / 想法、选项、框架卡住 | `dao` |
| Fit role and audience / 适配角色与受众 | email, official note, customer reply / 邮件、正式说明、客服回复 | `confucian` |
| Enforce exact rules / 严格执行规则 | schema, exact format, parse, validate / schema、精确格式、解析、校验 | `legal` |
| Plan and manage contingencies / 规划与应变 | architecture, steps, strategy, break down / 架构、步骤、策略、拆解 | `military` |
| Reduce waste while preserving utility / 去浪费并保留功用 | brief, concise, compress, efficient / 简短、压缩、高效 | `mohist` |
| Verify terms and claims / 核验术语与断言 | contradiction, verify, ambiguity, category / 矛盾、核验、歧义、范畴 | `logician` |
| Interrogate before answering / 作答前先质询 | vague spec, undefined terms, "what do you mean by X" / 规约模糊、术语未定义、"X 是什么意思" | `socratic` |
| Partition controllable vs not / 划分可控边界 | tool failure, API down, ambiguous user, retry loop / 工具失败、API 不可达、用户模糊、重试循环 | `stoic` |
| Demand falsifiability / 要求可证伪 | hypothesis, "what would refute this", high-confidence claim with no failure mode / 假设、"什么能推翻它"、高自信但无失败条件 | `falsificationist` |
| Force counter-position and synthesis / 强制反命题与综合 | stakeholder disagreement, red-team review, "before we ship — what's the strongest objection" / 利益相关者分歧、红队评审、"发货前——最强反对意见是什么" | `hegelian` |
| Choose by practical consequence / 按实践后果选择 | trade-off, A vs B, "which one actually pays off", MVP selection / 权衡、A vs B、"哪个真能兑现"、MVP 选型 | `pragmatist` |
| Demand actionable form / 要求可被采纳的行动 | abstract advice, decision paralysis with sufficient info, "what should I do next" / 抽象建议、信息已足却瘫痪、"下一步该做什么" | `yangming` |

## Secondary Questions / 二级判断问题

Before routing, ask:

在真正路由前，先问：

1. Is the main problem missing structure, missing precision, missing audience
   fit, or missing exploration?
2. Which control surface matters most: planning, validation, tone, cost, or
   semantic discipline?
3. Is the task risky enough that a multi-school sequence is safer than a single school?

1. 当前主要缺的是结构、精度、受众适配，还是探索？
2. 当前最重要的控制面是什么：规划、校验、语气、成本，还是语义纪律？
3. 当前任务风险是否已经高到需要多学派流水线，而不是单一学派？

## Risk Overrides / 风险覆盖规则

- If the task is high-risk and format-sensitive, prefer `legal` or a sequence
  ending in `legal`.
- 如果任务高风险且格式敏感，优先 `legal` 或以 `legal` 结尾的流水线。

- If the task is high-risk and claim-sensitive, prefer `logician -> legal`.
- 如果任务高风险且断言敏感，优先 `logician -> legal`。

- If the task is open-ended and still underframed, prefer `dao` first and hand
  off later only after the frame is clearer.
- 如果任务开放且仍未定框，优先先用 `dao`，等框架更清晰后再决定是否交接。

- If the prompt is vague and the user seems to want an answer to a question
  they have not finished formulating, prefer `socratic` before any committing
  school.
- 如果提示词模糊、用户似乎在还没把问题问完时就索要答案，优先 `socratic`
  再交给任何承诺型学派。

- If the failure is external (tool error, API timeout, permission denied)
  and the model is at risk of looping or fabricating, prefer `stoic` to
  partition scope before any further action.
- 如果失败来自外部（工具错误、API 超时、权限拒绝），且模型有进入循环或
  编造的风险，优先 `stoic` 在任何后续动作前先划清边界。

- If the task is hypothesis-shaped or the model has been emitting
  high-confidence claims without stating how they could fail, prefer
  `falsificationist` before `legal` finalization.
- 如果任务呈"假设"形态，或模型一直输出高自信断言却从不说明"能怎么失
  败"，在 `legal` 定稿前先用 `falsificationist`。

- If a draft is about to ship without facing its strongest counter-case,
  or stakeholders are split with both sides holding load-bearing claims,
  prefer `hegelian` before commitment.
- 如果初稿即将发货却尚未直面最强反案，或各方均持承重断言而分裂时，在
  承诺前先用 `hegelian`。

- If multiple options look equally valid in theory and the user has to
  choose, prefer `pragmatist` to make the choice by consequence.
- 如果多个选项在理论上看似同样可行、用户必须选时，优先 `pragmatist`，
  以"实际能兑现什么"作出选择。

- If articulate-but-unadoptable advice is the dominant failure, or the
  user with sufficient information is stuck in decision paralysis,
  prefer `yangming` before any final delivery.
- 如果"措辞清楚但用不起来"是主要失败模式，或信息已足的用户卡在决策瘫
  痪，最终交付前先用 `yangming`。

## Confidence Policy / 置信度策略

| Confidence / 置信度 | Router Action / 路由动作 |
|---|---|
| High / 高 | Auto-select and proceed / 自动选择并继续 |
| Medium / 中 | Auto-select and explain why / 自动选择并说明原因 |
| Low / 低 | Present top candidates / 给出前两名候选 |

## Anti-Patterns / 反模式

- Do not route to `confucian` just because the prompt sounds polite.
- 不要仅因为提示词看起来礼貌就路由到 `confucian`。

- Do not route to `mohist` just because the user said "short" if accuracy would
  clearly suffer.
- 不要仅因为用户说了“简短”就路由到 `mohist`，尤其在准确性会明显受损时。

- Do not route to `military` for one-step trivial tasks.
- 不要为单步小任务路由到 `military`。

- Do not route to `socratic` when the user has explicitly asked for execution
  speed and the spec is already adequate; that is pedantry, not inquiry.
- 当用户明确要求执行速度且规约已经足够时，不要路由到 `socratic`；那是迂
  阔，不是追问。

- Do not route to `stoic` to skip work the agent could in fact have done; the
  partition must be honest, not a shortcut.
- 不要用 `stoic` 跳过代理本来能做的工作；可控划分必须诚实，不能当成捷径。

- Do not route to `falsificationist` purely on the surface form of "looks
  scientific"; the real signal is *missing failure conditions*, not the
  presence of jargon.
- 不要仅凭"看起来很科学"的表面形式就路由到 `falsificationist`；真正的信
  号是"缺少失败条件"，而不是术语堆砌。

- Do not route to `hegelian` when one side is simply wrong; force-fitting
  a triadic synthesis where it does not belong is failure mode, not virtue.
- 当其中一方明显错误时，不要路由到 `hegelian`；在不该有三段式综合的地
  方硬凑三段式，是失败模式，不是优点。

- Do not route to `pragmatist` if the user has not given enough downstream
  context; "cash-out" requires knowing whose practice is being cashed out.
- 如果用户尚未提供足够的下游语境，不要路由到 `pragmatist`；"兑现"必须
  先知道"谁的实践被兑现"。

- Do not route to `yangming` when the user actually needs more reflection
  or information; demanding action prematurely is voluntarism, not
  knowledge-action unity.
- 当用户其实需要更多反思或信息时，不要路由到 `yangming`；过早催促行动
  是意志主义，不是知行合一。
