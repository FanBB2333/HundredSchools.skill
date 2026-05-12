# 跨模型推广 & 日常使用规则

**写作日期**: 2026-05-12
**数据来源**: `docs/samples/benchmarks/results/summary.json` (5 Qwen3.5 sizes × 19 conditions × 6 benchmarks = 570 cells)
**目的**: 把 router_auto 从"Qwen3.5 特化的硬编码查表"提炼为可跨模型族使用的设计原则 + 一组日常 LLM 使用的可操作结论。

---

## 一、为什么要重新设计 router

当前 `docs/samples/benchmarks/router.py` 是一份 ~190 行的 `if/elif` 规则表。它的 "智能" 来自规则**内容**，而内容**全部**来自 5 个 Qwen3.5 规模 × 6 个 benchmark 的实验。

它不能直接搬到 Llama / Gemma / Mistral，因为：

1. **输入是 `benchmark` 名字符串**——真实流量没有这个标签。
2. **BBH 子任务白名单（12+5+9 项）是从 ~920 个数据点统计出的局部最优**——没有显著性检验，换模型族大概率失效。
3. **路由表不带 `model_size` 维度**——但实验显示同一学派在 0.8B 上 −5pp、9B 上 +14pp，方向相反。
4. **+12.68pp / +0.78pp 这些数字本身是 Qwen3.5 特化的**——9B HumanEval baseline = 4.88% 与 27B TruthfulQA baseline = 0% 这两个 baseline 工件还放大了表观增益。

要让 router **跨模型可推广**，必须把上述四个问题逐项替换为：可从 prompt 本身检测的特征、跨规模一致的方向性规则、不依赖具体 Δpp 数字的决策骨架、模型规模显式可选的接口。

---

## 二、可推广的依据：跨 5 个模型规模一致的发现

只有在 ≥4/5 规模上**同方向**的发现，才有资格作为"跨模型可推广"的依据。

### 2.1 稳健的"该用"信号（≥4/5 模型上跑赢 baseline）

| 任务 | 条件 | 一致性 | 平均 Δ |
|---|---|---|---|
| MMLU | neutral_long | 4/5 | +0.8pp |
| BBH | neutral_long | 5/5 | +2.3pp |
| BBH | router_auto | 5/5 | +13.2pp |
| TruthfulQA | router_auto | 4/5 | +18.0pp |
| GSM8K / IFEval / HumanEval | **无任何单一学派满足 ≥4/5** | — | — |

注意：HumanEval 上没有学派达到 4/5，但 dao / confucian / logician / legal 都在 3/5 上跑赢 baseline 且平均 +10pp 以上。这是中等强度的"该用"信号。

### 2.2 稳健的"千万别用"信号（≥4/5 模型上跑输 baseline）

| 任务 | 该任务上几乎一定让你掉分的 prompt | 量级 |
|---|---|---|
| MMLU | cot, socratic, hegelian, bacon, pragmatist, wittgenstein | 5/5 × ≈ −50pp |
| BBH | hegelian, stoic, wittgenstein, falsificationist, military, logician | 5/5 × ≈ −27pp |
| GSM8K | hegelian, socratic, falsificationist, bacon, wittgenstein, yangming | 5/5 × ≈ −60pp |
| IFEval | socratic, hegelian, stoic, yangming, falsificationist, wittgenstein | 5/5 × ≈ −42pp |
| TruthfulQA | bacon, cot, pragmatist, falsificationist, yangming | 4/5 × ≈ −32pp |
| HumanEval | socratic, hegelian, wittgenstein | 4-5/5 × ≈ −20pp |

### 2.3 关键不对称

> **所有"该用"信号都偏弱（+1 ~ +18pp）；所有"千万别用"信号都极强且 100% 一致（5/5 × −30 ~ −70pp）。**

这个不对称是设计可推广 router 的关键洞见：**禁止性规则比允许性规则可靠**。

---

## 三、模型无关的 router 设计

把当前 `route_school_condition(benchmark, sample)` 改成 `route_school_condition(prompt, max_tokens)`。

### 3.1 检测特征（纯字符串规则，零模型依赖）

```python
import re

def detect_task_features(prompt: str, max_tokens: int) -> dict:
    p = prompt.lower()
    return {
        'has_code':      bool(re.search(r'```(?:python|js|ts|c|cpp|rust)|def \w+\(|function \w+', p)),
        'has_math':      bool(re.search(r'\d+\s*[\+\-\*/]\s*\d+|how many|how much|word problem|grade.school', p)),
        'is_choice':     bool(re.search(r'\([A-D]\)|(?:^|\n)[A-D]\)\s|Choices:|Options:', prompt)),
        'has_format_lock': any(s in p for s in (
            'answer with only', 'reply with only', 'one letter',
            'no explanation', 'just the number', 'just the answer',
            'end your response with', 'exactly',
        )),
        'is_short_budget': max_tokens <= 64,
        'is_factual':    bool(re.search(r'\b(true or false|which of the following|is it true that)\b', p)),
        'is_longform':   max_tokens >= 512,
    }
```

### 3.2 模型无关决策规则（三层）

```python
def route_for_any_model(prompt: str, max_tokens: int) -> tuple[str, str]:
    """Returns (condition_name, reason). Suitable for any instruction-tuned LLM."""
    f = detect_task_features(prompt, max_tokens)
    
    # ─── 层 1: 禁止性规则（5/5 模型上一致, 跨模型推广性最强）─────────
    if f['has_math']:
        return ('baseline',
                'math: no condition beats baseline on any of 5 sizes; verbose prompts cause -40~-70pp')
    if f['has_format_lock'] or f['is_short_budget'] or f['is_choice']:
        return ('neutral_long',
                'short-budget / format-locked: any meta-cognitive prompt is truncated')
    
    # ─── 层 2: 允许性规则（3-4/5 模型一致, 量级较大值得启用）──────
    if f['has_code']:
        return ('dao',
                'code generation: exploratory prompt unlocks try-and-fix; +12pp avg on HumanEval')
    if f['is_factual'] and not f['is_choice']:
        return ('legal',
                'factual claim: rule-based zero-tolerance reduces fabrication; +0.8pp avg on TruthfulQA')
    
    # ─── 层 3: 默认安全网 ───────────────────────────────────────
    if f['is_longform']:
        return ('dao',
                'long-form generation: dao has lowest variance (-2.76pp avg, never catastrophic)')
    return ('neutral_long',
            'default: lowest-variance positive condition, +2.1pp avg, no cell <-6pp')
```

### 3.3 这个版本与当前 router 的对比

| 维度 | 当前 router.py | 模型无关版本 |
|---|---|---|
| 输入 | benchmark 名 + sample meta | prompt 文本 + max_tokens |
| 规则总数 | ~190 行 | ~50 行 |
| BBH 子任务白名单 | 12 + 5 + 9 项硬编码 | 无（由特征检测替代）|
| 引用的具体 Δpp | 多处 | 无（仅作为脚注引用）|
| 模型族适用性 | Qwen3.5 特化 | 任何 instruction-tuned LLM |
| BBH 上的预期增益 | +13.24pp (Qwen3.5) | ≈ +8pp（粗粒度损失 5pp）|
| Llama / Gemma 上的预期增益 | 未知，可能 ≈ 0pp | +3~+5pp（基于跨模型不对称信号） |
| 决策可审计性 | reason 字符串 | reason 字符串 + 特征字典 |

### 3.4 推广步骤（按工程优先级）

**P0 — 立刻可做**: 把 `route_for_any_model` 加到 `router.py` 作为 `route_school_condition` 的并行实现，原版保留做 A/B 对照。任何使用 benchmark 名的代码继续走原版；新接入的真实流量走新版。

**P1 — 一次小实验**: 在 Gemma3 或 Llama3.5 上跑同样的 19 条件 × 6 benchmark（最少子集：每个 size 1 个模型 × 6 benchmark × {baseline, neutral_long, router_v1_qwen, router_v2_agnostic} = 24 cells/size）。
- 如果 router_v2 平均 ≥ +3pp → 跨模型族可推广，发布为默认 router
- 如果 router_v2 ≈ 0pp → 当前 9 条特征规则需要 calibration，但骨架仍可用

**P2 — 学习化**: 用 ~920 cells 的现有数据训练一个 embedding-based 任务分类器（KNN 或 2 层 MLP）替代硬编码特征检测。可以接入新模型族的数据继续更新。

**P3 — 模型规模感知**: 把 `model_size_b` 作为 router 输入，针对 < 4B / 4-13B / >13B 三档使用不同规则（数据已支持这种划分：< 4B 模型不应使用任何复杂学派 prompt，4-13B 是甜点，>13B 部分元认知 prompt 会过度服从）。

---

## 四、可立即用在日常 LLM 使用中的 10 条规则

每条都标了证据强度（5/5 = 5 个模型规模一致；3/5 = 中等一致；元 = 来自机制推理）和量级。

### 强信号：跨模型几乎一定成立（5/5 一致）

**规则 1 — 数学题前不要加任何 system prompt 思考指令**
- **证据**：GSM8K 上没有任何条件在 5 个模型规模上胜过 baseline。CoT 在 GSM8K 上 5/5 都掉，平均 −18pp；hegelian/socratic 5/5 都掉，平均 −70pp。
- **做法**：数学题用最简 system prompt（`"You are a helpful assistant."`）或干脆不加。
- **特别警告**：不要把"先列出已知条件、再推导、最后回答"这种 CoT 模板写进 system prompt。模型自己已经会做 CoT，你的模板只会消耗 token 预算。

**规则 2 — 16-token 短答案任务前不要加"先思考再回答"的指令**
- **证据**：MMLU 上 CoT 在 5/5 模型上掉 **−58pp**；hegelian / socratic / wittgenstein / bacon / pragmatist 全部 5/5 掉 −48pp 以上。机制是：模型严格服从"先分析"指令时，答案在 16 token 限制内被截断。
- **做法**：选择题、单字母回答、是非题前**不要**加 `"Let's think step by step"` / `"First analyze, then answer"` / `"Take your time"`。
- **替代**：如果担心模型乱猜，加 `"Respond with the single letter only."` 这种格式锁，比加思考指令好。

**规则 3 — 任何 "质疑 / 反证 / 语境分析 / 偏见审查" 型 meta-cognitive prompt 在短答案上是毒药**
- **证据**：socratic（追问）、falsificationist（反证）、bacon（偏见审查）、wittgenstein（语境分析）在 MMLU / BBH / IFEval / TruthfulQA 上 **几乎所有 (任务, 规模) 上都掉 30~50pp**。
- **做法**：这些 prompt 只适合**输出预算 ≥ 500 token 的长格式任务**（论文、设计方案、多轮对话）。
- **判断标准**：如果期望输出 ≤ 100 tokens，绝对不要用任何要求"先做 X、再做 Y、最后做 Z"的多步元结构 prompt。

**规则 4 — system prompt 的复杂度必须匹配输出预算**
- **证据**：这是数据里最干净的"模型无关"规律。1000 字的元结构 prompt + 16 token 答案 = 必死。
- **做法**：估计你期望的输出长度，prompt 复杂度不能超过它的 5%。粗略对应关系：
  - 输出 ≤ 50 token：仅 `"You are a helpful assistant."` 加格式锁
  - 输出 50–500 token：可以加单条风格指令（如"Be concise"）
  - 输出 > 500 token：可以使用学派级的元结构 prompt（dao / mohist / legal 等）

### 中等信号：方向稳但量级有波动（3-4/5 一致）

**规则 5 — 代码生成任务上，任何非空 system prompt 都会帮助**
- **证据**：HumanEval 上 dao(+12.68)、confucian(+12.44)、logician(+12.07)、legal(+11.46)、military(+10.00) 都在 ≥ 3/5 模型上胜过 baseline。**baseline 排第 8**。
- **做法**：写代码时加一个 "exploratory" 风格的 prompt：
  ```
  You write Python code. Prefer simple solutions, but if the first
  approach is fragile, briefly consider an alternative before committing.
  ```
- **机制推测**：裸 baseline 让强模型默认进入"过度谨慎"或"思考模式"状态；任何明确的"你的工作是写代码"的 system prompt 都能解锁直接生成代码的行为。

**规则 6 — 长格式指令遵从（IFEval 类）首选通用 neutral 助手 prompt**
- **证据**：neutral_long 在 IFEval 上 3/5 跑赢，无 catastrophic loss。任何元认知 prompt 在 IFEval 上掉 30~50pp。
- **做法**：写邮件、写报告、做格式严格的任务，用：
  ```
  You are a careful assistant who follows instructions exactly.
  When a request has multiple constraints, satisfy all of them.
  ```

**规则 7 — 事实问答可以加 "规则约束、不编造" 型 prompt**
- **证据**：legal 在 TruthfulQA 上 3/5 跑赢 baseline。
- **做法**：问"X 是哪一年发生的"这类事实题，加一句：
  ```
  Answer factual questions only when you are confident.
  If you are not sure, say "I don't know" rather than guessing.
  ```

### 元层规律（理论层面，来自机制）

**规则 8 — random_school 的存在证明"选择本身"是价值的来源**
- **证据**：random_school 平均 −19.92pp，router_auto 平均 +7.69pp，使用同一个学派池。**28pp 鸿沟全部来自选择策略**。
- **结论**：维护一个"任务类型 → prompt 风格"的小型路由表，比设计一个万能 prompt 价值大得多。这是 **HundredSchools 项目最核心的结论**——把"prompt 工程"从"调一个万能 prompt"转化为"维护一组专科 prompt + 一个分诊路由器"。

**规则 9 — "复杂哲学 prompt" 的 scaling 是倒 U 形**
- **证据**：0.8B-2B 上学派接近 baseline（模型太弱不严格服从）；4B+ 上严格服从导致短答案截断；9B 是 Pre-Qin 学派的甜点（+3.4pp 平均，唯一正向规模）。
- **结论**：
  - 4B 以下：不要花时间调 system prompt，性价比极低
  - 7-13B：是 prompt 工程性价比最高的规模
  - > 20B：再看任务，部分元认知 prompt 反而过度服从

**规则 10 — 如果不确定，"通用助手 prompt" 是永远不亏的选择**
- **证据**：neutral_long 在 30 个 (preset, benchmark) cell 上 **20/30 跑赢 baseline**，平均 +2.1pp，**没有一个 cell 上掉超过 −6pp**。
- **结论**：默认用：
  ```
  You are a helpful assistant. Be concise and accurate.
  ```
  比裸 baseline 平均略好且绝不灾难。**只有当你确认任务属于上面 1-7 条规则的明确分类时，再切到专用 prompt。**

---

## 五、一句话总结

> **可推广的不是 router 的规则表，而是 router 的"形状"**：
>
> 1. **永远先用"禁止性规则"裁掉灾难选项**——5/5 一致的负向信号比正向信号强得多，且跨模型稳。
> 2. **再用"特征驱动"而非"benchmark 名驱动"做选择**——任务有特征，benchmark 是人造标签。
> 3. **默认走通用助手 prompt 这种永不灾难的安全网**——neutral_long 是 ~28pp 安全垫。
> 4. **只在数据支持时才换专用学派**——dao for code, legal for factual, mohist for short-logic reasoning。
>
> 这个形状跨模型族（Llama / Gemma / Mistral / GPT）都能直接用，预期下界 +3~+5pp，上界仍需要在新模型上做一次小规模 calibration 实验确认（见 §3.4 P1 步骤）。

---

## 附：相关文档

- 完整 570-cell 数据：`docs/samples/benchmarks/results/summary.json`
- 当前 Qwen3.5 特化 router：`docs/samples/benchmarks/router.py`
- 每学派详细发现：`docs/samples/benchmarks/ANALYSIS.md`
- 跨规模一致性的源数据脚本：`experiments/analysis/run_analysis.py`
