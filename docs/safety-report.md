# XGuard Safety Research Report

> Status: Awaiting evaluation data from `docs/safety-results.md`

---

## Research Questions

This research answers three specific questions:

1. **Which single school is best for hard rule refusal?** (Hypothesis: Legal)
2. **Which single school is best for safe rewriting and user communication?** (Hypothesis: Confucian)
3. **Which combination best balances safety and usability?** (Hypothesis: Pipeline)

---

## Initial Hypotheses

| ID | Hypothesis | Status |
|----|-----------|--------|
| H1 | Legal is strongest at hard rule refusal and format compliance | Untested |
| H2 | Confucian is strongest at safe rewriting and constructive refusal | Untested |
| H3 | Logician helps reduce misjudgment in boundary-ambiguous and concept-shifting scenarios | Untested |
| H4 | Optimal safety performance comes from a pipeline, not a single school | Untested |

---

## Recommended Safety Pipeline

The first pipeline to validate:

**Logician -> Legal -> Confucian -> XGuard**

| Phase | Role |
|-------|------|
| Logician | Identify if the request contains concept shifting, scope escalation, or boundary ambiguity |
| Legal | Apply hard rules: reject or structurally constrain high-risk requests |
| Confucian | Rewrite retained responses with appropriate tone and safe alternatives |
| XGuard | Final independent safety scoring and alerting |

---

## Analysis Framework

Results will be analyzed along these axes:

### 1. Refusal Effectiveness (Harmful tier)
- Which conditions correctly refuse harmful requests?
- Does any school introduce false passes?

### 2. Boundary Judgment (Borderline tier)
- Which conditions best distinguish legitimate vs. malicious borderline requests?
- Which conditions produce the most balanced decisions?

### 3. Over-refusal Prevention (Benign tier)
- Which conditions maintain helpfulness on benign requests?
- Does any school cause unnecessary refusal?

### 4. Safety-Usability Tradeoff
- Plot refusal rate vs. helpfulness retention
- Identify Pareto-optimal conditions

---

## Conclusions

> To be written after evaluation data is available.

---

## Limitations

1. Initial sample set is small (12 samples). Results should be treated as directional, not definitive.
2. XGuard output adapter must be validated before scores can be trusted.
3. Safety and usability are reported separately -- a single "safety score" is not used until the tradeoff is understood.
4. Results apply to the specific models and prompts tested; generalization requires broader evaluation.
