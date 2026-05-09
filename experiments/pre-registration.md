# HundredSchools Pre-registration

> **Lock-down date**: _____________ (fill before running models > 4B)
> **Repository commit hash at lock-down**: _____________
> **OSF / AsPredicted ID**: _____________
>
> This document is the canonical, frozen statement of hypotheses,
> metrics, and analysis plans for the HundredSchools v0.4 technical
> report. Any change after lock-down requires a separate amendment
> recorded as a new git commit referencing this file.

---

## 1. Title

Cross-scale, cross-task evaluation of philosophically-grounded
control stances for instruction-tuned LLMs (HundredSchools v0.4).

## 2. Authors and ORCID

- _____________ (ORCID: _____________)

## 3. Background and rationale

The framework defines 14 inference-time control stances drawn from
classical Chinese (6) and Mediterranean / modern Western / Ming
Neo-Confucian (8) philosophical schools. Each stance is operationalized
as a system prompt and a public list of 5–10 behavioral markers
(`experiments/markers/<school>.py`). Prior work on persona prompting
(Salewski 2023; Deshpande 2023; Serapio-García 2023) has shown that
persona conditioning measurably affects outputs and downstream task
performance, but no published study compares a fixed taxonomy of
philosophical control stances at scale on the *same* benchmark suite
across multiple model sizes.

The full motivation, non-goals, and risk analysis are in
[../docs/tech-report-plan.md](../docs/tech-report-plan.md).

## 4. Hypotheses

### H1 (school distinguishability)

Across the 14 schools, the pairwise cosine distance between mean
output embeddings is at least 2× the baseline-vs-baseline noise floor,
on average across the schools.

**Falsification**: any **≥ 3** distinct school pairs whose distance falls
within the noise floor — measured as the cosine distance between two
independent runs of the `baseline` (vanilla, no system prompt)
condition — will count as failure.

### H2a (fidelity scaling)

Marker recall (L2) is monotonically non-decreasing in model parameter
count, averaged across the 14 schools.

**Falsification**: Spearman rank correlation between (parameter count,
mean marker recall across schools) is < 0.3.

### H2b (cross-size school identity)

Cross-size school identity (L4): for each school, the cosine
similarity between its mean output embedding at the smallest tested
preset and at the largest tested preset is > 0.6, averaged across
the 14 schools.

**Falsification**: average L4 < 0.6.

### H3 (task–school matching)

For each of the 8 task domains, there exists at least one school whose
score on that domain is significantly higher than vanilla baseline
(p < 0.01 paired t-test, Cohen's d > 0.3).

**Falsification**: < 4 of 8 tasks satisfy the above.

### H4 (pipeline composition) — *bonus, may be dropped*

At least 2 of the predefined pipelines listed in §5 below produce
better task scores than any single school in their target domain.

**Falsification**: every pipeline ≤ best single school for its target
task.

## 5. Predefined pipelines (for H4)

| Pipeline | Target task |
|---|---|
| `military -> legal` | code (HumanEval) |
| `logician -> mohist` | summarization (XSum) |
| `socratic -> yangming` | planning (custom) |
| `dao -> hegelian -> military` | reasoning (GSM8K) |
| `bacon -> falsificationist` | fact-checking (TruthfulQA) |

## 6. Models

Primary axis (Qwen 3.5 instruction-tuned series):

- `qwen3.5-0.8b-it`
- `qwen3.5-2b-it`
- `qwen3.5-4b-it`
- `qwen3.5-9b-it`
- `qwen3.5-27b-it` *(if compute permits)*

Cross-family sanity (RQ1 only):

- `gemma4-e2b-it`
- `llama3.1-8b-it` *(optional)*

## 7. Conditions (19 total)

3 baselines + 14 schools + 1 random-school + 1 router-auto = 19.

| Group | IDs |
|---|---|
| Baselines | `baseline`, `neutral_long`, `cot` |
| Pre-Qin core | `dao`, `confucian`, `legal`, `military`, `mohist`, `logician` |
| Later additions | `socratic`, `stoic`, `falsificationist`, `hegelian`, `pragmatist`, `yangming`, `bacon`, `wittgenstein` |
| Meta-baselines | `random_school`, `router_auto` |

`best-fit prompt-eng` (B4) is per-task, recorded but not enumerated
here; entries land in
`experiments/markers/_b4_best_fit/<task>.py`.

## 8. Tasks (8 domains)

| Domain | Loader | Default samples |
|---|---|---|
| Math reasoning | `gsm8k` | 200 |
| Mixed reasoning | `mmlu` (5 subjects) | 200 |
| Instruction following | `ifeval` | 200 |
| Code | `humaneval` | 164 (full set) |
| Multi-step reasoning | `bbh` | 200 |
| Truthfulness | `truthfulqa` | 200 |
| Compression | `xsum` (to be added) | 200 |
| Custom planning / creative | from `case-studies` | 30+30 |

Custom planning and creative loaders are added in `loaders/custom.py`
before lock-down.

## 9. Decoding

Per-benchmark overrides come from `docs/samples/benchmarks/models.py`
`BENCHMARK_DECODING`. All conditions for a given (preset × task) pair
share identical decoding settings and seed.

## 10. Metrics (locked at lock-down)

| Metric | Algorithm | Lock-status |
|---|---|---|
| L1 length ratio | `len(out) / len(baseline_out)` (chars) | Locked |
| L2 marker recall | `experiments/markers/<school>.py::MARKERS` | Locked at marker-dict freeze (pre-lock-down step) |
| L3 pairwise distance | sentence-transformers all-mpnet-base-v2; cosine of mean embeddings | Locked |
| L4 cross-size identity | cosine of mean(small) vs mean(large) per school | Locked |
| L5 task accuracy | existing scorers in `docs/samples/benchmarks/scorers/` | Locked |
| L6 overuse trigger rate | `experiments/metrics/l6_overuse_triggers.py::_ANTI_MARKERS` | Locked |

## 11. Statistical tests

- Pairwise comparison: paired t-test across samples, Bonferroni-corrected
  for the number of (school × task) pairs.
- Correlation tests for H2a: Spearman rank.
- Effect size: Cohen's d for school-vs-baseline; report alongside
  p-values throughout.

## 12. Sample sizes

- 6 sizes × 19 conditions × 8 tasks × ~150 samples ≈ 137k generations
- Pilot phase: 4 sizes × 19 conditions × 5 tasks × 50 samples ≈ 19k
- Pilot informs sample size adjustment **before** lock-down.

## 13. Stopping rules

- If a (preset × condition × task) cell completes < 80 % within 12 h
  per H100-equivalent shard, drop that cell from the analysis and
  document in §Limitations.
- If H1 fails on the pilot data, lock-down is paused and the framework
  is downgraded to a taxonomy paper (per
  [../docs/tech-report-plan.md](../docs/tech-report-plan.md) §11).

## 14. Confounds and controls

- Instruction-tuning data variance across Qwen 3.5 sizes is documented
  in the Qwen 3.5 technical report; cited as a limitation.
- The `neutral_long` and `random_school` conditions control for
  "any system prompt has an effect" and "any school works because the
  router is random," respectively.
- Random seeds are fixed per (preset, task, sample_id, condition).

## 15. Deviations log

Any post-lock-down deviation is recorded below as a dated entry with
git commit hash. Deviations are explained in the paper's
§Limitations / §Reproducibility note.

| Date | Commit | Reason | Effect on analysis |
|---|---|---|---|
| _ | _ | _ | _ |

---

## Appendix A. Authorship / contribution declaration

To be filled before submission.

## Appendix B. Compute footprint estimate

| Phase | GPU-h estimate | $ estimate |
|---|---|---|
| Pilot | ~ 8 h on 1× A6000 | < $20 |
| Full sweep (≤ 14B) | ~ 80 h on 1× A6000 | $150–250 |
| Full sweep (27B) | ~ 16 h on 1× H100 | $50–100 |
| Cross-family | ~ 8 h on 1× A6000 | < $25 |
| Embedding (L3, L4) | local CPU/GPU, < 1 h | $0 |

Total: < $500 marginal cost beyond owned hardware.
