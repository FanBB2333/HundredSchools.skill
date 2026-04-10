# Logicism Guide (Ming-Jia)

This reference provides the formal logic validation rules, fallacy taxonomy, and
self-reflection protocol for the Logicism school. Logicism governs semantic
analysis, concept precision, hallucination detection, and logical consistency
verification. Every concept (ming) must strictly correspond to reality (shi).

## Philosophy Deep-Dive

- **Kong-ming-ze-shi (examine names to verify facts)**: every concept must be
  precisely defined before it is used in argument. No vague or overloaded terms.
- **Bai-ma-fei-ma (a white horse is not a horse)**: category precision matters.
  Subcategories are not interchangeable with their parent categories without
  explicit justification.
- **Ming-shi-xiang-fu (names must correspond to reality)**: concepts (ming) must
  strictly map to verifiable facts (shi). Claims without grounding are flagged.

---

## Logic Validation Checklist

### Concept Clarity Verification

- [ ] Every key term is explicitly defined before use.
- [ ] No term is used with multiple meanings within the same argument.
- [ ] Abstract concepts are grounded with concrete examples.
- [ ] Category boundaries are explicit (what is included and excluded).
- [ ] Analogies are validated: the mapping between source and target holds.
- [ ] Quantifiers are precise (all/some/none, not vague "many" or "often").

### Logical Consistency Checks

- [ ] Premises do not contradict each other.
- [ ] Conclusions follow from premises (valid inference).
- [ ] No unstated assumptions smuggled into the argument.
- [ ] Conditional statements have both antecedent and consequent verified.
- [ ] Negations are correctly scoped (not ambiguous double negatives).
- [ ] Temporal and causal ordering is explicit where relevant.

---

## Self-Reflection Protocol (Zi-Xing)

Before finalizing output:

1. Re-read the generated response in its entirety.
2. For each factual claim: verify it is supported by provided context or
   clearly marked as inference.
3. For each logical step: verify the conclusion follows from the premises.
4. Check for concept substitution (using term A's definition but term B's
   label) -- the classical tou-huan-gai-nian error.
5. Flag any claim that cannot be verified as [UNVERIFIED].
6. If a logical gap is found: either fill it with explicit reasoning or
   mark it as [ASSUMPTION].

---

## Logical Fallacy Catalog

| Fallacy | Description | Detection Method |
|---------|-------------|-----------------|
| Equivocation | Same term, different meanings | Check term consistency across argument |
| Straw man | Misrepresenting opponent's position | Compare stated vs. addressed position |
| False dichotomy | Presenting only two options when more exist | Check for excluded middle options |
| Appeal to authority | Claiming truth by source alone | Verify independent evidence exists |
| Circular reasoning | Conclusion assumes what it tries to prove | Trace inference chain for loops |
| Hasty generalization | Broad conclusion from limited evidence | Check sample size and representativeness |
| Post hoc | Assuming causation from sequence | Verify causal mechanism, not just timing |
| Ad hominem | Attacking the arguer instead of argument | Check if critique targets claim or person |
| Non sequitur | Conclusion does not follow from premises | Verify logical connection between steps |
| Moving the goalposts | Shifting criteria after evidence is presented | Compare original and revised criteria |

---

## Hallucination Detection

- Compare generated claims against source material provided in context.
- Flag specific numbers, dates, names that cannot be traced to input.
- When uncertain: output "[NEEDS VERIFICATION]" rather than assert.
- Prefer "I don't have enough information" over fabrication.
- Cross-check generated code examples against actual API signatures.
- Verify that cited references or quotations exist in the provided context.

### Hallucination Risk Indicators

| Indicator | Risk Level | Action |
|-----------|-----------|--------|
| Specific statistic with no source | High | Flag as [UNVERIFIED] |
| Named entity not in context | High | Flag or omit |
| API method or parameter not in docs | Medium | Verify before including |
| Exact quote not traceable to input | High | Remove or mark as paraphrase |
| Causal claim without mechanism | Medium | Qualify with "possibly" or flag |

---

## Use Case Catalog

| Use Case | Trigger Signal | Expected Behavior |
|----------|---------------|-------------------|
| Logical reasoning | "prove", "analyze the argument", deductive context | Step-by-step inference, each step justified |
| Contract review | Legal text, clause analysis | Term-by-term definition, ambiguity flagging |
| Debate preparation | "argue for/against", adversarial context | Identify logical weaknesses in both positions |
| Fact-checking | "verify", "is this true", claim evaluation | Source-trace every claim, flag unverifiable ones |
| Academic argumentation | Thesis defense, peer review context | Logical structure audit, fallacy detection |
| Code logic review | "does this logic make sense", correctness review | Trace execution paths, verify conditionals |

---

## Anti-Patterns

- [ ] Do NOT use when approximate reasoning is acceptable.
- [ ] Do NOT use for creative tasks where strict logic constrains ideation.
- [ ] Do NOT use when speed matters more than precision.
- [ ] Avoid pedantic over-analysis that blocks progress on clear-enough issues.
- [ ] Do NOT flag stylistic preferences as logical errors.
- [ ] Do NOT apply formal logic rules to casual conversation or brainstorming.

---

## Logicism Notes Template

```
### Logicism Session Notes

**Analysis type**: [logical reasoning / fact-check / contract review / other]

**Concept definitions established**:
- [term 1]: [definition]
- [term 2]: [definition]

**Logic validation results**:
- [ ] Concept clarity: [pass / issues found]
- [ ] Logical consistency: [pass / issues found]
- [ ] Self-reflection (zi-xing) completed: [yes / no]

**Fallacies detected**:
- [fallacy type]: [location] -- [description]

**Hallucination flags**:
- [claim]: [UNVERIFIED / NEEDS VERIFICATION / confirmed]

**Outcome**:
[Whether the output meets logical consistency and factual accuracy standards]
```
