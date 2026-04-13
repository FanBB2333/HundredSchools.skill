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
