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
| Understand the **14 schools** (what each one does, why it's distinct) | [hundredschools/SKILL.md](hundredschools/SKILL.md) + per-school guides under `hundredschools/references/` |
| Lock down a **pre-registration** before running large models | [experiments/pre-registration.md](experiments/pre-registration.md) |
| Configure **A6000 / vLLM** runs operationally | [docs/scale-curve-experiment-plan.md](docs/scale-curve-experiment-plan.md), [docs/a6000-runbook.md](docs/a6000-runbook.md) |
| See **benchmark methodology** (selection, baselines, fairness) | [docs/general-benchmark-plan.md](docs/general-benchmark-plan.md) |
| Work on the **safety / XGuard branch** (independent from tech-report) | [docs/xguard-official-benchmark-plan.md](docs/xguard-official-benchmark-plan.md) |

If you only have **5 minutes**: read this file + scroll [experiments/TODO.md](experiments/TODO.md) §1 (Pre-GPU work).

If you only have **30 minutes**: add [docs/tech-report-plan.md](docs/tech-report-plan.md) §1–§5.

---

## 2. Current state (as of last commit)

**Done**
- 14 schools defined and wired (6 Pre-Qin core + 8 later additions)
- Web frontend updated to display the 14 schools (grouped by origin)
- Benchmark runner accepts all 19 conditions (3 baselines + 14 schools + `random_school` + `router_auto`)
- 14 marker dictionaries × 6 markers each, public for review
- L1, L2, L3, L4, L6 metrics implemented; L5 reuses existing scorers
- Pre-registration template ready (placeholders to fill before lock-down)
- Pilot + full-sweep shell scripts with checkpoint/resume
- Analysis driver writes 4 CSVs + hypothesis sketch

**Not yet done** (everything that needs GPU or external decisions)
- Pilot run (`bash experiments/scripts/run_pilot.sh`)
- Pre-registration lock-down (date / commit hash / OSF ID)
- Full sweep (5 Qwen 3.5 sizes × 6–8 benchmarks × 19 conditions)
- Cross-family sanity (Gemma / Llama)
- Significance notebook (paired t-test + Bonferroni + Cohen's d)
- Preprint draft

---

## 3. Active checkpoint

Per [docs/tech-report-plan.md](docs/tech-report-plan.md) §13, the next
binding decision is:

> **Week 1 checkpoint** — collision search complete, OSF preregistration
> filed, marker dictionaries audited.

Everything in [experiments/TODO.md](experiments/TODO.md) §1 (Pre-GPU
work) can be done in parallel **before** this checkpoint. None of it
needs GPU. Pick any subset.

---

## 4. Document layering (why we have eight files)

```
strategy ─── docs/improvement-proposal.md           (top-level, 5 branches)
                ├─ tech-report-plan.md              (this branch's strategy)
                │     └─ experiments/TODO.md        (per-week execution)
                │     └─ experiments/pre-registration.md  (frozen at lock-down)
                ├─ xguard-official-benchmark-plan.md  (independent safety branch)
                └─ general-benchmark-plan.md        (cross-cutting methodology)
                      ├─ scale-curve-experiment-plan.md  (A6000 execution)
                      └─ targeted-evaluation-plan.md     (Phase 1 historical)
runbook ──── docs/a6000-runbook.md                  (operational)
```

The split is deliberate: strategy docs change rarely; execution docs
change every week; runbooks change with hardware.

---

## 5. Latest commits (most recent first)

Run `git log --oneline -10` for the live view. As of this writing:

```
7e78d78 experiments: add living TODO.md with per-phase checklist
4574fcb experiments: build full tech-report infrastructure (everything but results)
5be997c docs: add tech-report plan branch with explicit empirical purpose
9358935 schools: add Bacon's Idols and Wittgenstein language-games
51b0ac1 schools: add Hegelian, Pragmatist, Yangming + wire 6 additions into web
de202f5 schools: add Socratic, Stoic, Falsificationist as Western additions
```

---

> Update this file when a new doc is added or a checkpoint is crossed.
> Single entry point only stays useful if it stays current.
