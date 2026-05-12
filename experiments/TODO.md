# HundredSchools Tech-Report — Living TODO

> **Status (2026-05-12)**: All benchmark experiments COMPLETE. 570/570
> cells filled (5 Qwen3.5 sizes × 19 conditions × 6 benchmarks =
> 2,218,259 records). Router_auto achieves +7.69pp avg vs baseline.
> Next phase: statistical analysis and preprint writing.

---

## 0. Completed (experiment phase)

- [x] 14 schools defined as guides (`hundredschools/references/`)
- [x] 14 schools wired into the runner via `SCHOOL_PROMPTS`
- [x] 19 conditions registered (3 baselines + 14 schools + random_school + router_auto)
- [x] `random_school` resolves deterministically per sample
- [x] 14 marker dictionaries × 6 markers each (`experiments/markers/`)
- [x] L1, L2, L3, L4, L6 metrics implemented (L5 reuses existing scorers)
- [x] Pre-registration template (`experiments/pre-registration.md`)
- [x] Pilot + full-sweep shell scripts (`experiments/scripts/`)
- [x] Analysis driver writes CSVs + hypothesis sketch (`experiments/analysis/run_analysis.py`)
- [x] **Batch A — Extended 8 schools + `cot` on 0.8B–9B** (all 216 cells)
- [x] **Batch B — 27B on all 6 benchmarks × 18 conditions** (108 cells)
- [x] **Batch D — Router rules** (`docs/samples/benchmarks/router.py` with empirical rules)
- [x] **Batch C — `random_school` + `router_auto`** on all 5 presets × 6 benchmarks
- [x] Qwen3.5 thinking mode fix (4B+ requires `enable_thinking=false`)
- [x] Final dedup and summary.json regeneration (570 rows)
- [x] Analysis pipeline run (L1, L2, L5, L6 CSVs generated)
- [x] ANALYSIS.md comprehensive report written

---

## 1. Pre-GPU work (still applicable)

- [ ] **Citation collision search** (Week 1)
  - Google Scholar: `philosophical persona LLM`, `system prompt taxonomy LLM`
  - Outcome: short note in `experiments/related-work-notes.md`

- [ ] **`significance.ipynb` skeleton**
  - Loads the CSVs from `analysis/out/full/`
  - Functions for paired t-test + Bonferroni + Cohen's d on (school × task) cells
  - Plots: H1 distance heatmap, H2 scaling curve, H3 task-school grid, H4 router-vs-single bar chart

- [ ] **Marker review pass** (audit)
  - Run pilot, dump 5 random outputs per (preset, school) pair
  - PR-style discussion log under `experiments/marker-audit-log.md`

---

## 2. Full sweep — COMPLETE ✅

**Coverage matrix (all ✅ = 19 conditions covered)**:

| Preset \ Bench | MMLU | BBH | GSM8K | TQA | IFEval | HumanEval |
|---|---|---|---|---|---|---|
| qwen3.5-0.8b-it | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c |
| qwen3.5-2b-it   | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c |
| qwen3.5-4b-it   | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c |
| qwen3.5-9b-it   | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c |
| qwen3.5-27b-it  | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c | ✅ 19c |

**Key findings:**
- Router_auto: +7.69pp average, #1 on 4/6 benchmarks
- Best single schools: dao (code +12.68pp), mohist (BBH +0.52pp), legal (TruthfulQA +0.78pp)
- Extended schools collapse on short-format tasks (token budget conflict, not school ineffectiveness)
- 9B is the "sweet spot" for Pre-Qin school benefits

---

## 3. Analysis & writing (current phase)

- [x] **Generate all CSVs** via `run_analysis.py`
- [ ] **Run significance.ipynb** end-to-end
- [ ] **Hypothesis verdict**
  - For each H1–H4 record: support / partial / fail
  - For each failed H, apply the rewrite from `docs/tech-report-plan.md` §5
- [ ] **Draft preprint** (10–14 pages, structure in tech-report-plan §9.2)
- [ ] **Internal review**: ask 1–2 friends; address comments
- [ ] **Decision checkpoint**: draft v0 reviewed → ready to submit

---

## 4. Release

- [ ] `git tag tech-report-v1.0`
- [ ] arXiv submission (cs.CL or cs.AI)
- [ ] Skill v1.0 GitHub release with attached preprint PDF
- [ ] Web frontend mirrors the new figures
- [ ] Cross-post: HN, Twitter / X, relevant Discord communities

---

## 5. Post-release (optional)

- [ ] Workshop submission (NeurIPS Foundation Model Interventions, ACL ROBUSTNLP)
- [ ] Mech-interp follow-up: probe attention/activations
- [ ] Adversarial robustness sub-paper
- [ ] Cross-family validation (Gemma, Llama, larger Qwen)
- [ ] Long-format task evaluation (papers, projects, multi-turn dialogue)

---

## Decision log

| Date | Commit | Decision | Effect |
|------|--------|----------|--------|
| 2026-05-12 | bda7f5b | Router rules populated from empirical data | Batch D complete |
| 2026-05-12 | dfd0101 | All 570 cells complete; thinking mode fixed | Experiment phase closed |

---

## Technical notes

### Qwen3.5 Thinking Mode
Qwen3.5 4B+ models have built-in thinking mode that activates by default. Must disable via:
```bash
--default-chat-template-kwargs '{"enable_thinking": false}'
```
Without this, models produce `<think>...</think>` blocks that consume the token budget on short-answer tasks.

### Parallel Worker Deduplication
Multiple eval workers with `--resume` create duplicates (each loads the same remaining-task list at startup). Always dedup by `(preset, benchmark, condition, sample_id)` after parallel runs.
