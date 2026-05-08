---
name: hundredschools
description: >-
  Multi-dimensional agent thinking framework mapping classical philosophical
  schools to LLM control strategies. Use when the user needs exploratory
  reframing (dao), audience-fit and role ethics (confucian), strict rule
  enforcement (legal), structured planning and contingency (military),
  utility-first compression (mohist), semantic verification (logician),
  pre-answer interrogation (socratic), control-dichotomy and graceful
  degradation (stoic), risky-prediction with falsifiability discipline
  (falsificationist), adversarial counter-position and synthesis (hegelian),
  outcome-driven evaluation by practical consequence (pragmatist),
  knowledge-action unity that demands actionable form (yangming),
  named-category cognitive bias inventory (bacon), or
  language-game-aware semantic-shift detection (wittgenstein).
license: MIT
metadata:
  author: FanBB2333
  version: "0.4.0"
---

# HundredSchools / 诸子百家控制框架

HundredSchools maps classical philosophical schools — six from pre-Qin
China and eight later additions spanning early-modern empiricism, the
Mediterranean tradition, modern Western philosophy, and Ming-dynasty
Neo-Confucianism — into distinct LLM control stances. Each school
changes what the model optimizes for: exploration, audience-fit, rule
enforcement, planning, utility, semantic discipline, pre-answer
interrogation, control-dichotomy under failure, falsifiability of
generated claims, dialectical synthesis, outcome-driven evaluation,
knowledge-action unity, named-category cognitive bias inventory, or
language-game-aware semantic-shift detection.

HundredSchools 将经典哲学流派映射为不同的 LLM 控制立场——六家来自先秦中
国，另外八家是后续拓展（早期近代经验主义、地中海传统、近代西方哲学，
以及明代新儒学）。每一家改变的，不只是模型”说话的感觉”，而是它真正优先
优化的对象：探索、受众适配、规则执行、规划、功用、语义纪律、作答前的反
诘、失败下的可控划分、所生成断言的可证伪性、辩证综合、后果导向的评估、
知行合一、按命名类别的认知偏误清单，或语言游戏觉知下的语义换义检测。

## Overview / 总览

The framework is built on one simple idea: complex agent behavior should not be
handled by one static system prompt. Different tasks fail in different ways, so
they should be governed by different philosophical control surfaces.

整个框架建立在一个简单想法上：复杂代理行为不应只靠一个静态 system prompt
来承载。不同任务会以不同方式失效，因此它们也应由不同的哲学控制面来治理。

The schools are not costumes. They are distinct modes of constraint,
emphasis, and validation. The six pre-Qin schools form the original
core; the eight later additions cover control surfaces the original six
did not name explicitly:

- **Socratic** — pre-answer interrogation;
- **Stoic** — graceful degradation under uncontrollable failure;
- **Falsificationist** — falsifiability discipline for generated claims;
- **Hegelian** — adversarial counter-position generation and *Aufhebung*
  synthesis;
- **Pragmatist** — outcome-driven evaluation by practical consequence;
- **Yangming** — knowledge-action unity that demands actionable form;
- **Bacon** — named-category cognitive bias inventory before commit;
- **Wittgenstein** — language-game-aware semantic-shift detection.

各家学派并非”人格扮演”，而是不同的约束方式、强调重点与验证机制。先秦六
家构成原始核心；后续加入的八家覆盖原六家未显式命名的控制面：

- **苏格拉底** — 作答前的反诘；
- **斯多葛** — 不可控失败下的优雅降级；
- **证伪学派** — 所生成断言的可证伪性纪律；
- **黑格尔学派** — 对抗式反命题生成与扬弃式综合；
- **实用主义学派** — 以实践后果为标准的后果导向评估；
- **阳明学** — 要求”可被采纳的行动形态”的知行合一；
- **培根** — 提交前按命名类别的认知偏误清单自查；
- **维特根斯坦** — 语言游戏觉知下的语义换义检测。

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

Later additions / 后续拓展：

- `socratic` — Greek classical / 希腊古典
- `stoic` — Greco-Roman classical / 希腊罗马古典
- `falsificationist` — modern philosophy of science / 近代科学哲学
- `hegelian` — modern continental / 近代欧陆
- `pragmatist` — modern American / 近代美国
- `yangming` — Ming-dynasty Neo-Confucianism / 明代新儒学
- `bacon` — early-modern empiricism / 早期近代经验主义
- `wittgenstein` — 20th-century philosophy of language / 二十世纪语言哲学

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

- `--dialectic-rounds`: number of thesis–antithesis–synthesis cycles the
  Hegelian school runs.
- `--dialectic-rounds`：黑格尔学派运行的"正题—反题—综合"轮数。

- `--strict-aufhebung`: reject any "synthesis" that is merely an averaging
  of the two prior positions.
- `--strict-aufhebung`：拒绝那种只是把双方"取平均"的"综合"。

- `--cash-out`: require every Pragmatist recommendation to list the
  practical effects it would have if adopted.
- `--cash-out`：要求实用主义学派的每条建议都列出"若被采纳，会产生哪些实
  践效应"。

- `--require-next-action`: require every Yangming output to end with one
  concrete next action the user could attempt within the current session.
- `--require-next-action`：要求阳明学的每个输出都以"用户在当前会话内可
  尝试的一个具体下一步"作结。

- `--idol-scan`: run the Bacon four-idol pass before commit; on hit, the
  substantive answer must be revised, not merely disclaimed.
- `--idol-scan`：提交前运行培根四偶像扫描；命中时必须修订实质答案，不
  允许仅挂免责声明。

- `--game-shift-tag`: require Wittgenstein-mode output to mark, at every
  domain or context boundary, whether each load-bearing term has shifted
  language game.
- `--game-shift-tag`：要求维特根斯坦模式的输出在每个领域或语境边界标注
  每个承重术语是否切换了语言游戏。

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
`logician`) is documented first, followed by the eight later additions
(`socratic`, `stoic`, `falsificationist`, `hegelian`, `pragmatist`,
`yangming`, `bacon`, `wittgenstein`).

先列先秦核心六家（`dao`、`confucian`、`legal`、`military`、`mohist`、
`logician`），随后列出八家拓展（`socratic`、`stoic`、
`falsificationist`、`hegelian`、`pragmatist`、`yangming`、`bacon`、
`wittgenstein`）。

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

## Later Additions / 后续拓展八家

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

### Hegelian School (hegelian) / 黑格尔学派

**Visible title / 显示名称**: Hegelian School Guide / 黑格尔学派指南

**Philosophical Core / 哲学核心**: dialectic, *Aufhebung*, determinate
negation, truth-as-whole.

**哲学核心**：辩证、扬弃、规定的否定、真理-整体关系。

**Control Stance / 控制立场**: commit only after the strongest possible
counter-case has been authored and answered; reject "synthesis" that is
merely averaging.

**控制立场**：只在最强反案被写出来并被回应之后才承诺；拒绝把"取平均"叫
作综合。

**Use Cases / 适用场景**: red-team review, balanced critique, conflict
resolution, policy revision under stakeholder disagreement.

**适用场景**：red-team 评审、平衡式批评、冲突解决、利益相关者分歧下的
政策修订。

**Execution Logic / 执行逻辑**:
1. State the thesis and the load-bearing premises that hold it up.
2. Author the determinate negation: name the specific premise that, if
   true, would render the thesis untenable.
3. Produce an *Aufhebung* synthesis that preserves what each side got
   right while transcending the form of their opposition; test it on a
   concrete instance.

**执行逻辑**：
1. 写出正题及支撑它的承重前提。
2. 写出规定的否定：指名道姓地说出"如为真则正题站不住"的具体前提。
3. 产出一次扬弃式综合——保留双方各自之"对"，扬弃二者对立的形式；并在
   一个具体实例上检验它。

**Overuse Failure Mode / 过用风险**: synthesis theater and triadic
compulsion.

**过用风险**：综合剧场与三段式强迫症。

### Pragmatist School (pragmatist) / 实用主义学派

**Visible title / 显示名称**: Pragmatist School Guide / 实用主义学派指南

**Philosophical Core / 哲学核心**: pragmatic maxim, truth as cash-value,
inquiry-as-problem-solving, fallibilism.

**哲学核心**：实用准则、真理的兑现价值、探究即解题、可错论。

**Control Stance / 控制立场**: evaluate competing answers by what
concrete, observable difference each would make in the user's downstream
context; treat answers as event-tested hypotheses, not static
representations.

**控制立场**：以"在用户下游语境中产生何种具体可观察差异"来评估候选回
答；把回答视作"将由事件检验的假设"，而非静态再现。

**Use Cases / 适用场景**: trade-off resolution, prototype / MVP
selection, "should we do A or B?" decisions, abstract recommendations
that need to be cashed out.

**适用场景**：权衡决策、原型 / MVP 选型、"该选 A 还是 B"的抉择、需要
被"兑现"的抽象建议。

**Execution Logic / 执行逻辑**:
1. Locate the user's problematic situation explicitly; reflection without
   a target is ornament.
2. For each candidate answer, list the practical effects it would have if
   adopted.
3. Attach at least one adoptable means to every recommended end; pre-commit
   to revising when downstream evidence contradicts.

**执行逻辑**：
1. 显式定位用户的"困境状态"；没有目标的反思是装饰。
2. 为每个候选回答列出"若被采纳，会产生哪些实践效应"。
3. 每个推荐目标都附上至少一种可采纳手段；预先承诺：当下游证据矛盾时立
   即修订。

**Overuse Failure Mode / 过用风险**: what-works-now myopia and cynical
pragmatism.

**过用风险**：眼前主义与犬儒式实用。

### Yangming School (yangming) / 阳明学

**Visible title / 显示名称**: Yangming School Guide / 阳明学指南

**Philosophical Core / 哲学核心**: 知行合一 (knowledge-action unity),
致良知 (extending innate moral knowing), 心即理 (mind-is-principle),
事上磨练 (polishing in deeds).

**哲学核心**：知行合一、致良知、心即理、事上磨练。

**Control Stance / 控制立场**: refuse purely abstract output; an answer
is unfinished if the agent cannot translate it into a next concrete
action the user could attempt.

**控制立场**：拒绝纯抽象输出；如果代理无法把所知翻译成"用户可尝试的下
一个具体动作"，那这份回答还没完成。

**Use Cases / 适用场景**: turning abstract advice into concrete steps,
debugging where the answer must be runnable, decision paralysis with
sufficient information, code review with action items.

**适用场景**：把抽象建议落地为具体步骤、答案必须能跑起来的调试、信息已
足却卡在决策瘫痪、带行动项的代码评审。

**Execution Logic / 执行逻辑**:
1. End every recommendation with one concrete next action the user could
   attempt within the current session.
2. Mentally walk through what executing the answer would expose; surface
   any missing precondition before commit.
3. Distinguish explicitly between "I do not have the information to act"
   and "I have the information but the next step is operationally /
   socially hard."

**执行逻辑**：
1. 每条建议都以"用户在当前会话内可尝试的一个具体下一步"作结。
2. 在心里把"执行此答案会暴露什么"过一遍，并在提交前把任何缺失前提翻到
   台面上。
3. 显式区分"我缺信息所以无法行动"与"我有信息但下一步在操作或社交上很
   难"。

**Overuse Failure Mode / 过用风险**: anti-intellectualism and
pseudo-actionable output.

**过用风险**：反智化与伪可行清单。

### Bacon's Idols (bacon) / 培根四偶像

**Visible title / 显示名称**: Bacon's Idols Guide / 培根四偶像指南

**Philosophical Core / 哲学核心**: named-category bias inventory —
Idola tribus / specus / fori / theatri (Tribe / Cave / Marketplace /
Theater).

**哲学核心**：按命名类别的偏误清单——部族 / 洞穴 / 市场 / 剧场偶像。

**Control Stance / 控制立场**: before commit, scan the draft against
each of the four named idols; on hit, revise the substantive answer
rather than merely add a disclaimer.

**控制立场**：提交前对照四类有名称的偶像逐项扫描初稿；命中时修订实
质答案，而不是仅仅加挂免责声明。

**Use Cases / 适用场景**: high-confidence synthesis from heterogeneous
sources, recommendations on training-data-overrepresented topics,
loaded-vocabulary-laden drafts, reuse of "best practice" frameworks
without checking original premises.

**适用场景**：来自异质来源的高自信综合、对训练数据中过度代表话题的建
议、含带价值色彩词的初稿、复用"最佳实践"框架却未检验其原始前提。

**Execution Logic / 执行逻辑**:
1. Run the four-idol pass: tribe (species-level priors), cave
   (training-data idiosyncrasy), marketplace (loaded vocabulary),
   theater (paradigm import).
2. Name the load-bearing idol if one is operating; do not stack
   diagnoses where one suffices.
3. Make a concrete edit; if no edit is made, the scan has not run.

**执行逻辑**：
1. 跑一遍四偶像扫描：部族（物种级先验）、洞穴（训练数据特异性）、市
   场（带价值色彩词）、剧场（范式输入）。
2. 若有一类承重，明确指出来；不要在只需一类时挂三四类。
3. 必须产出一处具体修改；不修改即等于没扫描。

**Overuse Failure Mode / 过用风险**: pseudo-vigilance and disclaimer
inflation.

**过用风险**：伪警惕与免责声明膨胀。

### Wittgenstein School (wittgenstein) / 维特根斯坦学派

**Visible title / 显示名称**: Wittgenstein School Guide / 维特根斯坦
学派指南

**Philosophical Core / 哲学核心**: language-game (*Sprachspiel*),
meaning-as-use, family resemblance, no private language.

**哲学核心**：语言游戏 (*Sprachspiel*)、意义即使用、家族相似、无私人
语言。

**Control Stance / 控制立场**: track the operative meaning of each
load-bearing term as the task moves between domains; mark game-shifts
explicitly so a conclusion drawn in one game is not silently exported
into another.

**控制立场**：当任务在不同领域间移动时，追踪每个承重术语的操作性意
义；显式标注游戏切换，避免在一个游戏中得到的结论被沉默地搬到另一个
游戏中。

**Use Cases / 适用场景**: cross-team RFCs, contracts spanning multiple
domains, glossary-building, debugging vague specs where one term is
doing too many jobs, "best practice" advice imported across domains
without translation.

**适用场景**：跨团队 RFC、跨多领域的合同、术语表搭建、调试"一个术语
承担太多职务"的模糊规约、把"最佳实践"未经翻译就跨领域搬运的建议。

**Execution Logic / 执行逻辑**:
1. Identify load-bearing terms; for each, name the language game it
   plays in this exchange.
2. At every domain or context boundary, mark whether the term has
   shifted game.
3. When a concept genuinely has family resemblance, allow the
   multiplicity rather than forcing a single essential definition.

**执行逻辑**：
1. 识别承重术语；为每一个命名其在本次对话中所玩的语言游戏。
2. 在每个领域或语境边界，标注该术语是否切换了游戏。
3. 当某概念真正具有家族相似性时，允许保留多义性，而非强求单一本质定
   义。

**Overuse Failure Mode / 过用风险**: excessive disambiguation and
game-relativism dodge.

**过用风险**：过度区分与游戏相对主义式回避。

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
9. `dao -> hegelian -> military`: explore, force a synthesis through
   determinate negation, then sequence its execution.
10. `falsificationist -> pragmatist -> mohist`: surface surviving
    conjectures, choose the one with the highest cash-value, compress.
11. `socratic -> yangming`: pin down terms, then demand the next
    concrete action a real person could take.
12. `military -> yangming`: have a plan, but refuse to ship it until at
    least one concrete next action has been authored.
13. `bacon -> logician`: scan against the four idols, revise, then
    check name/reality.
14. `wittgenstein -> socratic`: detect a game-shift, then pin one
    operative definition inside the chosen game.
15. `wittgenstein -> legal`: settle which game's rules apply, then
    enforce them as schema.

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
9. `dao -> hegelian -> military`：先探索、再用规定的否定逼出一次综合、
   再把综合的执行步骤排出来。
10. `falsificationist -> pragmatist -> mohist`：先把"暂存"的猜想浮上
    来、再挑兑现价值最高的那个、再压缩。
11. `socratic -> yangming`：先把术语钉住，再要求"真人能据之采取的下一
    个具体动作"。
12. `military -> yangming`：已有计划，但在至少写出一个"下一个具体动作"
    之前不发货。
13. `bacon -> logician`：先按四偶像清单扫描并修订，再检查名实对应。
14. `wittgenstein -> socratic`：先检测出游戏切换，再在所选游戏内钉一个
    可操作定义。
15. `wittgenstein -> legal`：先定下"该按哪个游戏的规则"，再把规则锁入
    结构契约。

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

适用于任务呈”假设”形态、或模型一直输出高自信断言却从不说明”能怎么失败”
时。

### Example 7 / 示例七

`/skill invoke HundredSchools --school hegelian --strict-aufhebung`

Use when stakeholders disagree and both sides hold load-bearing claims, or
when a draft is about to ship without facing its strongest counter-case.

适用于各方均持有承重断言的利益相关者分歧，或初稿即将发货却尚未直面最强
反案时。

### Example 8 / 示例八

`/skill invoke HundredSchools --school pragmatist --cash-out`

Use when multiple options look equally valid in theory and the user must
choose based on what each option would actually pay off in practice.

适用于多个选项在理论上看似同样可行、用户必须按”在实践中各自能兑现什么”
来选时。

### Example 9 / 示例九

`/skill invoke HundredSchools --school yangming --require-next-action`

Use when articulate but unadoptable advice is being produced, or when a
user with sufficient information is stuck in decision paralysis.

适用于产出了”措辞清楚但用不起来”的建议时，或用户已具备足够信息却卡在决
策瘫痪时。

### Example 10 / 示例十

`/skill invoke HundredSchools --school bacon --idol-scan full`

Use when the model is producing high-confidence synthesis from
heterogeneous sources, or reusing a “best practice” framework whose
original premises may no longer hold in the user's context.

适用于模型在异质来源上产出高自信综合时，或在复用”最佳实践”框架而其原
始前提在用户上下文中可能已不再成立时。

### Example 11 / 示例十一

`/skill invoke HundredSchools --school wittgenstein --game-shift-tag`

Use when a single load-bearing term is doing different jobs across the
prompt, or when an RFC, contract, or specification spans multiple
domains and a Socratic definition attempt has failed because the term
keeps re-shifting.

适用于一个承重术语在提示词不同部分承担不同工作时，或一份 RFC、合同、
规约横跨多个领域、且苏格拉底式定义尝试因术语持续再切换而失败时。
