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

## Example 5 / 示例五

### `socratic -> military`

**Use when / 适用场景**: The prompt is vague and the downstream cost of
acting on the wrong interpretation is high.

**适用场景**：提示词模糊，按错误解读行动的下游成本较高。

- `socratic`: identify open terms, run one or two rounds of definitional and
  boundary-case questions, refuse to commit to an answer until success
  conditions are concrete.
- `socratic`：识别尚未确定的术语，进行一两轮"定义 + 边界用例"追问；在成
  功条件具体化之前不进入承诺。

- `military`: with a clarified problem statement, build the multi-step plan
  with primary and fallback paths.
- `military`：基于已被澄清的问题陈述，搭建带主路径与备路的多步骤计划。

## Example 6 / 示例六

### `dao -> falsificationist -> logician`

**Use when / 适用场景**: The task is research-shaped — multiple plausible
explanations exist, the user wants the riskier-but-more-informative one, and
category coherence still matters.

**适用场景**：任务呈研究型——存在多个合理解释、用户希望"风险更高但信息
量更大"的那一个，同时范畴一致性仍然重要。

- `dao`: generate alternative framings without committing.
- `dao`：生成多种候选框架而不立即落点。

- `falsificationist`: pick the riskier, more informative conjecture; attach
  a concrete falsifying observation; apply at least one severe self-test.
- `falsificationist`：挑出风险更高、信息量更大的猜想；附上具体的可证伪观
  察；至少进行一次严苛自检。

- `logician`: check that the surviving claim's names and categories track
  reality.
- `logician`：检查"暂存"的断言中，名与类是否对应所指。

## Example 7 / 示例七

### `legal -> stoic -> confucian`

**Use when / 适用场景**: Validation depends on a hard external constraint
that the agent cannot make compliant, and the user is human and must be
informed gracefully.

**适用场景**：校验依赖一个代理无法强行合规的硬性外部约束，且用户是真人，
需要以人情味告知。

- `legal`: validate; if the schema cannot be satisfied because of an
  uncontrollable upstream, return the rejection as a clean signal.
- `legal`：执行校验；若 schema 因不可控上游而无法满足，把拒绝作为干净的
  信号返回。

- `stoic`: emit the controllable / uncontrollable partition; produce an
  acceptance line and a revised plan instead of looping.
- `stoic`：输出"可控/不可控"划分；用一行接受陈述与一份修订计划替代循环。

- `confucian`: deliver the acceptance and revised plan to the user with
  appropriate tone, role, and audience fit.
- `confucian`：以合宜的语气、角色与受众适配，把"接受陈述与修订计划"交付
  给用户。

## Example 8 / 示例八

### `dao -> hegelian -> military`

**Use when / 适用场景**: Open exploration has produced multiple
load-bearing perspectives that genuinely conflict; before committing,
the team needs a synthesis that has answered the strongest counter-case.

**适用场景**：开放探索已经产出多个真正冲突的承重视角；在承诺之前，团
队需要一次"已经回应了最强反案"的综合。

- `dao`: keep multiple framings live; refuse premature commitment.
- `dao`：保留多个框架同时存活；拒绝过早承诺。

- `hegelian`: stage the framings as thesis–antithesis pairs; produce an
  *Aufhebung* that preserves what each side got right while
  transcending the form of their opposition; test on a concrete case.
- `hegelian`：把这些框架组织为正反命题对；产出扬弃式综合（保留双方各
  自之"对"，扬弃二者对立的形式）；在具体案例上检验。

- `military`: with the synthesis in hand, build the multi-step plan
  with primary and fallback paths.
- `military`：基于已得出的综合，搭建带主路径与备路的多步骤计划。

## Example 9 / 示例九

### `falsificationist -> pragmatist -> mohist`

**Use when / 适用场景**: Several conjectures have survived testing and
the question is now which one is most useful, and the final answer must
also be terse.

**适用场景**：多个猜想都已熬过检验，剩下的问题是"哪个最有用"，且最终
答案还必须简短。

- `falsificationist`: surface the conjectures that have not been
  refuted; tag any rhetorical claims as orientation-only.
- `falsificationist`：把尚未被推翻的猜想浮上来；把任何修辞性陈述标注
  为"仅方向性"。

- `pragmatist`: for each surviving conjecture, list its cash-value;
  pick the one whose practical effects best fit the user's downstream
  context.
- `pragmatist`：为每个暂存的猜想列出兑现价值；挑选其实践效应最贴合用
  户下游语境的那一个。

- `mohist`: strip everything that does not contribute to that
  benefit; deliver the dense form.
- `mohist`：删去任何无贡献的部分，交付高密度形态。

## Example 10 / 示例十

### `socratic -> yangming`

**Use when / 适用场景**: The prompt is vague *and* the user is paralyzed
because no concrete next step exists, even after key terms are clarified.

**适用场景**：提示词模糊*且*——即使关键术语澄清后——用户仍因"没有具体
下一步可走"而瘫痪。

- `socratic`: identify open terms and run a round of definitional and
  boundary-case questions; clarify success conditions.
- `socratic`：识别尚未确定的术语，进行一轮"定义 + 边界用例"追问；澄清
  成功条件。

- `yangming`: end with one concrete next action the user could attempt
  within the current session; mentally walk through what executing it
  would expose; surface any missing precondition.
- `yangming`：以"用户在当前会话内可尝试的一个具体下一步"作结；在心里
  把"执行此动作会暴露什么"过一遍；把任何缺失前提翻到台面上。

## Example 11 / 示例十一

### `military -> yangming`

**Use when / 适用场景**: A multi-step plan has been authored but is at
risk of being shipped as abstract strategy without an adoptable next
move.

**适用场景**：已经写好多步骤计划、但有作为"抽象策略"发货的风险——尚
缺一个可采纳的下一步动作。

- `military`: define objective, resources, primary path, and fallback;
  emit the full plan.
- `military`：定义目标、资源、主路径与备路；输出完整计划。

- `yangming`: refuse to ship until at least one concrete next action
  has been pinned down; explicitly tag any remaining gaps as
  *information* gaps vs. *operational/social* gaps.
- `yangming`：在至少钉住一个"下一个具体动作"之前不发货；显式区分剩余
  缺口为"信息缺口"与"操作 / 社交缺口"。

## Design Rule / 设计规则

Every handoff should answer one question: what can the next school do that the
current school should not try to do itself?

每一次交接都应回答一个问题：下一家能做、而当前这家不该硬做的事情，究竟是什
么？
