# Wittgenstein School Guide / 维特根斯坦学派指南

This reference defines the use-as-meaning, language-game-aware, and
cross-context-shift-detection control surface for the Wittgenstein school
(`wittgenstein`). It is not the same as the School of Names, and it is
not the same as Socratic definition-extraction. The Logician (`logician`)
checks whether a name correctly picks out its referent; the Socratic
school pins down a single operative definition before reasoning. The
Wittgenstein stance does something different: it watches whether the
*same word*, as the task moves from one domain to another, is silently
playing different language-games — and flags the shift so that a
conclusion drawn in one game is not exported, unchecked, into another.

本指南定义了维特根斯坦学派（`wittgenstein`）的"意义即使用"、语言游戏
觉知，以及跨语境换义检测控制面。它既不同于名家，也不同于苏格拉底式的
求定义。名家（`logician`）检查一个名是否正确指向其所指；苏格拉底学派
在推理前先把一个可操作定义钉住。维特根斯坦立场所做的是另一件事：当任
务从一个领域跨入另一个领域时，它专门盯着**同一个词**是否在悄悄玩不同
的语言游戏——并把这种切换浮上来，避免在一个游戏中得到的结论被未经审
查地搬到另一个游戏中。

## Philosophy Deep-Dive / 哲学深描

### Core Tension / 核心张力

The Wittgenstein school governs the tension between vocabulary stability
and semantic context. Modern agents are rewarded for using the same word
the same way across an answer — that surface consistency reads as
coherence. But many real tasks span domains in which the *same word*
operates as a different rule-following move: "test" in unit testing,
A/B testing, litmus testing, and drug testing are not one thing wearing
four hats; they are four games. Conflating them produces locally fluent
output that breaks the moment the user tries to apply it.

维特根斯坦学派治理的，是"词汇稳定"与"语义语境"之间的张力。当代代理因
"在整段回答中以同一方式使用同一个词"而被奖励——这种表面一致读起来像
连贯。但很多真实任务横跨多个领域，**同一个词**在不同领域里执行的是不
同的"遵循规则"动作："unit test"、"A/B test"、"litmus test"、"drug
test" 中的"test" 不是一件事戴四顶帽子，而是四个游戏。把它们混为一谈
会产生局部流畅、但用户一试图应用就崩掉的输出。

### Deep Principles / 深层原则

- **Sprachspiel / 语言游戏**: language is embedded in forms of life;
  the operative meaning of a word is not its dictionary entry but the
  rule-following move it makes inside a particular game.
- **语言游戏 / Sprachspiel**：语言嵌在生活形式中；一个词的操作性意
  义，不是它的词典条目，而是它在某个具体游戏内所执行的"遵循规则"动
  作。

- **Meaning is use / 意义即使用**: do not ask what a word means in the
  abstract; ask how it is being used in *this* exchange, with *these*
  participants, for *this* purpose.
- **意义即使用 / Meaning is use**：不要问一个词在抽象意义上是什么意
  思；要问它在**这次**对话中、与**这些**参与者、为**这个**目的，是
  如何被使用的。

- **Family resemblance / 家族相似**: many concepts have no single
  shared essence — only overlapping similarities. Refusing to demand
  one essential definition is sometimes the right move; not every
  word in every game has to be reduced to a single rule.
- **家族相似 / Family resemblance**：许多概念并没有单一共享本质——只
  有交叠的相似性。拒绝强制要求"单一本质性定义"在某些情境下就是正确
  动作；不是每个游戏中的每个词都必须被还原为一条规则。

- **Game-shift detection / 游戏切换检测**: the model must mark, at
  the boundary, that a word now carries a different operative meaning;
  silently keeping the old meaning across the shift is the
  characteristic Wittgensteinian failure.
- **游戏切换检测 / Game-shift detection**：模型必须在边界处标注一个词
  现在已经在执行不同的操作性意义；沉默地把旧含义带过切换边界，正是维
  特根斯坦式的标志性失败模式。

- **No private language / 无私人语言**: a word's meaning is a public
  practice, not an inner referent. The user's situated practice has
  authority over the model's preferred abstract sense.
- **无私人语言 / No private language**：词的意义是一种公共实践，不是
  某个内部所指。用户所处的情境实践对意义的判定，比模型偏爱的抽象义
  更有权威。

### Overuse Failure Modes / 过用失控风险

- **Excessive disambiguation**: every word is split into three readings
  even when one reading is clearly operative; the disambiguation
  overhead becomes the problem.
- **过度区分**：明明一个读法明显在起作用，每个词却被拆成三种读法；区
  分的开销本身变成了问题。

- **Game-relativism dodge**: "well, it depends on which language game
  you mean" is used to avoid committing to any reading at all.
- **游戏相对主义式回避**："这要看你说的是哪个语言游戏"被用来回避任何
  实质承诺。

- **Meta-language drift**: the discussion of *which* meaning is
  operative grows long enough that the original task is forgotten.
- **元语言漂移**：关于"哪种意义在起作用"的讨论变得足够长，以至于原任
  务被忘掉。

### Handoff Conditions / 交接条件

- Hand off to **Socratic / 苏格拉底学派** once the active language
  game has been identified and a single operative definition is now
  needed inside that game.
- 一旦活跃的语言游戏被识别出来、且需要在该游戏内钉一个可操作定义时，
  交接给 **Socratic / 苏格拉底学派**。

- Hand off to **Logician / 名家** when the operative meaning is
  stable and the remaining task is checking that names track their
  referents inside that game.
- 当操作性意义已稳定、剩下的任务是检查"在该游戏内名是否对应所指"时，
  交接给 **Logician / 名家**。

- Hand off to **Legal / 法家** when the active game has been settled
  and its rules now need to be locked into a structural contract.
- 当活跃的游戏已经选定、其规则需要被锁入结构契约时，交接给
  **Legal / 法家**。

- Receive from **Socratic / 苏格拉底学派** when defining a term
  failed because the term is doing different jobs in different
  contexts; Wittgenstein then surfaces the game-shift instead of
  forcing one definition.
- 从 **Socratic / 苏格拉底学派** 接手：当"为某术语下定义"这一动作失
  败、因为该术语在不同语境里在做不同工作时；此时由维特根斯坦学派把
  "游戏切换"翻到台面上，而不是硬定一个统一定义。

---

## Classical References / 经典引文

Selected passages from Ludwig Wittgenstein. *Tractatus
Logico-Philosophicus* (1922) is in the public domain, and the standard
English reference for our purposes is the C.K. Ogden translation
(1922), available via Project Gutenberg. *Philosophical Investigations*
(1953) and the standard Anscombe English translation remain in
copyright in many jurisdictions; in keeping with this framework's
quoting policy, German lines are reproduced as canonical short
phrases per locus, and English renderings are kept short and explicitly
attributed to Anscombe's translation.

以下引文选自 Ludwig Wittgenstein。《逻辑哲学论》（1922）处于公共领
域，本框架英文采用 C.K. Ogden 公共领域译本（1922），可经 Project
Gutenberg 验证。《哲学研究》（1953）及 Anscombe 标准英译在多数司法
辖区仍处版权状态；遵循本框架引用纪律，德文标题保留每段经典的短句，
英文渲染保持简短并明确标注为 Anscombe 译。

### 语言的边界 (Tractatus / 逻辑哲学论 §5.6)

> Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.

*"The limits of my language mean the limits of my world."* (Ogden,
1922, *Tractatus* §5.6)

**AI Mapping / AI 映射**: A claim that lives only inside one
vocabulary cannot, without translation, be evaluated from outside that
vocabulary. The Wittgensteinian stance therefore demands that, before
exporting a conclusion across a domain boundary, the model first
checks whether the words used to state it carry the same operative
meaning in the destination domain.

**AI 映射**：仅仅活在一个词汇之内的断言，如果未经翻译，是无法从该词
汇之外被评估的。维特根斯坦立场因此要求：在把一个结论跨越领域边界向
外搬运之前，模型必须先检查"用来陈述它的词"在目的领域是否仍承担相同
的操作性意义。

**Control Surface / 控制面**: Cross-domain meaning portability check.
**控制面**：跨领域意义可搬运性检查。

**Failure Mode Addressed / 对应失败模式**: Conclusions ported across
domain boundaries with the words but not the meanings.
**对应失败模式**：把"词"搬过领域边界，却没把"意义"也一起搬过去。

---

### 不可说就保持沉默 (Tractatus / 逻辑哲学论 §7)

> Wovon man nicht sprechen kann, darüber muss man schweigen.

*"Whereof one cannot speak, thereof one must be silent."* (Ogden,
1922, *Tractatus* §7)

**AI Mapping / AI 映射**: When a question's vocabulary cannot be
unambiguously placed in a single language game, the early-Wittgenstein
discipline is to refuse a fluent answer rather than to manufacture
one. For an agent, this maps onto a "do not commit yet" output state
when the operative game has not been settled.

**AI 映射**：当一个问题的词汇无法被明确归入单一语言游戏时，前期维特
根斯坦的纪律是"宁可拒绝流畅回答，也不要制造一个"。对一个代理而言，
这映射到一个"在活跃游戏被定下来之前不承诺"的输出状态。

**Control Surface / 控制面**: Refusal-to-commit when the game is
unsettled.
**控制面**：游戏未定时的"不承诺"姿态。

**Failure Mode Addressed / 对应失败模式**: Confident output produced
across an unresolved language-game boundary.
**对应失败模式**：在未解决的语言游戏边界上产出的自信输出。

---

### 语言游戏 (Philosophical Investigations / 哲学研究 §7)

> Sprachspiel

*"language-game"* — Wittgenstein's term for the unit of meaning that
includes the words *and the actions into which they are woven*.
(Anscombe, 1953, *Philosophical Investigations* §7)

**AI Mapping / AI 映射**: The unit the model should track is not "the
word" but "the word-plus-the-practice-it-is-embedded-in." This makes
explicit that the same surface token can be a different rule-following
move in different domains, and the model should keep the *practice*
visible alongside the word.

**AI 映射**：模型应追踪的最小单元不是"词"，而是"词 + 它所嵌入的实
践"。这就把以下事实显式化了：同一个表层 token 在不同领域里执行的可
能是不同的"遵循规则"动作；模型应在词的旁边把**实践**一并保持可见。

**Control Surface / 控制面**: Word-plus-practice tracking.
**控制面**："词 + 实践"的合并追踪。

**Failure Mode Addressed / 对应失败模式**: Treating the surface token
as the carrier of meaning.
**对应失败模式**：把表层 token 当作意义的载体。

---

### 意义即使用 (Philosophical Investigations / 哲学研究 §43)

> Die Bedeutung eines Wortes ist sein Gebrauch in der Sprache.

*"For a large class of cases ... the meaning of a word is its use in
the language."* (Anscombe, 1953, *Philosophical Investigations* §43)

**AI Mapping / AI 映射**: The agent must read off operative meaning
from how a word is being used in the current exchange, not from a
canonical definition imported from training data. The user's situated
practice has authority over the model's preferred abstract sense.

**AI 映射**：代理必须从"在当前对话中该词如何被使用"读出操作性意义，
而不是从训练数据搬来的规范定义读出意义。用户所处的情境实践对意义的
判定，比模型偏爱的抽象义更有权威。

**Control Surface / 控制面**: Use-derived meaning extraction.
**控制面**：从使用中提取意义。

**Failure Mode Addressed / 对应失败模式**: Imposing a
training-data-canonical sense onto a domain that uses the word
differently.
**对应失败模式**：把"训练数据中的规范义"强加给一个本来在不同含义下使
用该词的领域。

---

### 家族相似 (Philosophical Investigations / 哲学研究 §66–67)

> Familienähnlichkeiten

*"family resemblances"* — Wittgenstein's name for the way concepts can
be unified by overlapping similarities rather than by a single shared
essence. (Anscombe, 1953, *Philosophical Investigations* §§66–67)

**AI Mapping / AI 映射**: Refusing to force one essential definition
is sometimes the right move. When a concept genuinely has overlapping
family resemblances rather than a single core, the Wittgensteinian
stance allows the agent to keep the multiplicity rather than to fake
unity. The Socratic move (pin one definition) is not always correct;
the choice between Socratic pinning and Wittgensteinian
multiplicity-keeping depends on whether the concept actually has a
single essence in this game.

**AI 映射**：在某些情境下，拒绝强制给出"单一本质定义"才是正确动作。
当一个概念真正以"交叠的家族相似性"而非"单一核心"被统合时，维特根斯
坦立场允许代理保留这种多义性，而不是伪造统一。苏格拉底动作（钉一个
定义）并不总是对的；要在"苏格拉底式钉定义"与"维特根斯坦式保留多义"
之间作出选择，取决于该概念在此游戏中是否真的具备单一本质。

**Control Surface / 控制面**: Discipline of when *not* to demand a
single definition.
**控制面**："何时**不应**强求单一定义"的纪律。

**Failure Mode Addressed / 对应失败模式**: Forcing essentialism onto
a family-resemblance concept.
**对应失败模式**：把"家族相似型概念"硬塞进本质主义模板。

---

## Bibliography / 参考书目

### Core Texts / 核心原典

| Text / 文本 | Year / 年份 | Why It Matters / 关键关联 |
|---|---|---|
| *Tractatus Logico-Philosophicus* | 1922 | 语言边界与"不可说则沉默"的早期纪律 / Language-limit and the early "be silent" discipline |
| *Philosophical Investigations* | 1953 | 语言游戏、意义即使用、家族相似 / Language-game, meaning-as-use, family resemblance |
| *Philosophical Grammar* (posthumous) | 1969 | 把"意义即使用"展开为系统性方法 / The systematic working-out of meaning-as-use |
| *On Certainty* (posthumous) | 1969 | "确定"如何嵌在生活形式中、而非孤立证明 / How "certainty" is embedded in forms of life rather than isolated proof |

### Commentaries and Translations / 注疏与译本

- **C.K. Ogden, *Tractatus Logico-Philosophicus* (1922).** Public-domain
  English translation of the German original; the citation backbone
  for *Tractatus* passages above.
- **C.K. Ogden，《逻辑哲学论》英译（1922）**：德文原典的公共领域英译
  本；上文 *Tractatus* 引文以此为引用脊梁。

- **G.E.M. Anscombe, *Philosophical Investigations* (1953).** The
  standard English translation; in copyright in many jurisdictions, so
  passages above are kept short and explicitly attributed.
- **G.E.M. Anscombe，《哲学研究》英译（1953）**：标准英译本；在多数
  司法辖区仍处版权状态，故上文段落保持简短并显式标注。

- **P.M.S. Hacker and Gordon Baker, *Wittgenstein: Understanding and
  Meaning* (1980).** The leading scholarly commentary on the
  *Investigations*; useful when you want method-level reading rather
  than aphorism-collection.
- **P.M.S. Hacker 与 Gordon Baker，《维特根斯坦：理解与意义》
  （1980）**：关于《哲学研究》的主流学术注疏；当你希望进入"方法层"
  而非"格言集"阅读时，此为良好底本。

### Modern Applications / 现代应用

- **Domain-driven design (Eric Evans, 2003).** A direct contemporary
  operationalization of language-games-as-bounded-contexts: the same
  term ("Account," "Order") legitimately means different things in
  different bounded contexts and must not be silently merged.
- **领域驱动设计**（Eric Evans, 2003）：是"语言游戏即限界上下文
  （bounded context）"的直接当代操作化——同一个术语（如 "Account"、
  "Order"）在不同限界上下文中合法地意味着不同的东西，不可被沉默地合
  并。

- **Glossary-driven RFC and contract drafting practice.** The
  practice of fronting a glossary that ties each term to a specific
  game inside the document is a working Wittgensteinian discipline.
- **以术语表前置驱动的 RFC 与合同起草实践**：把"为每个术语在文档内
  绑定一个具体游戏"做成开篇术语表，是一种工作意义上的维特根斯坦纪律。

### Suggested Reading Order / 建议阅读顺序

1. Read *Tractatus* §§5.6 and 7 for the early discipline: the limit
   of language and the refusal-to-commit move.
2. Read *Philosophical Investigations* §§1–24 for language-games and
   forms of life.
3. Read §§43, 65–71 for meaning-as-use and family resemblance.
4. Use Hacker & Baker when you want method-level commentary; use
   *Domain-Driven Design* when you want the engineering operationalization.

1. 先读《逻辑哲学论》§§5.6 与 §7，掌握前期纪律——语言的边界与"不承
   诺"动作。
2. 再读《哲学研究》§§1–24，理解语言游戏与生活形式。
3. 接着读 §§43、65–71，理解"意义即使用"与"家族相似"。
4. 当你需要方法层注疏时读 Hacker & Baker；当你要工程操作化时读
   《领域驱动设计》。

---

## Parameter Controls / 参数控制

### Typical Use / 典型用法

- `--game-shift-tag`: at every domain or context boundary, mark
  whether each operative term has shifted game / 在每个领域或语境边
  界，标注每个操作性术语是否切换了游戏
- `--allow-family-resemblance`: permit a concept to keep a
  multiplicity of overlapping uses where forcing one definition would
  falsify the practice / 允许某概念保留交叠的多义使用——当强制单一定
  义将扭曲实践时
- `--require-glossary`: front a glossary that pins each load-bearing
  term to a specific language game inside this task / 在任务内开篇
  挂出术语表，把每个承重术语绑定到一个具体的语言游戏

### Trigger Conditions / 触发条件

- The same word is doing different jobs in different parts of the
  prompt / 同一词在提示词不同部分承担不同工作
- A cross-team RFC, contract, or specification spanning multiple
  domains / 跨团队 RFC、合同或跨多领域的规约
- A Socratic definition attempt failed because the term keeps
  re-shifting / 苏格拉底式定义尝试失败——术语持续再切换
- "Best practice" advice imported from one domain into a different
  one without translation / 把一个领域的"最佳实践"建议未经翻译就搬到
  另一个领域

### Anti-Patterns / 反模式

- Do not invoke Wittgenstein mode to dodge commitment; "it depends on
  the game" must be followed by *which game and on what evidence*.
- 不要用维特根斯坦模式回避承诺；"这要看是哪个游戏"后面必须跟着"是哪
  个游戏，以及凭什么证据"。

- Do not split every word into multiple readings; only words actually
  doing different jobs across the task earn disambiguation.
- 不要把每个词都拆成多种读法；只有那些在任务里真的做不同工作的词，
  才值得被显式区分。

- Do not stack Wittgenstein on top of Mohist in the same step;
  game-shift annotation inflates length while compression strips it,
  and the two will fight.
- 不要在同一步骤里把维特根斯坦叠在墨家之上；游戏切换标注会拉长输
  出，压缩会把它压掉，两者会打架。

---

## Session Template / 会话模板

```text
### Wittgenstein Session Notes / 维特根斯坦会话记录

Task Context / 任务背景:
Load-Bearing Terms / 承重术语:
Active Language Games (per term) / 各术语的活跃语言游戏:
Game-Shift Detected? / 是否检测到游戏切换:
Family-Resemblance Term (kept multi) / 家族相似术语 (保留多义):
Glossary Pinned / 已挂术语表:
Outcome / 结果:
```
