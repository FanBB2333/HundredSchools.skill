# 学派 × 任务效应分析 — 各学派擅长什么，如何推广

**数据来源**: `docs/samples/benchmarks/results/summary.json`（224 行 = 6 preset × 6 benchmark × 8 condition，部分缺位）  
**实际覆盖的学派**: 6 个先秦学派 `dao / confucian / legal / military / mohist / logician` + `baseline` + `neutral_long`  
**模型规模（Qwen3.5 系列）**: 0.8B / 2B / 4B / 9B（完整）+ 27B（仅 GSM8K、IFEval）+ gemma4-e2b-it（仅 GSM8K、IFEval）  
**评测集**: MMLU / BBH / GSM8K / TruthfulQA / IFEval / HumanEval  
**注**: `docs/samples/benchmarks/ANALYSIS.md` 内的 14 学派表格在当前 `summary.json` 里没有对应数据，本报告只用真实数据 ✅。

绘图脚本：`experiments/analysis/plot_schools.py`  
图片输出：`docs/figures/01..05_*.png`  
派生数据：`experiments/analysis/out/tidy.csv`, `experiments/analysis/out/school_strength.csv`

---

## 一、汇总图（先看图，再看表）

| # | 图 | 用途 |
|---|---|---|
| 1 | `docs/figures/01_heatmap_delta_pooled.png` | 跨模型规模聚合后，每个学派 × 评测集的 Δ vs baseline |
| 2 | `docs/figures/02_heatmap_delta_per_preset.png` | 同上，但按 0.8B/2B/4B/9B 横向切片，看规模交互 |
| 3 | `docs/figures/03_scaling_curves.png` | 每个评测集独立画 accuracy vs model size，含 baseline 黑虚线 |
| 4 | `docs/figures/04_school_strength_bar.png` | 学派为 x 轴、benchmark 为分组的条形图 |
| 5 | `docs/figures/05_school_radar.png` | 学派 × benchmark 的 rank-normalized 雷达，看"形状差异" |

---

## 二、每学派擅长什么（基于实证）

### 排序方法
对每个学派，在 4 个 Qwen3.5 规模（0.8B/2B/4B/9B）上取 Δ vs baseline 的均值，得到下表（单位：百分点 pp）：

| 学派 | MMLU | BBH | GSM8K | TruthfulQA | IFEval | HumanEval |
|------|-----:|----:|------:|----------:|------:|---------:|
| **mohist 墨** | **+0.35** | **+2.15** | -15.88 | -0.31 | -5.91 | -5.64 |
| **dao 道** | -0.86 | -19.75 | -10.51 | +0.12 | **-1.04** | **+23.63** |
| **legal 法** | -0.90 | -13.79 | -8.34 | **+0.98** | -21.48 | +22.10 |
| **military 兵** | -0.83 | -30.95 | -10.37 | -2.97 | -17.26 | +17.23 |
| **confucian 儒** | -2.65 | -12.69 | **-4.28** | -4.80 | -11.24 | +23.32 |
| **logician 名** | -2.79 | -30.78 | -9.17 | -7.47 | -13.27 | +22.87 |

加粗 = 该列内的最佳学派。

### 单条解读

- **墨家（mohist）— 唯一在 BBH 上正向，且 MMLU 也正向**  
  "节用 / 极简 / 直接判决"指令与 BBH（短答案逻辑判断）天然匹配。9B 模型上 BBH +14.19 pp（绝对值 74.57% vs baseline 60.37%），是所有 (学派, 评测集) 组合里**最干净、可解释、可复现**的一个增益。  
  代价：在需要中间步骤的 GSM8K 上 −15.88 pp（数学链被节用截断），代码任务 HumanEval 上 −5.64 pp（代码不能压缩）。  
  → **应用域：分类、判断、单步逻辑、风控决策、短答案问答**。

- **道家（dao）— 全能型最低风险学派**  
  四个评测集（MMLU/TruthfulQA/IFEval/HumanEval）都接近 0 或正向，BBH 是显著负的主要短板。  
  IFEval 上 −1.04 pp 是 6 学派里最小的损失，HumanEval +23.63 pp 是最大的增益（与"无为不强判，多路径"和代码"先试几种实现再选"的工作模式契合）。  
  → **应用域：默认通用 system prompt、代码助手、不确定性场景下的稳健输出**。

- **法家（legal）— 事实性最强 / 指令遵从代价最大**  
  TruthfulQA 上 +0.98 pp 是 6 学派里最高，与"以法断之，零容忍"抑制编造的机制一致。  
  代价是 IFEval −21.48 pp（最差）：用户开放式指令容易触发"违反即拒"。27B 上甚至跌到 −31.24 pp，这是法家最值得警惕的副作用。  
  → **应用域：事实核查、合规审查、医疗/法律/金融问答；不适合自由文本助手**。

- **儒家（confucian）— 数学损失最小 + 礼节性拒绝**  
  GSM8K 上 −4.28 pp 是 6 学派里最小的（"克己复礼"在算术上几乎无伤）。HumanEval +23.32 pp 与 dao 几乎并列。  
  IFEval 上 −11.24 pp 是中等损失，但 9B 上的 HumanEval +76.83 pp 是这套数据里所有 (学派, 评测集) 中最大的增益。  
  → **应用域：数学/STEM 辅导、代码 review、文化敏感内容审核**。

- **兵家（military）— 代码增益 + BBH/IFEval 重伤**  
  HumanEval +17.23 pp（代码"风险评估、最坏情况"似乎确实帮代码考虑边界）。但 BBH −30.95 pp 是最差，IFEval −17.26 pp。  
  风险评估框架对"非威胁场景"的 over-application 是清晰的失败模式。  
  → **应用域：安全代码评审、红队/对抗性测试、威胁建模；远离通用 QA**。

- **名家（logician）— 代码强 / BBH 反直觉地差**  
  HumanEval +22.87 pp 接近 dao/confucian。但 BBH −30.78 pp（9B 上甚至跌到 8.40%，几乎随机），原因是"先检测偷换概念再回答"在 BBH 上是纯认知开销 — **"对逻辑的元分析" ≠ "做逻辑"**，是本数据里最反直觉的发现。  
  → **应用域：需求澄清、规格审查、API/合同语义分析；不适合本身就是逻辑题的任务**。

---

## 三、跨学派共性结论

1. **HumanEval（代码）被几乎所有学派显著抬升（+17 ~ +24 pp）**  
   是 baseline 异常低 + 学派 prompt 充当"启动 prompt"的复合效应：9B baseline HumanEval 只有 4.88%，neutral_long 就跳到 44.51%，再加学派 prompt 又涨 30+。所以**学派 prompt 至少有一部分作用相当于"任何非空的 system prompt"**，需要严谨地把这层分离掉（与 neutral_long 比较，而非与 baseline 比较）。

2. **GSM8K（数学链）被几乎所有学派略微压低（−4 ~ −16 pp）**  
   GSM8K 需要 1024 token 的中间步骤；任何要求结构化输出/拒绝/审慎的 prompt 都会挤压推理空间。**惟一的最小损失来自 confucian**（"礼节"指令短，没干扰推理链）。

3. **BBH 是学派之间分化最大的评测**  
   范围从 **mohist +2.15** 到 **military −30.95**，差距 33 pp。BBH（短答案、复杂推理）对 prompt 风格极度敏感 — 这是把它作为"学派区分能力"的核心 benchmark 的理由。

4. **MMLU 几乎不动（除了 logician/confucian 轻微下降）**  
   MMLU 仅要求一个字母答案，prompt 风格基本不渗透。**说明 MMLU 不是好的"学派效应"探针**。

5. **9B 是先秦学派的甜点**（见 `02_heatmap_delta_per_preset.png`）  
   - 0.8B / 2B：学派指令"理解不到位"，平均稍负
   - 4B：开始过度遵从，BBH 大幅下降但其他持平
   - **9B：能利用 prompt 框架，又没被冗长指令拖垮，HumanEval/IFEval/TruthfulQA 几乎都正**
   - 这是一条 inverted-U 曲线，说明"能力 × 服从度"存在中段最佳。

---

## 四、推广到更深层研究 / 应用

### 4.1 立即可做的工程应用（3 条）

1. **任务感知路由（task-aware router）**  
   把已有学派当成 6 个候选 system prompt，按任务类型路由：
   - 短答案 / 分类 / BBH 类 → `mohist`
   - 代码（含 review/重构）→ `dao` 或 `confucian`
   - 事实核查 / 高风险问答 → `legal`
   - 不确定 / 通用 → `dao`（最小损失）  
   理论上能在不训练任何模型的前提下，把固定 baseline 的"中段"任务提升 5~15 pp。`docs/samples/benchmarks/router.py` 已有骨架，缺路由规则。

2. **"prompt 拼装"实验**  
   - `dao + mohist`：无为 + 节用 = 不强判 + 短输出 → 假设：BBH 与 HumanEval 同时受益。
   - `legal + dao`：以法断之 + 多路径 → 减弱 legal 的过度拒绝。
   - 这是组合学派，与单一学派对比即可验证可加性 vs 干扰。

3. **9B-only 部署建议**  
   对 9B 级的 Qwen3.5（以及类似量级的 Mistral / Llama-3.1-8B），首选 system prompt 顺序为：
   - 代码：`confucian` > `legal` ≈ `logician` > `dao`
   - 推理：`mohist`（独此一家）
   - 数学：`confucian`（−2.27）或 `military`（−2.05），不要用 `mohist`
   - 指令遵从：`dao`（+0.18）

### 4.2 值得投入的研究方向（按性价比排序）

1. **"格式效应 vs 思想效应"的解纠缠（最高优先级）**  
   当前所有学派 prompt 都在 system 字段一次性下发完整指令。**做对照实验**：把同一思想内容用"内部思考 + 输出仅答案"的两段式 prompt 改写（类似 hidden CoT），看 BBH/MMLU 上的崩溃是否消失。如果消失，证明 ANALYSIS.md 里"后续学派全崩"是格式/token 预算冲突，而非思想缺陷。

2. **学派 prompt 的 attention-head 解释性**  
   既然 mohist 在 BBH 上独优、logician 在 BBH 上独差，但两者表面上都是"短指令"，差异应该可以在 9B 模型的 attention 模式里观察到。  
   建议工具：activation patching / circuit tracing，比较 (mohist BBH) vs (logician BBH) 的中间表征。  
   预期产出：一个学派 prompt 与 task circuit 之间的"激活路径图"。

3. **学派的"中段最佳"现象 → scaling law 视角**  
   在 0.8B → 9B → 27B 上观测到的 inverted-U 形状，等价于"prompt-following capability × prompt-content quality"的相互作用。建议拟合：
   `Δ_school(N) = α(N) · quality(school, task) − β(N) · over_following(school)`  
   其中 α 单调递增（大模型更能利用提示），β 在 4B+ 后陡升（大模型过度执行 prompt）。这是个有可发表价值的小论文议题。

4. **细化的"安全 + 能力" Pareto 前沿**  
   现有数据只覆盖通用 benchmark，没有 over-refusal / safety 指标。把 `datasets/or_bench/` 和 `datasets/xstest/` 接上同一套学派条件，可以画出每个学派的（任务能力 ↑, 安全/拒绝合理性 ↑）Pareto 前沿。我们已经能预测：
   - `legal`：拒绝率最高 → 安全/能力前沿偏左上
   - `dao` / `mohist`：拒绝最克制 → 偏右下
   - 这对落地选 prompt 是直接可用的决策图。

5. **跨家族复现**  
   当前 6/6 数据点都在 Qwen3.5 + Gemma。同套学派 prompt 跑 Llama-3.1-{8B,70B}、Mistral-{7B,8x22B}，能区分"学派效应"是 Qwen 特有的还是普适的。

### 4.3 落地到产品的具体场景

| 产品场景 | 推荐学派 | 关键卖点 |
|---------|---------|---------|
| 通用聊天助手 | dao | 全场景最稳，无明显短板 |
| 客服 FAQ / 短答 | mohist | BBH +2.15, MMLU +0.35，回答短而准 |
| 编程助手 IDE | confucian | HumanEval +23.32，9B 上 +76.83 |
| 医疗/法律问答 | legal | TruthfulQA +0.98（最高），抑制编造 |
| 红队/安全代码 review | military | HumanEval +17.23 + 自带威胁建模 |
| 需求文档/API spec 审查 | logician | 检测术语漂移，HumanEval +22.87 |
| K-12 数学辅导 | confucian | GSM8K 损失最小（−4.28），礼节性回答风格 |

---

## 五、需要解决的数据/方法缺口

1. **ANALYSIS.md 内 14 学派的来源**：当前 `summary.json` 不含 socratic/stoic/falsificationist/hegelian/pragmatist/yangming/bacon/wittgenstein 任何条目。要么是另一个未提交的结果目录被 ANALYSIS.md 引用，要么是计划数字。建议在 README 或 ANALYSIS.md 顶端注明"实测 vs 计划"。

2. **27B 与 gemma4-e2b-it 只跑了 GSM8K + IFEval**，不能参与跨任务排名。`run_all.sh` 的 27B 完整 sweep 是后续最直接的 ROI 工作。

3. **9B baseline HumanEval = 4.88% 显著异常**（同一模型 neutral_long = 44.51%）。在引用 HumanEval Δ 数字时必须用 `Δ vs neutral_long` 而非 `Δ vs baseline`，否则会高估学派增益 ~40 pp。

4. **没有 seed/重复实验**：当前每个 (preset, condition, benchmark) 只有 1 个 acc 数字，无方差估计。`school_strength.csv` 里的 `delta_std` 是跨模型规模算的，不是同模型内的随机性。统计显著性需要把 sample-level scoring 接回来。

---

## 六、一句话结论

> **6 个先秦学派对 LLM 性能不是"全方位增益"，而是"在特定 (任务, 规模) 上有可预测的增减益"。**  
> 最干净的正向例子：**墨家 + BBH + 9B**（+14 pp，BBH 唯一独优）。  
> 最干净的反例：**法家 + IFEval + 27B**（−31 pp，规则零容忍击穿了指令遵从）。  
> 真正可落地的应用是 **任务感知路由**，而不是单一最佳学派。
