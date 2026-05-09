# HundredSchools 技术报告 · 实施方案

> 文档定位：统一定义"技术报告（arXiv preprint）+ 开源 skill 包 v1.0"
> 这一交付物的目的、研究问题、预注册假设、实验矩阵、度量、时间线与风险。
>
> 与 [general-benchmark-plan.md](general-benchmark-plan.md) 与
> [scale-curve-experiment-plan.md](scale-curve-experiment-plan.md) 互补：
> 那两份回答"如何把 benchmark 跑出来"；本文档回答"为什么跑、跑出来要回
> 答什么问题、最终交付物长什么样"。
>
> 起始日期：2026-05；目标完成：12 周内提交 arXiv + skill v1.0 release。

---

## 1. 目的 (Purpose)

**最终交付物**：一篇 arXiv preprint（10–14 页技术报告） + 一个可被任何
agent 框架直接复用的开源 skill 包，二者通过同一个公共仓库联合发布。

**核心目的**——本技术报告要回答下面其中**至少一个**问题，并以**可复现的
实证证据**支撑：

1. **学派 × 任务匹配性**：是否存在"对的学派 → 对的任务"配对，使其在
   该领域的表现**显著优于** vanilla baseline 与现成 prompt-engineering
   baseline？也就是说，**不同学派是否能在特定领域做得比较优秀**。
2. **跨规模一致性**：把 14 个学派挂到 Qwen 2.5 系列（0.5B–32B）上时，
   学派的"行为身份"是否随尺寸 scaling 表现出可被刻画的规律？
3. **派系组合性**：预定义流水线（如 `military → legal`、`socratic →
   yangming`）是否在对应任务上**优于任意单派**？
4. **失败模式可观察性**：每个学派在 SKILL.md 中显式承诺的"过用风险"
   能否被自动检测出来？这给出一份关于"persona 何时坏掉"的实证证据。

**最低成功条件**：以上 4 个问题，**只要有 2 个能给出可复现、方向明确、
统计显著的实证答案**（不论是支持、反驳或部分支持），就构成可发布的
preprint 内容。

**最高目标**：4 个问题全部有清楚结论，并产生至少 1 条**之前文献未明确报
告**的、与"学派 × 任务"匹配相关的具体发现（哪怕只是局部、特定模型尺寸下
的）。

---

## 2. 不是什么 (Non-Goals)

为避免目标蔓延，本技术报告**不**做以下事：

1. **不**论证"哲学派系映射本身有理论新意"——哲学包装是**展示**层面，
   不是科学贡献。我们在 §5 *Discussion* 中**显式承认**这点。
2. **不**与 RLHF / DPO / Constitutional AI 等训练侧方法对比。本文限定
   于推理时（inference-time）system-prompt 控制范畴。
3. **不**要求顶会接收。preprint + 开源包的双轨发布本身就是合理终点，
   conference / workshop 投稿是后续可选项。
4. **不**测心理学量表（Big Five / MBTI）——这是 Serapio-García
   (2023) 等工作的路线，与本文不同：我们测**可被自动检测的功能性行为承
   诺**，不测心理特质。
5. **不**做机制可解释性 / activation probing。该路线门槛高，留作 future
   work。
6. **不**做训练时学派注入。本文所有派系都通过 system prompt 注入。

---

## 3. 核心主张 (Core Claims)

**论文中可以诚实写下的句子**：

> "We propose a 14-school taxonomy of inference-time control stances drawn
> from classical philosophy, and provide the first systematic
> cross-scale, cross-task comparison of distinct persona-based control
> strategies, with reproducible pipeline composition rules."

拆解：

- "taxonomy" — 是分类整理工作，不是发现新现象
- "first systematic ... comparison" — 矩阵化对比是这份工作的实质贡献
- "cross-scale, cross-task" — 实证骨架就在这两个维度
- "reproducible pipeline composition rules" — 兼容矩阵 + 流水线规则
- 全文不出现 "personality"、"discover"、"emergent" 等高负载词

**论文中绝不写的句子**（每一条都是常见审稿陷阱）：

| 不要写 | 为什么 |
|---|---|
| "We discover that LLMs have personalities" | persona ≠ personality；Serapio-García 已经做了 |
| "Persona steering is novel" | Salewski、Deshpande 已经反复做过 |
| "Our Daoist mode reduces hallucinations" | 不可重复、不可证伪——把它换为可测 marker |
| "The framework emerges at X B parameters" | 看 Schaeffer (2023)；用连续度量避开这条死路 |

---

## 4. 研究问题 (RQs)

只设 4 个；再多就稀释。

| RQ  | 形式问题 | 是否可砍 |
|-----|---------|---------|
| RQ1 | 14 派的输出在嵌入空间是否两两可分？ | 不可——这是底座 |
| RQ2 | 派系保真度（marker recall）如何随模型尺寸 scaling？ | 不可——这是"为何要跨 Qwen 尺寸"的核心理由 |
| RQ3 | 对的学派 × 对的任务，是否优于 vanilla / prompt-eng baseline？ | 不可——这是"学派 × 任务匹配性"目的的全部 |
| RQ4 | 预定义流水线是否优于任一单派？ | 可砍——保留则升级"创新性" |

---

## 5. 预注册假设 (Pre-registered Hypotheses)

每条 H 都给一个**可证伪条件**。预注册到 OSF / AsPredicted；正式跑大模型
之前度量定义全部冻结。

| H    | 主张 | 度量 | 证伪条件 |
|------|-----|------|---------|
| H1   | 14 派两两 cosine 距离 > baseline-vs-baseline 噪声地板 × 2 | 嵌入距离矩阵（sentence-transformers all-mpnet-base-v2） | 任何 ≥ 3 对学派落入噪声地板 |
| H2a  | 派系保真度随参数量单调非降 | 自动化 marker recall（每家 5–10 个 lexical/structural marker） | Spearman ρ < 0.3 |
| H2b  | 跨尺寸"同派一致性"（cosine） > 0.6 | dao@0.5B vs dao@32B 嵌入距离，14 派平均 | < 0.6 |
| H3   | 对每个任务，存在某派显著优于 vanilla baseline (p < 0.01, Cohen's d > 0.3) | 任务正确率 / 评分 | < 4 / 8 任务能找到 |
| H4   | 至少 2 条预定义流水线在对应任务上优于任一单派 | 任务正确率 + 配对 t 检验 | 全部流水线效果 ≤ best single |

**对每条 H 都预先写好"如果失败该怎么写论文"**：

- H1 失败 → 框架降级为"taxonomy paper"，砍 RQ2-4，仍可发 workshop
- H2a 失败 → 改写为"persona fidelity does not scale; small models follow
  schools as well as large models on lexical markers"，反而是反直觉发现
- H2b 失败 → 改写为"school identity does not transfer across scale"
- H3 失败 → 改写为"persona-based steering shows no domain advantage on
  N/8 tasks"，作为反向证据
- H4 失败 → 改写为"single-stance dominates: pipeline composition is
  unnecessary on N tasks in our suite"

**核心点**：每条 H 不论支持或反驳都能写出有意义的 §Results。这是论文不
被卡死的关键。

---

## 6. 实验矩阵

```
模型轴（Qwen 2.5 系列 instruction-tuned，instruction-tuning 数据同源）：
  0.5B / 1.5B / 3B / 7B / 14B / 32B          (6 档主轴)
  跨家族 sanity check：Llama-3.2-3B、Mistral-7B-Instruct  (2 档，仅 RQ1)

学派轴（19 条件）：
  14 派（先秦 6 + 拓展 8）+ 5 baselines
  baselines:
    B1. vanilla（无 system prompt）
    B2. "you are a helpful assistant"
    B3. CoT prompt
    B4. best-fit prompt-engineering（每任务专用，公平基线）
    B5. random-school（控制"任何 system prompt 都有效"的反对意见）

任务轴（8 域，每域 100–200 样本）：
  推理:        GSM8K (math)、MMLU-Pro 5 学科子集
  指令服从:    IFEval
  代码:        HumanEval
  安全:        AdvBench-100 子集
  事实:        TruthfulQA-MC
  压缩:        XSum
  规划:        自定义多步任务（来自现有 case studies）
  创意:        自定义 reframing prompts（3–5 个）

合计：6 sizes × 19 conditions × 8 tasks × ~150 samples ≈ 137k generations
跨家族 sanity：2 × 19 × 4 tasks × ~100 ≈ 15k generations

主路径合计 < 160k 生成；80% 在 7B 以下，全程 < 7 天 wall time、
< $500 (OpenRouter 或 自托管 A100/H100)。
```

任务–学派预期映射（用于 RQ3 解读）：

| 任务域       | 预期受益学派 |
|------------|------------|
| 数学 / 多步推理 | military, falsificationist, hegelian |
| 指令服从     | legal, confucian |
| 代码         | legal, mohist |
| 安全         | confucian, stoic |
| 事实         | logician, falsificationist, bacon |
| 压缩         | mohist |
| 规划         | military, yangming |
| 创意 / 重构  | dao, wittgenstein |

注：预期映射不是"必须验证为真"——映射不一致本身也是有价值的发现（"这个
任务 dao 起作用，但 military 不起作用"是一条结论）。

---

## 7. 度量定义（连续度量，避开 Schaeffer 陷阱）

**只用连续度量。所有度量在跑大模型之前定义并冻结**。

| 度量 ID | 名称 | 算法 |
|---|---|---|
| L1 | 输出长度比 | `len(output) / len(baseline_output)` |
| L2 | 派系签名遵循率 (marker recall) | `命中 marker 数 / 总 marker 数`，每家 5–10 个自动 marker |
| L3 | 学派两两距离 | sentence-transformers all-mpnet-base-v2 嵌入 cosine |
| L4 | 跨尺寸同派一致性 | `cosine(embed(school@small), embed(school@large))` |
| L5 | 任务正确率 / 评分 | 各 benchmark 标准评分（GSM8K：sympy；IFEval：rule；HumanEval：sandbox；TruthfulQA：MC；XSum：ROUGE + BERTScore；自定义：rubric + LLM judge） |
| L6 | "过用风险"触发率 | 每家 SKILL.md 中"Overuse Failure Mode"对应的反 marker（如 mohist 的"under-explained"对应 token < threshold；dao 的"drift"对应主题分散度） |

**Marker 定义示例**（必须公开在仓库 `experiments/markers/` 下供 review）：

```python
# mohist markers
mohist_markers = {
    "no_docstring": lambda code: not re.search(r'"""|\'\'\'', code),
    "bare_return": lambda code: bool(re.search(r'^\s*return [^#\n]+$', code, re.M)),
    "compressed": lambda out, base: len(out) < 0.7 * len(base),
    "no_inline_comment": lambda code: code.count('#') < 0.5 * code.count('\n'),
    "no_usage_example": lambda out: 'example' not in out.lower() and '# usage' not in out.lower(),
}
# 召回 = 命中数 / len(markers)
```

每家学派必须有这样一份 marker 字典。在仓库 PR 阶段公开，让任何人审视 /
质疑 / PR 修改。**这层透明度是 reviewer 接受的关键**。

---

## 8. Baselines（最容易被忽视的部分）

被 reviewer 挑战最多的是 baseline 不公平。**5 类 baseline 必须全部跑**：

| baseline | 控制的对手 |
|---|---|
| B1 vanilla | "system prompt 完全没用？" |
| B2 generic helpful | "你只是因为加了任何 system prompt 就有效" |
| B3 CoT | "兵家其实只是 CoT 换皮" |
| B4 best-fit prompt-eng | "你只是输给了一个普通的好 prompt" |
| B5 random-school | "你的路由其实是随机的" |

B5 是论文新颖性最直接的护盾——如果 random-school 和 routed-school 同样
好，路由就是装饰；如果 routed 显著好，路由就**有效**。

---

## 9. 论文 + skill 联合发布

### 9.1 仓库结构（新增项）

```
HundredSchools.skill/
  hundredschools/                    # 14 派 guides（已有）
  paper/                             # 新增
    preprint.tex                     # LaTeX 源文件
    preprint.pdf                     # 编译产物
    figures/                         # 论文图表
    bibtex.bib                       # 参考文献
  experiments/                       # 新增 — 论文复现
    pre-registration.md              # 预注册原文（OSF mirror）
    run_all.sh                       # 一键复现论文全部表 + 图
    markers/                         # 14 个 marker 字典（每家一文件）
    tasks/                           # 8 个任务加载器
    metrics/                         # L1–L6 实现
    analysis.ipynb                   # 论文中所有图表的生成
    results/                         # 跑出来的 raw outputs（gzip）
  benchmark/                         # 新增 — 第三方在自己模型上跑
    on_your_model.py                 # 把 14 派挂到任意 OpenAI-compat endpoint
    minimal_reproduce.py             # 最小复现脚本（< 100 行）
```

### 9.2 论文骨架（10–14 页）

| 节 | 页数 | 内容要点 |
|---|---|---|
| §1 Introduction | 1.5 | 问题 / 贡献 / RQ |
| §2 Framework | 2 | 14 派 mapping table；控制面分类；流水线规则 |
| §3 Setup | 2 | 模型 / 任务 / 度量 / baselines；引用 pre-registration |
| §4 Results | 4 | RQ1 → distinguishability heatmap；RQ2 → scaling curves；RQ3 → task × school 表；RQ4 → pipeline vs single 比较 |
| §5 Discussion | 2 | 哪些哲学映射经验上对得上、哪些是装饰；失败案例；与 Salewski / Serapio-García / Schaeffer 的关系 |
| §6 Limitations + Release | 1 | 边界 + 仓库链接 |

### 9.3 First-author footnote 必含

> "Code, data, prompts, pre-registration, and reproducibility scripts:
> https://github.com/<owner>/HundredSchools.skill"

这是 reviewer 接受的强信号。

---

## 10. 时间线（12 周）

| 周 | 主要工作 | 交付 |
|---|---|---|
| 1 | OSF 预注册；冻结 marker 定义；prepare task data | 预注册 + marker 字典 PR |
| 2–3 | baseline + 6 派在 Qwen 2.5 0.5B / 7B 上 pilot | pilot 数据 + 度量调试 |
| 4 | pilot 数据 → 调试 marker / metric / pipeline | pilot 报告（内部） |
| 5–7 | full sweep：6 sizes × 19 conditions × 8 tasks | raw results tarball |
| 8 | 跨家族 sanity check（Llama / Mistral） | sanity 数据 |
| 9–10 | 数据分析、画图 | analysis notebook + figures |
| 11 | 写作（draft） | preprint draft v0 |
| 12 | 同行预审（找 1–2 个朋友 review） + arXiv 提交 + skill v1.0 release | preprint + tag v1.0 |

**最小可行版本（4 周精简版）**：砍 RQ4、砍跨家族、砍 32B；4 sizes × 14
schools + 3 baselines × 5 tasks ≈ 12k 生成；单卡 4090 / A6000 一周内；
论文 8 页（workshop 风格）。先验证概念，再决定是否升级到 12 周完整版。

---

## 11. 风险与备份

| 风险 | 影响 | 缓解 |
|---|---|---|
| H1 失败（学派不可分） | 全文逻辑垮 | 降级为 taxonomy paper；砍 RQ2–4；改投 workshop |
| H3 大部分任务找不到 winning school | RQ3 部分失败 | 实事求是写"persona only helps in N/8 task domains"；这本身是有价值的反向证据 |
| Reviewer 说"哲学包装是装饰" | 影响接收 | §5 直接承认；这恰好是论文诚实度的加分项 |
| 跨 Qwen 尺寸 SFT 数据差异是 confound | 影响 RQ2 | 引用 Qwen 2.5 Technical Report 中 SFT 同源说明；跨家族 sanity 作为旁证 |
| arXiv 撞车（已有人做类似） | 失去新颖性 | 在 Week 1 用 Google Scholar 搜 "philosophical persona LLM" / "system prompt taxonomy LLM" / "agent stance composition"，2 小时确认；如撞车，重新定位为 "we differ in X, Y, Z" |
| 跑全量遇到工具故障 / 中断 | 时间线延误 | checkpoint/resume 写在 `run_all.sh` 里；每个 (model, school, task) 三元组独立 |
| 人手不够 / 写作慢 | 12 周末出不来 | 提前固化 §2 Framework（已经在 SKILL.md 中可重用），§3 Setup 在 Week 4 pilot 完后就能写完 |

---

## 12. 与现有方案的关系

本文档**不**取代以下文档；它**统一**它们的目的方向：

| 文档 | 关系 |
|---|---|
| [improvement-proposal.md](improvement-proposal.md) | 仓库整体改版方案；本文档是其"科研产出"分支 |
| [general-benchmark-plan.md](general-benchmark-plan.md) | benchmark 选型、度量原则；本文档复用其方法论 |
| [scale-curve-experiment-plan.md](scale-curve-experiment-plan.md) | A6000 执行细节；本文档继承其硬件分工 |
| [targeted-evaluation-plan.md](targeted-evaluation-plan.md) | 早期定向评估；本文档把它推广到 14 派 × 8 任务全矩阵 |
| [test-results.md](test-results.md) | Phase 1 已有 6 派结果；将作为本文 §4 的 anchor |
| [case-studies.md](case-studies.md) | 15 跨域案例；自定义"规划""创意"任务的来源 |
| [xguard-official-benchmark-plan.md](xguard-official-benchmark-plan.md) | 安全研究分支；与本文档**并行**而非合并——安全研究可作为单独 short paper / workshop submission |

---

## 13. 决策检查点

| 节点 | 必须确认 | 不通过则 |
|---|---|---|
| Week 1 末 | 撞车搜索完成；预注册提交；marker 字典 PR 通过 | 推迟 1 周；如严重撞车则重新定位 |
| Week 4 末 | pilot 结果显示 H1 在 Qwen 0.5B + 7B 上至少**部分**成立 | 触发 §11 风险流程，决定降级为 taxonomy paper |
| Week 7 末 | full sweep 完成 80%+ | 切到 4 周精简版结题 |
| Week 11 末 | preprint draft v0 内部审过 | 推迟 arXiv 提交 ≤ 2 周 |

---

> **本文档为活文档。任何上面假设、度量、时间线的调整都应通过 PR 修改本
> 文档并对应更新 OSF 预注册（如已提交）。**
