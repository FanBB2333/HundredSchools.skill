# Legalism Guide / 法家指南

This reference defines the rule-clarity, auditability, and enforcement control
surface for Legalism (`legal`). It is the strictest school in the framework, but
it should not be reduced to "JSON validation only." Legalism is about making
requirements explicit, measuring them uniformly, and attaching consequences to
deviation.

本指南定义了法家（`legal`）的规则清晰度、可审计性与执行约束控制面。它是整
个框架里最严格的学派，但不应被缩减成“只会校验 JSON”。法家的重点，是把规则
写清、统一度量、并让偏离规则的行为真正产生后果。

## Philosophy Deep-Dive / 哲学深描

### Core Tension / 核心张力

Legalism governs the tension between discretion and enforceability. The more a
system depends on goodwill, the less reliably it scales.

法家治理的，是“裁量空间”与“可执行性”之间的张力。一个系统越依赖善意与临场
发挥，就越难稳定扩展。

### Deep Principles / 深层原则

- **Fa / 法**: the rule must be explicit enough to be checked.
- **法 / Fa**：规则必须明确到可被检查。

- **Shu / 術**: method matters; enforcement requires procedures, not slogans.
- **术 / Shu**：执行靠方法，不靠口号。

- **Shi / 勢**: positional force matters; the system prompt, parser, and retry
  loop together create authority.
- **势 / Shi**：位置性力量很重要；system prompt、parser 与 retry loop 一
  起构成约束权威。

- **Xing-ming / 刑名**: what was promised must match what was delivered.
- **刑名 / Xing-ming**：说出的规格必须和交付结果相符。

- **No hidden exception / 无隐性例外**: once rules admit silent exceptions,
  trust in the constraint layer collapses.
- **无隐性例外 / No hidden exception**：一旦规则开始默认“悄悄通融”，约束层
  的可信度就会崩塌。

### Overuse Failure Modes / 过用失控风险

- **Brittleness**: legal mode rejects useful outputs because the rule was badly
  written.
- **脆化**：不是输出错，而是规则写得差，导致有用结果被错杀。

- **Compliance theater**: the system passes the surface checks while violating
  the spirit of the task.
- **合规表演**：表面通过检查，但实质违背任务精神。

- **Over-governance**: strictness is applied where exploration was still needed.
- **治理过度**：还需要探索的阶段却过早上了严格约束。

### Handoff Conditions / 交接条件

- Hand off to **Logician / 名家** when the schema is clear but the claims inside
  it are still semantically doubtful.
- 当格式规则已经清晰，但其中断言仍然语义可疑时，交接给
  **Logician / 名家**。

- Hand off to **Confucian / 儒家** when compliance is done and the remaining task
  is audience-safe delivery.
- 当合规已经完成、剩下的任务是受众适配式表达时，交接给
  **Confucian / 儒家**。

- Hand off to **Military / 兵家** when the real problem is missing strategy, not
  missing rules.
- 当真正缺的是战略而不是规则时，交接给 **Military / 兵家**。

---

## Classical References / 经典引文

Selected passages from the *Hanfeizi* (韓非子). Because page-level English on
ctext is partly AI-assisted and the previous guide used uncited quote-style
renderings, the English lines below are now explicitly marked as close
paraphrases grounded in the Chinese text.

以下引文选自《韩非子》。由于 ctext 上部分英文为 AI-assisted，且旧版文档曾使
用无明确出处的“引文式英文”，因此以下英文统一明确标注为基于中文原文的 close
paraphrase。

### 奉法者強則國強 (有度)

> 國無常強，無常弱。奉法者強則國強，奉法者弱則國弱。

*English Paraphrase / 英文意译*: No state stays strong by nature; a state grows
strong when those who uphold its laws are strong.

**AI Mapping / AI 映射**: Reliability does not come from declaring a schema; it
comes from actually enforcing it. A validation rule with no consequence is only
ornament.

**AI 映射**：可靠性并不是“写下 schema”就自动产生的，而是来自真正执行。
一个没有后果的校验规则，只是装饰。

**Control Surface / 控制面**: Enforcement strength.
**控制面**：执行强度。

**Failure Mode Addressed / 对应失败模式**: Soft constraints that drift over
time.
**对应失败模式**：随时间松弛的软约束。

---

### 法不阿貴，繩不撓曲 (有度)

> 法不阿貴，繩不撓曲。

*English Paraphrase / 英文意译*: Law does not bend toward the noble, just as a
straightening line does not bend for the crooked.

**AI Mapping / AI 映射**: Validation must ignore rhetorical prestige. A clever
paragraph surrounding invalid JSON does not make the JSON valid.

**AI 映射**：校验不应被修辞光环影响。围绕错误 JSON 写得再漂亮，也不会把它
变成合法 JSON。

**Control Surface / 控制面**: Uniform validation.
**控制面**：一视同仁的校验。

**Failure Mode Addressed / 对应失败模式**: Granting exceptions to impressive
output.
**对应失败模式**：对“看起来很聪明”的输出偷偷放行。

---

### 二柄者，刑、德也 (二柄)

> 二柄者，刑、德也。

*English Paraphrase / 英文意译*: A ruler governs by two handles only:
punishment and reward.

**AI Mapping / AI 映射**: Legal mode needs a binary consequence layer. The
output passes and proceeds, or it fails and is regenerated. Partial credit is a
different regime.

**AI 映射**：法家需要明确的二元后果层：通过并进入下游，或失败并重新生成。
“差不多给点分”属于另一种制度，不属于法家。

**Control Surface / 控制面**: Pass/fail consequence model.
**控制面**：通过/失败后果模型。

**Failure Mode Addressed / 对应失败模式**: Ambiguous acceptance states.
**对应失败模式**：通过状态含混不清。

---

### 功當其事，事當其言，則賞 (二柄)

> 功當其事，事當其言，則賞；功不當其事，事不當其言，則罰。

*English Paraphrase / 英文意译*: Reward follows when achievement matches task
and task matches stated claim; punishment follows when the match breaks.

**AI Mapping / AI 映射**: Legal validation should compare three layers: prompt
specification, generated structure, and delivered content. Misalignment at any
layer should be visible and attributable.

**AI 映射**：法家校验应同时比较三层：规格说明、生成结构与实际内容。任意一
层错位，都必须可见、可定位、可归责。

**Control Surface / 控制面**: Traceable audit.
**控制面**：可追责审计。

**Failure Mode Addressed / 对应失败模式**: Hidden mismatch between promise and
delivery.
**对应失败模式**：承诺与交付之间的隐藏错位。

---

### 法者，憲令著於官府 (定法)

> 法者，憲令著於官府。

*English Paraphrase / 英文意译*: Law means that decrees are made explicit and
publicly fixed.

**AI Mapping / AI 映射**: The format, required fields, and validation criteria
must be written into the instruction layer up front. The model cannot obey a
constitution that was never published.

**AI 映射**：格式、必填字段与校验标准必须事先写进指令层。一个从未公布过的
“宪法”，模型无法遵守。

**Control Surface / 控制面**: Specification clarity.
**控制面**：规格清晰度。

**Failure Mode Addressed / 对应失败模式**: Ambiguous or moving requirements.
**对应失败模式**：模糊或不断移动的要求。

---

## Bibliography / 参考书目

### Core Classical Texts / 核心原典

| Text / 文本 | Period / 时期 | Why It Matters / 关键关联 |
|---|---|---|
| 韓非子 *Hanfeizi* | Warring States | Fa, shu, shi, auditable control / 法、术、势与可审计控制 |
| 商君書 *Book of Lord Shang* | Warring States | Uniform rule and state-strength logic / 一体化规则与强国逻辑 |
| 申不害 fragments | Warring States | Administrative method and role-accountability / 行政方法与角色问责 |
| 慎子 fragments | Warring States | Positional authority and structural force / 位置性权威与结构力量 |

### Commentaries and Translations / 注疏与译本

- **W.K. Liao, *The Complete Works of Han Fei Tzu* (1939).** Useful for breadth
  when you need more than anthology-level excerpts.
- **W.K. Liao，《韩非子全集》英译（1939）**：当你需要超出选篇范围的整体视野
  时很实用。

- **Burton Watson, *Han Fei Tzu: Basic Writings* (1964).** Usually the best
  modern entry point for stable English.
- **Burton Watson，《韩非子基本文选》英译（1964）**：通常是进入法家稳定英
  译世界的最佳起点。

- **Yuri Pines, *The Book of Lord Shang* (2017).** Strong for understanding rule,
  power, and administrative rationality together.
- **Yuri Pines，《商君书》英译（2017）**：特别适合理解“规则、权力、行政理
  性”三者如何相互嵌合。

### Modern Applications / 现代应用

- **Rule-based systems literature.** Relevant whenever the framework must make
  constraints operational rather than inspirational.
- **规则系统研究**：当项目需要把约束从“启发式建议”变成“可执行制度”时尤为相
  关。

- **Audit and compliance design literature.** Useful for translating fa/shu/shi
  into modern technical governance.
- **审计与合规设计文献**：适合把法、术、势转译成现代技术治理语言。

### Suggested Reading Order / 建议阅读顺序

1. Start with short Hanfeizi selections.
2. Add *Book of Lord Shang* for severity and institutional logic.
3. Use modern compliance literature only after the classical grammar is clear.

1. 先读《韩非子》短篇选段。
2. 再读《商君书》，补足制度严厉性与国家逻辑。
3. 等古典语法清楚后，再进入现代合规文献。

---

## Strict Mode Mechanics / 严格模式机制

### Rule Layer / 规则层

- Required fields are explicit.
- 必填字段必须明确。
- Allowed types are explicit.
- 允许类型必须明确。
- Prohibited wrappers are explicit.
- 禁止的包裹性文字必须明确。

### Consequence Layer / 后果层

- Pass: return the output.
- 通过：返回输出。
- Fail: reject and regenerate.
- 失败：拒绝并重新生成。

### Anti-Patterns / 反模式

- Do not activate Legalism while the task is still under exploration.
- 在任务仍处于探索阶段时，不要过早启用法家。

- Do not let schema conformance substitute for semantic correctness.
- 不要让格式合规替代语义正确。

---

## Session Template / 会话模板

```text
### Legalism Session Notes / 法家会话记录

Target Format / 目标格式:
Rule Source / 规则来源:
Validation Passes / 校验轮次:
Failure Cause / 失败原因:
Retry Used? / 是否重试:
Outcome / 结果:
```
