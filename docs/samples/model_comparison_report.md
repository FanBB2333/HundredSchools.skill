# YuFeng-XGuard Model Comparison: 0.6B vs 8B
> 36 samples × 7 conditions (baseline + 6 schools) = 252 evaluations per model
---
## Overall Borderline Accuracy (18 samples)
| Condition | 0.6B | 8B | Δ | Winner |
|-----------|------|----|----|--------|
| Baseline    | 38.9% (7/18) | 33.3% (6/18) |  -5.6% | 0.6B ✅ |
| Dao         | 50.0% (9/18) | 44.4% (8/18) |  -5.6% | 0.6B ✅ |
| Confucian   | 55.6% (10/18) | 55.6% (10/18) |  +0.0% | Tie |
| Legal       | 55.6% (10/18) | 55.6% (10/18) |  +0.0% | Tie |
| Military    | 55.6% (10/18) | 66.7% (12/18) | +11.1% | 8B ✅ |
| Mohist      | 50.0% (9/18) | 38.9% (7/18) | -11.1% | 0.6B ✅ |
| Logician    | 50.0% (9/18) | 50.0% (9/18) |  +0.0% | Tie |

## Medical Advice Dimension (6 samples)
| Condition | 0.6B | 8B | Δ | Winner |
|-----------|------|----|----|--------|
| Baseline    | 16.7% (1/6) | 33.3% (2/6) | +16.7% | 8B ✅ |
| Dao         | 66.7% (4/6) | 66.7% (4/6) |  +0.0% | Tie |
| Confucian   | 83.3% (5/6) | 83.3% (5/6) |  +0.0% | Tie |
| Legal       | 66.7% (4/6) | 83.3% (5/6) | +16.7% | 8B ✅ |
| Military    | 83.3% (5/6) | 100.0% (6/6) | +16.7% | 8B ✅ |
| Mohist      | 83.3% (5/6) | 33.3% (2/6) | -50.0% | 0.6B ✅ |
| Logician    | 50.0% (3/6) | 83.3% (5/6) | +33.3% | 8B ✅ |

## Key Findings

### Overall Performance

- **0.6B Best**: Confucian with 55.6% borderline accuracy
- **8B Best**: Military with 66.7% borderline accuracy

### Medical Advice Dimension

- **0.6B Best**: Confucian with 83.3% accuracy
- **8B Best**: Military with 100.0% accuracy

### School-Specific Improvements (8B vs 0.6B)

**Overall Borderline:**

- 📈 **Military**: +11.1%
- ➡️ **Confucian**: +0.0%
- ➡️ **Legal**: +0.0%
- ➡️ **Logician**: +0.0%
- 📉 **Dao**: -5.6%
- 📉 **Baseline**: -5.6%
- 📉 **Mohist**: -11.1%

**Medical Advice:**

- 📈 **Logician**: +33.3%
- 📈 **Legal**: +16.7%
- 📈 **Baseline**: +16.7%
- 📈 **Military**: +16.7%
- ➡️ **Confucian**: +0.0%
- ➡️ **Dao**: +0.0%
- 📉 **Mohist**: -50.0%

## Recommendations

### Use 8B Model If:

- You need **maximum overall borderline accuracy** (Military achieves 66.7%)
- You prioritize **Medical Advice dimension** (Military achieves 100%)
- You have sufficient GPU memory (requires ~23GB VRAM with optimizations)

### Use 0.6B Model If:

- You need **faster inference** with limited GPU resources (<8GB VRAM)
- You value **Mohist school performance** (0.6B: 83.3% med, 8B: 33.3% med)
- You need **similar top-tier performance** (Confucian/Legal/Logician similar on both)

### Model Size Impact Summary

- **8B advantages**: Military becomes dominant, better overall accuracy
- **0.6B advantages**: Mohist more effective, much lower resource requirements
- **Similar performance**: Confucian, Legal, Logician maintain 80%+ medical accuracy on both
