# HundredSchools 规模曲线评测 · A6000 全栈实施方案

> 文档定位：在 [general-benchmark-plan.md](general-benchmark-plan.md) 与 [targeted-evaluation-plan.md](targeted-evaluation-plan.md) 的基础上，给出一份按硬件资源切分的可执行方案。
>
> 本方案不重新论证 benchmark 选型（已在 general-benchmark-plan 中），只回答："**手头两台机器，怎么把这套实验跑出来**"。

---

## 1. 目标与边界

**目标**：用两台异构机器跑出一条"**百家收益 vs 模型规模**"的曲线，证明 HundredSchools system-prompt steering 在 2B–9B 的若干尺度上产生可复现、可归因、方向正确的差异。

**边界**：
1. 只用 instruction-tuned (`-it` / `-Instruct`) 版本。base 模型没有 chat template，system prompt 进不去。
2. 一期不引入 GPT-4 judge。所有评分必须可在本地完成（规则 / sympy / 沙箱执行 / 本地小 judge 模型）。
3. 数据集必须**预先下载到本地**并随 bundle 打包。A6000 不假设有外网。

---

## 2. 硬件分工（已根据用户决定调整）

| 维度 | 8×A6000（48GB×8，**跳板机 SSH**，唯一执行环境） |
|---|---|
| **角色** | Dev + Debug + Pilot + Full batch + 出图，**全栈一站式** |
| **模型范围** | 全 6 模型（0.5B / 2B / 4B / 8B / Gemma-2-9B / Llama-3.1-8B） |
| **数据规模** | pilot `--limit 50` 烟测；通过后跑全量 |
| **运行模式** | `tmux` 长会话；脚手架代码也在 A6000 上写并 `git push`；只回传 results tarball |
| **必须支持** | checkpoint/resume、心跳、results tarball ≤ 200MB（避免大文件回传） |

**关键决策（相对早期方案）**：

- **3090Ti 不参与本轮实验**。原因：A6000 是仓库实际可用的唯一 GPU 环境；本仓库的工作流是"在 A6000 上写脚手架 → A6000 上 pilot → A6000 上 full → 只回传结果"。
- A6000 数据传输方向受限：**入站不便**（不便从本地往 A6000 大量上传），**出站方便**（results tarball 小、易回拉）。因此代码必须通过 git 在 A6000 端 `pull` 后开发。
- 既然代码就在 A6000 上写，就不再有"在另一台机器先验证、再同步"这一层。pilot 是唯一的 sanity 防线，必须严格执行。

### A6000 访问方式与协议

A6000 通过**跳板机 SSH** 访问，所有命令行操作（`git pull/push`、`pip install`、`tmux`、`vim`、`pdb`、`scp`）均可用。

- ✅ 推荐：`tmux new` 起长会话、`git push` 同步代码、`tail -f` 看进度、最终 `scp -J jumphost a6000:.../results.tar.gz .` 回拉结果
- ⚠️ 注意：跳板机带来额外延迟，交互式调试体验比直连差，但**这是本轮唯一可行环境**——不要因不便而省略 pilot 验证
- ❌ 禁止：`git push --force`、跳过 pilot 直接跑 full、用 `--limit` 缩小 full 题量

具体执行手册见 [a6000-runbook.md](a6000-runbook.md)。本文档只描述方案设计；如何在 A6000 上一步步执行参 runbook。

---

## 3. 模型矩阵

| 档位 | Preset | A6000 上的部署 |
|---|---|---|
| 0.5B（sanity） | `qwen3.5-0.5b-it` | 单卡 8 实例 |
| 2B（pilot 也用它） | `qwen3.5-2b-it` | 单卡 4–6 实例 |
| 4B | `qwen3.5-4b-it` | 单卡 3–4 实例 |
| 8B | `qwen3.5-8b-it` | 单卡 1 实例，8 卡并发 |
| 9B（异家） | `gemma-2-9b-it` | 单卡 1 实例 |
| 7B（异家） | `llama-3.1-8b-instruct` | 单卡 1 实例 |

> 6 档形成 0.5B / 2B / 4B / 8B 的 Qwen 自家规模阶梯 + Gemma/Llama 两家的同档对照。
>
> Pilot 阶段用 `qwen3.5-2b-it` 做单点验证（仅 `--limit 50`），跑通后立即进入 full。
>
> 若 Qwen3.5 实际命名与 HF 仓库不符，沿用本仓库 [general-benchmark-plan.md:23](general-benchmark-plan.md) 中的命名约定，以 `models.yaml` 为准。

---

## 4. Benchmark 矩阵（A 档必跑 + B 档加分项）

完全沿用前文与 general-benchmark-plan 中已论证过的清单，重列于此供 runner 配置使用：

### A 档（必跑，覆盖 6 家全部）

| Benchmark | 主对应学派 | 评分方式 | 规模 |
|---|---|---|---|
| GSM8K | 兵家 | 数字抽取 | 1319 |
| MuSR | 兵家 | MCQ | 756 |
| IFEval-strict | 墨家/法家 | 规则 | 541 |
| BFCL v3 | 法家 | AST 比较 | 800（抽样） |
| TruthfulQA-MC1 | 名家 | 规则 | 817 |
| OR-Bench-Hard + XSTest | 儒家 | 规则 + Llama-Guard-3 | 1000 + 250 |
| HumanEval（pass@1 / pass@10） | 墨家 / 道家 | 沙箱执行 | 164 |
| HarmBench | 法家/名家 | Llama-Guard-3 | 200（抽样） |

### B 档（强结论加分项）

| Benchmark | 价值 |
|---|---|
| SimpleQA | 名家 abstention 校准曲线 |
| NoveltyBench | 道家唯一可量化 benchmark |
| SycophancyEval | 名家 vs 儒家张力，有论文级新发现潜力 |

### 两个非常规但关键的指标

1. **Token-Acc Pareto 前沿**：横轴 = 平均输出 token，纵轴 = 准确率。8 条件 8 个点。墨家应位于前沿。
2. **Selective Accuracy 曲线**：横轴 = coverage，纵轴 = accuracy on attempted。名家应是最高曲线。

---

## 5. 条件矩阵（8 条件）

复用 [hundredschools/SKILL.md](../hundredschools/SKILL.md) 与 `docs/samples/run_8b_benchmark_eval.py` 中的 `SCHOOL_PROMPTS`：

```
baseline / neutral_long / dao / confucian / legal / military / mohist / logician
```

`neutral_long` 必须**在 token 数上对齐 6 家学派的平均**，作为"任意长 system prompt 都会带来效应"的 confound 控制。

---

## 6. 代码架构

```
docs/samples/benchmarks/
├── models.yaml              # 6 个模型 preset，含 GPU/端口分配、paper_baseline
├── conditions.py            # 8 条件
├── loaders/
│   ├── gsm8k.py
│   ├── musr.py
│   ├── ifeval.py
│   ├── bfcl.py
│   ├── truthfulqa.py
│   ├── or_bench.py
│   ├── xstest.py
│   ├── humaneval.py
│   └── harmbench.py
├── scorers/
│   ├── numeric.py           # GSM8K
│   ├── mcq.py               # MuSR / TruthfulQA
│   ├── ifeval_rules.py      # 移植自 google-research/instruction_following_eval
│   ├── bfcl_ast.py
│   ├── code_exec.py         # HumanEval 沙箱
│   ├── llama_guard.py       # OR-Bench / XSTest / HarmBench
│   └── exact_match.py
├── runners/
│   ├── serve_vllm.sh        # 接受 model preset 名作参数，1 卡或 8 卡部署
│   └── run_all_models.sh    # 6 模型循环（起 vLLM → runner → 关 vLLM）
├── monitor_heartbeat.py     # 每 5min 写一行进度到 results/heartbeat.log
├── analyze.py
└── experiments/
    ├── pilot.yaml           # qwen3.5-2b × 8 conds × 3 benches × limit 50
    └── full.yaml            # 6 模型 × 8 conds × 11 benches × full（唯一正式配置）
```

### 单文件 yaml 描述完整实验

```yaml
# experiments/full.yaml
commit: <git-sha>          # 由 git rev-parse HEAD 注入，启动前校验
models:
  - qwen3.5-0.5b-it
  - qwen3.5-2b-it
  - qwen3.5-4b-it
  - qwen3.5-8b-it
  - gemma-2-9b-it
  - llama-3.1-8b-instruct
conditions: [baseline, neutral_long, dao, confucian, legal, military, mohist, logician]
benchmarks: [gsm8k, musr, ifeval, bfcl, truthfulqa, or_bench, xstest, humaneval, harmbench, simpleqa, noveltybench]
limits: {default: null, harmbench: 200, bfcl: 800}
seeds: [0]
output_dir: results/full_${date}
```

A6000 上一条命令：`bash runners/run_all_models.sh`（封装了 6 个 vLLM 起停 + 6 个 runner 调用）。

### 强制 checkpoint/resume

每完成一题 append 一行到 `raw_results.jsonl`。重启读已有结果，跳过已完成 `(model, condition, benchmark, sample_id, seed)`。

### 心跳

```python
{"ts": "...", "completed": 42130, "total": 180000, "eta_min": 412,
 "current": "qwen3.5-4b/military/musr"}
```

A6000 上 `tail -f results/heartbeat.log` 即可观察；本地也可通过 `ssh -J jumphost a6000 'tail -f .../heartbeat.log'` 远程跟踪。

---

## 7. 阶段一（A6000 上）：脚手架 + Pilot

> 全部在 A6000 上完成。每完成一步先 `git add && git commit`，commit message 写清做了什么。

### S0 · 脚手架（约 1 天）

1. 建 `docs/samples/benchmarks/` 目录（结构见 §6）
2. `models.yaml` 注册全部 6 个 preset；`paper_baseline` 字段先留空，全量跑完回填
3. `conditions.py` 复用 `SCHOOL_PROMPTS`（来自 `docs/samples/run_8b_benchmark_eval.py`），校准 `neutral_long` token 数

### S1 · Chat template 验证（约 0.5 小时）

**对全部 6 个模型**只载 tokenizer 打印 `apply_chat_template` raw string。
A6000 上只载 tokenizer 几乎零成本——不要因为"在 GPU 机器上"就跳过这一步。

**退出标准**：6 个学派 prompt 都能在每个模型的 raw string 里 `grep` 到关键词。

> Gemma 历史上不原生支持 `system` role，必须确认 system 内容被前置进了 user turn；若失败 → 停下问用户，可能需要在 loader 层显式拼接。

### S2 · GSM8K Baseline 复现（仅 2B，约 0.5 小时）

`qwen3.5-2b-it × baseline × GSM8K(limit 50)`。单卡 vLLM 即可。

**退出标准**：与 paper 偏差 ≤ 2 分。若差距大，停下排查（chat template / 解码参数 / 数据集版本），不要继续扩展。

> 只在 2B 上做。其余模型的 baseline 复现挪到全量跑完后由 `analyze.py` 自动比对——本步只是验证 runner 行为正确。

### S3 · 单学派烟测（约 15 分钟）

`qwen3.5-2b-it × military × GSM8K(limit 50)`。复用 S2 的 vLLM 实例。

**退出标准**：与 baseline 出现可观测 Δ（≥ ±1 分），方向不要求正确，只验证 prompt 真的影响了输出。

### S4 · Pilot 全条件（约 2–3 小时）

`pilot.yaml`：`qwen3.5-2b-it × 8 conditions × {GSM8K, IFEval-strict, OR-Bench-Hard}(limit 50)`。

**退出标准**：
- 跑完无 crash
- `analyze.py` 能完整产出图表
- 8 条件 × 3 benchmark = 24 个数字中，至少 **3 处** Δ vs `neutral_long` 大于 +2 分（绝对值）

> 若 0 处显著 Δ → **立刻停**，回 S1 排查 chat template 与 prompt 注入路径。**不要跳过此步直接跑 full**。

### S5 · 关 vLLM、commit、进入阶段二

```bash
pkill -f "vllm serve"
sleep 10
nvidia-smi      # 确认 8 张卡都空了
git add -A && git commit -m "scaffold: pilot passed, ready for full"
git push
```

> 阶段一总耗时：**约 1.5–2 个工作日**（代码 S0 占大头，跑量本身 < 4 小时）。

---

## 8. 阶段二（A6000 上）：全量 Batch

### 前提

- 阶段一 S0–S4 全部退出标准达成
- vLLM 已关闭、8 张卡空闲
- 在 `tmux` 长会话内执行（避免跳板机 SSH 断连导致进程死亡）

### Prefetch 模型权重（首次约 1–2 小时）

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

datasets 在 loader 内通过 `load_dataset(...)` 触发缓存（`~/.cache/huggingface/`），首次跑会缓存住，无需单独 prefetch。

### vLLM 部署（每个模型独占 8 卡）

```bash
# runners/serve_vllm.sh <preset_name>
# tmux 内执行
mkdir -p logs
MODEL_PATH=$(yq ".presets.\"$1\".local_path" docs/samples/benchmarks/models.yaml)
for i in 0 1 2 3 4 5 6 7; do
  CUDA_VISIBLE_DEVICES=$i \
  vllm serve "$MODEL_PATH" \
    --port $((8000+i)) \
    --gpu-memory-utilization 0.85 \
    --max-model-len 8192 \
    --disable-log-requests > logs/vllm_${1}_$i.log 2>&1 &
done
sleep 90
for i in 0 1 2 3 4 5 6 7; do
  curl -sf http://localhost:$((8000+i))/v1/models > /dev/null \
    || { echo "vllm $i failed for $1"; exit 1; }
done
echo "all 8 vllm endpoints healthy for $1"
```

### 跑量循环

```bash
# runners/run_all_models.sh
for MODEL in qwen3.5-0.5b-it qwen3.5-2b-it qwen3.5-4b-it \
             qwen3.5-8b-it gemma-2-9b-it llama-3.1-8b-instruct; do
  echo "=== START $MODEL $(date) ===" | tee -a logs/timeline.log
  bash docs/samples/benchmarks/runners/serve_vllm.sh "$MODEL" || exit 1
  python docs/samples/benchmarks/run_general_eval.py \
    docs/samples/benchmarks/experiments/full.yaml \
    --model "$MODEL" 2>&1 | tee -a logs/run_${MODEL}.log
  pkill -f "vllm serve"; sleep 15
  echo "=== END $MODEL $(date) ===" | tee -a logs/timeline.log
done
```

`full.yaml`：**6 模型** × 8 条件 × 11 benchmark ≈ **190K 调用**，8 卡并发 ≈ **12–18 小时**。
按规模升序跑（0.5B → 9B），小模型先出结果即可早期发现问题。

### 中途观察

```bash
tmux attach -t eval                              # 直接看 runner pane
tail -f results/full_*/heartbeat.log              # 每 5 分钟一行 JSON
tail -f logs/vllm_*.log                           # 服务端
wc -l results/full_*/raw_results.jsonl            # 完成数
```

也可在本地用 `ssh -J jumphost a6000 'tail -f .../heartbeat.log'` 远程跟踪。

### 完成后

`analyze.py` 出图，tarball 只包含**结果与日志**（代码已在 git 里，不重复传）：

```bash
python docs/samples/benchmarks/analyze.py results/full_*/

TS=$(date +%Y%m%d-%H%M%S); SHA=$(git rev-parse --short HEAD)
tar -czf "results_${SHA}_${TS}.tar.gz" results/full_*/ logs/
sha256sum "results_${SHA}_${TS}.tar.gz"

git add -A && git commit -m "full run: ${SHA}" && git push
git tag "a6000-completed-${TS}" && git push --tags
```

预期 tarball ≤ 200MB，从本地 `scp -J jumphost a6000:.../results_*.tar.gz .` 回拉。

---

## 9. 自检清单（Pilot 通过 → 进 Full 之前）

A6000 上 pilot 跑完后，进入全量 batch 之前必须全部 ✅：

- [ ] S1：6 模型 chat template raw string `grep` 学派关键词全部命中
- [ ] S2：`qwen3.5-2b × baseline × GSM8K(limit 50)` 与 paper ±2 分内
- [ ] S3：`qwen3.5-2b × military × GSM8K(limit 50)` 与 baseline 出现 Δ ≥ ±1 分
- [ ] S4：pilot `analyze.py` 出图无报错，且 24 个数字中 ≥ 3 处显著 Δ vs `neutral_long`
- [ ] `experiments/full.yaml` 中 6 个 preset 全部填齐、`temperature` / `max_tokens` 已按 benchmark 区分配置
- [ ] vLLM 已 `pkill` 关闭、8 张卡空闲（`nvidia-smi` 验证）
- [ ] 当前 commit 已 `git push`，便于失败时回滚到已知良好状态

---

## 10. 产出物清单

### 阶段一产出（仅 pilot，本地不回拉）

```
results/pilot_${date}/
├── raw_results.jsonl              # qwen3.5-2b × 8 conds × 3 benches × limit 50
├── pilot_summary.md               # 显著 Δ 的清单
└── chat_template_dump/            # 6 个模型 × 6 学派 = 36 个 raw string 文件
```

留在 A6000 本机即可，不必单独打包回拉。

### 阶段二产出（最终回拉 tarball）

```
results/full_${date}/
├── raw_results.jsonl              # 6 模型 × 8 条件 × 11 benchmark
├── heartbeat.log
├── vllm_*.log
├── summary.md                     # 6 模型 × 8 条件全表
├── baseline_reproduction.md       # 6 模型 vs paper baseline
└── figures/
    ├── scale_curve.png            # 6 模型 × 8 条件，每 benchmark 一张
    ├── scale_curve_avg.png        # 跨 benchmark 平均的规模曲线（最关键一张）
    ├── pareto_tokens_acc.png      # 墨家专属
    ├── selective_accuracy.png     # 名家专属
    └── heatmap_school_x_benchmark.png
```

打包：`tar -czf results_${SHA}_${TS}.tar.gz results/full_*/ logs/`，预期 ≤ 200MB。
回拉：本地 `scp -J jumphost a6000:.../results_*.tar.gz .`。

**`scale_curve_avg.png` 是本轮最重要的一张图**——它直接回答"百家收益是否在 4B/8B 出现倒 U 形峰值"。

---

## 11. 时间估算

| 阶段 | 任务 | 估时 |
|---|---|---|
| S0 | 脚手架（11 个 loader + 9 个 scorer + runner + analyze） | 1 天 |
| S1 | 6 模型 chat template 验证 | 0.5 小时 |
| S2 | GSM8K baseline 复现（仅 2B） | 0.5 小时 |
| S3 | 单学派烟测 | 15 分钟 |
| S4 | Pilot 全条件 | 2–3 小时 |
| **阶段一合计** | | **约 1.5–2 个工作日** |
| Prefetch | 6 模型权重 + Llama-Guard-3 | 1–2 小时（带宽相关） |
| Full batch | 6 模型 × 8 条件 × 11 benchmark | **12–18 小时（tmux 无人值守）** |
| 出图 + 打包 + 回拉 | `analyze.py` + `tar` + `scp` | 0.5 小时 |
| **阶段二合计** | | **约 1 天（含夜跑）** |
| **总计** | | **约 2.5–3 个工作日** |

---

## 12. 三条容易翻车的细节

### 1. chat template 差异

Qwen 与 Gemma 的 chat template 不同。Gemma 历史上不原生支持 `system` role，必须把 system prompt 前置到第一条 user message。务必用各家官方 `tokenizer.apply_chat_template` 验证，否则会得"百家无效"的虚假阴性。

### 2. 解码温度按 benchmark 分别配置

`temperature=0` 在 GSM8K / MMLU / IFEval 上 OK，HumanEval 业界惯例 `temperature=0.2, top_p=0.95`，pass@10 必须 `temperature≥0.6`。**写进 `models.yaml` 每个 benchmark 的元数据下，不要全局一刀切**。

### 3. A6000 数据传输方向受限

A6000 出站方便（小 tarball 走 `scp -J jumphost`），**入站不便**——不要假设可以从本地往 A6000 大量上传文件。因此协议是：
- 代码通过 `git pull` 进入 A6000、通过 `git push` 流出
- 模型权重 / datasets 在 A6000 上直接 `huggingface-cli download`，不走本地中转
- 只有最终 results tarball 走 `scp` 流出（≤ 200MB）

如出现"想把本地某个文件传到 A6000"的需求，先想办法 commit 进 git push，避免直接 scp 入站。

### 4. tmux 是硬性要求，不是建议

跳板机 SSH 容易断连。Pilot 跑 2–3 小时、Full 跑 12–18 小时，都必须在 `tmux new -s eval` 的会话内启动。一旦 `&` 后台跑但宿主 SSH 断了，进程**会**死。

---

## 13. 下一步动作

按本方案推进，进 A6000 后的下一步只做这两件：

1. 进 `tmux new -s eval`，建 `docs/samples/benchmarks/` 骨架，完成 §7 的 S0–S2（脚手架 + 6 模型 chat template 验证 + 2B baseline 复现）
2. S2 通过后继续 S3 → S4 pilot，pilot 退出标准达成才能进阶段二

执行手册见 [a6000-runbook.md](a6000-runbook.md)。**任何一步未达退出标准都不要前进**。

> 本方案不再依赖 3090Ti，所有正式结果在 A6000 上一次性产出。硬件、推理后端、vLLM 版本、解码参数完全一致，结果直接可比。
