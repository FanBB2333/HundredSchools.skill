# HundredSchools — Project Roadmap & Document Index

> **Single entry point** to every plan / TODO / runbook in this repo.
> Skim §1 to find the right doc; §2 for the current state; §3 for what
> ships next.

---

## 1. Where to look (by reader / task)

| If you want to … | Read |
|---|---|
| Understand the **whole v2 improvement plan** (5 branches, all goals) | [docs/improvement-proposal.md](docs/improvement-proposal.md) |
| Understand the **tech-report deliverable** (RQs, hypotheses, 12-week timeline, risks) | [docs/tech-report-plan.md](docs/tech-report-plan.md) |
| Pick up **today's actionable work** (checkboxes, decision checkpoints) | [experiments/TODO.md](experiments/TODO.md) |
| Run a **benchmark on your hardware** | [experiments/README.md](experiments/README.md) |
| See **complete experiment results and analysis** | [docs/samples/benchmarks/ANALYSIS.md](docs/samples/benchmarks/ANALYSIS.md) |
| See **experiment progress and system details** | [docs/samples/benchmarks/PROGRESS.md](docs/samples/benchmarks/PROGRESS.md) |
| Apply findings to **other models / real flows** & 10 daily-usage rules | [docs/generalization-and-daily-usage.md](docs/generalization-and-daily-usage.md) |
| Understand the **14 schools** (what each one does, why it's distinct) | [hundredschools/SKILL.md](hundredschools/SKILL.md) + per-school guides under `hundredschools/references/` |
| Lock down a **pre-registration** before running large models | [experiments/pre-registration.md](experiments/pre-registration.md) |
| Configure **A6000 / vLLM** runs operationally | [docs/scale-curve-experiment-plan.md](docs/scale-curve-experiment-plan.md), [docs/a6000-runbook.md](docs/a6000-runbook.md) |
| See **benchmark methodology** (selection, baselines, fairness) | [docs/general-benchmark-plan.md](docs/general-benchmark-plan.md) |
| Work on the **safety / XGuard branch** (independent from tech-report) | [docs/xguard-official-benchmark-plan.md](docs/xguard-official-benchmark-plan.md) |

If you only have **5 minutes**: read this file + the conclusion of [ANALYSIS.md](docs/samples/benchmarks/ANALYSIS.md) §六.

If you only have **30 minutes**: add [docs/tech-report-plan.md](docs/tech-report-plan.md) §1–§5.

---

## 2. Current state (2026-05-12)

**All benchmark experiments are COMPLETE.**

| Milestone | Status |
|-----------|--------|
| 14 schools defined and wired | ✅ Done |
| 19 conditions registered (3 baselines + 14 schools + random_school + router_auto) | ✅ Done |
| Full sweep: 5 Qwen3.5 sizes × 19 conditions × 6 benchmarks | ✅ **570/570 cells** |
| Total records | 2,218,259 |
| Router_auto (task-aware routing) | ✅ +7.69pp avg vs baseline |
| Analysis pipeline (L1, L2, L5, L6) | ✅ Generated |
| summary.json | ✅ 570 rows |

**Key results:**
- Router_auto achieves #1 rank on 4/6 benchmarks (BBH, HumanEval, TruthfulQA, IFEval/MMLU tied)
- Average improvement: +7.69 percentage points over baseline
- Prior Pre-Qin schools individually: dao best for code (+12.68pp), mohist best for reasoning (+0.52pp on BBH)

**Not yet done** (writing / publication tasks)
- Pre-registration lock-down (date / commit hash / OSF ID)
- Significance notebook (paired t-test + Bonferroni + Cohen's d)
- Preprint draft
- Cross-family sanity (Gemma / Llama — Gemma4 model files not available on disk)

---

## 3. Active checkpoint

The experiment phase is complete. The next binding work is:

> **Writing phase** — Draft the preprint from real data. All 570 cells
> are in `summary.json`; all per-sample data is in `results/full/`.

Priority tasks:
1. Run `significance.ipynb` for statistical tests
2. Draft preprint (10–14 pages)
3. Generate publication-quality figures

---

## 4. Document layering

```
strategy ─── docs/improvement-proposal.md           (top-level, 5 branches)
                ├─ tech-report-plan.md              (this branch's strategy)
                │     └─ experiments/TODO.md        (per-week execution)
                │     └─ experiments/pre-registration.md  (frozen at lock-down)
                ├─ xguard-official-benchmark-plan.md  (independent safety branch)
                └─ general-benchmark-plan.md        (cross-cutting methodology)
results ──── docs/samples/benchmarks/
                ├─ ANALYSIS.md                      (comprehensive findings)
                ├─ PROGRESS.md                      (system & status)
                ├─ results/summary.json             (570-row aggregate)
                └─ results/full/*.jsonl             (2.2M raw records)
analysis ─── experiments/analysis/
                ├─ run_analysis.py                  (L1-L6 metrics)
                └─ out/full/                        (CSVs + hypothesis sketch)
```

---

## 5. Latest commits (most recent first)

```
dfd0101 experiments: complete all 570 cells (5 models × 19 conditions × 6 benchmarks)
bda7f5b experiments: update router with empirical rules and regenerate summary
6f68c0e docs+experiments: analyse 6-school sweep and plan gap-fill
50d287b docs: add experiment analysis report with per-school causal reasoning
507f658 docs: add ROADMAP.md as single entry point to all plans
7e78d78 experiments: add living TODO.md with per-phase checklist
4574fcb experiments: build full tech-report infrastructure (everything but results)
5be997c docs: add tech-report plan branch with explicit empirical purpose
9358935 schools: add Bacon's Idols and Wittgenstein language-games
```

---

> Update this file when a new doc is added or a checkpoint is crossed.
> Single entry point only stays useful if it stays current.
