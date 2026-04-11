# HundredSchools Case Study Test Results -- Multi-Model Comparison

> Tested via CLIppet on 2026-04-10 (GLM-5.1) and 2026-04-11 (GLM-4.7, MiniMax-M2.5, Qwen 3.5-Plus, Qwen 3.6-Plus)
> Each case was run twice: once without the skill (baseline), once with the school activated.
> Visual report: [results.html](results.html)

---

## Cross-Model Summary

| School | Metric | GLM-5.1 | GLM-4.7 | MiniMax-M2.5 | Qwen 3.5-Plus | Qwen 3.6-Plus |
|--------|--------|---------|---------|--------------|---------------|---------------|
| Mohist | Bytes (baseline -> school) | 3420 -> 1741 | 3400 -> 917 | 1877 -> 1334 | 3817 -> 2206 | 2892 -> 2482 |
| Mohist | Change | **-49%** | **-73%** | **-29%** | **-42%** | **-14%** |
| Logician | Bytes (baseline -> school) | 630 -> 3021 | 626 -> 1363 | 1154 -> 808 | 949 -> 1777 | 406 -> 1503 |
| Logician | Change | **+380%** | **+118%** | **-30%** (failed) | **+87%** | **+270%** |
| Confucian | Bytes (baseline -> school) | 1330 -> 2408 | 801 -> 831 | 701 -> 827 | 1953 -> 2182 | 1226 -> 2658 |
| Confucian | Change | **+81%** | **+4%** | **+18%** | **+12%** | **+117%** |

## Skill Responsiveness Rating

| Model | Mohist | Logician | Confucian | Overall |
|-------|--------|----------|-----------|---------|
| GLM-5.1 | Strong | Strong | Strong | **Excellent** |
| Qwen 3.6-Plus | Weak | Strong | Strong | **Good** |
| GLM-4.7 | Strong | Good | Weak | **Good** |
| Qwen 3.5-Plus | Moderate | Good | Weak | **Moderate** |
| MiniMax-M2.5 | Moderate | Failed | Weak | **Fair** |

---

## Test 1: Mohism (`mohist`) -- LRU Cache Implementation

**Prompt:** "Explain how to implement LRU Cache and give me the code in Python."

### GLM-5.1

| Metric | Baseline | With Mohist | Change |
|--------|----------|-------------|--------|
| Response size | 3420 bytes | 1741 bytes | **-49%** |
| Explanation | 3 paragraphs + table + complexity table + `functools` shortcut | 2-line summary only | Stripped |
| Code comments | Verbose inline comments on every method | No comments except `# sentinel` | Stripped |
| Extras | Usage example, shortcut section, interview tips | None | Stripped |

**Observation:** The mohist school's "jie yong" (frugality) mode cut response size by
half. The agent explicitly noted that `__slots__` on Node "reduces per-entry memory --
consistent with jie yong (frugality)," showing it internalized the school's philosophy
rather than just truncating output.

### GLM-4.7

| Metric | Baseline | With Mohist | Change |
|--------|----------|-------------|--------|
| Response size | 3400 bytes | 917 bytes | **-73%** |
| Explanation | Full guide with How It Works, Time Complexity sections | 1-line concept | Stripped |
| Code implementations | OrderedDict + from-scratch (doubly linked list) | OrderedDict only | Stripped |
| Code comments | Verbose inline comments | Minimal inline | Stripped |
| Extras | Usage example (7 lines) | Usage (4 lines) | Reduced |

**Observation:** GLM-4.7 achieved the most aggressive compression of all models. It
stripped the full explanation, the from-scratch implementation, and most of the usage
example. However, unlike GLM-5.1, it did not reference the "jie yong" philosophy in
its output -- it followed the instruction to be frugal without internalizing the
reasoning behind it.

### Qwen 3.5-Plus

| Metric | Baseline | With Mohist | Change |
|--------|----------|-------------|--------|
| Response size | 3817 bytes | 2206 bytes | **-42%** |
| Explanation | Full sections with headings, bullet points, data structures | 3-line summary with core idea + operations | Stripped |
| Code implementations | From-scratch + OrderedDict (both full) | OrderedDict + from-scratch (both kept, no comments) | Retained |
| Code comments | Full docstrings and inline comments | None | Stripped |
| Extras | Usage example, complexity analysis, implementation approach | 1-line complexity | Stripped |

**Observation:** Qwen 3.5 explicitly acknowledged the Mohist approach ("I'll use the
Mohist approach: minimal, efficient, no excess"), demonstrating meta-awareness of the
skill. It stripped all prose, comments, and usage examples, reducing output by 42%.
However, it retained both implementations (OrderedDict and from-scratch), interpreting
"frugality" as "no prose" rather than "minimal code."

### Qwen 3.6-Plus

| Metric | Baseline | With Mohist | Change |
|--------|----------|-------------|--------|
| Response size | 2892 bytes | 2482 bytes | **-14%** |
| Explanation | 2-line intro + inline comments with docstrings | 2-line intro without comments | Reduced |
| Code implementations | From-scratch + OrderedDict | From-scratch with `__slots__` + OrderedDict | Both kept |
| Code comments | Docstrings and inline comments | None | Stripped |
| Extras | Usage demo, complexity, "interviewers typically want" note | Complexity bullets | Stripped |

**Observation:** Qwen 3.6 showed the weakest compression at -14%. While it stripped
comments and added `__slots__` for memory efficiency (an optimization aligned with
"jie yong"), it retained both implementations and the narrative intro. The baseline
was already relatively concise (2892 bytes), limiting compression headroom. The
`__slots__` addition shows Qwen 3.6 understood the *spirit* of frugality (optimize
memory) but did not apply it to the *output format* (token reduction).

### MiniMax-M2.5

| Metric | Baseline | With Mohist | Change |
|--------|----------|-------------|--------|
| Response size | 1877 bytes | 1334 bytes | **-29%** |
| Explanation | How-it-works section + functools alternative | 1-line approach note + key mechanics | Reduced |
| Code implementations | OrderedDict + functools.lru_cache | OrderedDict only | Stripped |
| Code comments | Moderate with __repr__ | Brief inline | Reduced |
| Extras | functools section | Time complexity + key mechanics notes | Replaced |

**Observation:** MiniMax-M2.5's compression was the weakest at -29%. While it removed
the functools alternative and __repr__ method, it retained a "Key mechanics" section and
"Time complexity" note that add bulk without functional value.

---

## Test 2: Logicism (`logician`) -- Operator Precedence Bug

**Prompt:** "This function should return true if a user has access. Is it correct? [has_access code]"

### GLM-5.1

| Metric | Baseline | With Logician | Change |
|--------|----------|---------------|--------|
| Response size | 630 bytes | 3021 bytes | **+380%** |
| Truth table | None | Full 5-row truth table | Added |
| Interpretations | Mentioned briefly | Formally separated into Interpretation A vs B | Formalized |
| Fallacy naming | None | "Concept substitution fallacy" | Added |
| Self-reflection | None | Explicit "bai ma fei ma" analysis + verdict section | Added |
| Fix options | 2 one-liners | 3 options including structural refactor | Expanded |

**Observation:** The logician school transformed a casual 630-byte bug report into a
3021-byte formal logic analysis with truth tables, named fallacies, and a philosophical
framework ("kong ming ze shi"). The agent performed the "zi-xing" (self-reflection)
step before finalizing its verdict.

### Qwen 3.6-Plus

| Metric | Baseline | With Logician | Change |
|--------|----------|---------------|--------|
| Response size | 406 bytes | 1503 bytes | **+270%** |
| Truth table | None | 4-row table with "Correct?" column | Added |
| Interpretations | None (just fix suggestion) | Formal "intended vs actual" analysis | Formalized |
| Fallacy naming | None | "Implicit Grouping Assumption" | Added |
| Self-reflection | None | Integrated into verdict section | Partial |
| Philosophy refs | None | "Name-to-Reality Mapping" section header | Added |

**Observation:** Qwen 3.6 demonstrated the second-strongest Logician response at +270%.
The baseline was notably minimal (406 bytes -- shortest of all models), amplifying the
expansion ratio. The output featured "Name-to-Reality Mapping" analysis (direct kong
ming ze shi adaptation), a truth table, and explicit fallacy identification. The model
structured its entire analysis as a formal logical argument rather than a casual code
review, indicating genuine framework internalization.

### GLM-4.7

| Metric | Baseline | With Logician | Change |
|--------|----------|---------------|--------|
| Response size | 626 bytes | 1363 bytes | **+118%** |
| Truth table | None | 3-row logic decomposition table | Added |
| Interpretations | Mentioned briefly | Formally separated into A (current) vs B (likely intent) | Formalized |
| Fallacy naming | None | "Semantic ambiguity" identified | Partial |
| Self-reflection | None | Explicit "zi-xing" section with nuanced verdict | Added |
| Philosophy refs | None | "kong ming ze shi" header, "zi-xing" section | Added |

**Observation:** GLM-4.7's logician mode produced structured formal analysis with explicit
"kong ming ze shi" and "zi-xing" sections. The zi-xing provides a nuanced verdict
("logically consistent but semantically ambiguous") rather than a simple correct/incorrect.

### Qwen 3.5-Plus

| Metric | Baseline | With Logician | Change |
|--------|----------|---------------|--------|
| Response size | 949 bytes | 1777 bytes | **+87%** |
| Truth table | None | 5-row truth table with "Intended?" column | Added |
| Interpretations | Contradictory ("correct as written" then caveat) | "Current behavior" vs "Likely intent" formally separated | Corrected |
| Fallacy naming | None | "Ambiguity" identified | Partial |
| Self-reflection | None | Summary table with status icons | Added |
| Philosophy refs | None | Explicit "Logician school" meta-reference | Added |

**Observation:** Qwen 3.5 produced competent logician-mode output with a truth table
and ambiguity analysis. Notably, it corrected its own baseline error -- the baseline
incorrectly stated "the function is correct as written" before backtracking. The
Logician mode eliminated this self-contradiction, showing the school improved
analytical accuracy, not just output format.

### MiniMax-M2.5

| Metric | Baseline | With Logician | Change |
|--------|----------|---------------|--------|
| Response size | 1154 bytes | 808 bytes | **-30%** |
| Truth table | None | None | Not added |
| Interpretations | 2 interpretations listed | "What you likely intended" | Simplified |
| Fallacy naming | None | None | Not added |
| Self-reflection | None | None | Not added |
| Philosophy refs | None | None | Not added |

**Observation:** MiniMax-M2.5 **failed** the logician test. The model compressed its
output from 1154 to 808 bytes (-30%). No truth table, no zi-xing, no fallacy naming.
The model interpreted the logician instructions as a request for conciseness rather
than analytical depth -- the opposite of the intended behavior.

---

## Test 3: Confucianism (`confucian`) -- Code Review Tone

**Prompt:** "A junior developer submitted this PR. Write a code review comment for [calc function]"

### Qwen 3.6-Plus

| Metric | Baseline | With Confucian | Change |
|--------|----------|----------------|--------|
| Response size | 1226 bytes | 2658 bytes | **+117%** |
| Opening | "Here's a code review comment" | "Thank you for submitting this" | Softened |
| Tone | Professional reviewer | Supportive mentor | Transformed |
| Philosophy refs | None | "zheng ming -- rectification of names" (explained) | Added |
| Closing | "[Suggested rewrite]" (code-only) | "These are modest adjustments... I look forward to seeing the next revision" | Encouraging |
| Framing | Issue list with fix | Constructive guidance with reasoning for each point | Reframed |

**Observation:** Qwen 3.6 achieved the deepest Confucian transformation of all models
at +117%. The output was explicitly framed as "written in the Confucian spirit of
measured, constructive feedback." It applied "zheng ming -- rectification of names"
with full explanation, offered 5 points of constructive guidance with reasoning, and
closed with genuine relational warmth. The entire communication register shifted from
professional reviewer to supportive mentor.

### GLM-5.1

| Metric | Baseline | With Confucian | Change |
|--------|----------|----------------|--------|
| Response size | 1330 bytes | 2408 bytes | **+81%** |
| Opening | "needs several improvements before it's ready to merge" | "Thank you for your contribution" | Softened |
| Tone | Direct reviewer | Supportive mentor | Transformed |
| Philosophy refs | None | "zheng ming", "zhong yong zhi dao" | Added |
| Closing | "Could you add a docstring?" | "I look forward to your revision" | Encouraging |
| Framing | Issue list | Constructive guidance with reasoning | Reframed |

**Observation:** The confucian school shifted the entire register from "reviewer listing
defects" to "mentor guiding a junior colleague." It applied "zheng ming" directly to
the naming issue, and invoked "zhong yong" when discussing code clarity.

### Qwen 3.5-Plus

| Metric | Baseline | With Confucian | Change |
|--------|----------|----------------|--------|
| Response size | 1953 bytes | 2182 bytes | **+12%** |
| Opening | "I need to see the actual PR" (demanding) | "Thank you for this contribution" | Softened |
| Tone | Demanding reviewer | Constructive mentor | Moderate shift |
| Philosophy refs | None | "zheng ming" with Chinese characters | Added |
| Closing | "If you can share the file path..." | "I am happy to review again" | Softer |
| Framing | Demand for context + defect list | Direct review with guidance | Reframed |

**Observation:** Qwen 3.5 showed moderate Confucian transformation. The baseline was
unusually demanding, requesting additional context before providing feedback. The
Confucian school replaced this with a direct, constructive review. Added "zheng ming"
with Chinese characters but the overall expansion was modest (+12%) because the
baseline was already verbose (1953 bytes). The tone shift was real but the model
did not deeply internalize the philosophical principles beyond surface references.

### GLM-4.7

| Metric | Baseline | With Confucian | Change |
|--------|----------|----------------|--------|
| Response size | 801 bytes | 831 bytes | **+4%** |
| Opening | "A few suggestions to improve" | "A few thoughts to consider" | Slightly softened |
| Tone | Reviewer | Slightly softer reviewer | Marginal shift |
| Philosophy refs | None | "zheng ming" (naming section), "ke ji fu li" (closing) | Added |
| Closing | "Consider adding type hints" | "Well-written code is its own best documentation (ke ji fu li)" | Aphoristic |
| Framing | Numbered defect list | Numbered defect list (unchanged structure) | No change |

**Observation:** GLM-4.7's confucian mode produced only marginal change (+4%). The
model referenced zheng ming and ke ji fu li but did not transform its communication
register. The overall structure remained a numbered defect list. This confirms GLM-4.7
handles structural/format instructions better than persona/style instructions.

### MiniMax-M2.5

| Metric | Baseline | With Confucian | Change |
|--------|----------|----------------|--------|
| Response size | 701 bytes | 827 bytes | **+18%** |
| Opening | "A few issues to address" | "A few items to address" | Negligible change |
| Tone | Direct reviewer | Direct reviewer | No change |
| Philosophy refs | None | "zheng ming" (naming section label only) | Minimal |
| Closing | Operator precedence note | "naming and lack of input validation are the main concerns" | Still critical |
| Framing | Numbered defect list | Same + suggested rewrite | Added code |

**Observation:** MiniMax-M2.5 showed partial skill adherence. It added a "zheng ming"
label and a suggested rewrite. But the overall tone remained that of a reviewer -- no
encouraging words, no acknowledgment of effort, no relational framing.

---

## Overall Conclusions

1. **GLM-5.1 remains the most skill-responsive model**. It produces qualitatively and
   quantitatively distinct behaviors for each school, internalizing philosophical
   principles rather than just following surface instructions.

2. **Qwen 3.6-Plus is the strongest newcomer**, excelling at analytical depth (Logician:
   +270%) and persona transformation (Confucian: +117%). Its weakness in compression
   (Mohist: -14%) likely reflects its already-concise baseline style rather than poor
   skill adherence. Profile: **Analytical Communicator**.

3. **GLM-4.7 excels at structural/format changes** (Mohist: -73%, best of all) but
   **struggles with nuanced persona transformations** (Confucian: +4%). Profile:
   **Structural Optimizer**.

4. **Qwen 3.5-Plus shows balanced but shallow responsiveness**. It follows instructions
   and produces adequate results across all schools but does not deeply internalize
   philosophical frameworks. The Logician school notably corrected a self-contradictory
   baseline analysis. Profile: **Surface Follower**.

5. **MiniMax-M2.5 has limited skill responsiveness**. Its Logician test failure (-30%
   instead of expanding) represents a fundamental misinterpretation. Profile:
   **Limited Adherent**.

6. **The HundredSchools skill design is validated** across 5 models. Models with
   strong instruction-following capabilities (GLM-5.1, Qwen 3.6) fully internalize
   the philosophical frameworks. Model capability is the limiting factor, not the
   skill design.
