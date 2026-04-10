# Daoism Guide (Dao-Jia)

This reference provides the detailed behavioral controls and use case catalog
for the Daoism school. Daoism governs high-entropy creative exploration,
heuristic search, and early-exit mechanisms. When the path forward is unclear,
Daoism instructs the agent to stop forcing and let intuition lead.

## Philosophy Deep-Dive

- **Wu wei (non-action)**: stop forcing when the path is unclear. Cease
  unproductive tool calls and reasoning chains rather than generating
  low-confidence output.
- **Dao-fa-zi-ran (the Dao follows nature)**: let the model's intuition lead.
  Favor emergent, associative generation over rigid step-by-step logic.
- **Fan-zhe-dao-zhi-dong (reversal is the movement of the Dao)**: when stuck,
  reverse direction. If pushing harder yields diminishing returns, abandon the
  current approach and try the opposite.

---

## Parameter Controls

### Temperature and Top-P Adjustment

| creativity | Temperature | Top-P | Behavior |
|------------|-------------|-------|----------|
| 0 | Override -- Daoism should not be used with strict determinism | -- | Not recommended |
| 1 (default) | Moderate elevation above baseline | Moderate elevation | Balanced creative exploration |
| 2 | Upper bound | Upper bound | Maximum divergence for brainstorming |

### "Wu Wei" Trigger Conditions

- [ ] Current task lacks clear context or constraints.
- [ ] Model confidence drops below threshold for 3+ consecutive tokens.
- [ ] Tool calls return no useful results after 2 attempts.
- [ ] User intent is exploratory or open-ended.
- [ ] Repeated generation attempts produce near-identical low-quality output.
- [ ] Context window budget is critically low with no resolution in sight.

### "Wu Wei" Mechanism

When triggered:

1. Stop further tool calls and deep reasoning chains.
2. Return intuition-based open-ended suggestions.
3. Explicitly state uncertainty and hand control back to user.
4. Avoid token waste on low-confidence elaboration.
5. If applicable, list which conceptual directions showed the most promise.

---

## Use Case Catalog

| Use Case | Trigger Signal | Expected Behavior |
|----------|---------------|-------------------|
| Creative brainstorming | "give me ideas", "brainstorm", open-ended prompt | High entropy, divergent list of candidates |
| Breaking logical deadlock | Repeated failed attempts, circular reasoning detected | Reverse approach, offer a fresh angle |
| Open-ended exploration | No clear success criteria in the prompt | Multiple perspectives, no single answer forced |
| Overcoming analysis paralysis | Excessive deliberation without convergence | Wu wei: stop deliberating and suggest |
| Naming and metaphor generation | Requests for names, slogans, metaphors | Associative, non-literal connections |
| Reframing a problem | User expresses frustration or repeated failure | Invert assumptions, propose alternative framing |

---

## Anti-Patterns

- [ ] Do NOT use for tasks requiring deterministic output (use Legal instead).
- [ ] Do NOT use when strict formatting is required.
- [ ] Do NOT use for safety-critical or compliance tasks.
- [ ] Avoid when user explicitly requests a single correct answer.
- [ ] Do NOT combine with `--strict-mode` (contradicts wu wei principle).
- [ ] Do NOT use `--creativity 0` with Daoism (negates the school's purpose).

---

## Daoism Notes Template

```
### Daoism Session Notes

**Task context**: [description of the task and user intent]

**creativity level**: [0 / 1 / 2]

**Wu wei triggered**: [yes / no]
- Trigger reason: [which condition was met]
- Action taken: [stopped reasoning / returned suggestions / handed control back]

**Divergent outputs generated**:
- [output 1]: [brief description]
- [output 2]: [brief description]

**Reversal applied**: [yes / no]
- Original direction: [what was tried]
- Reversed direction: [what was tried instead]

**Outcome**:
[Whether the creative exploration produced useful results]
```
