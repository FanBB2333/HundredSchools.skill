# HundredSchools 通用能力评测 · 完整实施方案

> 目标:用 Qwen3.5 / Gemma4 两家小模型,在**两家 paper 都报告过的通用能力 benchmark** 上,
> 验证"诸子百家"system-prompt steering 是否产生**可复现、可归因、方向正确**的差异。

---

## 一、目标与不变量

**目标**:用 5 个小模型 × 8 条件 × 6–8 个通用 benchmark,
衡量添加 HundredSchools skill 前后在通用能力指标上的性能差异,并与 paper 基线对齐。

**不变量**(评审时会被挑战的三条底线):

1. baseline 必须**复现论文分数 ±2 分以内**——证明 harness 公平
2. 每组条件必须跑**相同 prompt 样本、相同 seed、相同解码参数**
3. 必须有 **neutral-long** 中性长 prompt 对照组——分离"百家效应"与"任何 system prompt 效应"

---

## 二、模型 Preset(本地 Ollama / vLLM 均可)

全部使用 **it / Instruct 版本**。Base(pretrained-only)模型 chat template 不存在,system prompt 进不了 system slot,在 steering 实验里没有意义。

| Preset 名 | HF 模型名 | Ollama tag | 备注 |
|---|---|---|---|
| `qwen3.5-0.8b-it` | `Qwen/Qwen3.5-0.8B-Instruct` | `qwen3.5:0.8b-instruct` | 手机级,烟测 |
| `qwen3.5-2b-it`   | `Qwen/Qwen3.5-2B-Instruct`   | `qwen3.5:2b-instruct`   | 快速迭代主力 |
| `qwen3.5-4b-it`   | `Qwen/Qwen3.5-4B-Instruct`   | `qwen3.5:4b-instruct`   | 质量档 |
| `gemma4-e2b-it`   | `google/gemma-4-E2B-it`      | `gemma4:e2b-it`         | PLE,边缘 |
| `gemma4-e4b-it`   | `google/gemma-4-E4B-it`      | `gemma4:e4b-it`         | 128K 上下文 |

---

## 三、Benchmark 矩阵

每个学派至少有一个能赢的 benchmark,否则无法证明"诸子百家"作为抽象的必要性——
如果 6 家最后只有 2 家在所有 benchmark 上都赢,诚实裁剪优于虚假收敛。

### 各学派 × benchmark 映射(Qwen3.5 / Gemma4 paper 都报过的)

| 学派 | 机理 | 对应 benchmark | 论文是否报告 | 预期方向 |
|---|---|---|---|---|
| **兵家** 庙算 | 先评估后行动 | **GSM8K / MATH / AIME 2025** | ✅ 两家都报 | CoT 规划类,分数 ↑ |
| **兵家 / 名家** | 逐步推理 | **BBH, GPQA-Diamond** | ✅ 两家都报 | ↑ |
| **墨家** 节用 | 极简输出 | **IFEval (format-strict)** | ✅ 两家都报 | strict ↑;loose 可能 ↓ |
| **名家** 控名责实 | 识破框架攻击 | **TruthfulQA, AdvBench / HarmBench, JailbreakBench** | ✅ Gemma4 明确报告 HarmBench | 越狱成功率 ↓ |
| **法家** 以断于法 | 零容忍规则 | **XSTest unsafe + AdvBench** | ✅ 两家都报 safety | unsafe 拒绝率 ↑ |
| **儒家** 克己复礼 | 建设性拒绝 | **OR-Bench + MT-Bench helpful** | ✅ | 过度拒绝 ↓,helpfulness ↑ |
| **道家** 无为 | 保留多解 | **MT-Bench creative / AlpacaEval 多样性 / TruthfulQA 的 "I don't know" 正确率** | 部分 | 开放任务 diversity ↑;确定题可能 ↓ |

### 同时必须跑的对照 / sanity check

| benchmark | 作用 |
|---|---|
| **MMLU / MMLU-Pro** | 纯知识题,schools 不应有大影响。若任一学派在 MMLU 上掉 >2 分,说明污染了知识提取——反面证据同样有价值 |
| **HumanEval / MBPP / LiveCodeBench** | 代码。墨家应持平或 ↑,儒家/道家可能 ↓。两家 paper 都报 |
| **"中性长 system prompt"对照组** | 排除"任何长 prompt 都会影响"的 confound |

### 最小可信实验矩阵(一期)

- **模型**:Qwen3.5-0.8B/2B/4B-it、Gemma4-E2B-it、Gemma4-E4B-it(共 5 个)
- **条件**(8 组):baseline + neutral-long + 6 schools
- **Benchmark**(6 个一期全规则评分,2 个 judge-based 放二期):
  1. MMLU(知识基线,sanity)
  2. GSM8K(数学推理 → 兵家)
  3. IFEval(指令遵循 → 墨家/法家)
  4. BBH(复杂推理 → 兵家/名家)
  5. HumanEval(代码 → 墨家)
  6. TruthfulQA(对抗性真实性 → 名家)
  7. *[P2]* HarmBench / AdvBench(越狱 → 法家/名家,用 Llama-Guard-3 本地判 judge)
  8. *[P2]* MT-Bench / Arena-Hard(开放对话 → 儒家/道家,用本地 9B/27B 当 judge)

**总 API 调用量估算**:5 模型 × 8 条件 × ≈ 4500 题 ≈ **180K 次推理**。
小模型 vLLM 并发 6–8 下,总耗时约 **24–36 小时**(checkpoint/resume 可分段)。

---

## 四、目录结构变更

原则:**新代码独立成子目录,不动现有 `run_8b_benchmark_eval.py`**——safety 流水线已稳定,不要在同一文件里再塞通用 benchmark。

```
docs/samples/
├── benchmarks/                    # 新增:通用能力评测模块
│   ├── __init__.py
│   ├── models.yaml                # 模型 preset 注册表
│   ├── conditions.py              # 8 个条件(baseline/neutral-long/6 schools)
│   ├── loaders/
│   │   ├── mmlu.py
│   │   ├── gsm8k.py
│   │   ├── ifeval.py
│   │   ├── bbh.py
│   │   ├── humaneval.py
│   │   └── truthfulqa.py
│   ├── scorers/
│   │   ├── mcq.py                 # 多选题 (MMLU/TruthfulQA-MC1)
│   │   ├── numeric.py             # GSM8K 数字抽取
│   │   ├── ifeval_rules.py        # IFEval 官方规则检查(移植)
│   │   ├── bbh_router.py          # 按子任务路由
│   │   └── code_exec.py           # HumanEval 沙箱执行
│   ├── run_general_eval.py        # 新 runner(复用现有 ETA/checkpoint 架构)
│   └── analyze.py                 # 聚合 + 对比图生成
└── run_8b_benchmark_eval.py       # 保留不动(safety 4 套仍用)

datasets/
├── mmlu/                          # 新增
├── gsm8k/
├── ifeval/
├── bbh/
├── humaneval/
├── truthfulqa/
└── (已有 4 个 safety 数据集)
```

---

## 五、关键文件设计

### 1. `benchmarks/models.yaml`(模型 preset 注册表)

```yaml
presets:
  qwen3.5-0.8b-it:
    api_base: http://localhost:11434/v1
    model: qwen3.5:0.8b-instruct
    timeout: 30
    concurrency: 8
    max_tokens: 1024
    temperature: 0.0
    paper_baseline: {mmlu: 58.2, gsm8k: 62.1, ifeval: 61.0}  # 跑完一轮回填

  qwen3.5-2b-it:
    api_base: http://localhost:11434/v1
    model: qwen3.5:2b-instruct
    timeout: 45
    concurrency: 6
    max_tokens: 1024
    temperature: 0.0
    paper_baseline: {...}

  # qwen3.5-4b-it / gemma4-e2b-it / gemma4-e4b-it 同上
```

Runner 通过 `--preset qwen3.5-2b-it` 一键切换。
`paper_baseline` 字段让 `analyze.py` 自动画出"论文 baseline 横线"。

### 2. `benchmarks/conditions.py`(8 条件)

```python
from docs.samples.run_8b_benchmark_eval import SCHOOL_PROMPTS  # 复用

# 调整到 ≈ 6 家 school prompt 的平均 token 数
_NEUTRAL_LONG = (
    "You are a helpful, knowledgeable assistant. Be accurate, clear, and "
    "follow the user's instructions precisely. Take a moment to understand "
    "the request before answering. Avoid unnecessary padding, cite reasoning "
    "when it aids correctness, and do not produce content you are not asked to."
)

CONDITIONS = {
    "baseline": None,
    "neutral_long": _NEUTRAL_LONG,
    **SCHOOL_PROMPTS,  # dao / confucian / legal / military / mohist / logician
}
```

### 3. `benchmarks/loaders/*.py`(每个 benchmark 一个)

统一返回 `dict` 格式:

```python
{
    "dataset": "gsm8k",
    "sample_id": "test_042",
    "prompt": "...",
    "gold": "72",               # scorer 消费
    "meta": {"subject": "..."}  # 分组分析用
}
```

**数据来源**(全部公开):

| benchmark | 来源 | 规模 |
|---|---|---|
| MMLU | `cais/mmlu` test split | 14042 → 分层抽 1000 |
| GSM8K | `gsm8k` test split | 1319 全量 |
| IFEval | `google/IFEval` | 541 全量 |
| BBH | `lukaemon/bbh` | 6511(或每子任务 40 题分层) |
| HumanEval | `openai/openai_humaneval` | 164 全量 |
| TruthfulQA | `truthful_qa` MC1 | 817 全量 |

### 4. `benchmarks/scorers/*.py`(一期全部规则评分)

不引入 GPT-4 judge——小模型评测不该被 judge 成本卡住:

| Scorer | 实现 |
|---|---|
| `mcq.py` | 正则抽 `A/B/C/D`,等于 gold → correct |
| `numeric.py` | 抽最后一个 `-?\d+(\.\d+)?`,与 gold 数值相等 |
| `ifeval_rules.py` | 从 `google-research/instruction_following_eval` 移植规则库(strict / loose 两档) |
| `bbh_router.py` | 按 `task` 字段路由到 mcq 或 exact-match |
| `code_exec.py` | `tempfile` + `subprocess` 带超时,pass@1 |

MT-Bench / HarmBench(需 judge)放二期。

### 5. `benchmarks/run_general_eval.py`

参考 `run_8b_benchmark_eval.py`,保留 ETA / checkpoint / async concurrency,新增:

- `--preset` 读 `models.yaml`
- `--benchmarks` 多选 MMLU / GSM8K / IFEval / BBH / HumanEval / TruthfulQA
- 条件从 `conditions.py` 读 8 条
- `--limit` 支持 per-benchmark 限额(快速迭代时用)
- 输出格式:每行一条
  `{preset, condition, benchmark, sample_id, gold, pred, correct, latency_ms, tokens}`

### 6. `benchmarks/analyze.py`(对比图)

输入:runner 产出的 JSONL。输出:

- 每个 benchmark 一张 PNG,横轴 5 个模型,纵轴得分,柱子:
  1. paper_baseline(灰线,来自 `models.yaml`)
  2. 我们的 baseline(深色柱)
  3. neutral_long(浅色柱)
  4. 6 家学派(各一色)
- **热力图**:行=6 学派,列=6 benchmark,值=**Δ vs neutral_long**。
  这才是"百家效应"的净值——也是最有说服力的一张图。
- `summary.md`:每(模型, benchmark)显示 Δ vs baseline 和 Δ vs neutral_long。

---

## 六、分阶段实施计划

### Phase 0 · 脚手架(0.5 天)

1. 建目录 `benchmarks/`,放空壳模块
2. 写 `models.yaml` 的 5 个 preset(`paper_baseline` 字段**先留空**,跑完一轮再回填)
3. 写 `conditions.py`,校准 `neutral_long` 的 token 数

### Phase 1 · 最小可运行闭环(1.5 天)—— 先跑通 2 个 benchmark

选 **GSM8K + IFEval**:前者有官方 paper 数字、后者是 system-prompt 最敏感的 benchmark,一正一反。

1. 实现 `loaders/gsm8k.py`, `loaders/ifeval.py`
2. 实现 `scorers/numeric.py`, `scorers/ifeval_rules.py`
3. 实现 `run_general_eval.py` 主流程(可大量 copy 自 `run_8b_benchmark_eval.py`)
4. **先只跑 `qwen3.5-0.8b-it × baseline`** —— 验证分数接近 paper(±2 分)。
   若差距大,**停下排查**(chat template? 解码参数? 数据集版本?),不要继续扩展。
5. baseline 校准通过后,扩到 5 模型 × 8 条件

**Phase 1 退出标准**:两张对比图 + `summary.md`,
能清晰看到**墨家 / 法家在 IFEval-strict 上 vs neutral_long 的差值**。

### Phase 2 · 扩充到 6 个 benchmark(2 天)

补 MMLU / BBH / TruthfulQA / HumanEval。
其中 HumanEval 的 `code_exec.py` 要写**沙箱**(subprocess + resource limit + network off),这是唯一有安全性的环节。

### Phase 3 · 分析与可视化(1 天)

`analyze.py` 产出:

1. 每个 benchmark 的 5×8 柱图
2. 学派 × benchmark 热力图
3. `summary.md` 中的**诚实段落**:列出所有"学派 < neutral_long"的组合——
   这些是反向证据,**必须保留**。

### Phase 4 · Judge-based benchmark(可选,3 天)

若 Phase 1–3 结果足够有说服力再做:

- MT-Bench(用本地更大的 Qwen3.5-9B 或 Gemma4-26B 作 judge,省 GPT-4 成本)
- HarmBench(用 Llama-Guard-3 本地分类器)

---

## 七、预期产出物

```
docs/samples/benchmarks/results/
├── raw_results.jsonl                          # 每条预测一行
├── summary.md                                 # 主对比表(markdown)
├── figures/
│   ├── gsm8k_comparison.png
│   ├── ifeval_strict_comparison.png
│   ├── mmlu_comparison.png
│   ├── bbh_comparison.png
│   ├── humaneval_comparison.png
│   ├── truthfulqa_comparison.png
│   └── schools_vs_benchmarks_heatmap.png      # 最有说服力的一张
└── baseline_reproduction.md                   # 我方 baseline vs paper baseline 表
```

Web UI 侧:在 `web/src/data/models.ts` 旁新增 `general_benchmarks.ts`,
数据来自 `analyze.py` 导出;UI 加一个 "通用能力" tab。

---

## 八、资源与时间估算

| 资源 | 估算 |
|---|---|
| 本地 GPU | 单张 24GB(RTX 4090 / L4)跑 0.8B/2B/E2B 绰绰有余;4B/E4B 建议 fp16 或 Q6 量化 |
| 总推理次数 | 5 模型 × 8 条件 × ≈ 4500 题 ≈ **180K 次调用** |
| 单次 P50 延迟 | 小模型 vLLM 并发 8 下约 200–400ms |
| 总耗时 | **24–36 小时**(checkpoint/resume 可分多段) |
| 人力 | Phase 0–3 约 **5 个工作日**,IFEval 规则移植 + code_exec 沙箱最耗时 |

---

## 九、两条容易忽视的坑

### 1. chat template

Qwen3.5 和 Gemma4 的 chat template 不同。
Gemma 历史上**不原生支持 system role**,其 `<start_of_turn>user` 格式要求把 system prompt 前置到第一条 user 消息。

**务必用各家官方 `tokenizer.apply_chat_template` 确认 system prompt 是否真的进模型了**,
否则会得到"百家无效"的**虚假负面结论**。

### 2. 解码温度

`temperature=0` 在 GSM8K / MMLU / IFEval 上 OK,
但 HumanEval 业界惯例用 `temperature=0.2, top_p=0.95`。

为了和 paper 对齐,**每个 benchmark 单独配置解码参数**,
写进 `models.yaml` 的每个 preset 下或 benchmark 元数据里。

---

## 十、下一步

建议以 **Phase 0 + Phase 1** 作为第一个可交付里程碑:

- 产出 `qwen3.5-0.8b-it × baseline × GSM8K (limit 50)` 可跑通的最小闭环
- `benchmarks/` 目录骨架完整
- GSM8K + IFEval 两个 loader / scorer 可用
- `run_general_eval.py` 支持 `--preset / --benchmarks / --conditions / --limit` 四个核心参数

Phase 1 跑通后,再决定是否进入 Phase 2 全量矩阵。
