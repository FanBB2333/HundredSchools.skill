# HundredSchools 通用能力评测 · A6000 机器进展说明

> 更新日期：2026-04-28
> 机器配置：8 × NVIDIA RTX A6000 (48GB)，Driver 550.120，CUDA 12.9

---

## 一、硬件与环境现状

| 项目 | 状态 |
|------|------|
| GPU | 8 × RTX A6000 48GB，全部空闲可用 |
| Python 环境 | `/root/miniforge3/envs/torch/` (PyTorch 2.11.0+cu128) |
| vLLM | `/usr/local/bin/vllm` v0.19.1（系统 Python 3.12，非 conda 环境） |
| 已装依赖 | openai, nltk, absl-py, langdetect, immutabledict, datasets, pandas |

---

## 二、本地模型

| 模型 | 路径 | 权重 |
|------|------|------|
| Qwen3.5-0.8B | `/root/models/Qwen/Qwen3.5-0.8B` | OK |
| Qwen3.5-2B | `/root/models/Qwen/Qwen3.5-2B` | OK |
| Qwen3.5-4B | `/root/models/Qwen/Qwen3.5-4B` | OK |
| Qwen3.5-9B | `/root/models/Qwen/Qwen3.5-9B` | OK |
| Qwen3.5-27B | `/root/models/Qwen/Qwen3.5-27B` | OK |
| Gemma4-E2B-it | 不在本机（原在远程服务器） | 需下载或跳过 |

---

## 三、数据集（全部就绪）

所有数据集已下载到 `~/datasets/`：

| 数据集 | 路径 | 样本数 | 格式 |
|--------|------|--------|------|
| GSM8K | `~/datasets/gsm8k/test.parquet` | 1,319 | parquet |
| IFEval | `~/datasets/ifeval/ifeval_input_data.jsonl` | 541 | jsonl |
| MMLU | `~/datasets/mmlu/test.parquet` | 14,042 | parquet |
| BBH | `~/datasets/bbh/*.jsonl` (27 subtasks) | 6,511 | jsonl per task |
| HumanEval | `~/datasets/humaneval/test.parquet` | 164 | parquet |
| TruthfulQA | `~/datasets/truthfulqa/mc.parquet` | 817 (MC1) | parquet |

---

## 四、代码变更（已完成）

### 4.1 `models.py` 更新

- 路径从远程服务器 (`/home/l1ght/models/`) 改为本机 (`/root/models/Qwen/`)
- 新增 preset：`qwen3.5-4b-it`、`qwen3.5-9b-it`、`qwen3.5-27b-it`
- 当前共 6 个 preset（含 gemma4-e2b-it）

### 4.2 新增 Loader（4 个）

| 文件 | 数据集 | 说明 |
|------|--------|------|
| `loaders/mmlu.py` | MMLU | 4-choice MCQ，按 subject 分层抽样（limit 时） |
| `loaders/bbh.py` | BBH | 读取 27 个 subtask jsonl，CoT prompt 格式 |
| `loaders/humaneval.py` | HumanEval | 代码补全，发送函数签名 + docstring |
| `loaders/truthfulqa.py` | TruthfulQA | MC1 单选，numpy array 已处理 |

### 4.3 新增 Scorer（3 个）

| 文件 | 适用 benchmark | 评分逻辑 |
|------|---------------|---------|
| `scorers/mcq.py` | MMLU, TruthfulQA | 正则提取 A-D 字母，三级回退匹配 |
| `scorers/bbh_router.py` | BBH | 提取 "So the answer is X"，支持 (A)/(B) 和 True/False |
| `scorers/code_exec.py` | HumanEval | 提取代码块 → 拼接测试 → subprocess 沙箱执行 |

### 4.4 `run_general_eval.py` 更新

- 注册了全部 6 个 benchmark（gsm8k, ifeval, mmlu, bbh, humaneval, truthfulqa）
- `--benchmarks` 参数现在支持所有 6 个
- 新增 `--shard-index/--shard-count`，支持按 sample 分片续跑
- JSONL 写入增加跨进程文件锁，便于多进程安全续跑
- 所有 import 和注册已验证通过

### 4.5 新增本地 OpenAI 兼容服务

| 文件 | 说明 |
|------|------|
| `local_openai_server.py` | Transformers + aiohttp 实现 `/v1/chat/completions`，用于 vLLM CUDA kernel 不兼容时的本地 fallback |

该服务默认对 Qwen3.5 chat template 传入 `enable_thinking=False`，避免长思考模式导致 IFEval/GSM8K 输出过长，并与 Qwen3.5 README 的 non-thinking baseline 对齐。

### 4.6 验证状态

```
✅ 6 个 loader 全部通过 load(limit=3) 测试
✅ 5 个 scorer 全部通过单元测试
✅ run_general_eval.py import 正常，注册表完整
✅ local_openai_server.py OpenAI API smoke 通过
✅ Phase 2 新增 benchmark（mmlu/bbh/humaneval/truthfulqa）limit=1 smoke 通过
```

---

## 五、已有评测结果（Phase 1 已完成）

Phase 1 目标：GSM8K + IFEval × 8 条件，6 个模型均已完成：

| Preset | GSM8K (baseline acc) | IFEval (baseline strict_prompt) | 状态 |
|--------|--------|--------|------|
| qwen3.5-0.8b-it | 53.68% | 46.58% | ✅ 完成 |
| qwen3.5-2b-it | 78.85% | 60.44% | ✅ 完成 |
| gemma4-e2b-it | 90.83% | 70.06% | ✅ 完成 |
| qwen3.5-4b-it | 94.09% | 73.94% | ✅ 本机完成 |
| qwen3.5-9b-it | 94.31% | 75.79% | ✅ 本机完成 |
| qwen3.5-27b-it | 96.74% | 77.82% | ✅ 本机完成 |

每个模型的结果：8 条件 × (1319 GSM8K + 541 IFEval) = 14,880 条记录，存于 `results/<preset>.jsonl`。

本机新增结果：

| 文件 | 行数 | API errors |
|------|------|------------|
| `results/qwen3.5-4b-it.jsonl` | 14,880 | 0 |
| `results/qwen3.5-9b-it.jsonl` | 14,880 | 0 |
| `results/qwen3.5-27b-it.jsonl` | 14,880 | 0 |

`summary.md` 和 `summary.json` 已用全部 6 个 Phase 1 结果重新生成，共 89,280 条 raw rows，96 个聚合单元。

### 5.1 Qwen3.5-27B 评测与提速记录

- vLLM TP2 仍在 Qwen3.5 GDN/linear-attention 初始化路径触发 A6000 kernel 不兼容，无法通过增加 KV cache 或 `gpu-memory-utilization` 修复。
- 已安装/验证 `causal-conv1d` 与 `flash-linear-attention`/`fla-core`，Transformers 路径不再走缺失 fast path 的警告路径。
- 27B 使用 4 个本地 OpenAI fallback 服务，每个服务绑定 2 张 A6000；GSM8K 阶段使用 batch=64 / runner concurrency=128，显存峰值接近 48GB/卡，吞吐明显高于最初纯串行/小 batch 路径。
- IFEval 长输出阶段 batch=64、batch=16 容易被少量超长输出拖慢尾延迟；最终使用 resume + batch=4 + 2-way shard 补齐 `military`/`logician` 尾段。最终 8 个 condition 均为 1,860 行，唯一键 14,880，API/score errors 均为 0。

### 5.1.1 vLLM A6000 调试补充

- 默认 vLLM attention backend 会在 A6000 上触发 flash-attn `no kernel image is available for execution on the device`；对 Qwen3.5-0.8B、4B、9B，使用 `--attention-backend TRITON_ATTN` 可正常启动。
- 推荐 vLLM 启动参数（适用于 0.8B/4B/9B 后续评测）：

```bash
CUDA_VISIBLE_DEVICES=0 /usr/local/bin/vllm serve /root/models/Qwen/Qwen3.5-9B \
  --served-model-name qwen3.5-9b \
  --host 127.0.0.1 \
  --port 8001 \
  --trust-remote-code \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.85 \
  --max-num-seqs 64 \
  --max-num-batched-tokens 8192 \
  --attention-backend TRITON_ATTN
```

- Qwen3.5-27B 在 vLLM 0.19.1 下仍无法启动：已尝试 `TRITON_ATTN`、`--enforce-eager`、`--gdn-prefill-backend triton`、TP=2/4、禁用 PyNCCL/自定义 all-reduce、单卡 `--cpu-offload-gb`、`--dtype float16`，均在 GDN/linear-attention profile run 中触发 CUDA `no kernel image`。因此 27B 的 Phase 2 后续若严格要求 vLLM，需要先升级/重编 vLLM 及相关 GDN/FLA kernel 对 sm_86 的支持。

### 5.2 实验结论（GSM8K + IFEval）

1. **规模提升带来明显基线收益，但 GSM8K 在 4B 后趋于平台期。** Qwen3.5 baseline GSM8K 从 0.8B 的 53.68% 提升到 2B 的 78.85%，4B 达到 94.09%，9B 为 94.31%，27B 进一步到 96.74%。IFEval 也随规模提升，从 46.58% → 60.44% → 73.94% → 75.79% → 77.82%，但 9B 到 27B 的增幅小于 0.8B 到 4B。
2. **neutral_long 基本不改变能力排序。** 对 27B，neutral_long 在 GSM8K 上比 baseline 高 0.45pp，在 IFEval 上高 0.18pp；其他 Qwen 模型也大多只在 ±1pp 左右波动，说明“更长但中性”的系统提示不是主要干扰源。
3. **学派提示普遍会损伤通用任务，且对 IFEval 的影响大于对 GSM8K。** 27B 在 GSM8K 上的六个学派平均仅比 baseline 低 1.82pp，最差是 legal -3.41pp；但 IFEval 平均下降 15.31pp，legal -31.24pp、military -22.18pp、logician -19.78pp 最明显。
4. **大模型更能抵抗数学任务中的风格扰动。** Qwen3.5 学派提示在 GSM8K 上的平均下降幅度从 0.8B 的 -17.36pp、2B 的 -15.74pp，缩小到 4B 的 -7.28pp、9B 的 -6.58pp，并在 27B 缩小到 -1.82pp。
5. **指令遵循对角色/价值框架提示更敏感，规模不能完全解决。** 27B 的 IFEval baseline 最高，但 legal/military/logician 下跌幅仍超过 19pp，说明强规范性或辩论性 system prompt 会显著改变回答格式/约束遵循，不能简单依靠更大参数量抵消。
6. **Gemma4-E2B-it 在该组结果中相对高效。** Gemma4-E2B-it baseline GSM8K 90.83%、IFEval 70.06%，明显高于 Qwen3.5-2B，并接近 Qwen3.5-4B 的部分能力，但本机未下载 Gemma 权重，当前结果来自已有记录。

---

## 六、待解决问题

### 6.1 vLLM 启动失败

**症状**：vLLM v0.19.1 在本机启动时，在 `_initialize_kv_caches` → `determine_available_memory` 阶段崩溃。

**已尝试**：
- `--enforce-eager`：仍然失败
- `--gpu-memory-utilization 0.85`：仍然失败
- GPU 状态正常（`nvidia-smi` 显示 8 卡全部空闲）
- `--max-model-len 4096`、`--gdn-prefill-backend triton`、`VLLM_ENABLE_FLA_PACKED_RECURRENT_DECODE=0`、`VLLM_USE_V1=0`：仍然失败

**已定位原因**：

vLLM 在 Qwen3.5 的 `gdn_linear_attn.py` 路径触发 `torch.AcceleratorError: CUDA error: no kernel image is available for execution on the device`。系统 PyTorch 与 conda PyTorch 都包含 `sm_86`，但 vLLM/Qwen3.5 GDN/linear-attention 相关 kernel 在 A6000 上不可用。

**当前绕过方案**：

使用 `docs.samples.benchmarks.local_openai_server` 通过 Transformers fallback 路径提供 OpenAI 兼容接口，8 卡按单卡或双卡服务并行运行评测。该路径已完成 qwen3.5-4b-it、qwen3.5-9b-it 与 qwen3.5-27b-it 的 Phase 1。

**建议修复方向**：
- 方案 A：等待/安装支持 A6000 sm_86 的 vLLM Qwen3.5 GDN kernel wheel
- 方案 B：尝试从源码编译 vLLM / flash-linear-attention / causal-conv1d
- 方案 C：继续使用 `local_openai_server.py` fallback 路径完成 benchmark

---

## 七、后续需要完成的工作

### 阶段 1：修复 vLLM 并完成 Phase 1（已完成）

1. ✅ 已定位 vLLM 原生失败原因，并用本地 OpenAI fallback 完成评测
2. ✅ `qwen3.5-4b-it` × GSM8K + IFEval × 8 条件已完成
3. ✅ `qwen3.5-9b-it` × GSM8K + IFEval × 8 条件已完成
4. ✅ `qwen3.5-27b-it` × GSM8K + IFEval × 8 条件已完成
5. ✅ 已运行 `analyze.py` 更新 `summary.md` 和 `summary.json`

### 阶段 2：扩充到 6 个 benchmark（Phase 2）

对全部 6 个模型（或 5 个 Qwen 模型），运行新增的 4 个 benchmark：

| Benchmark | 样本数 | 条件数 | 总推理次数（per model） |
|-----------|--------|--------|----------------------|
| MMLU | 14,042 | 8 | 112,336 |
| BBH | 6,511 | 8 | 52,088 |
| HumanEval | 164 | 8 | 1,312 |
| TruthfulQA | 817 | 8 | 6,536 |

每个模型 Phase 2 全量为 172,272 条记录。

当前状态：

| Preset | Phase 2 行数 | 唯一键 | API errors | Score errors | 状态 |
|--------|-------------:|-------:|-----------:|-------------:|------|
| qwen3.5-0.8b-it | 172,272 | 172,272 | 0 | 0 | ✅ 完成 |
| qwen3.5-2b-it | 172,272 | 172,272 | 0 | 0 | ✅ 完成 |
| qwen3.5-4b-it | 172,272 | 172,272 | 0 | 0 | ✅ 完成 |
| qwen3.5-9b-it | 172,272 | 172,272 | 0 | 0 | ✅ 完成 |
| qwen3.5-27b-it | 61,935 partial（fallback 产物，已暂停） | 61,935 | 0 | 0 | ⏸ 等待 vLLM 27B kernel 问题解决 |

已完成模型的 Phase 2 baseline：

| Preset | MMLU | BBH | HumanEval | TruthfulQA |
|--------|-----:|----:|----------:|-----------:|
| qwen3.5-0.8b-it | 43.91% | 39.58% | 25.00% | 42.23% |
| qwen3.5-2b-it | 54.94% | 43.46% | 17.68% | 43.82% |
| qwen3.5-4b-it | 70.95% | 56.63% | 68.29% | 66.83% |
| qwen3.5-9b-it | 77.80% | 60.37% | 4.88% | 72.71% |

Phase 2 中，学派/长提示相对 baseline 的最优变化如下：

| Preset | MMLU | BBH | HumanEval | TruthfulQA |
|--------|------|-----|-----------|------------|
| qwen3.5-0.8b-it | mohist -0.63pp | neutral_long +2.12pp | dao +1.22pp | dao +2.20pp |
| qwen3.5-2b-it | neutral_long +3.57pp | neutral_long +4.72pp | dao +22.56pp | dao +8.57pp |
| qwen3.5-4b-it | neutral_long +2.14pp | mohist +2.15pp | confucian +2.44pp | mohist +3.55pp |
| qwen3.5-9b-it | neutral_long +0.13pp | mohist +14.19pp | confucian +76.83pp | mohist +2.45pp |

注意：`qwen3.5-9b-it` 的 HumanEval baseline 仅 4.88%，但多个学派条件大幅更高，说明该项很可能受到输出格式/代码块提取方式影响；后续分析应抽样检查 baseline 原始输出，避免把格式差异误判为真实编程能力差异。

`summary.md` 和 `summary.json` 已更新到 224 个聚合单元、778,368 条 raw rows（Phase 1 全部 6 模型 + Phase 2 已完成的 4 个 Qwen 模型）。

### 7.1 基于实验结果的 Router 设计结论

结论：**可以做，但应采用保守型 router，而不是把“平均最佳学派”直接全局替换 baseline。**

- **baseline 仍然是最稳的默认项。** GSM8K 明显偏向 baseline；IFEval 只有 `neutral_long` 有小幅稳定增益；TruthfulQA 的正增益很弱且不稳定。
- **router 的主要价值来自“局部高置信增益”。** 在已完成的 Phase 2 里，BBH 的部分 task 对 `mohist` 或 `neutral_long` 有明显提升，例如 `formal_fallacies`、`logical_deduction_*`、`geometric_shapes` 更偏向 `mohist`，而 `boolean_expressions`、`multistep_arithmetic_two`、`navigate` 更偏向 `neutral_long`。
- **HumanEval 暂不应作为路由证据。** 9B baseline 与学派之间差异过大，更像输出格式/代码提取差异，因此 router 对代码问题默认回退到 baseline。

因此，新增的 `router_auto` 条件采用以下策略：

1. GSM8K / 数学 word problem：**baseline**
2. IFEval / 强格式约束提示：**neutral_long**
3. MMLU：**neutral_long**（小幅但相对稳定）
4. TruthfulQA：**baseline**（收益弱且不稳）
5. HumanEval / 代码问题：**baseline**
6. BBH：对已观察到高置信收益的 task，定向选择 **mohist** 或 **neutral_long**；其余 task 保守回退 baseline 或 neutral_long

实现上，router 不会替换原有 8 条件，只新增一个 **opt-in** 的 `router_auto` condition，并在 raw JSONL 中额外记录：

- `resolved_condition`
- `router_reason`
- `router_confidence`

这样后续可以把 router 作为第 9 个实验条件单独评测，并追踪它每道题到底选择了哪个学派。

运行命令示例：
```bash
cd /root/fzy/repos/HundredSchools.skill

# Phase 2 单模型运行
python -m docs.samples.benchmarks.run_general_eval \
  --preset qwen3.5-0.8b-it \
  --benchmarks mmlu bbh humaneval truthfulqa \
  --resume

# 或指定 limit 快速验证
python -m docs.samples.benchmarks.run_general_eval \
  --preset qwen3.5-0.8b-it \
  --benchmarks mmlu \
  --limit 100 \
  --conditions baseline neutral_long
```

### 阶段 3：分析与可视化（Phase 3）

- 扩展 `analyze.py` 支持 6 个 benchmark 的聚合
- 生成学派 × benchmark 热力图
- 生成 per-benchmark 5×8 柱图
- 更新 `summary.md`

### 阶段 4：Gemma4 模型（可选）

- 下载 Gemma4-E2B-it / E4B-it 到本机
- 补充 Gemma 系列的全 benchmark 结果

---

## 八、文件清单

```
docs/samples/benchmarks/
├── __init__.py
├── models.py              # ✅ 已更新（6 presets, 本机路径）
├── conditions.py          # ✅ 未变（8 条件）
├── run_general_eval.py    # ✅ 已更新（注册 6 benchmarks，支持 sharding）
├── local_openai_server.py # 🆕 新增（Transformers OpenAI-compatible fallback）
├── analyze.py             # ✅ 未变（待 Phase 3 扩展）
├── loaders/
│   ├── __init__.py
│   ├── gsm8k.py           # ✅ 已修复路径兼容
│   ├── ifeval.py           # ✅ 未变
│   ├── mmlu.py            # 🆕 新增
│   ├── bbh.py             # 🆕 新增
│   ├── humaneval.py       # 🆕 新增
│   └── truthfulqa.py      # 🆕 新增
├── scorers/
│   ├── __init__.py
│   ├── numeric.py         # ✅ 未变
│   ├── ifeval_rules.py    # ✅ 未变
│   ├── ifeval_lib/        # ✅ 未变
│   ├── mcq.py             # 🆕 新增（MMLU/TruthfulQA）
│   ├── bbh_router.py      # 🆕 新增
│   └── code_exec.py       # 🆕 新增（HumanEval）
└── results/
    ├── gemma4-e2b-it.jsonl    # ✅ Phase 1 完成
    ├── qwen3.5-0.8b-it.jsonl  # ✅ Phase 1 完成
    ├── qwen3.5-2b-it.jsonl    # ✅ Phase 1 完成
    ├── qwen3.5-4b-it.jsonl    # ✅ Phase 1 本机完成
    ├── qwen3.5-9b-it.jsonl    # ✅ Phase 1 本机完成
    ├── qwen3.5-27b-it.jsonl   # ✅ Phase 1 本机完成
    ├── summary.json
    └── summary.md
```
