# HundredSchools Tech-Report — Living TODO

> **Status as of last commit**: full infrastructure layer is in place;
> the **Pre-Qin partial sweep is done** (6 schools × 4 Qwen sizes × 6
> benchmarks + 27B/Gemma on GSM8K + IFEval); **8 extended schools and
> 4 missing benchmarks on 27B/Gemma are pending**. See
> [./gap-filling-plan.md](./gap-filling-plan.md) for the exact batches,
> commands, and cost.
>
> This file is the working punch-list distilled from
> [../docs/tech-report-plan.md](../docs/tech-report-plan.md) §10 (timeline)
> and §13 (decision checkpoints). It is meant to be checked off and
> updated in PRs, not preserved as a static plan.

---

## 0. Already done (for the record)

- [x] 14 schools defined as guides (`hundredschools/references/`)
- [x] 14 schools wired into the runner via `SCHOOL_PROMPTS`
- [x] 19 conditions registered (3 baselines + 14 schools + random_school + router_auto)
- [x] `random_school` resolves deterministically per sample
- [x] 14 marker dictionaries × 6 markers each (`experiments/markers/`)
- [x] L1, L2, L3, L4, L6 metrics implemented (L5 reuses existing scorers)
- [x] Pre-registration template (`experiments/pre-registration.md`)
- [x] Pilot + full-sweep shell scripts (`experiments/scripts/`)
- [x] Analysis driver writes 4 CSVs + hypothesis sketch (`experiments/analysis/run_analysis.py`)
- [x] User-facing README (`experiments/README.md`)
- [x] Tech-report plan + improvement-proposal v2 (`docs/`)

---

## 1. Pre-GPU work (no compute required)

These can be picked up by anyone, in any order, before locking down.

- [ ] **Citation collision search** (Week 1)
  - Google Scholar: `philosophical persona LLM`, `system prompt taxonomy LLM`,
    `agent stance composition`, `multi-stance steering benchmark`
  - 2-hour timebox; if anything close lands, draft a §Related Work
    "we differ in X, Y, Z" paragraph before lock-down
  - Outcome: short note in `experiments/related-work-notes.md`

- [ ] **Add XSum loader** (compression task domain — task domain 7 of 8)
  - Place at `docs/samples/benchmarks/loaders/xsum.py`
  - Mirror the `(dataset, sample_id, prompt, gold, meta)` shape used by
    other loaders
  - Register in `run_general_eval.py::LOADERS` and `SCORERS` (use ROUGE
    + BERTScore wrapper; sketch in `scorers/summary.py`)

- [ ] **Custom planning / creative loaders** (task domains 7–8)
  - Convert `docs/case-studies.md` into 30 + 30 sample JSONL files
  - Loaders at `docs/samples/benchmarks/loaders/planning.py` and
    `loaders/creative.py`
  - Score via rubric + LLM-as-judge (judge prompt frozen at lock-down)

- [ ] **B4 "best-fit prompt-eng" registry**
  - One short, well-engineered prompt per (task domain) — the strongest
    non-school baseline a competent practitioner would write
  - Place at `experiments/baselines/best_fit/<task>.py`
  - Wire into `run_general_eval.py` as condition `b4_best_fit`
  - Reviewer-facing comment: who wrote it, when, on which dev split

- [ ] **`significance.ipynb` skeleton**
  - Loads the 4 CSVs from `analysis/out/full/`
  - Reproduces every table in §4 of the paper
  - Functions for paired t-test + Bonferroni + Cohen's d on
    (school × task) cells
  - Plots: H1 distance heatmap, H2 scaling curve, H3 task-school grid,
    H4 pipeline-vs-single bar chart

- [ ] **Marker review pass** (audit before lock-down)
  - Run pilot, dump 5 random outputs per (preset, school) pair
  - For each pair, score per_marker_hits manually; see whether the
    automated recall matches human judgment
  - PR-style discussion log under `experiments/marker-audit-log.md`
  - Adjust markers; merge **before** pre-registration lock-down

- [ ] **Datasets manifest**
  - Document expected layout under `~/datasets/` for all 8 task
    domains (currently 4 are present: or_bench, s_eval,
    simple_safety_tests, xstest; XSum + planning + creative will be
    added by the loaders above)
  - Path: `experiments/datasets-manifest.md`

---

## 2. Pilot (Week 2–4)

- [ ] **Spin up vLLM endpoint** for `qwen3.5-0.8b-it`
- [ ] **Run pilot script**
  ```bash
  bash experiments/scripts/run_pilot.sh
  ```
- [ ] **Verify L1–L6 outputs** in `experiments/analysis/out/pilot/`
- [ ] **Decision checkpoint (Week 4 from tech-report-plan §13)**
  - H1 needs to be at least *partially* satisfied on the pilot data
  - If yes → proceed to full sweep
  - If no → trigger §11 risk flow (downgrade to taxonomy paper)

---

## 3. Pre-registration lock-down

- [ ] Fill placeholders in `experiments/pre-registration.md`:
  - Lock-down date
  - Repo commit hash at lock-down
  - OSF / AsPredicted ID
  - Author + ORCID
- [ ] `git tag pre-registration-v1`
- [ ] Submit to OSF / AsPredicted
- [ ] Freeze marker dictionaries (no PRs to `experiments/markers/`
  except via §15 deviations log)

---

## 4. Full sweep (Week 5–7)

**Coverage of `docs/samples/benchmarks/results/summary.json` as of last commit**:

| Preset \ Bench | MMLU | BBH | GSM8K | TQA | IFEval | HumanEval |
|---|---|---|---|---|---|---|
| qwen3.5-0.8b-it | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c |
| qwen3.5-2b-it   | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c |
| qwen3.5-4b-it   | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c |
| qwen3.5-9b-it   | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c | ✅ 8c |
| qwen3.5-27b-it  | ❌    | ❌    | ✅ 8c | ❌    | ✅ 8c | ❌        |
| gemma4-e2b-it   | ❌    | ❌    | ✅ 8c | ❌    | ✅ 8c | ❌        |

> "8c" = covered with 8 conditions only (baseline + neutral_long + 6 Pre-Qin). The 8 extended schools, `cot`, `random_school`, and `router_auto` are missing from every cell. Full plan: [./gap-filling-plan.md](./gap-filling-plan.md).

- [x] **Spin up endpoints** for the full Qwen 3.5 ladder (0.8b → 9b)
- [x] **Run partial sweep** — 8 conditions × 6 benchmarks × 0.8B/2B/4B/9B + GSM8K/IFEval on 27B & Gemma
- [ ] **Batch A — extended 8 schools + `cot` on 0.8B–9B grid** (gap-filling-plan §2.A)
  ```bash
  PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it qwen3.5-4b-it qwen3.5-9b-it" \
  CONDITIONS="cot socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein" \
  LIMIT=0 bash experiments/scripts/run_all.sh
  ```
- [ ] **Batch B — 27B & Gemma on missing benchmarks** (gap-filling-plan §2.B)
  ```bash
  PRESETS="qwen3.5-27b-it gemma4-e2b-it" \
  BENCHMARKS="mmlu bbh truthfulqa humaneval" \
  CONDITIONS="baseline neutral_long cot dao confucian legal military mohist logician socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein" \
  LIMIT=0 bash experiments/scripts/run_all.sh
  ```
- [ ] **Batch D — router rules** (no GPU; precondition for `router_auto`)
  - Populate `docs/samples/benchmarks/router.py::pick_school` from the
    school-effects findings (see [../docs/school-effects-report.md](../docs/school-effects-report.md))
- [ ] **Batch C — `random_school` + `router_auto`** (gap-filling-plan §2.C)
  ```bash
  CONDITIONS="random_school router_auto" \
  LIMIT=0 bash experiments/scripts/run_all.sh
  ```
- [ ] **Cross-family sanity** (Week 8)
  ```bash
  PRESETS="gemma4-e2b-it" \
  BENCHMARKS="gsm8k ifeval mmlu humaneval" \
  bash experiments/scripts/run_all.sh
  ```
- [ ] **Decision checkpoint (Week 7)**
  - If Batch A < 80 % complete → switch to 4-week MVP scope
    (drop RQ4, drop cross-family, drop 27b)
  - If Batch B 27B inference can't sustain throughput → prioritise BBH +
    MMLU on 27B (scaling-curve completeness) and defer TQA + HumanEval

---

## 5. Analysis & writing (Week 9–11)

- [ ] **Generate all CSVs**
  ```bash
  python3 experiments/analysis/run_analysis.py
  ```
- [ ] **Run significance.ipynb** end-to-end
- [ ] **Hypothesis verdict**
  - For each H1–H4 record: support / partial / fail
  - For each failed H, apply the "if fails, write the paper this way"
    rewrite from `docs/tech-report-plan.md` §5
- [ ] **Draft preprint** (10–14 pages, structure in tech-report-plan §9.2)
- [ ] **Internal review**: ask 1–2 friends; address comments
- [ ] **Decision checkpoint (Week 11)**: draft v0 reviewed → ready to submit

---

## 6. Release (Week 12)

- [ ] `git tag tech-report-v1.0`
- [ ] arXiv submission (cs.CL or cs.AI)
- [ ] Skill v1.0 GitHub release with attached preprint PDF
- [ ] First-author footnote includes: preprint URL, code, data, OSF link
- [ ] Web frontend mirrors the new figures (re-use `web/src/components/`
  patterns)
- [ ] Cross-post: HN, Twitter / X, relevant Discord communities

---

## 7. Post-release (optional, time permitting)

- [ ] Workshop submission (NeurIPS Foundation Model Interventions,
  ACL ROBUSTNLP, etc.) — same content, repackaged
- [ ] Mech-interp follow-up: probe attention / activations to
  distinguish surface marker fidelity from deeper representational
  identity
- [ ] Adversarial robustness sub-paper: how do schools survive prompt
  injection? (the (B) angle from earlier discussion)
- [ ] Larger-model sanity (Qwen 72B) once compute permits

---

## Decision log

Use this table to record every binding decision after lock-down. Tie
each row to a git commit so the audit trail is preserved.

| Date | Commit | Decision | Effect on pre-registration |
|------|--------|----------|---------------------------|
|      |        |          |                           |

---

## Risk register quick reference

Pulled from [../docs/tech-report-plan.md](../docs/tech-report-plan.md) §11
for ease of reference; do not edit here, edit the source.

| Risk | Quick mitigation |
|------|------------------|
| H1 fails (schools indistinguishable) | Downgrade to taxonomy paper; workshop venue |
| H3 winning-school sparse | Honest reframe as "persona helps in N/8 domains" |
| Reviewer says "philosophy is decoration" | Concede in §Discussion; that *is* the position |
| Qwen SFT data variance is a confound | Cite Qwen 3.5 tech report; note as limitation |
| arXiv collision | Refocus §Related Work onto specific differentiators |
| Compute / time blow-up | 4-week MVP fallback already wired (LIMIT=50, 4 presets) |
| Writing lag | §2 Framework and §3 Setup can be drafted early from existing docs |
