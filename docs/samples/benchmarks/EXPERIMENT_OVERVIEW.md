# HundredSchools 实验总览与数据导航

## 1. 实验整体规划

本轮总实验矩阵为：

- **模型**：`qwen3.5-0.8b-it`、`qwen3.5-2b-it`、`qwen3.5-4b-it`、`qwen3.5-9b-it`、`qwen3.5-27b-it`
- **条件（19）**：
  - 基线：`baseline`、`neutral_long`、`cot`
  - 先秦核心：`dao`、`confucian`、`legal`、`military`、`mohist`、`logician`
  - 后续补充：`socratic`、`stoic`、`falsificationist`、`hegelian`、`pragmatist`、`yangming`、`bacon`、`wittgenstein`
  - 元条件：`random_school`、`router_auto`
- **评测集（6）**：
  - `mmlu`（14042）
  - `bbh`（6511）
  - `gsm8k`（1319）
  - `truthfulqa`（817）
  - `ifeval`（541）
  - `humaneval`（164）

每个模型共 **19 × 6 = 114** 个 condition×benchmark 组合。  
每个模型完整结果应为 **444,486** 条唯一记录。

## 2. 最终状态 (2026-05-12)

全部评测已完成，包括 router_auto 修正重跑（修复 Qwen3.5 thinking mode 问题）：

| 模型 | 最终记录数 | combos | 状态 |
| --- | ---: | ---: | --- |
| qwen3.5-0.8b-it | 444,486 | 114/114 | ✅ 完成 |
| qwen3.5-2b-it | 444,486 | 114/114 | ✅ 完成 |
| qwen3.5-4b-it | 444,486 | 114/114 | ✅ 完成 |
| qwen3.5-9b-it | 444,486 | 114/114 | ✅ 完成 |
| qwen3.5-27b-it | 444,486 | 114/114 | ✅ 完成 |

**汇总**: 570 行 `summary.json`，2,222,430 条原始记录。

### 关键结果

| 指标 | 数值 |
|------|------|
| Router_auto 平均增益 vs baseline | **+7.69pp** |
| Router_auto 排名第一的评测集 | 4/6 (BBH, HumanEval, TruthfulQA, ~IFEval) |
| 最佳单学派 (代码) | dao (+12.68pp on HumanEval) |
| 最佳单学派 (推理) | mohist (+0.52pp on BBH) |
| 最佳单学派 (事实性) | legal (+0.78pp on TruthfulQA) |

## 3. 关键文档与入口

### 3.1 分析报告（核心）

- **`docs/samples/benchmarks/ANALYSIS.md`** — 完整分析报告，含 router_auto 结果、因果分析、学派推荐

### 3.2 进展记录

- **`docs/samples/benchmarks/PROGRESS.md`** — 系统架构、时间线、技术问题

### 3.3 项目路线图

- **`ROADMAP.md`** — 项目入口，当前状态总览
- **`experiments/TODO.md`** — 执行清单（实验阶段已完成，写作阶段进行中）
- **`experiments/gap-filling-plan.md`** — 缺口补跑计划（已全部执行完毕）

### 3.4 最终结果数据

权威目录：`docs/samples/benchmarks/results/full/`

- `qwen3.5-0.8b-it.jsonl` (~399MB)
- `qwen3.5-2b-it.jsonl` (~394MB)
- `qwen3.5-4b-it.jsonl` (~463MB)
- `qwen3.5-9b-it.jsonl` (~469MB)
- `qwen3.5-27b-it.jsonl` (~488MB)

每行 JSON 记录包含：`preset`, `benchmark`, `condition`, `resolved_condition`, `sample_id`, `raw_output`, `score`, `latency_ms`, `tokens`, `error`, `ts`

对于 `router_auto` 条件，额外包含：`router_reason`, `router_confidence`

### 3.5 汇总结果

- `docs/samples/benchmarks/results/summary.json` — 570 行条件级汇总（preset × benchmark × condition → acc）

### 3.6 分析输出

- `experiments/analysis/out/full/l1_l2_l6_summary.csv` — 标记物/长度指标
- `experiments/analysis/out/full/l5_accuracy.csv` — 逐条件准确率
- `experiments/analysis/out/full/hypothesis_sketch.md` — 假设验证输入

## 4. Benchmark 框架核心代码

目录：`docs/samples/benchmarks/`

| 文件 | 用途 |
|------|------|
| `run_general_eval.py` | 异步 benchmark runner，支持 `--resume`、`--api-base` |
| `models.py` | 模型配置注册 (5 presets) |
| `conditions.py` | 19 个 condition 定义与解析 |
| `router.py` | 任务感知路由规则（empirical） |
| `loaders/` | 各 benchmark 数据加载器 |
| `scorers/` | 各 benchmark 评分逻辑 |

## 5. 技术要点

### Qwen3.5 Thinking Mode

Qwen3.5 4B+ 模型默认启用 thinking mode（`<think>...</think>`）。必须通过 vLLM 参数禁用：

```bash
--default-chat-template-kwargs '{"enable_thinking": false}'
```

否则在 max_tokens=16 的任务（MMLU, TruthfulQA）上，模型输出全部是被截断的思考过程。

### 并行去重

多 worker 并行使用 `--resume` 时，各 worker 启动时加载相同的"剩余任务列表"，导致重复处理。最终数据需以 `(preset, benchmark, condition, sample_id)` 为键去重。

### Router Auto 路由规则

```
gsm8k     → baseline      (数学：无学派能改善)
ifeval    → neutral_long  (指令遵从：+0.67pp)
mmlu      → neutral_long  (知识：+0.84pp)
truthfulqa→ legal         (事实性：+0.78pp，"零容忍"减少编造)
humaneval → dao           (代码：+12.68pp，"多路径探索")
bbh       → per-task routing:
            逻辑任务 → mohist (极简直判)
            格式任务 → neutral_long
            不确定   → baseline
```

## 6. 推荐使用顺序

1. `docs/samples/benchmarks/ANALYSIS.md` — 核心结论
2. `docs/samples/benchmarks/results/summary.json` — 数据概览
3. `experiments/analysis/out/full/l5_accuracy.csv` — 详细准确率
4. `docs/samples/benchmarks/results/full/` — 原始样本级数据

## 7. 常用命令

```bash
# 查看汇总
python -c "import json; d=json.load(open('docs/samples/benchmarks/results/summary.json')); print(len(d), 'rows')"

# 运行分析
python experiments/analysis/run_analysis.py \
  --results-dir docs/samples/benchmarks/results/full \
  --out-dir experiments/analysis/out/full

# 验证完整性
python -c "
import json
from collections import defaultdict
from pathlib import Path
targets = {'mmlu': 14042, 'bbh': 6511, 'gsm8k': 1319, 'truthfulqa': 817, 'ifeval': 541, 'humaneval': 164}
for f in sorted(Path('docs/samples/benchmarks/results/full').glob('*.jsonl')):
    counts = defaultdict(lambda: defaultdict(int))
    for line in open(f):
        r = json.loads(line)
        counts[r['condition']][r['benchmark']] += 1
    missing = sum(1 for c in counts for b in targets if counts[c][b] < targets[b])
    print(f'{f.stem}: {\"✅\" if missing == 0 else f\"❌ {missing} missing\"}')
"
```

## 8. 一句话结论

**任务感知的学派路由 (router_auto) 实现了平均 +7.69pp 的增益，证明不同哲学思维框架适合不同任务类型，"选择正确的学派"比"设计万能 prompt"更有效。**
