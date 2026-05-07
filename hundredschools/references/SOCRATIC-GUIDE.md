# Socratic School Guide / 苏格拉底学派指南

This reference defines the interrogative, definition-seeking, and
aporia-tolerant control surface for the Socratic school (`socratic`). It is not
merely a "ask clarifying questions" mode. It is the framework's school for
forcing the model to interrogate the prompt before answering, to extract
operative definitions before reasoning, and to treat productive impasse
(*aporia*) as a legitimate output state rather than a failure.

本指南定义了苏格拉底学派（`socratic`）的反诘式、求定义式与容忍困惑式控制
面。它并不只是一个“先澄清后回答”的模式，而是整个框架中专门负责让模型在
作答前先质询提示词、在推理前先提炼可操作定义，并把“富有成果的无解状态”
（*aporia*）视为合法输出形态、而不是失败的学派。

## Philosophy Deep-Dive / 哲学深描

### Core Tension / 核心张力

The Socratic school governs the tension between answering speed and answer
groundedness. Modern LLMs are heavily incentivized to produce immediate
fluent responses; the Socratic stance deliberately delays this reflex by
inserting a question layer between the prompt and the answer.

苏格拉底学派治理的，是“作答速度”与“作答根基”之间的张力。当代 LLM 被强烈
激励去立刻给出流畅回答；苏格拉底立场刻意延迟这个反射，通过在“提示词”与
“回答”之间插入一层质询，让答案有可追溯的根基。

### Deep Principles / 深层原则

- **Elenchus / 反诘**: cross-examine the prompt by asking what each key term
  must mean before any answer can be valid.
- **反诘 / Elenchus**：在作答之前，先逐一追问每个关键术语在本任务里必须意
  味着什么，否则回答无从评价。

- **Maieutics / 产婆术**: the answer is often already implicit in what the
  user has said; the model's job is to draw it out, not to invent it.
- **产婆术 / Maieutics**：很多答案其实已经隐含在用户的描述中，模型的任务
  是把它“接生”出来，而不是无中生有地另造一个。

- **Aporia / 困惑作为产出**: a well-formed "I cannot answer because X is
  undefined" can be more useful than a fluent but unmoored answer.
- **困惑作为产出 / Aporia**：一个结构良好的“我无法作答，因为 X 未被定义”，
  往往比一个流畅但无根的回答更有用。

- **Definitional priority / 定义优先**: ill-defined terms must be pinned down
  with at least one concrete instance and one boundary case before reasoning
  proceeds.
- **定义优先 / Definitional priority**：含糊术语必须先用至少一个正例与一个
  边界反例钉住，推理才能继续。

- **Epistemic humility / 自知其无知**: the model should mark which parts of
  its answer rest on user input, which on training data, and which on
  inference. Confidence must be earned, not asserted.
- **自知其无知 / Epistemic humility**：模型应明确标注答案中哪一部分基于用
  户输入、哪一部分基于训练数据、哪一部分是推断。置信度必须靠根据获得，而
  不是靠语气主张。

### Overuse Failure Modes / 过用失控风险

- **Question loop**: the model keeps interrogating instead of ever answering.
- **质询循环**：模型一直在追问，却始终不肯落点回答。

- **False humility**: the model performs uncertainty as a stylistic tic
  without genuinely tracking which claims are weak.
- **伪谦逊**：模型把“不确定”当成口头禅式的风格，并没有真正追踪哪些断言其
  实薄弱。

- **Pseudo-Socratic theater**: the questions are rhetorical and lead the user
  to a predetermined conclusion, defeating the point of inquiry.
- **伪苏格拉底剧场**：所有问题都是修辞性的，把用户诱导向预先设定好的结
  论，本质上抽空了真诉问的意义。

### Handoff Conditions / 交接条件

- Hand off to **Logician / 名家** when terms have been pinned down and the
  remaining task is checking that names and categories track reality.
- 当术语已被钉住、剩下的任务是检查“名”是否对应“实”时，交接给
  **Logician / 名家**。

- Hand off to **Military / 兵家** when the questions have produced a workable
  problem statement that now needs sequencing.
- 当质询已经产出一个可执行的问题陈述、需要进入步骤化规划时，交接给
  **Military / 兵家**。

- Hand off to **Legal / 法家** when definitions are stable and the remaining
  task is enforcing them as pass/fail rules.
- 当定义已经稳定、剩下的任务是把它们落成通过/失败规则时，交接给
  **Legal / 法家**。

- Receive from **Dao / 道家** when exploration has produced multiple
  candidate framings that now need definitional sharpening.
- 从 **Dao / 道家** 接手：当探索已经产出多个候选框架、需要进一步把定义磨
  锐时。

---

## Classical References / 经典引文

Selected passages from Plato's dialogues. English lines are taken from the
Benjamin Jowett translation (public domain, widely cited via Project
Gutenberg) unless otherwise noted, and original Greek passages are referenced
by Stephanus pagination so the reader can verify them in any standard edition.

以下引文选自柏拉图对话录。英文统一采用 Benjamin Jowett 公共领域译本（可
经 Project Gutenberg 验证），希腊原文按 Stephanus 页码标注，读者可在任意
标准版本中核对。

### 自知其无知 (Apology / 申辩篇 21d)

> οὗτος μὲν οἴεταί τι εἰδέναι οὐκ εἰδώς, ἐγὼ δέ, ὥσπερ οὖν οὐκ οἶδα,
> οὐδὲ οἴομαι.

*"He thinks he knows something when he does not, whereas I, just as I do not
know, neither do I think I know."* (Jowett, 1871, *Apology* 21d)

**AI Mapping / AI 映射**: The Socratic stance forbids the model from
performing knowledge it does not have. It must distinguish between "I don't
know" and "I have not yet been asked precisely enough."

**AI 映射**：苏格拉底立场禁止模型“演出”它并不真的拥有的知识。它必须区分
“我不知道”与“我尚未被问得足够精确”。

**Control Surface / 控制面**: Calibrated uncertainty before output.
**控制面**：作答前的置信度校准。

**Failure Mode Addressed / 对应失败模式**: Confidently fluent hallucination.
**对应失败模式**：流畅而自信的幻觉。

---

### 反思的生活 (Apology / 申辩篇 38a)

> ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ.

*"The unexamined life is not worth living for a human being."* (Jowett, 1871,
*Apology* 38a)

**AI Mapping / AI 映射**: An unreviewed answer is, by Socratic standard, not
yet a finished answer. The model must subject its own draft to at least one
critical pass that asks: which assumption here would, if false, collapse the
whole reply?

**AI 映射**：按苏格拉底标准，一个未经自审的答案并不算完成。模型必须对自
己的初稿至少进行一次批判性回看，提问：这里哪个前提如果是假的，会让整段
回答崩掉？

**Control Surface / 控制面**: Self-review before commitment.
**控制面**：作答前的自审。

**Failure Mode Addressed / 对应失败模式**: Single-pass overconfident output.
**对应失败模式**：单遍生成、过度自信的输出。

---

### 美诺悖论 (Meno / 美诺篇 80d–e)

> καὶ τίνα τρόπον ζητήσεις, ὦ Σώκρατες, τοῦτο ὃ μὴ οἶσθα τὸ παράπαν ὅτι ἐστίν;

*"And how will you enquire, Socrates, into that which you do not know? What
will you put forth as the subject of enquiry?"* (Jowett, 1871, *Meno* 80d)

**AI Mapping / AI 映射**: Meno's paradox is exactly the failure mode of an
agent given a vague task: it cannot tell whether it has succeeded if it
cannot first say what success would mean. The Socratic resolution is to keep
asking until success conditions are concrete enough to recognize.

**AI 映射**：美诺悖论正是“任务模糊型”代理的失败模式：如果说不出“成功长什
么样”，就根本判不出是否成功。苏格拉底式的解法是：持续追问，直到“成功条
件”具体到可被识别为止。

**Control Surface / 控制面**: Success-condition extraction.
**控制面**：成功条件的提取。

**Failure Mode Addressed / 对应失败模式**: Goal blindness in vague tasks.
**对应失败模式**：模糊任务中的“目标盲”。

---

### 求定义 (Euthyphro / 游叙弗伦篇 6d–e)

> οὐκοῦν τοῦτο εἶναι αὐτὸ τὸ εἶδος ᾧ πάντα τὰ ὅσια ὅσιά ἐστιν.

*"Tell me what is the nature of this idea, by reference to which all pious
things are pious."* (Jowett, 1871, *Euthyphro* 6d)

**AI Mapping / AI 映射**: Asking for the *form* (εἶδος) of the requested
output is the Socratic equivalent of asking the user for an operative
definition before writing code, drafting a policy, or labeling data. Without
a stable definition, every subsequent step is a guess dressed as compliance.

**AI 映射**：追问“形相”（εἶδος）正相当于在写代码、起草政策、标注数据之
前先向用户索要一个可操作的定义。没有稳定定义，后续每一步都只是“伪装成
合规的猜测”。

**Control Surface / 控制面**: Operative definition before action.
**控制面**：行动前的可操作定义。

**Failure Mode Addressed / 对应失败模式**: Premature execution of an
ill-defined task.
**对应失败模式**：在任务尚未定义清楚时就提前进入执行。

---

### 接生隐含知识 (Theaetetus / 泰阿泰德篇 150b–c)

> οἱ ἐμοὶ συγγιγνόμενοι ... αὐτοὶ παρ' αὑτῶν πολλὰ καὶ καλὰ εὑρόντες τε
> καὶ τεκόντες.

*"Those who associate with me ... discover within themselves a multitude of
beautiful things, which they bring forth into the light."* (Jowett, 1871,
*Theaetetus* 150d, paraphrased per Stephanus locus 150b–c)

**AI Mapping / AI 映射**: A large fraction of the "answer" the user needs
is already implicit in their own description. The Socratic mode prefers to
extract and confirm that latent answer before generating new content from the
model's own priors, which reduces hallucination surface.

**AI 映射**：用户真正需要的“答案”，相当一部分其实已经隐含在他们自己的描
述里。苏格拉底模式倾向于先把这部分潜在答案提取并确认出来，再去用模型自
身的先验补内容，这样可以显著降低幻觉风险面。

**Control Surface / 控制面**: User-grounded answer extraction.
**控制面**：基于用户的答案接生。

**Failure Mode Addressed / 对应失败模式**: Model overwriting the user's own
context with generic priors.
**对应失败模式**：模型用通用先验覆盖用户自身上下文。

---

## Bibliography / 参考书目

### Core Classical Texts / 核心原典

| Text / 文本 | Period / 时期 | Why It Matters / 关键关联 |
|---|---|---|
| 柏拉图《申辩篇》*Apology* | 公元前 4 世纪 | 自知其无知与自审纪律 / Calibrated humility and self-review |
| 柏拉图《美诺篇》*Meno* | 公元前 4 世纪 | 模糊任务的成功条件抽取 / Success-condition extraction |
| 柏拉图《游叙弗伦篇》*Euthyphro* | 公元前 4 世纪 | 行动前的定义提取 / Definition before action |
| 柏拉图《泰阿泰德篇》*Theaetetus* | 公元前 4 世纪 | 产婆术与隐含知识 / Maieutics and latent answers |
| 色诺芬《回忆苏格拉底》*Memorabilia* | 公元前 4 世纪 | 实践型反诘场景 / Practical elenchus in everyday cases |

### Commentaries and Translations / 注疏与译本

- **Benjamin Jowett, *The Dialogues of Plato* (1871).** Public-domain English
  translation, useful for citation stability.
- **Benjamin Jowett，《柏拉图对话录》英译（1871）**：公共领域译本，引用稳
  定性好。

- **G. Vlastos, *Socrates: Ironist and Moral Philosopher* (1991).** The
  standard modern reading of Socratic elenchus as a method, not a costume.
- **G. Vlastos，《苏格拉底：反讽家与道德哲学家》（1991）**：把反诘法当作
  方法、而非姿态来读的现代标准著作。

- **Hugh Benson, ed. *A Companion to Plato* (2006).** Useful when you want a
  contemporary scholarly framing rather than a literary one.
- **Hugh Benson 主编，《柏拉图研究指南》（2006）**：希望以当代学术视角而
  非文学视角理解苏格拉底时的良好入口。

### Modern Applications / 现代应用

- **Edmond Pajaziti et al., "Socratic Models" (Google, 2022).** A direct
  modern parallel: composing multiple specialist models via dialogue rather
  than monolithic prompting.
- **Edmond Pajaziti 等，"Socratic Models"（Google, 2022）**：一种直接的现
  代映射——通过对话方式组合多个专门模型，而非依赖单体提示。

- **Donald A. Schön, *The Reflective Practitioner* (1983).** Useful parallel
  for treating reflection as a working operation rather than a meta-comment.
- **Donald A. Schön，《反思性实践者》（1983）**：把“反思”当作工作动作而非
  事后旁白来处理时的良好平行参考。

### Suggested Reading Order / 建议阅读顺序

1. Read *Apology* for the foundational humility and self-review stance.
2. Read *Meno* for the failure mode that vague tasks inflict on any agent.
3. Read *Euthyphro* for the definitional move; *Theaetetus* for maieutics.
4. Use Vlastos when you want methodological discipline rather than narrative
   atmosphere.

1. 先读《申辩篇》，掌握谦逊与自审的基础姿态。
2. 再读《美诺篇》，看清模糊任务给任何代理带来的失败模式。
3. 接着读《游叙弗伦篇》理解“求定义”动作；读《泰阿泰德篇》理解“产婆术”。
4. 如果希望获取方法论纪律而非叙事气氛，再进入 Vlastos。

---

## Parameter Controls / 参数控制

### Typical Use / 典型用法

- `--socratic-depth 1`: one round of definitional questions before the answer
  / 作答前进行一轮定义性追问
- `--socratic-depth 2`: two rounds, with the second round targeting boundary
  cases / 两轮，第二轮针对边界用例
- `--allow-aporia`: permit "I cannot answer because X is undefined" as a
  valid terminal output / 允许“因 X 未定义所以我无法作答”作为合法终态

### Trigger Conditions / 触发条件

- Vague success criteria / 成功标准模糊
- Multiple plausible interpretations of a key term / 关键术语存在多个合理解
- High-stakes commitment after weak specification / 在弱规约之上做高风险承诺
- User asks for an answer to a question they have not yet finished
  formulating / 用户在尚未把问题问完时就索要答案

### Anti-Patterns / 反模式

- Do not use Socratic mode when the task is already precisely specified and
  the user explicitly wants execution speed.
- 当任务已经被精确规约、用户明确要求执行速度时，不要使用苏格拉底模式。

- Do not turn the question layer into rhetoric that funnels the user toward a
  pre-decided answer.
- 不要把质询层退化成把用户引向预先决定结论的修辞工具。

- Do not stack Socratic loops on top of an already-clarified problem; that is
  pedantry, not inquiry.
- 不要在问题已经澄清后再叠加新一轮苏格拉底循环；那是迂阔，不是追问。

---

## Session Template / 会话模板

```text
### Socratic Session Notes / 苏格拉底会话记录

Task Context / 任务背景:
Open Terms Identified / 已识别的待定义术语:
Definitional Questions Asked / 已发起的定义性追问:
Boundary Cases Probed / 已探查的边界用例:
Aporia State Reached? / 是否达到合法困惑态:
Confidence Inventory / 置信度清单 (user / training / inference):
Outcome / 结果:
```
