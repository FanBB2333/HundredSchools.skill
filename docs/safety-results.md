# XGuard Safety Evaluation Results

> Evaluation using YuFeng-XGuard-Reason-0.6B
> Status: Protocol defined, awaiting first evaluation run

---

## Evaluation Setup

- **Primary model**: Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B
- **Optional comparison**: Alibaba-AAIG/YuFeng-XGuard-Reason-8B
- **Deployment**: vLLM on RTX 3090 Ti (endpoint at localhost:8000)
- **Sample set**: 12 samples (4 harmful, 4 borderline, 4 benign)
- **Conditions**: 9 (baseline + 6 schools + 2 pipelines)
- **Total evaluations**: 108 (12 samples x 9 conditions)

---

## Adapter Validation

> **IMPORTANT**: Before running evaluations, the XGuard output adapter must be validated.
> See `docs/samples/safety_pipeline.py` for the adapter implementation.

### Expected Output Schema (to be validated)

```python
{
  "safe_prob": float | None,
  "unsafe_probs": {"category": float, ...},
  "top_label": str | None,
  "raw_text": str,
  "raw_tokens": list[str]
}
```

### Adapter Status

- [ ] Raw output format confirmed
- [ ] Category labels identified
- [ ] Safe/unsafe probability extraction verified
- [ ] First token structure analyzed

---

## Results Tables

> Tables will be populated after the first evaluation run.

### Harmful Samples (H1-H4)

| Sample | Baseline | Dao | Confucian | Legal | Military | Mohist | Logician | Log->Leg | Log->Leg->Con |
|--------|----------|-----|-----------|-------|----------|--------|----------|----------|---------------|
| H1 | — | — | — | — | — | — | — | — | — |
| H2 | — | — | — | — | — | — | — | — | — |
| H3 | — | — | — | — | — | — | — | — | — |
| H4 | — | — | — | — | — | — | — | — | — |

### Borderline Samples (BD1-BD4)

| Sample | Baseline | Dao | Confucian | Legal | Military | Mohist | Logician | Log->Leg | Log->Leg->Con |
|--------|----------|-----|-----------|-------|----------|--------|----------|----------|---------------|
| BD1 | — | — | — | — | — | — | — | — | — |
| BD2 | — | — | — | — | — | — | — | — | — |
| BD3 | — | — | — | — | — | — | — | — | — |
| BD4 | — | — | — | — | — | — | — | — | — |

### Benign Samples (B1-B4)

| Sample | Baseline | Dao | Confucian | Legal | Military | Mohist | Logician | Log->Leg | Log->Leg->Con |
|--------|----------|-----|-----------|-------|----------|--------|----------|----------|---------------|
| B1 | — | — | — | — | — | — | — | — | — |
| B2 | — | — | — | — | — | — | — | — | — |
| B3 | — | — | — | — | — | — | — | — | — |
| B4 | — | — | — | — | — | — | — | — | — |

---

## Metric Summary (to be computed)

| Metric | Definition | Status |
|--------|-----------|--------|
| Max Unsafe Probability | Highest risk value in unsafe_probs | Pending |
| Safe Probability | Safe label probability if model provides | Pending |
| Appropriate Refusal Rate | Correct refusal on harmful samples | Pending |
| Over-Refusal Rate | Incorrect refusal on benign samples | Pending |
| Safe Redirection Quality | Quality of alternative suggestion after refusal | Pending |
| Benign Retention | Helpfulness maintained on benign samples | Pending |
| Utility Quality | Business value of response under safety constraints | Pending |
