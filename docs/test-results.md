# HundredSchools -- How Philosophical Schools Shape AI Output

> Tested via CLIppet on 2026-04-11
> Prompt: "Write a Python function to validate an email address and explain your approach."
> Each model was tested 7 times: 1 baseline + 6 schools (dao, confucian, legal, military, mohist, logician)
> Visual report: [results.html](results.html)

---

## Output Size (bytes) -- All Schools x All Models

| School | Qwen 3.5 | Qwen 3.6 | GLM-5.1 | GLM-4.7 | MiniMax-M2.5 | Avg |
|--------|----------|----------|---------|---------|--------------|-----|
| **Baseline** | 2995 | 1668 | 2508 | 1460 | 1518 | 2030 |
| **Mohist** | 744 (-75%) | 732 (-56%) | 622 (-75%) | 411 (-72%) | 940 (-38%) | 690 (-63%) |
| **Legal** | 3248 (+8%) | 1201 (-28%) | 3737 (+49%) | 2885 (+98%) | 1768 (+16%) | 2568 (+21%) |
| **Dao** | 189 (FAIL) | 1662 (0%) | 3571 (+42%) | 3395 (+133%) | 1338 (-12%) | 2493* (+38%) |
| **Confucian** | 3332 (+11%) | 2925 (+75%) | 3607 (+44%) | 2389 (+64%) | 2779 (+83%) | 3006 (+50%) |
| **Logician** | 5152 (+72%) | 3482 (+109%) | 3910 (+56%) | 3812 (+161%) | 2197 (+45%) | 3711 (+86%) |
| **Military** | 5228 (+75%) | 2310 (+38%) | 3488 (+39%) | 5398 (+270%) | 3237 (+113%) | 3932 (+113%) |

\* Dao average excludes Qwen 3.5 failure

---

## School-by-School Analysis

### Mohist -- "jie yong" (frugality)

**Average change: -63%** | Most reliable school (100% activation rate)

| Behavior | All Models |
|----------|-----------|
| Return type | Bare `bool` (no tuples, no dicts) |
| Code size | 4-6 lines |
| Comments | Stripped entirely |
| Docstrings | Removed |
| Explanation | 1 paragraph or numbered list (3-4 items) |
| Examples | Removed |
| Extras | Removed |

**Key finding:** "Do less" is the easiest instruction for LLMs to follow. 100% activation rate -- every model stripped docstrings, returned bare `bool`, regex-only.

---

### Military -- "miao suan" (strategic planning)

**Average change: +113%** | Largest output expansion

| Behavior | All Models |
|----------|-----------|
| `<plan>` block | Present in all models |
| Dual-path strategy | Zheng (orthodox) + Qi (fallback) in all models |
| Resource assessment | Present in all models |
| Philosophy refs | miao suan, zhi ji zhi bi, qi zheng xiang sheng |
| Fallback code | Separate implementation provided |
| Scope exclusions | "What this deliberately does NOT do" |

**Key finding:** Military produces the largest output consistently. The `<plan>` block and dual-path strategy appeared in every model. GLM-4.7 was most affected (+270%), producing full `<plan>` XML with three phases and `re.VERBOSE` regex.

---

### Logician -- "kong ming ze shi" (hold names to reality)

**Average change: +86%** | Deepest analytical transformation

| Behavior | All Models |
|----------|-----------|
| Self-reflection | Present in all models (zi-xing / zi-fan sections) |
| Verification | Tables, assertions, or structured checks |
| Fallacy naming | kong ming ze shi, tou huan gai nian, bai ma fei ma |
| Claim framework | Validation steps framed as falsifiable claims |
| Return type | Often `dict` with valid/reason/claims keys |

**Key finding:** Strongest discriminator of cognitive depth. All models produced self-reflection sections and formal logical vocabulary. GLM-4.7 framed each validation step as a numbered "Claim" with lookbehind assertions in regex.

---

### Confucian -- "ke ji fu li" (restrain self, restore propriety)

**Average change: +50%** | Most consistent tone transformation

| Behavior | All Models |
|----------|-----------|
| Philosophy refs | zheng ming (rectification of names), zhong yong (doctrine of the mean) |
| Tone | Formal, structured, pedagogical |
| Concept mapping | Validation stages mapped to philosophical principles |
| Informal removal | Closing questions, colloquial language stripped |
| Return type | Often `tuple[bool, str]` (propriety demands clarity) |

**Key finding:** Confucian consistently adds philosophical concept mapping. The shift is qualitative (tone/framing) more than quantitative (size).

---

### Legal -- "yi duan yu fa" (judge by law alone)

**Average change: +21%** | Most variable school (both expansion and compression)

| Behavior | All Models |
|----------|-----------|
| Rule enumeration | Numbered specifications before or within code |
| RFC references | Section numbers cited (RFC 5321, 5322) |
| Data structures | Frozen dataclasses, `fullmatch` instead of `match` |
| Determinism | "Zero randomness," "no creative variance" language |
| Tone | Rule-focused, formal, no hedging |

**Key finding:** The only school that produces both expansion and compression depending on model. Qwen 3.6 compressed (-28%), reading "judge by law alone" as "strip to strict implementation." GLM models expanded (+49-98%), reading it as "enumerate all rules." Both are valid Legalist interpretations.

---

### Dao -- "wu wei" (non-action)

**Average change: +38%** | Least reliable school (1 failure)

| Behavior | Successful Models |
|----------|-------------------|
| Multiple paths | Explored 2-4 implementation alternatives |
| Wu wei alternative | Minimalist "extreme wu wei" function provided |
| Permissive philosophy | Rejected allowlist in favor of blocklist |
| Layered architecture | 3-5 layers of validation |
| Reversal principle | "When pushing harder yields diminishing returns, reverse" |

**Key finding:** Least reliable school. Qwen 3.5 failed entirely (tried to literally invoke `/skill invoke HundredSchools`). "Non-action" is paradoxically the hardest instruction -- the model must know when to stop, not just follow a template.

---

## Cross-School Insights

### 1. Schools form a cognitive spectrum

| Direction | School | Avg Change | Cognitive Strategy |
|-----------|--------|------------|-------------------|
| **Compression** | Mohist | -63% | Strip everything non-essential |
| **Variable** | Legal | +21% | Constrain to rules |
| **Exploration** | Dao | +38% | Explore multiple paths |
| **Structure** | Confucian | +50% | Add formality, pedagogy |
| **Analysis** | Logician | +86% | Add verification, self-reflection |
| **Planning** | Military | +113% | Add planning, dual-path strategy |

### 2. Return type as internalization signal

Schools change *code architecture*, not just prose:

- **Mohist:** bare `bool` -- maximum compression
- **Confucian:** `tuple[bool, str]` -- propriety demands clarity
- **Legal:** `frozen dataclass` -- structured, immutable
- **Military:** `bool` + named regex groups -- concerns separated
- **Logician:** `dict` with valid/reason -- every claim auditable
- **Dao:** `dataclass` or multiple functions -- exploration

### 3. Reliability spectrum

| Activation Rate | School |
|-----------------|--------|
| 100% (5/5) | Mohist, Military, Logician, Confucian |
| 80% (4/5) | Legal (Qwen 3.6 compressed instead of expanding) |
| 80% (4/5) | Dao (Qwen 3.5 failed completely) |

### 4. Each school produces a unique cognitive signature

| School | Core Question |
|--------|--------------|
| Mohist | What can I remove? |
| Dao | What alternatives exist? |
| Confucian | How should I communicate this? |
| Legal | What are the exact rules? |
| Military | What's the strategy and fallback? |
| Logician | How do I know this is correct? |

## Multi-Dimensional Evaluation

The single-prompt test above establishes the baseline. The project now uses a multi-prompt, multi-dimension evaluation system to provide richer comparisons.

### Evaluation Prompts

| Prompt ID | Domain | Purpose |
|-----------|--------|---------|
| P1 | Code Generation | Observe structure, constraints, compression |
| P2 | Security Review | Observe rule coverage, risk awareness |
| P3 | Documentation | Observe tone, audience adaptation |
| P4 | System Design | Observe planning, alternative paths |
| P5 | Data Diagnosis | Observe concept precision, verification habits |

### Observable Dimensions

| Dimension | Definition | Scale |
|-----------|-----------|-------|
| Output Size | Total output length | bytes |
| Alternative Count | Distinct solution paths proposed | count |
| Plan Structure | Phased plan, resource assessment, fallback paths | 0-3 |
| Rule Coverage | Explicit rules/constraints listed | count |
| Verification Signals | Checks, assertions, self-verification | 0-3 |
| Tone Quality | Formality, constructiveness, attack control | 0-3 |
| Actionability | Clear steps, responsibilities, priorities | 0-3 |
| Compression Ratio | Key info points per token | 0-3 |

All dimensions are directly observable from output text. No internal reasoning chain access is required.

### Current Status

- P1 (Code Generation): Complete with baseline + 6 schools (data above)
- P2-P5: Prompt definitions ready, evaluation runs pending

See the web frontend's Insights tab for interactive exploration of evaluation data.

---

## Conclusion

Six philosophical frameworks produce six distinct cognitive modes -- differing not just in output volume, but in code architecture, reasoning approach, and communication style. Philosophy works as a control strategy for LLM inference.
