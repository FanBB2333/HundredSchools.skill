# Gap-Filling Experiments Plan

> **Purpose.** The current `docs/samples/benchmarks/results/summary.json` covers only **8 of 19 conditions** and only **2 of 6 benchmarks on the largest two presets**. This file enumerates the missing cells, the exact commands that produce them, the expected cost, and the acceptance criteria.

Linked from:
- [../ROADMAP.md](../ROADMAP.md) §3
- [./TODO.md](./TODO.md) §4
- [../docs/tech-report-plan.md](../docs/tech-report-plan.md) §10
- [../docs/samples/benchmarks/ANALYSIS.md](../docs/samples/benchmarks/ANALYSIS.md) data-source banner

---

## 1. What is missing (coverage matrix)

The benchmark runner already supports the full 19-condition × 6-benchmark × 6-preset grid. The actual `summary.json` only fills part of that grid:

### 1.1 Conditions

| Group | Conditions | Covered? |
|-------|-----------|----------|
| Baselines | `baseline`, `neutral_long` | ✅ 全覆盖 |
| Baselines | `cot` | ❌ 未跑 |
| Pre-Qin 6 | `dao`, `confucian`, `legal`, `military`, `mohist`, `logician` | ✅ 全覆盖 |
| Extended 8 | `socratic`, `stoic`, `falsificationist`, `hegelian`, `pragmatist`, `yangming`, `bacon`, `wittgenstein` | ❌ 未跑（代码已 wire，0 条记录） |
| Routing | `random_school`, `router_auto` | ❌ 未跑 |

> **Caveat**：`docs/samples/benchmarks/ANALYSIS.md` 里关于 14 学派的表格在 `summary.json` 里没有对应数据；这部分数字是计划值 / 旧 A6000 runbook 残留，**不是已经跑出来的实证结果**。本计划目标即是让它变成真实数据。

### 1.2 (preset, benchmark) cells already covered

| Preset \ Bench | MMLU | BBH | GSM8K | TruthfulQA | IFEval | HumanEval |
|---|---|---|---|---|---|---|
| qwen3.5-0.8b-it  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| qwen3.5-2b-it    | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| qwen3.5-4b-it    | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| qwen3.5-9b-it    | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **qwen3.5-27b-it** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **gemma4-e2b-it**  | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |

Each ✅ cell is currently filled by only 8 of 19 conditions; the extended/routing conditions are missing across every cell.

### 1.3 Raw-JSONL availability

Only `qwen3.5-0.8b-it.jsonl`, `qwen3.5-2b-it.jsonl`, `gemma4-e2b-it.jsonl` exist in the repo, and each contains only `gsm8k + ifeval`. For 4B/9B/27B, only the aggregated rows in `summary.json` are present — the raw JSONLs presumably live on the GPU box and were not committed. Per-sample analysis (L1–L6, marker recall, etc.) will need either those JSONLs pulled back or a re-run.

---

## 2. Experiments needed (4 batches)

Batches are ordered by **cost per unit information**: cheapest, highest-coverage gain first.

### Batch A — Extended 8 schools + `cot` on the already-covered Qwen 0.8B–9B grid

**Why first.** The 4-size Qwen grid is the backbone of the scaling-curve story. Adding 9 conditions on this grid (8 extended schools + cot) is what makes RQ1/RQ2 publishable — without it, the paper covers only the Pre-Qin half of the 14-school taxonomy.

**Scope.** 4 presets × 6 benchmarks × 9 new conditions.

**Command.**
```bash
PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it qwen3.5-4b-it qwen3.5-9b-it" \
CONDITIONS="cot socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein" \
LIMIT=0 \
bash experiments/scripts/run_all.sh
```
(`LIMIT=0` reuses the full per-benchmark sample counts that the existing `summary.json` used: MMLU 14042, BBH 6511, GSM8K 1319, TQA 817, IFEval 541, HumanEval 164.)

**Resume safety.** `run_all.sh` passes `--resume`; reruns pick up at the first unfinished `(sample_id, condition)` pair.

**Cost estimate.** ≈ **876 K samples**, ≈ **243 M generated tokens**. On a single 24 GB GPU with vLLM @ ~1.5 k tok/s on Qwen-9B-it (less for 4B, more for 0.8/2B), order-of-magnitude: 60–80 GPU-hours. Smaller models will finish overnight; 9B dominates.

**Acceptance.**
- All 4 × 6 × 9 = **216** new (preset, benchmark, condition) cells appear in `summary.json` with `err = 0`.
- `experiments/analysis/run_analysis.py` produces an updated `l1_l2_l6_summary.csv` including the 8 extended schools.
- `web/src/data/benchmark_results.json` re-synced and `BenchmarkTab` shows 14 schools (extend `SCHOOL_ORDER` and `PreQinSchool` type → `SchoolId`).

---

### Batch B — Complete the 27B and Gemma4-E2B grids on the 4 missing benchmarks

**Why second.** Closes the "right edge" of the scaling curve. Without 27B on BBH/MMLU/TruthfulQA/HumanEval, RQ2 (scaling) can't claim "schools persist at 27B" — the strongest single review-defense for the paper.

**Scope.** 2 presets × 4 benchmarks × all 17 conditions (baseline + neutral_long + cot + 6 Pre-Qin + 8 extended).

**Command.**
```bash
PRESETS="qwen3.5-27b-it gemma4-e2b-it" \
BENCHMARKS="mmlu bbh truthfulqa humaneval" \
CONDITIONS="baseline neutral_long cot dao confucian legal military mohist logician socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein" \
LIMIT=0 \
bash experiments/scripts/run_all.sh
```

**Cost estimate.** ≈ **732 K samples**, ≈ **126 M tokens**. The 27B portion is the bottleneck (~3–4× slower per token than 9B). Order-of-magnitude: 60–100 GPU-hours, dominated by MMLU on 27B (≈ 14k × 17 × 16 tokens but bandwidth-bound, so cheaper than BBH which is 6.5k × 17 × 512).

**Acceptance.**
- All 2 × 4 × 17 = **136** new cells in `summary.json` with `err = 0`.
- 27B column in the front-end heat-table goes from 2/6 to 6/6 ✅.
- Scaling curves (`docs/figures/03_scaling_curves.png` + `BenchmarkTab` scaling chart) extend to x = 27B for **all** benchmarks.

---

### Batch C — `random_school` and `router_auto` routing baselines (4 + 2 presets)

**Why third.** The single most important *applied* claim of the paper is "task-aware routing beats any single school". This requires the router/random conditions on every (preset, benchmark) cell. They're cheap because no new prompts are needed — just hashing.

**Scope.** 6 presets × 6 benchmarks × 2 conditions.

**Command.**
```bash
PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it qwen3.5-4b-it qwen3.5-9b-it qwen3.5-27b-it gemma4-e2b-it" \
CONDITIONS="random_school router_auto" \
LIMIT=0 \
bash experiments/scripts/run_all.sh
```

**Cost estimate.** Roughly the same per-condition cost as one school, but only 2 conditions: ≈ **200 K samples**, ≈ **55 M tokens**. ~15–25 GPU-hours.

**Note.** `router_auto` requires `docs/samples/benchmarks/router.py` to be wired with concrete rules (see Batch D). If `router.py` is still a stub at run time, this batch can run `random_school` only — pull `router_auto` forward once D lands.

**Acceptance.**
- 72 new cells.
- `analysis/run_analysis.py` outputs a `router_vs_best_single_school.csv` showing per-(preset, benchmark) which is higher.

---

### Batch D — Router rule definition (no GPU, pre-req for `router_auto`)

**Why.** `router_auto` in the runner currently has no rules registered. Define them from the empirical findings in `docs/school-effects-report.md` so that the Batch C run produces meaningful numbers, not a degenerate copy of one school.

**Scope.** Static decision rules, no GPU.

**Deliverable.** `docs/samples/benchmarks/router.py` — function `pick_school(benchmark, sample_meta) -> str` with the following minimal rules (subject to update after Batches A/B):
- `humaneval`, `mbpp`-like → `dao` (best HumanEval delta with smallest variance)
- `bbh`, single-step logic → `mohist` (only positive school on BBH)
- `truthfulqa`, fact-check → `legal` (best TQA + anti-fabrication)
- `gsm8k` → `confucian` (smallest math-chain disruption)
- `ifeval` → `dao` (smallest IFEval drop)
- `mmlu` → `mohist` (smallest MMLU drop, also positive)
- fallback → `dao` (lowest variance overall)

**Acceptance.**
- Rules added with inline citations to specific (preset, benchmark) deltas in `summary.json`.
- Unit test under `experiments/tests/test_router.py` covering each rule.

---

## 3. Decision points

| When | What to decide |
|------|---------------|
| **Before any GPU run** | Lock down `LIMIT=0` (full samples) vs `LIMIT=200` (paper-table only). Default here is `LIMIT=0` to match what `summary.json` already contains; switch to 200 if compute slips by > 50 %. |
| **After Batch A** | Re-check H1 / H3 on extended schools. If the 8 extended schools all collapse below 50 % of baseline on short-answer benches, **freeze the format-effect rewrite** (two-segment "internal thinking, output answer only" prompts) before continuing. |
| **After Batch B** | If 27B BBH for `mohist` is ≥ 9B BBH, confirm the scaling claim; else trigger the "Pre-Qin advantage shrinks with scale" downgrade-rewrite from `tech-report-plan.md` §5. |
| **After Batch C** | If `router_auto` beats the best single school on ≥ 4/6 benchmarks (pooled), Batch D rules ship as-is. Otherwise iterate rules using the Batch A/B data. |

---

## 4. Output artefacts (what should exist when this plan is done)

```
docs/samples/benchmarks/results/
  summary.json                     # 224 → ~648 rows (6 presets × 6 benchmarks × 18 conditions)
  qwen3.5-{0.8b,2b,4b,9b,27b}-it.jsonl    # raw per-sample, all benchmarks
  gemma4-e2b-it.jsonl              # raw per-sample, all benchmarks

experiments/analysis/out/
  tidy.csv                         # re-built from full summary
  school_strength.csv              # 14 schools × 6 benchmarks
  l1_l2_l6_summary.csv             # 14 schools
  l3_distance_<preset>.csv         # per-preset cosine matrices
  l4_identity_*.csv                # cross-size identity
  l5_accuracy.csv                  # task-accuracy table
  router_vs_best_single_school.csv
  hypothesis_sketch.md             # H1–H4 verdicts

docs/figures/
  01..05_*.png                     # re-rendered with 14 schools
  06_router_vs_best.png            # new: routing claim

web/src/data/benchmark_results.json   # re-synced from summary.json
web/src/components/BenchmarkTab.tsx   # PreQinSchool -> SchoolId, 14-school heatmap
```

---

## 5. Total cost summary

| Batch | New cells | Samples | Gen tokens | Wall-clock (rough, single 24 GB GPU) |
|------|----------|---------|-----------|--------------------------------------|
| A — extended × 0.8B–9B | 216 | 876 K | 243 M | 60–80 h |
| B — 27B / Gemma × 4 benchmarks | 136 | 732 K | 126 M | 60–100 h |
| C — routing baselines | 72 | 200 K | 55 M | 15–25 h |
| D — router rules | 0 (no GPU) | — | — | 1 dev-day |
| **Total** | **424** | **~1.8 M** | **~424 M** | **~135–205 h** |

A typical A6000 or 3090 Ti node can finish this in 7–10 wall-clock days running 24/7; on a multi-GPU node (e.g. 4 × A100) it's 2–3 days.

---

## 6. Risk register (delta vs the main one in `tech-report-plan.md` §11)

| Risk specific to this gap-filling | Mitigation |
|---|---|
| Extended schools collapse on short-answer benches (MMLU/TruthfulQA) due to verbose prompts | Run the two-segment-prompt rewrite ablation on `socratic` only as a sentinel before committing GPU to all 8 |
| 27B inference unavailable / OOM on 24 GB | Drop to TP=2 on a multi-GPU host, or switch 27B → Qwen-32B-base via vLLM if 27B-it is gated |
| Raw JSONLs for 4B/9B/27B not recoverable from the prior sweep | Recompute by re-running the existing 8 conditions alongside Batch A — small marginal cost, restores full per-sample data |
| Compute slips, can't finish 27B on all 4 missing benchmarks | Prioritise BBH and MMLU on 27B (scaling-curve completeness); defer TruthfulQA + HumanEval as "future work" |

---

## 7. Order of operations (one-shot script)

```bash
# Pre: ensure vLLM endpoint is up for each preset (see docs/a6000-runbook.md §3)

# Batch D first (no GPU)
$EDITOR docs/samples/benchmarks/router.py   # populate pick_school rules

# Batch A
PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it qwen3.5-4b-it qwen3.5-9b-it" \
CONDITIONS="cot socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein" \
LIMIT=0 bash experiments/scripts/run_all.sh

# Batch B
PRESETS="qwen3.5-27b-it gemma4-e2b-it" \
BENCHMARKS="mmlu bbh truthfulqa humaneval" \
LIMIT=0 bash experiments/scripts/run_all.sh

# Batch C (after D)
CONDITIONS="random_school router_auto" \
LIMIT=0 bash experiments/scripts/run_all.sh

# Re-aggregate
python3 experiments/analysis/run_analysis.py
python3 experiments/analysis/plot_schools.py

# Re-sync front-end
cp docs/samples/benchmarks/results/summary.json web/src/data/benchmark_results.json
# (extend BenchmarkTab.tsx PreQinSchool -> SchoolId; same diff pattern as the current 6-school version)
cd web && npm run build
```

When this whole sequence has run cleanly and `summary.json` contains ≥ 648 rows with `err = 0`, the gap is closed and the paper can be drafted from real data instead of placeholders.
