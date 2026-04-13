# Multi-School Pipeline Examples / 多学派流水线示例

Pipelines are useful when one school would otherwise need to optimize two
incompatible goals at the same time.

当单一学派会被迫同时优化两个互相冲突的目标时，多学派流水线就会变得有价值。

## Example 1 / 示例一

### `dao -> military`

**Use when / 适用场景**: The task is underframed and needs both reframing and a
later commitment.

**适用场景**：问题定框不足，需要先重构问题，再进入明确承诺。

- `dao`: generate perspectives, alternatives, and reframings.
- `dao`：生成不同视角、替代方向与重构方案。

- `military`: choose one viable direction, define steps, and add a fallback.
- `military`：选出一条可行方向，写出步骤，并补上备路。

## Example 2 / 示例二

### `military -> legal`

**Use when / 适用场景**: The task is complex and the final deliverable must obey
an exact structure.

**适用场景**：任务复杂，且最终交付物必须服从精确结构。

- `military`: define objective, resources, and switch triggers.
- `military`：明确目标、资源与切换触发条件。

- `legal`: enforce final structure, schema, and pass/fail rule.
- `legal`：执行最终结构、schema 与通过/失败规则。

## Example 3 / 示例三

### `logician -> mohist`

**Use when / 适用场景**: The answer must remain precise while becoming much
shorter.

**适用场景**：答案必须在保持精确的同时显著缩短。

- `logician`: remove category confusion and unsupported claims.
- `logician`：清除范畴混乱与无依据断言。

- `mohist`: strip what adds no user benefit.
- `mohist`：删去所有不增加用户收益的部分。

## Example 4 / 示例四

### `legal -> confucian`

**Use when / 适用场景**: A structurally compliant answer must still be delivered
in a role-appropriate tone.

**适用场景**：结构已合规，但表达仍需要角色与受众适配。

- `legal`: make the answer valid.
- `legal`：先让答案有效。

- `confucian`: make the answer fitting.
- `confucian`：再让答案合宜。

## Design Rule / 设计规则

Every handoff should answer one question: what can the next school do that the
current school should not try to do itself?

每一次交接都应回答一个问题：下一家能做、而当前这家不该硬做的事情，究竟是什
么？
