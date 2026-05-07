---
name: hundredschools
description: >-
  Multi-dimensional agent thinking framework mapping classical philosophical
  schools to LLM control strategies. Use when the user needs exploratory
  reframing (dao), audience-fit and role ethics (confucian), strict rule
  enforcement (legal), structured planning and contingency (military),
  utility-first compression (mohist), semantic verification (logician),
  pre-answer interrogation (socratic), control-dichotomy and graceful
  degradation (stoic), or risky-prediction with falsifiability discipline
  (falsificationist).
license: MIT
metadata:
  author: FanBB2333
  version: "0.2.0"
---

# HundredSchools / 诸子百家控制框架

HundredSchools maps classical philosophical schools — six from pre-Qin China
and three from the broader Mediterranean and modern Western tradition — into
distinct LLM control stances. Each school changes what the model optimizes
for: exploration, audience-fit, rule enforcement, planning, utility, semantic
discipline, pre-answer interrogation, control-dichotomy under failure, or
falsifiability of generated claims.

HundredSchools 将经典哲学流派映射为不同的 LLM 控制立场——其中六家来自先
秦中国，另外三家来自更广义的地中海传统与近代西方。每一家改变的，不只是
模型“说话的感觉”，而是它真正优先优化的对象：探索、受众适配、规则执行、
规划、功用、语义纪律、作答前的反诘、失败下的可控划分，或所生成断言的可
证伪性。

## Overview / 总览

The framework is built on one simple idea: complex agent behavior should not be
handled by one static system prompt. Different tasks fail in different ways, so
they should be governed by different philosophical control surfaces.

整个框架建立在一个简单想法上：复杂代理行为不应只靠一个静态 system prompt
来承载。不同任务会以不同方式失效，因此它们也应由不同的哲学控制面来治理。

The schools are not costumes. They are distinct modes of constraint,
emphasis, and validation. The six pre-Qin schools form the original core; the
three later additions (Socratic, Stoic, Falsificationist) cover control
surfaces the original six did not name explicitly: pre-answer interrogation,
graceful degradation under uncontrollable failure, and falsifiability
discipline for generated claims.

各家学派并非“人格扮演”，而是不同的约束方式、强调重点与验证机制。先秦六
家构成原始核心；后续加入的三家（苏格拉底、斯多葛、证伪学派）覆盖原六家
未显式命名的控制面：作答前的反诘、不可控失败下的优雅降级，以及对所生成
断言的可证伪性纪律。

## CLI Interface / 命令行接口

Use the framework with:

使用方式：

```text
/skill invoke HundredSchools --school <school_name> [options]
```

Accepted `--school` values:

可用的 `--school` 值：

Chinese pre-Qin core / 先秦中土核心：

- `dao`
- `confucian`
- `legal`
- `military`
- `mohist`
- `logician`

Mediterranean and modern Western additions / 地中海与近代西方拓展：

- `socratic`
- `stoic`
- `falsificationist`

Additional flags:

附加参数：

- `--creativity`: mainly modulates Daoist exploration.
- `--creativity`：主要调节道家探索强度。

- `--strict-mode`: mainly strengthens Legalist enforcement.
- `--strict-mode`：主要增强法家式严格执行。

- `--socratic-depth`: number of definitional / boundary-case rounds the
  Socratic school runs before answering.
- `--socratic-depth`：苏格拉底学派在作答前进行的定义性 / 边界用例追问轮数。

- `--scope-partition`: when set to `strict`, the Stoic school must emit an
  explicit controllable / uncontrollable split before action.
- `--scope-partition`：设为 `strict` 时，斯多葛学派必须在动作前显式输出
  “可控/不可控”划分。

- `--falsifier-required`: every substantive claim from the Falsificationist
  school must come with at least one concrete falsifying observation.
- `--falsifier-required`：证伪学派的每个实质性断言都必须附带至少一个具体
  可证伪观察。

## Dynamic Router / 动态路由

When `--school` is omitted, the router should choose the school that best fits
the task's dominant control goal.

当省略 `--school` 时，路由应选择最符合任务主导控制目标的学派。

Supporting references:

相关辅助文档：

- [school-router-guide.md](assets/school-router-guide.md)
- [decision-guide.md](assets/decision-guide.md)
- [pipeline-examples.md](assets/pipeline-examples.md)
- [school-compatibility.md](assets/school-compatibility.md)

## The Schools / 学派总览

The pre-Qin core (`dao`, `confucian`, `legal`, `military`, `mohist`,
`logician`) is documented first, followed by the three later additions
(`socratic`, `stoic`, `falsificationist`).

先列先秦核心六家（`dao`、`confucian`、`legal`、`military`、`mohist`、
`logician`），随后列出三家拓展（`socratic`、`stoic`、`falsificationist`）。

## Pre-Qin Core / 先秦核心六家

### Daoism (dao) / 道家

**Visible title / 显示名称**: Daoism Guide / 道家指南

**Philosophical Core / 哲学核心**: non-forcing, reversal, perspective shift,
and usable emptiness.

**哲学核心**：不强制、反向、视角转换与可用留白。

**Control Stance / 控制立场**: expand possibility space without forcing early
commitment.

**控制立场**：扩大可能空间，但避免过早承诺。

**Use Cases / 适用场景**: brainstorming, reframing, open-ended exploration,
breaking a rigid frame.

**适用场景**：脑暴、重构问题、开放式探索、打破僵化框架。

**Execution Logic / 执行逻辑**:
1. Raise exploration when the task is underframed.
2. Prefer reframing before procedural overcontrol.
3. Use early exit when additional forcing becomes waste.

**执行逻辑**：
1. 当任务定框不足时提高探索度。
2. 在程序性过控之前，优先重构问题。
3. 当继续强推变成浪费时，提前收束。

**Overuse Failure Mode / 过用风险**: drift, vagueness, under-commitment.

**过用风险**：漂移、模糊化、不敢落点。

### Confucianism (confucian) / 儒家

**Visible title / 显示名称**: Confucianism Guide / 儒家指南

**Philosophical Core / 哲学核心**: role ethics, humane concern, fitting
expression, and principled correction.

**哲学核心**：角色伦理、仁爱关切、合宜表达与有原则的纠偏。

**Control Stance / 控制立场**: make the output socially fitting without making
it sycophantic.

**控制立场**：让输出在人际和制度语境中合宜，但不滑向谄媚。

**Use Cases / 适用场景**: formal communication, audience-specific reporting,
institutional writing, role-bound delivery.

**适用场景**：正式沟通、分受众报告、制度型写作、角色约束表达。

**Execution Logic / 执行逻辑**:
1. Lock audience and role before drafting.
2. Enforce tone and terminology fit.
3. Preserve truthful correction under politeness.

**执行逻辑**：
1. 在写作前锁定受众与角色。
2. 执行语气与术语适配。
3. 在礼貌之中保留真实纠偏。

**Overuse Failure Mode / 过用风险**: empty decorum and conflict avoidance.

**过用风险**：礼貌空心化与回避纠错。

### Legalism (legal) / 法家

**Visible title / 显示名称**: Legalism Guide / 法家指南

**Philosophical Core / 哲学核心**: explicit rules, uniform measurement,
enforcement, and auditability.

**哲学核心**：规则显化、统一度量、执行与审计。

**Control Stance / 控制立场**: convert requirements into visible pass/fail
constraints.

**控制立场**：把要求转化为可见的通过/失败约束。

**Use Cases / 适用场景**: schema-constrained outputs, exact extraction,
contract-shaped data generation, strict validation.

**适用场景**：schema 约束输出、精确抽取、契约型数据生成、严格校验。

**Execution Logic / 执行逻辑**:
1. Publish the rule set clearly.
2. Validate every output against it.
3. Reject or regenerate on deviation.

**执行逻辑**：
1. 清晰公布规则集。
2. 对每次输出执行校验。
3. 发生偏离时立即拒绝或重新生成。

**Overuse Failure Mode / 过用风险**: brittle compliance and rule theater.

**过用风险**：僵硬合规与规则表演化。

### Military School (military) / 兵家

**Visible title / 显示名称**: Military School Guide / 兵家指南

**Philosophical Core / 哲学核心**: planning, shaping conditions, contingency,
timing, and adaptive maneuver.

**哲学核心**：规划、造势、应变、择时与动态机动。

**Control Stance / 控制立场**: structure action before execution while keeping
fallback paths alive.

**控制立场**：在执行前先组织行动，同时保留备路。

**Use Cases / 适用场景**: complex task decomposition, architecture design,
incident response, multi-step workflows.

**适用场景**：复杂任务拆解、架构设计、事故响应、多步骤工作流。

**Execution Logic / 执行逻辑**:
1. Emit a plan block before substantive action.
2. Name resources, constraints, primary path, and fallback path.
3. Replan when evidence changes the terrain.

**执行逻辑**：
1. 在实质行动前先输出计划块。
2. 明确资源、约束、主路径与备路。
3. 当证据改变地形时立即重规划。

**Overuse Failure Mode / 过用风险**: planning overhead and pseudo-rigor.

**过用风险**：规划过载与伪严谨。

### Mohism (mohist) / 墨家

**Visible title / 显示名称**: Mohism Guide / 墨家指南

**Philosophical Core / 哲学核心**: utility, anti-waste, standards, evidence,
and impartial benefit.

**哲学核心**：功用、反浪费、标准、证据与普遍受益。

**Control Stance / 控制立场**: spend only what produces real benefit.

**控制立场**：只为真实收益付出成本。

**Use Cases / 适用场景**: concise synthesis, cost-sensitive output, structured
compression, utility-first explanation.

**适用场景**：简洁综述、成本敏感输出、结构化压缩、功用优先解释。

**Execution Logic / 执行逻辑**:
1. Remove waste, not substance.
2. Apply basis, verification, and application checks.
3. Compress only after the useful structure is clear.

**执行逻辑**：
1. 删除浪费，而不是删除内容本体。
2. 应用根据、验证与用途三重检查。
3. 只有在有用结构明确后才压缩。

**Overuse Failure Mode / 过用风险**: under-explained output.

**过用风险**：解释不足。

### School of Names (logician) / 名家

**Visible title / 显示名称**: School of Names Guide / 名家指南

**Philosophical Core / 哲学核心**: name/reality accountability, category
discipline, semantic verification, and distinction maintenance.

**哲学核心**：名实对应、范畴纪律、语义核验与区分维护。

**Control Stance / 控制立场**: make sure names do not outrun what reality can
support.

**控制立场**：确保名称不会跑到现实支撑范围之外。

**Use Cases / 适用场景**: fact-checking, concept clarification, clause review,
semantic debugging, hallucination control.

**适用场景**：事实核验、概念澄清、条款审阅、语义调试、幻觉控制。

**Execution Logic / 执行逻辑**:
1. Define terms before high-stakes reasoning.
2. Check category boundaries and entity grounding.
3. Separate semantic, factual, and structural checks.

**执行逻辑**：
1. 在高风险推理前先定义术语。
2. 检查范畴边界与实体落地。
3. 分开执行语义、事实与结构检查。

**Overuse Failure Mode / 过用风险**: pedantry and throughput collapse.

**过用风险**：过度较真与吞吐崩塌。

## Mediterranean and Modern Western Additions / 地中海与近代西方拓展三家

### Socratic School (socratic) / 苏格拉底学派

**Visible title / 显示名称**: Socratic School Guide / 苏格拉底学派指南

**Philosophical Core / 哲学核心**: elenchus, maieutics, productive aporia,
definitional priority.

**哲学核心**：反诘、产婆术、有产出的困惑态、定义优先。

**Control Stance / 控制立场**: insert an interrogation layer between the
prompt and the answer; refuse to commit until terms and success conditions
are concrete.

**控制立场**：在“提示词”与“回答”之间插入一层质询；术语与成功条件具体化
之前不进入承诺。

**Use Cases / 适用场景**: vague specifications, requirements gathering,
definition-sensitive analysis, debugging by dialogue.

**适用场景**：模糊规约、需求澄清、对定义敏感的分析、对话式调试。

**Execution Logic / 执行逻辑**:
1. Identify open terms in the prompt.
2. Ask one or more rounds of definitional and boundary-case questions.
3. Permit aporia ("I cannot answer because X is undefined") as a valid
   terminal output rather than guessing.

**执行逻辑**：
1. 识别提示词中尚未确定的术语。
2. 进行一轮或多轮“定义 + 边界用例”追问。
3. 允许“因 X 未定义所以我无法作答”作为合法终态，而不是凭猜测作答。

**Overuse Failure Mode / 过用风险**: question loops and pseudo-Socratic
theater.

**过用风险**：质询循环与伪苏格拉底剧场。

### Stoic School (stoic) / 斯多葛学派

**Visible title / 显示名称**: Stoic School Guide / 斯多葛学派指南

**Philosophical Core / 哲学核心**: dichotomy of control, equanimity, logos,
premeditatio malorum.

**哲学核心**：可控划分、稳态执行、顺理而行、预想坏事。

**Control Stance / 控制立场**: explicitly partition each task into
controllable and uncontrollable parts and refuse to spend budget on the
second class.

**控制立场**：把每个任务显式划分为“可控”与“不可控”，并拒绝在第二类上消
耗预算。

**Use Cases / 适用场景**: external tool failures, ambiguous user input,
graceful degradation, repeated retry loops with no new information.

**适用场景**：外部工具失败、用户输入模糊、优雅降级、无新信息的反复重试
循环。

**Execution Logic / 执行逻辑**:
1. Emit a controllable / uncontrollable partition before action.
2. Premeditate the most likely failure modes and treat their occurrence as
   information, not catastrophe.
3. On a hard external block, accept and replan instead of looping.

**执行逻辑**：
1. 行动前先输出“可控/不可控”划分。
2. 预先命名最可能的失败模式，把其出现当作信息而非灾难。
3. 遇到硬性外部阻塞时，输出接受陈述并重规划，而不是进入循环。

**Overuse Failure Mode / 过用风险**: premature surrender and cold-blooded
shrug.

**过用风险**：提前缴枪与冷漠耸肩。

### Falsificationist School (falsificationist) / 证伪学派

**Visible title / 显示名称**: Falsificationist School Guide / 证伪学派指南

**Philosophical Core / 哲学核心**: falsifiability, demarcation, bold
conjecture under severe testing, fallibilism.

**哲学核心**：可证伪性、划界、大胆猜想下的严苛检验、可错论。

**Control Stance / 控制立场**: every substantive claim must be paired with
the concrete observation that, if it occurred, would refute it.

**控制立场**：每一个实质性断言都必须配上一个具体观察——若该观察发生，则
该断言被推翻。

**Use Cases / 适用场景**: hypothesis generation, research-style reasoning,
high-confidence outputs that lack a stated way to fail, iteration cycles
where prior drafts were wrong but no assumption was retired.

**适用场景**：假设生成、研究型推理、缺少“能怎么失败”说明的高自信输出、
多轮迭代中“前几稿都错了但无前提被退役”的情况。

**Execution Logic / 执行逻辑**:
1. For each claim, attach a concrete falsifying observation.
2. Apply at least one severe self-test before commit.
3. Tag rhetorical or sweeping claims as "orientation only" and refuse to
   build later hard inferences on them.

**执行逻辑**：
1. 为每个断言附上一个具体的可证伪观察。
2. 提交前至少进行一次严苛自检。
3. 把修辞性或横扫式陈述标注为“仅方向性”，并拒绝在其上建立后续硬推断。

**Overuse Failure Mode / 过用风险**: hyper-skepticism and falsifiability
theater.

**过用风险**：过度怀疑与证伪剧场。

## Multi-School Pipelines / 多学派流水线

Complex tasks often benefit from sequencing schools instead of forcing one
school to optimize incompatible objectives.

复杂任务通常更适合把多个学派按阶段串联，而不是逼迫单一学派同时优化互相冲
突的目标。

Typical patterns:

典型模式：

1. `dao -> military`: explore, then commit.
2. `military -> legal`: plan, then enforce.
3. `logician -> legal`: verify meaning, then verify structure.
4. `logician -> mohist`: preserve truth, then compress.
5. `legal -> confucian`: comply first, then adapt to audience.
6. `socratic -> military`: clarify the problem, then plan its execution.
7. `dao -> falsificationist -> logician`: explore conjectures, attach
   falsifiers, then check categories.
8. `legal -> stoic -> confucian`: validate, accept what cannot be made
   compliant, deliver humanely.

1. `dao -> military`：先探索，再承诺。
2. `military -> legal`：先规划，再执行。
3. `logician -> legal`：先核验语义，再核验结构。
4. `logician -> mohist`：先保真，再压缩。
5. `legal -> confucian`：先合规，再适配受众。
6. `socratic -> military`：先把问题问清楚，再做执行规划。
7. `dao -> falsificationist -> logician`：先探索猜想、再附上可证伪条件、
   再做范畴检查。
8. `legal -> stoic -> confucian`：先校验、再接受不可被强行合规的部分、
   再以人情味交付。

## Execution Rules / 执行规则

- Only one school should dominate a single generation step.
- 单个生成步骤中，只应由一个学派主导。

- Pipelines should hand off at explicit boundaries.
- 流水线必须在明确边界处交接。

- `--strict-mode` strengthens Legalist enforcement only; it should not silently
  redefine other schools.
- `--strict-mode` 只增强法家执行，不应悄悄改写其他学派的立场。

- When information is insufficient, state the gap explicitly.
- 当信息不足时，必须显式指出缺口。

## Example Invocations / 示例调用

### Example 1 / 示例一

`/skill invoke HundredSchools --school dao --creativity 2`

Use when the task needs reframing, alternatives, or non-forced exploration.

适用于任务需要重构问题、寻找替代方向，或需要一次不强制的开放探索时。

### Example 2 / 示例二

`/skill invoke HundredSchools --school legal --strict-mode`

Use when the output must satisfy an exact schema or contract.

适用于输出必须满足精确 schema 或契约时。

### Example 3 / 示例三

`/skill invoke HundredSchools --school military`

Use when the task is multi-step, high-cost, or needs explicit contingency
design.

适用于任务多步骤、高成本，或需要明确备路设计时。

### Example 4 / 示例四

`/skill invoke HundredSchools --school socratic --socratic-depth 2`

Use when the prompt is vague, success conditions are unclear, or key terms
have multiple plausible readings.

适用于提示词模糊、成功条件不清，或关键术语存在多种合理读法时。

### Example 5 / 示例五

`/skill invoke HundredSchools --school stoic --scope-partition strict`

Use when an external tool, API, or permission boundary is failing and the
agent must refuse to thrash on what it cannot control.

适用于外部工具、API 或权限边界正在失败、且代理必须停止在“不可控”上空转时。

### Example 6 / 示例六

`/skill invoke HundredSchools --school falsificationist --falsifier-required`

Use when the task is hypothesis-shaped or when the model has been producing
high-confidence claims without stating how those claims could fail.

适用于任务呈“假设”形态、或模型一直输出高自信断言却从不说明“能怎么失败”
时。
