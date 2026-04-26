# A6000 全栈执行 Runbook · HundredSchools 通用能力评测

> **本文档面向在 8×A6000 服务器上运行的 Claude（或其他 agent）**。读到这里说明你已经通过跳板机 SSH 登入 A6000，仓库已 clone 到本机。
>
> **本轮所有工作（写脚手架、调 chat template、跑 pilot、跑全量、出图、打包）全部在 A6000 上完成**。开发机（3090Ti）不参与，仓库回传只走最终结果 tarball。
>
> 设计依据：[docs/scale-curve-experiment-plan.md](scale-curve-experiment-plan.md)。本文档是该方案的**执行手册**——方案不可改，代码可写。

---

## 0. 任务范围与边界

### 你要做的（按顺序）

1. **建脚手架**：在 `docs/samples/benchmarks/` 下创建 11 个 benchmark loader、对应 scorer、统一 runner、analyze 脚本
2. **chat template 验证**：对 6 个模型分别 dump，确认 6 家 system prompt 真的注入
3. **Pilot 烟测**：`qwen3.5-2b-it × 8 conditions × {GSM8K, IFEval, OR-Bench-Hard}(limit 50)`，验证信号存在
4. **Full batch**：6 模型 × 8 条件 × 11 benchmark 全量
5. **出图 + 打包**：`analyze.py` 出图，tar.gz 结果

### 你**不能**改的

- [scale-curve-experiment-plan.md](scale-curve-experiment-plan.md) 中：模型矩阵（§3）、benchmark 矩阵（§4）、8 条件定义（§5）、两个新指标（§4 末）
- [hundredschools/SKILL.md](../hundredschools/SKILL.md) 中的 6 家 system prompt 措辞（已固化）
- 解码温度按 benchmark 分别配置的原则（plan §12-2）

### 你**可以**改的

- 脚手架代码本身的实现细节（loader 怎么写、scorer 怎么写、runner 用 asyncio 还是 multiprocessing）
- benchmark 数据集的具体 HF 路径（如 `cais/mmlu` 失效可换镜像）
- vLLM 启动参数（`--gpu-memory-utilization`、`--max-model-len`、并发数）以适配实际显存

### 不在你职责内（遇到则停下问用户）

- 改 system prompt 的措辞
- 增/减 benchmark
- 解读结果是否支持/反驳"百家有效"假设
- 切换到非 vLLM 的推理后端

---

## 1. 环境准备（不通过则停下）

### 1.1 仓库

```bash
cd ~/HundredSchools.skill          # 实际路径以登入后 pwd 为准
git status                          # 必须 clean
git log -1 --oneline
git pull --ff-only                  # 同步最新方案
```

### 1.2 GPU

```bash
nvidia-smi --query-gpu=index,name,memory.free,memory.total --format=csv
```

✅ 8 张 A6000，每张 free ≥ 45GB。
❌ 有卡在用 → 报告占用进程，等用户决定是否 kill。

### 1.3 Python 环境

```bash
which python && python --version    # ≥ 3.10
python -c "import vllm; print(vllm.__version__)"
python -c "import torch; print(torch.__version__, torch.cuda.is_available())"
python -c "from datasets import load_dataset; print('datasets ok')"
python -c "import openai; print('openai client ok')"   # 用于打 vLLM
```

缺包 → `pip install vllm openai datasets jsonschema` 之类，再重试。

### 1.4 网络

```bash
huggingface-cli whoami              # 若需要 gated 模型必须登录
curl -sf https://huggingface.co > /dev/null && echo "hf reachable"
```

❌ 不通 → 报告，等用户提供镜像或代理配置。**不要随便改 `HF_ENDPOINT`**。

---

## 2. 阶段一：脚手架开发

> 全部在 A6000 上写、A6000 上跑通。每完成一步先 `git add && git commit`，commit message 写清做了什么。**绝不 force push**。

### S0 · 目录骨架（首次运行约 1 小时）

```
docs/samples/benchmarks/
├── __init__.py
├── models.yaml                  # 6 个 preset
├── conditions.py                # 8 条件，复用 SCHOOL_PROMPTS
├── loaders/
│   ├── __init__.py
│   ├── gsm8k.py
│   ├── musr.py
│   ├── ifeval.py
│   ├── bfcl.py
│   ├── truthfulqa.py
│   ├── or_bench.py
│   ├── xstest.py
│   ├── humaneval.py
│   ├── harmbench.py
│   ├── simpleqa.py
│   └── noveltybench.py
├── scorers/
│   ├── __init__.py
│   ├── numeric.py               # GSM8K
│   ├── mcq.py                   # MuSR / TruthfulQA / SimpleQA
│   ├── ifeval_rules.py          # 移植 google-research/instruction_following_eval
│   ├── bfcl_ast.py
│   ├── code_exec.py             # HumanEval 沙箱
│   ├── llama_guard.py           # OR-Bench / XSTest / HarmBench
│   ├── exact_match.py
│   └── novelty.py               # self-BLEU / distinct-n
├── runners/
│   └── serve_vllm.sh            # 接受 model preset 名作为参数
├── experiments/
│   ├── pilot.yaml
│   └── full.yaml
├── run_general_eval.py
└── analyze.py
```

**复用约定**：`conditions.py` 直接 `from docs.samples.run_8b_benchmark_eval import SCHOOL_PROMPTS`，不要重新抄一份。

#### S0 退出标准

```bash
python -c "
from docs.samples.benchmarks.conditions import CONDITIONS
assert set(CONDITIONS.keys()) == {'baseline','neutral_long','dao','confucian','legal','military','mohist','logician'}
print('conditions ok')
"
```

### S1 · Chat template 验证（约 30 分钟）

写 `scripts/dump_chat_templates.py`，对 6 个模型只载 tokenizer（不载权重）：

```python
from transformers import AutoTokenizer
from docs.samples.benchmarks.conditions import CONDITIONS

MODELS = ["Qwen/Qwen3.5-0.5B-Instruct", "Qwen/Qwen3.5-2B-Instruct",
          "Qwen/Qwen3.5-4B-Instruct", "Qwen/Qwen3.5-8B-Instruct",
          "google/gemma-2-9b-it", "meta-llama/Llama-3.1-8B-Instruct"]

for hf_name in MODELS:
    tok = AutoTokenizer.from_pretrained(hf_name)
    for school, sys_prompt in CONDITIONS.items():
        if sys_prompt is None: continue
        msgs = [{"role":"system","content":sys_prompt},
                {"role":"user","content":"Hi"}]
        raw = tok.apply_chat_template(msgs, tokenize=False, add_generation_prompt=True)
        # grep 学派关键词
        keyword = sys_prompt.split()[0:3]   # 各家 prompt 第一行的前几个词
        ok = all(k in raw for k in keyword if len(k) > 3)
        print(f"{hf_name:50s} {school:12s} {'OK' if ok else 'FAIL'}")
        with open(f"logs/chat_template_{hf_name.split('/')[-1]}_{school}.txt","w") as f:
            f.write(raw)
```

#### S1 退出标准

- 6 模型 × 6 学派 = 36 行全部 `OK`
- 特别注意 Gemma：历史上不原生支持 `system` role，必须确认 `apply_chat_template` 把 system content 前置进了 user turn。如果 Gemma 那 6 行全 FAIL → **停下报告**，等用户决定是否在 loader 层把 system 内容拼进 user prompt

### S2 · GSM8K baseline 复现（仅 2B，约 30 分钟）

只为验证 runner / loader / scorer 的实现正确。

```bash
# 起 2B vLLM（单卡足够）
CUDA_VISIBLE_DEVICES=0 vllm serve Qwen/Qwen3.5-2B-Instruct \
  --port 8000 --gpu-memory-utilization 0.85 \
  > logs/vllm_smoke.log 2>&1 &
sleep 60
curl -sf http://localhost:8000/v1/models

# 跑 baseline × GSM8K(limit 50)
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml \
  --model qwen3.5-2b-it --condition baseline --benchmark gsm8k --limit 50
```

#### S2 退出标准

- 跑通无 crash，输出 50 条 `raw_results.jsonl`
- 准确率与 Qwen3.5 paper GSM8K 0-shot 数字偏差 ≤ 2 分
- ❌ 偏差大 → 排查顺序：① chat template 是否生效 ② `temperature` 是否为 0 ③ scorer 抽取数字是否正确 ④ 数据集版本（test vs train split）。**不要继续 S3 直到偏差过关**。

### S3 · 单学派烟测（约 15 分钟）

复用 S2 的 vLLM 实例：

```bash
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml \
  --model qwen3.5-2b-it --condition military --benchmark gsm8k --limit 50
```

#### S3 退出标准

- military 与 baseline 出现可观测 Δ（≥ ±1 分均可，方向不要求）
- ❌ Δ = 0 → 几乎肯定 system prompt 没注入。回 S1 排查。

### S4 · Pilot 全条件（约 2–3 小时）

`pilot.yaml` 内容：

```yaml
commit: <auto>
models: [qwen3.5-2b-it]
conditions: [baseline, neutral_long, dao, confucian, legal, military, mohist, logician]
benchmarks: [gsm8k, ifeval, or_bench]
limits: {default: 50}
seeds: [0]
output_dir: results/pilot_${date}
```

跑：

```bash
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml --model qwen3.5-2b-it
python docs/samples/benchmarks/analyze.py results/pilot_*/
```

#### S4 退出标准

- 跑完无 crash
- `analyze.py` 出图无报错
- 8 条件 × 3 benchmark = 24 个数字中，至少 **3 处** Δ vs `neutral_long` 大于 +2 分（绝对值）
- ❌ 0 处显著 Δ → **立刻停**，回 S1。不要把无效配置扩到全量。

### S5 · 关掉 pilot vLLM，准备进入全量

```bash
pkill -f "vllm serve"
sleep 10
nvidia-smi      # 确认 8 张卡都空了
git add -A && git commit -m "scaffold: pilot passed, ready for full"
```

> 阶段一总耗时：**约 1.5–2 个工作日**（其中代码 S0 占大头，S2-S4 跑量本身 < 4 小时）。

---

## 3. 阶段二：全量 batch（12–18 小时）

### 3.1 进 tmux

**绝对不要在裸 SSH 会话里启动**。

```bash
tmux new -s eval                    # 新建；已存在用 tmux attach -t eval
```

### 3.2 Prefetch 模型权重（首次约 1–2 小时）

```bash
mkdir -p models logs
for hf_name in \
  Qwen/Qwen3.5-0.5B-Instruct Qwen/Qwen3.5-2B-Instruct \
  Qwen/Qwen3.5-4B-Instruct Qwen/Qwen3.5-8B-Instruct \
  google/gemma-2-9b-it meta-llama/Llama-3.1-8B-Instruct \
  meta-llama/Llama-Guard-3-8B; do
  huggingface-cli download "$hf_name" --local-dir "models/${hf_name##*/}"
done
```

datasets 在 loader 内通过 `load_dataset(...)` 触发缓存，HF cache 默认在 `~/.cache/huggingface/`，不需要单独 prefetch（首次跑会缓存住，resume 时直接命中）。

### 3.3 跑量循环

`full.yaml` 内容：

```yaml
commit: <auto>
models: [qwen3.5-0.5b-it, qwen3.5-2b-it, qwen3.5-4b-it, qwen3.5-8b-it,
         gemma-2-9b-it, llama-3.1-8b-instruct]
conditions: [baseline, neutral_long, dao, confucian, legal, military, mohist, logician]
benchmarks: [gsm8k, musr, ifeval, bfcl, truthfulqa, or_bench, xstest, humaneval,
             harmbench, simpleqa, noveltybench]
limits: {default: null, harmbench: 200, bfcl: 800}
seeds: [0]
output_dir: results/full_${date}
```

按规模升序逐一跑（每个模型独占 8 张卡）：

```bash
for MODEL in qwen3.5-0.5b-it qwen3.5-2b-it qwen3.5-4b-it \
             qwen3.5-8b-it gemma-2-9b-it llama-3.1-8b-instruct; do
  echo "=== START $MODEL $(date) ===" | tee -a logs/timeline.log

  # 起 vLLM
  bash docs/samples/benchmarks/runners/serve_vllm.sh "$MODEL" \
    > logs/vllm_${MODEL}.log 2>&1 &
  sleep 90
  for p in 8000 8001 8002 8003 8004 8005 8006 8007; do
    curl -sf http://localhost:$p/v1/models > /dev/null \
      || { echo "vllm port $p failed for $MODEL"; exit 1; }
  done

  # 跑 runner
  python docs/samples/benchmarks/run_general_eval.py \
    docs/samples/benchmarks/experiments/full.yaml \
    --model "$MODEL" 2>&1 | tee -a logs/run_${MODEL}.log

  # 关 vLLM
  pkill -f "vllm serve"
  sleep 15
  nvidia-smi --query-gpu=memory.free --format=csv

  echo "=== END $MODEL $(date) ===" | tee -a logs/timeline.log
done
```

把这段存成 `runners/run_all_models.sh`，**在 tmux 内**用 `bash runners/run_all_models.sh` 启动。

### 3.4 跑量预期

| 模型 | 题量 | 预计耗时 |
|---|---|---|
| qwen3.5-0.5b-it | ~32K | 1.5–2.5h |
| qwen3.5-2b-it | ~32K | 2–3h |
| qwen3.5-4b-it | ~32K | 2.5–3.5h |
| qwen3.5-8b-it | ~32K | 3–4h |
| gemma-2-9b-it | ~32K | 3–4h |
| llama-3.1-8b-instruct | ~32K | 3–4h |
| **合计** | **~190K** | **12–18h** |

---

## 4. 监控

### 4.1 心跳

```bash
tail -f results/full_*/heartbeat.log
```

每 5 分钟一行 JSON：`{ts, completed, total, eta_min, current}`。

### 4.2 vLLM 状态

```bash
tail -f logs/vllm_${current_model}.log
```

留意 `OOM` / `RuntimeError` / `Connection refused`。

### 4.3 完成数

```bash
wc -l results/full_*/raw_results.jsonl
```

---

## 5. 异常处理

只列你可以独立处理的情况；其余停下问。

| 现象 | 你应该做的 |
|---|---|
| runner 报 `ConnectionError` 到 vLLM | `curl http://localhost:8000/v1/models` 检查；vLLM 挂了就重启它，然后**重跑同一条 runner 命令**（runner 自带 resume，会跳过已完成题）|
| runner OOM | 报告并停下，等用户决定是否调 `--gpu-memory-utilization` 或 `--max-model-len` |
| 单题 timeout | runner 内部 retry 一次后记失败，继续即可 |
| heartbeat 30 分钟无更新 | `tmux attach -t eval` 看 runner pane；卡住 Ctrl-C 后**重启同一条命令** resume |
| 磁盘满 | `df -h` 报告，等用户决定清理目录。**不要自行 `rm`** |
| 某模型 chat template 一开始就有问题（应在 S1 暴露但漏过了） | 停下报告，回 S1 修复 |
| HF download 失败 | 重试 3 次，仍失败报告 |

### 禁止操作

- ❌ **改 [scale-curve-experiment-plan.md](scale-curve-experiment-plan.md)** 任何字段
- ❌ **改 [hundredschools/SKILL.md](../hundredschools/SKILL.md)** 任何 system prompt
- ❌ 跳过 pilot 直接跑 full
- ❌ pilot 未达 §S4 退出标准就跑 full
- ❌ 用 `--limit` 缩小 full 题量"快速过一遍"
- ❌ 跳过任何模型或 benchmark
- ❌ `git push --force` 任何分支
- ❌ `rm` 任何 `results/` 下的文件

---

## 6. 完成后

### 6.1 验证产物

```bash
python docs/samples/benchmarks/analyze.py results/full_*/

ls results/full_*/
# 期望：
#   raw_results.jsonl
#   heartbeat.log
#   summary.md
#   baseline_reproduction.md
#   figures/
#     ├── scale_curve.png
#     ├── scale_curve_avg.png         <-- 最关键一张
#     ├── pareto_tokens_acc.png
#     ├── selective_accuracy.png
#     └── heatmap_school_x_benchmark.png
```

✅ 通过：
- `wc -l raw_results.jsonl` 接近 190K（允许 ≤ 2% 失败题）
- `summary.md` 中每个 (模型, 条件, benchmark) 都有数字，无 `N/A`
- 5 张 figure 全部生成且非空

❌ 失败：报告具体缺失项，**不要重跑**整套。

### 6.2 打包

打包**只包含结果与日志**——代码已在 git 里，不重复传：

```bash
TS=$(date +%Y%m%d-%H%M%S)
SHA=$(git rev-parse --short HEAD)
tar -czf "results_${SHA}_${TS}.tar.gz" results/full_*/ logs/
ls -lh "results_${SHA}_${TS}.tar.gz"
sha256sum "results_${SHA}_${TS}.tar.gz"
```

预期 tarball ≤ 200MB（raw_results.jsonl 是大头，可视情况开 `--use-compress-program=zstd`）。

### 6.3 同步代码到远端

```bash
git add docs/samples/benchmarks/ scripts/ runners/
git commit -m "scaffold + full run: ${SHA}"
git push origin main           # 或当前分支
git tag "a6000-completed-${TS}"
git push --tags
```

这样开发机（3090Ti 那台）`git pull` 就能拿到全部代码。

### 6.4 Handoff 报告

最终回复必须包含：

1. 总耗时（pilot + full 分别）
2. 6 个模型每个的失败题数（runner 末尾打印）
3. tarball 绝对路径 + 大小 + sha256
4. `summary.md` 中**最显眼的 5 个 (学派, benchmark) Δ vs neutral_long**（直接抄数字，不解读）
5. pilot S4 实际看到的 Δ 数（与你打算扩到 full 时的判断依据）
6. 跑的过程中所有"虽然你处理了但用户应该知道"的事

不要：
- 解读结果是否"证明了百家有效"
- 推荐下一步实验
- 在最终回复里贴大段日志（用 tarball 里的文件路径代替）

---

## 7. 一页速查

```bash
# === 阶段一：脚手架 + pilot（1.5–2 天）===
cd ~/HundredSchools.skill && git pull --ff-only

# S0: 建 docs/samples/benchmarks/ 骨架（见 §2 S0 列表）
# S1: 6 模型 chat template dump
python scripts/dump_chat_templates.py

# S2: GSM8K baseline 复现（仅 2B，limit 50）
CUDA_VISIBLE_DEVICES=0 vllm serve Qwen/Qwen3.5-2B-Instruct --port 8000 \
  --gpu-memory-utilization 0.85 > logs/vllm_smoke.log 2>&1 &
sleep 60
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml \
  --model qwen3.5-2b-it --condition baseline --benchmark gsm8k --limit 50

# S3: 单学派烟测
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml \
  --model qwen3.5-2b-it --condition military --benchmark gsm8k --limit 50

# S4: Pilot 全条件
python docs/samples/benchmarks/run_general_eval.py \
  docs/samples/benchmarks/experiments/pilot.yaml --model qwen3.5-2b-it
python docs/samples/benchmarks/analyze.py results/pilot_*/
pkill -f "vllm serve" && sleep 10
git add -A && git commit -m "scaffold: pilot passed"

# === 阶段二：全量（12–18h）===
tmux new -s eval

# Prefetch 6 模型 + Llama-Guard-3
huggingface-cli download Qwen/Qwen3.5-0.5B-Instruct --local-dir models/Qwen3.5-0.5B-Instruct
# ... 其余 6 个

# 跑 6 模型循环
bash runners/run_all_models.sh

# === 收尾 ===
python docs/samples/benchmarks/analyze.py results/full_*/
TS=$(date +%Y%m%d-%H%M%S); SHA=$(git rev-parse --short HEAD)
tar -czf results_${SHA}_${TS}.tar.gz results/full_*/ logs/
git add -A && git commit -m "full run: ${SHA}" && git push && \
  git tag a6000-completed-${TS} && git push --tags

# 报告 tarball 路径 + sha256 + summary 中 5 个最显眼的 Δ
```

---

## 8. 不在你职责内的事

如果用户问以下问题，回答"这超出 runbook 范围"：

- 改 system prompt 措辞 / benchmark 选型 / 模型矩阵
- 解读结果是否支持/反驳"百家有效"假设
- 重写 SKILL.md 文档
- 任何修改 `docs/scale-curve-experiment-plan.md` 的请求

---

## 附：相关文档

- 完整方案：[docs/scale-curve-experiment-plan.md](scale-curve-experiment-plan.md)
- Skill 定义：[hundredschools/SKILL.md](../hundredschools/SKILL.md)
- 现有 safety runner（参考实现）：`docs/samples/run_8b_benchmark_eval.py`
- 现有 SCHOOL_PROMPTS 定义：同上
- 仓库 README：[README_ZH.md](../README_ZH.md)
