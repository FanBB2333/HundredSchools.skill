# HundredSchools — experiments/

Scientific layer for the technical-report deliverable described in
[../docs/tech-report-plan.md](../docs/tech-report-plan.md).

This directory provides everything the existing
`docs/samples/benchmarks/` runner does **not** provide:

- **14-school marker dictionaries** with public per-school behavioral
  predictions (`markers/<school>.py`)
- **L1–L6 metrics** that consume runner output JSONL and produce
  reviewer-facing CSVs (`metrics/`)
- **Pre-registration template** ready to mirror to OSF / AsPredicted
  (`pre-registration.md`)
- **Pilot + full-sweep shell scripts** with resume safety
  (`scripts/`)
- **Analysis driver** producing every table the paper §Results
  references (`analysis/run_analysis.py`)

## Layout

```
experiments/
  README.md                          # this file
  pre-registration.md                # OSF / AsPredicted source-of-truth
  markers/
    __init__.py                      # SCHOOL_IDS, load_markers(), all_markers()
    dao.py confucian.py legal.py military.py mohist.py logician.py
    socratic.py stoic.py falsificationist.py hegelian.py
    pragmatist.py yangming.py bacon.py wittgenstein.py
  metrics/
    __init__.py
    l1_length.py                     # length ratio
    l2_marker_recall.py              # school fidelity
    l3_pairwise_distance.py          # cosine distance matrix (RQ1)
    l4_cross_size_identity.py       # cosine across model sizes (RQ2)
    l6_overuse_triggers.py          # anti-marker rate
    # L5 = task accuracy from existing scorers; not duplicated here
  analysis/
    load_records.py                  # JSONL loader + filters
    run_analysis.py                  # produces all CSVs + hypothesis sketch
  scripts/
    run_pilot.sh                     # 4-week MVP path: small slice end-to-end
    run_all.sh                       # 12-week full path: 6 sizes x 19 conds x 8 tasks
```

## How this slots into the existing repo

The benchmark runner already lives at
`docs/samples/benchmarks/run_general_eval.py`. It loads tasks via
`loaders/`, scores via `scorers/`, and writes one JSONL line per
(preset, condition, sample_id) call to
`docs/samples/benchmarks/results/<preset>.jsonl`.

What v0.4 added (this branch):

1. `docs/samples/run_8b_benchmark_eval.py::SCHOOL_PROMPTS` now contains
   **all 14 schools** (was 6).
2. `docs/samples/benchmarks/conditions.py` exposes 14 schools + 4
   baselines (`baseline`, `neutral_long`, `cot`, `random_school`)
   as well as `router_auto`.
3. `random_school` is resolved deterministically per sample using a
   stable hash, so reruns produce the same school assignment.

You do **not** need to rewrite the runner. You can drive everything via
the existing CLI; the only new step is running
`experiments/analysis/run_analysis.py` afterwards.

## Quick start

### 0. Pre-flight

```bash
# 1. Datasets present at ~/datasets (already configured in repo)
ls ~/datasets

# 2. vLLM OpenAI-compatible server up, e.g.:
vllm serve /root/models/Qwen/Qwen3.5-0.8B \
    --served-model-name qwen3.5-0.8b \
    --port 8001
```

### 1. Pilot (1 preset, 2 benchmarks, 8 conditions, 50 samples)

```bash
bash experiments/scripts/run_pilot.sh
# CSVs land under experiments/analysis/out/pilot/
```

Use the pilot to:
- confirm the runner works end-to-end on your hardware
- audit the marker dictionaries against real outputs
- decide whether to lock down the pre-registration

### 2. Full sweep

```bash
# Default: 5 Qwen sizes x 6 benchmarks x 19 conditions x 200 samples
bash experiments/scripts/run_all.sh

# Override any axis via env vars:
PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it" \
LIMIT=100 \
bash experiments/scripts/run_all.sh
```

### 3. Analysis only (re-run after partial results land)

```bash
python3 experiments/analysis/run_analysis.py \
    --results-dir docs/samples/benchmarks/results \
    --out-dir experiments/analysis/out/full
```

Outputs:
- `l1_l2_l6_summary.csv` — length / marker-recall / overuse rate per (preset, condition)
- `l3_distance_<preset>.csv` — pairwise cosine distance matrix per preset
- `l4_identity_<small>_vs_<large>.csv` — cross-size school identity
- `l5_accuracy.csv` — task accuracy per (preset, condition, benchmark)
- `hypothesis_sketch.md` — H1–H4 input-availability summary

## What is **not** in this directory

- **Models / weights**: bring your own; the runner targets any vLLM /
  OpenAI-compatible endpoint.
- **Datasets**: under `~/datasets/`. See `docs/samples/benchmarks/loaders/`
  for download paths.
- **Significance tests** (paired t-test, Bonferroni, Cohen's d): produced
  in a future `analysis/significance.ipynb` from the CSVs above. The CSVs
  contain enough information to compute them with stdlib +
  `scipy.stats`.
- **L5 task accuracy**: computed by the existing scorers in
  `docs/samples/benchmarks/scorers/`. The analysis driver reads the
  scorer output already attached to each record.

## Reproducing the paper from scratch

```bash
# 1. Lock down (after pilot)
git tag pre-registration-vN

# 2. Full sweep
bash experiments/scripts/run_all.sh

# 3. Generate every table in §4 of the paper
python3 experiments/analysis/run_analysis.py

# 4. Tag and release
git tag tech-report-v1.0
```

## Auditing the marker dictionaries

Each marker is a small Python lambda or function. To audit:

```python
from experiments.markers import load_markers
from experiments.metrics.l2_marker_recall import per_marker_hits

text = "...some draft answer here..."
print(per_marker_hits(text, "dao"))
# {'multi_alternatives': True, 'hedged_language': True, ...}
```

Markers are intentionally lexical / structural (regex / count / length).
They encode falsifiable behavioral commitments from each school's
`hundredschools/references/<SCHOOL>-GUIDE.md`. PRs that add or modify
markers must:

1. cite the specific GUIDE.md passage that justifies the marker
2. include at least one positive and one negative test sample
3. be merged **before** pre-registration lock-down

After lock-down, marker changes go through the §15 deviations log in
`pre-registration.md` and require a separate analysis pass with the
amended marker set.
