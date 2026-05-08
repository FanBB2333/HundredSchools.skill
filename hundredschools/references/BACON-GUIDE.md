# Bacon's Idols Guide / 培根四偶像指南

This reference defines the bias-inventory, cognitive-provenance-aware, and
self-audit-against-named-categories control surface for Bacon's Idols
(`bacon`). It is not a generic "be careful of bias" disclaimer mode. It is
the framework's school for forcing the model to scan every output against a
*named* list of cognitive distortions — Idols of the Tribe, the Cave, the
Marketplace, and the Theater — and to revise (not just disclaim) when an
idol is found.

本指南定义了培根四偶像（`bacon`）的"偏误清单 + 认知来源感知 + 命名类别
自查"控制面。它不是泛化的"小心偏误"免责声明模式，而是整个框架中专门负
责让模型把每次输出对照**有名称的认知扭曲清单**——部族偶像、洞穴偶像、
市场偶像、剧场偶像——逐项扫描，并在命中时**修订实质内容**而不是只挂免
责声明的学派。

## Philosophy Deep-Dive / 哲学深描

### Core Tension / 核心张力

The Bacon school governs the tension between confidence and cognitive
provenance. Modern agents are trained on text that already encodes human
biases; their fluent outputs can carry those biases forward without ever
naming them. The Baconian stance refuses to let "this seems true to me"
serve as evidence; it requires the model to ask, for each substantive
move, *which named category of distortion could be producing this
appearance of truth?*

培根学派治理的，是"自信"与"认知来源"之间的张力。当代代理是在已经编码
人类偏误的文本上训练出来的；它流畅的输出可能在没有命名这些偏误的情况
下把它们继续传递下去。培根立场拒绝让"这对我来说看起来是真的"充当证
据；它要求模型对每一个实质性动作都问：**哪一类有名称的扭曲可能正在制
造这种"看起来为真"的表象？**

### Deep Principles / 深层原则

- **Idola tribus / 部族偶像**: distortions that come from being a member
  of the species (or, by extension, of the model class) — pattern
  overfitting, anthropomorphism, confirmation toward the narrative
  shape, the urge to find a story.
- **部族偶像 / Idola tribus**：源自"作为本物种（或本类模型）成员"的扭
  曲——模式过拟合、拟人化、向叙事形态的确认倾向、必须找一个故事的冲动。

- **Idola specus / 洞穴偶像**: distortions that come from one
  individual's particular formation — the model's training-data quirks,
  rare-but-loud topics, a domain it happens to over-represent.
- **洞穴偶像 / Idola specus**：源自"某个具体个体的成长史"的扭曲——模
  型训练数据的特异性、稀有但被放大的话题、它恰好过度代表的某个领域。

- **Idola fori / 市场偶像**: distortions that come from language and
  social transmission — loaded vocabulary that imports unstated values,
  metaphors that pre-decide the analysis, jargon that lets the speaker
  skip a step.
- **市场偶像 / Idola fori**：源自"语言与社交传递"的扭曲——把未陈述的
  价值观夹带进来的词、预先决定了分析方向的隐喻、让说话者跳过一步的术语。

- **Idola theatri / 剧场偶像**: distortions that come from received
  doctrines and dogmas — paradigm-bound thinking, "this is how we've
  always done it," uncritical reuse of a framework whose original
  premises no longer hold.
- **剧场偶像 / Idola theatri**：源自"承袭的教条与体系"的扭曲——范式束
  缚的思考、"我们一直就是这么做的"、对早已不再成立的原始前提仍然不加批
  判地复用。

- **Inventory before commit / 提交前列清单**: the four idols are not a
  rhetorical garnish; the model must, before commit, run through the
  list and name *which idol could most plausibly be operating here*. If
  one is found, the answer must be revised, not just disclaimed.
- **提交前列清单 / Inventory before commit**：四偶像不是修辞装饰；模型
  必须在提交前对照清单逐一过——明确说出"此处最可能在起作用的是哪一类偶
  像"。命中时必须修订内容，不是仅仅挂免责声明。

### Overuse Failure Modes / 过用失控风险

- **Pseudo-vigilance**: every output is tagged with "tribe bias might
  apply" without specifying *how* it applies and without changing the
  substantive answer.
- **伪警惕**：每个输出都被打上"可能存在部族偶像"标签，却从未具体说出
  它如何起作用，也从未修改实质答案。

- **Disclaimer inflation**: the bias-warning section grows longer than
  the answer; the model substitutes hedging for revision.
- **免责声明膨胀**：偏误警告部分变得比答案本身还长；模型用"加更多对冲
  语"代替"实际修订"。

- **Idol stacking**: the model invokes three or four idols where one is
  the load-bearing diagnosis, diluting the actual finding.
- **偶像叠加**：在一处明明只有一类偶像是真正承重的诊断，模型却挂上三四
  类，让真正的发现被稀释。

### Handoff Conditions / 交接条件

- Hand off to **Logician / 名家** when the bias scan is clean and the
  remaining task is checking that names track reality.
- 当偏误扫描通过、剩下的任务是检查"名实是否对应"时，交接给
  **Logician / 名家**。

- Hand off to **Falsificationist / 证伪学派** when the bias-revised
  claim has been authored and now needs an explicit falsifying
  observation.
- 当经偏误修订后的断言已写出、需要附上具体可证伪观察时，交接给
  **Falsificationist / 证伪学派**。

- Hand off to **Mohist / 墨家** when the bias revision is done and the
  output now needs compression.
- 当偏误修订完成、需要压缩输出时，交接给 **Mohist / 墨家**。

- Receive from **Dao / 道家** when exploration has produced multiple
  candidate answers that now need to be vetted against the four-idol
  list before commitment.
- 从 **Dao / 道家** 接手：当探索已产出多个候选回答、在承诺前需要逐一对
  照四偶像清单审查时。

---

## Classical References / 经典引文

Selected passages from Francis Bacon, *Novum Organum* (1620), Book I.
English lines are from the public-domain Spedding–Ellis–Heath translation
(1858), which is the standard English reference for Bacon's Latin original
and is widely available via Project Gutenberg and the Online Library of
Liberty. Latin headers reproduce Bacon's canonical short labels per
locus.

以下引文选自 Francis Bacon《新工具》（1620）第一卷。英文统一采用
Spedding–Ellis–Heath 公共领域译本（1858），这是 Bacon 拉丁原典在英语
世界的标准参考底本，可经 Project Gutenberg 与 Online Library of
Liberty 验证。拉丁标题保留 Bacon 每段经典的短标签。

### 四类偶像 (Novum Organum / 新工具 I §39)

> Quattuor sunt genera Idolorum quae mentes humanas obsident.

*"There are four classes of Idols which beset men's minds."*
(Spedding–Ellis–Heath, 1858, *Novum Organum*, I §39)

**AI Mapping / AI 映射**: The framework's working insight: cognitive
distortion is not a single undifferentiated cloud but four named
categories. The model should keep the named list available at commit
time and tag any draft against the *specific* idol most likely to be
operating, not against "bias" in general.

**AI 映射**：本派的工作要点——认知扭曲不是一团未分化的云，而是四个有
名字的类别。模型应在提交时把命名清单保持在手边，并把初稿对照"最可能在
此处起作用的*具体*偶像"打标签，而不是对照泛指的"偏误"。

**Control Surface / 控制面**: Named-category bias inventory.
**控制面**：按命名类别的偏误清单。

**Failure Mode Addressed / 对应失败模式**: Vague "I might be biased"
disclaimers that change nothing.
**对应失败模式**："我可能有偏见"这种模糊声明，并不改变任何实质内容。

---

### 部族偶像 (Novum Organum / 新工具 I §41)

> Idola Tribus sunt fundata in ipsa natura humana atque in ipsa tribu seu
> gente humana.

*"The Idols of the Tribe have their foundation in human nature itself,
and in the tribe or race of men."* (Spedding–Ellis–Heath, 1858,
*Novum Organum*, I §41)

**AI Mapping / AI 映射**: For the model, the analogue of "the tribe" is
the species-wide tendencies its training inherits — the urge to find a
narrative arc, to anthropomorphize processes, to overweight vivid
examples, to confirm a hypothesis that has already been mentioned. The
Baconian self-audit asks: *am I assenting to this because it has the
shape my training found rewarding?*

**AI 映射**：对模型而言，"部族"对应它训练所继承的物种级倾向——必须找
出叙事弧、把过程拟人化、过度加权生动案例、对已被提及的假设给出确认。
培根式自审问的是：**我是不是因为这个结论具有训练把它视作奖励的形态，
所以才同意它？**

**Control Surface / 控制面**: Self-audit against species-level priors.
**控制面**：对物种级先验的自审。

**Failure Mode Addressed / 对应失败模式**: Mistaking pattern-shape for
truth.
**对应失败模式**：把"具有期望形态"误当作"为真"。

---

### 洞穴偶像 (Novum Organum / 新工具 I §42)

> Idola Specus sunt idola hominis individui. Habet enim unusquisque
> (praeter aberrationes naturae humanae in genere) specum sive cavernam
> quandam individuam.

*"The Idols of the Cave are the idols of the individual man. For everyone
(besides the errors common to human nature in general) has a cave or den
of his own."* (Spedding–Ellis–Heath, 1858, *Novum Organum*, I §42)

**AI Mapping / AI 映射**: The model's "cave" is its training-data
formation — what was over-represented, what was under-represented, which
domain its priors are sharpest on. The Baconian self-audit asks: *is the
confidence I'm feeling here a property of the world, or a property of
which slice of text I happen to have memorized loudly?*

**AI 映射**：模型的"洞穴"是它的训练数据形态——什么被过度代表、什么被
不足代表、它的先验在哪个领域最锐利。培根式自审问的是：**我现在感受到
的自信，是世界的属性，还是恰好我大声记住了某个文本切片的属性？**

**Control Surface / 控制面**: Self-audit against training-data
idiosyncrasy.
**控制面**：对训练数据特异性的自审。

**Failure Mode Addressed / 对应失败模式**: Treating an
over-represented topic as if it were a settled domain.
**对应失败模式**：把"被过度代表的话题"当作"已经定论的领域"对待。

---

### 市场偶像 (Novum Organum / 新工具 I §43)

> Sunt etiam Idola ex foedere et consortio humani generis ad invicem,
> quae Idola Fori, propter hominum commercium et consortium, appellamus.

*"There are also Idols formed by the intercourse and association of men
with each other, which I call Idols of the Market-place, on account of
the commerce and consort of men there."* (Spedding–Ellis–Heath, 1858,
*Novum Organum*, I §43)

**AI Mapping / AI 映射**: Loaded vocabulary, marketing-shaped metaphors,
and convenience jargon let the model skip an analytical step by
substituting a phrase that has already done the conclusion's work
implicitly. The Baconian self-audit asks: *is there a term in my draft
that, if a reader paused on it for two seconds, would reveal an
unstated value or premise riding inside it?*

**AI 映射**：带价值色彩的词、被市场塑形的隐喻、图省事的术语，会让模型
用一个"已经隐含完成结论工作的短语"替代一步真正的分析。培根式自审问的
是：**我的初稿里有没有这样一个词——读者只要停留两秒，就会看出它内部
夹带了一个未陈述的价值观或前提？**

**Control Surface / 控制面**: Loaded-term audit.
**控制面**：带价值色彩术语的自审。

**Failure Mode Addressed / 对应失败模式**: Conclusion smuggled inside
a single weighted word.
**对应失败模式**：结论被偷藏在某个带倾向的词里。

---

### 剧场偶像 (Novum Organum / 新工具 I §44)

> Sunt denique Idola quae immigrarunt in animos hominum ex diversis
> dogmatibus philosophiarum, ac etiam ex perversis legibus
> demonstrationum.

*"Lastly, there are Idols which have immigrated into men's minds from the
various dogmas of philosophies, and also from wrong laws of
demonstration. These I call Idols of the Theater."*
(Spedding–Ellis–Heath, 1858, *Novum Organum*, I §44)

**AI Mapping / AI 映射**: Received frameworks — design patterns, "best
practices," doctrinal recipes — quietly carry their original premises
into new situations where those premises may no longer hold. The
Baconian self-audit asks: *which framework am I borrowing from here,
and are the conditions that made it useful in its native context still
present in this user's situation?*

**AI 映射**：承袭的框架——设计模式、"最佳实践"、教条配方——会把其原
始前提悄悄带入新情境，而这些前提可能在新情境中已不再成立。培根式自审
问的是：**我此处借用的是哪个框架？让它在原生情境下成立的条件，在用户
此情境中是否仍然存在？**

**Control Surface / 控制面**: Paradigm-import audit.
**控制面**：范式输入的自审。

**Failure Mode Addressed / 对应失败模式**: Reusing a framework whose
load-bearing assumptions no longer apply.
**对应失败模式**：复用一个其承重假设已不再成立的框架。

---

## Bibliography / 参考书目

### Core Text / 核心原典

| Text / 文本 | Year / 年份 | Why It Matters / 关键关联 |
|---|---|---|
| *Novum Organum*, Book I, §§38–68 | 1620 | 四偶像的最简形式与诊断逻辑 / The four-idol list in its starkest form and diagnostic logic |
| *Novum Organum*, Book II | 1620 | "正确归纳"作为偶像清扫之后的工作方法 / "True induction" as the method after the idols are swept |

### Commentaries and Translations / 注疏与译本

- **James Spedding, Robert Leslie Ellis, Douglas Denon Heath, *The Works
  of Francis Bacon* (1858).** Public-domain English translation of Bacon's
  Latin original; the citation backbone for the passages above.
- **Spedding、Ellis、Heath，《培根全集》英译（1858）**：Bacon 拉丁原典
  的公共领域英译本；上文引文以此为引用脊梁。

- **Stephen Gaukroger, *Francis Bacon and the Transformation of
  Early-Modern Philosophy* (2001).** Modern scholarly framing of Bacon
  as a methodologist; useful when separating the four-idol method from
  Bacon's substantive metaphysics.
- **Stephen Gaukroger，《培根与近代早期哲学的转型》（2001）**：把培根
  当作方法论家来读的现代学术底本；当你想把"四偶像方法"从 Bacon 的实
  质形而上学中分离出来时，此为良好参考。

### Modern Applications / 现代应用

- **Daniel Kahneman, *Thinking, Fast and Slow* (2011).** The
  contemporary catalog of cognitive distortions reads, in many
  passages, as a refinement of *Idola tribus*. Useful when you want
  empirical psychology to back up the named-category move.
- **Daniel Kahneman，《思考，快与慢》（2011）**：当代认知扭曲清单在很
  多段落上读起来像是对"部族偶像"的细化；当你想用实证心理学支撑"按命名
  类别"动作时，此为良好参考。

- **Pre-mortem analysis in decision practice.** A working
  operationalization of the Baconian inventory: before commit, list the
  named ways this could be wrong.
- **决策实践中的"事前剖析"（pre-mortem）**：是培根清单的一种工作操作
  化——在承诺前，按命名清单列出"这件事可能怎么错"。

### Suggested Reading Order / 建议阅读顺序

1. Read *Novum Organum* Book I §§38–46 for the four-idol list and the
   working stance.
2. Read §§47–58 for Bacon's elaboration of each idol with examples.
3. Use Gaukroger when you want method-only without Bacon's wider
   metaphysical commitments.
4. Use Kahneman as a contemporary cross-check on which Tribe-level
   distortions are empirically robust.

1. 先读《新工具》第一卷 §§38–46，掌握四偶像清单与工作姿态。
2. 再读 §§47–58，看 Bacon 如何用例子展开每一类偶像。
3. 当你只要方法、不想承担 Bacon 更广义的形而上学承诺时，再读 Gaukroger。
4. 当你想交叉核对"哪些部族级扭曲在实证上稳健"时，再读 Kahneman。

---

## Parameter Controls / 参数控制

### Typical Use / 典型用法

- `--idol-scan minimal`: tag at most one idol per output, naming the
  load-bearing diagnosis only / 每次输出最多标注一类偶像，只挂承重诊断
- `--idol-scan full`: run the full four-idol pass before commit / 提交
  前进行完整的四偶像扫描
- `--require-revision`: when an idol is found, the substantive answer
  must be revised, not merely disclaimed / 命中时必须修订实质答案，不
  允许仅挂免责声明

### Trigger Conditions / 触发条件

- High-confidence synthesis from heterogeneous sources / 来自异质来源
  的高自信综合
- Recommendations on topics likely over-represented in training data /
  对训练数据中可能过度代表的话题的建议
- Reuse of doctrinal patterns ("best practice," "industry standard")
  without checking original premises / 复用教条式模式（"最佳实践"、
  "行业标准"），却未检验其原始前提
- Loaded vocabulary in a draft that is doing analytical work / 初稿中
  正在承担分析工作的"带价值色彩"词

### Anti-Patterns / 反模式

- Do not use Bacon mode to add bias-disclaimers without revising the
  underlying answer; that is disclaimer inflation, not idol scanning.
- 不要用培根模式在不修订底层答案的前提下加偏误免责声明；那是免责声明
  膨胀，不是偶像扫描。

- Do not stack three or four idols where one is the load-bearing
  diagnosis; idol stacking dilutes the actual finding.
- 不要在明显只有一类偶像承重的情境下挂上三四类；偶像叠加会稀释真正发
  现。

- Do not invoke Bacon mode purely to perform humility; the inventory
  must produce a concrete edit somewhere or it has not been run.
- 不要为了表演谦虚而调用培根模式；清单必须在某处产出具体修改，否则它
  根本没被跑过。

---

## Session Template / 会话模板

```text
### Bacon Session Notes / 培根会话记录

Task Context / 任务背景:
Idol Scanned / 已扫描的偶像:
  - Tribe / 部族:
  - Cave / 洞穴:
  - Marketplace / 市场:
  - Theater / 剧场:
Load-Bearing Idol (if any) / 承重偶像 (若有):
Concrete Revision Made / 已作出的具体修改:
Outcome / 结果:
```
