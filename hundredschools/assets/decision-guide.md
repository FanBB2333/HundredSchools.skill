# Daily Work Decision Guide

> When you encounter a problem, use this guide to choose the right philosophical school.
> Each recommendation is backed by case studies and evaluation data.

---

## Quick Decision Table

| Work Type | Primary School | Secondary School | Evidence |
|-----------|---------------|-----------------|----------|
| Need creative exploration | Dao (道家) | Military (兵家) | Alternative Count metric, Case 8 |
| Need concept clarification | Logician (名家) | Legal (法家) | Type system and data diagnosis cases (Case 10, P5) |
| Need strict formatted output | Legal (法家) | Logician (名家) | Schema/migration/defense cases (Case 3, 9, 14) |
| Need complex planning | Military (兵家) | Legal (法家) | Plan Structure metric, Case 4, 13 |
| Need multi-audience expression | Confucian (儒家) | Military (兵家) | Documentation case (Case 11), Tone Quality metric |
| Need high-density extraction | Mohist (墨家) | Legal (法家) | Meeting minutes case (Case 12), Compression Ratio metric |
| Need secure code review | Pipeline: Logician -> Legal -> Confucian | Legal -> Confucian | Pipeline case (Case 15) |
| Need incident response | Military -> Legal (兵家 -> 法家) | Military (兵家) | Incident response case (Case 13) |
| Need safety-critical evaluation | Legal (法家) | Logician (名家) | XGuard study: 0% over-refusal, 100% harmful refusal |

---

## Decision Dimensions

When the table above doesn't directly apply, use these three dimensions to guide your choice:

### 1. Task Type

| Task Type | Best Schools | Rationale |
|-----------|-------------|-----------|
| Generation (code, content) | Dao, Mohist | Dao for creative generation, Mohist for efficient generation |
| Review (code, security, design) | Logician, Legal | Logician for logical analysis, Legal for rule compliance |
| Planning (architecture, project) | Military, Legal | Military for strategic planning, Legal for constraint management |
| Extraction (summarize, compress) | Mohist, Logician | Mohist for compression, Logician for precision |
| Communication (docs, reports) | Confucian, Military | Confucian for audience adaptation, Military for structured communication |
| Diagnosis (debugging, analysis) | Logician, Dao | Logician for formal analysis, Dao for exploring hypotheses |

### 2. Output Goal

| Output Goal | Best Schools | Rationale |
|-------------|-------------|-----------|
| Creative / divergent | Dao | Explores multiple paths, high entropy |
| Precise / exact | Legal, Logician | Legal for format precision, Logician for logical precision |
| Compliant / rule-based | Legal | Strict rule enforcement, no exceptions |
| Executable / actionable | Military | Phased plans with owners and timelines |
| Minimal / dense | Mohist | Maximum information per token |

### 3. Risk Level

| Risk Level | Recommendation |
|------------|---------------|
| Normal | Use the best single school for the task type |
| High constraint (schema, compliance) | Legal, or Legal at the end of a pipeline |
| High risk (production, security) | Legal (single) — empirically validated for 0.6B safety models |

---

## Priority Rules

When selecting a school, follow this priority:

1. **User explicitly specifies a school** -> Use it directly
2. **High-risk task detected** -> Prioritize Legal or a pipeline with Legal
3. **Multi-step complex task** -> Prioritize Military
4. **Multi-audience communication** -> Prioritize Confucian
5. **Semantic ambiguity or definition dispute** -> Prioritize Logician
6. **Need for creative alternatives** -> Prioritize Dao
7. **Need for compression/efficiency** -> Prioritize Mohist

---

## Pipeline Recommendations

For complex tasks, combining schools produces stronger results than any single school.

| Scenario | Recommended Pipeline | Why |
|----------|---------------------|-----|
| Secure code review | Logician -> Legal -> Confucian | Logical analysis -> rule enforcement -> audience communication |
| System architecture | Military -> Mohist -> Legal | Strategic planning -> lean implementation -> strict output |
| Creative with quality gate | Dao -> Confucian -> Logician | Exploration -> tone alignment -> claim verification |
| Data pipeline with strict output | Logician -> Mohist -> Legal | Semantic analysis -> compression -> format enforcement |
| Incident response | Military -> Legal | Strategic assessment -> rule-based execution |
| Safety-critical tasks (0.6B model) | **Legal (single)** | Empirically best: 0% over-refusal + 100% harmful refusal |
| Safety-critical tasks (8B+ model) | Logician -> Legal -> Confucian | Multi-stage may benefit from larger model capacity (untested) |

> **Note on safety pipelines**: Empirical evaluation with XGuard-Reason-0.6B (108 evaluations, 12 prompts x 9 conditions) showed that the Logician -> Legal -> Confucian pipeline **regresses to baseline performance** (50% borderline over-refusal) on the 0.6B model. The single Legal school achieved the best results: 100% harmful refusal with 0% borderline over-refusal. Multi-stage pipelines may work better with larger models (8B+) that have more capacity for compound instructions. See `docs/safety-report.md` for full analysis.

---

## What Each School Does Best (Summary)

| School | Core Strength | Core Question |
|--------|--------------|---------------|
| Dao (道家) | Creative exploration, multiple paths | "What alternatives exist?" |
| Confucian (儒家) | Audience-aware communication, tone | "How should I communicate this?" |
| Legal (法家) | Rule enforcement, strict compliance | "What are the exact rules?" |
| Military (兵家) | Strategic planning, contingency | "What's the strategy and fallback?" |
| Mohist (墨家) | Compression, efficiency | "What can I remove?" |
| Logician (名家) | Logic validation, concept precision | "How do I know this is correct?" |
