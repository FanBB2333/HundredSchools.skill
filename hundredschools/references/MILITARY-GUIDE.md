# Militarism Guide (Bing-Jia)

This reference provides the plan template, resource assessment checklist, and
dual-path execution patterns for the Militarism school. Militarism governs
complex planning, multi-step reasoning, and strategic resource management. The
agent must calculate before it moves, know its capabilities, and always maintain
a fallback path.

## Philosophy Deep-Dive

- **Miao-suan (temple calculation)**: plan before action. No substantive work
  begins until a structured plan is established and evaluated.
- **Qi-zheng-xiang-sheng (orthodox and paradoxical generate each other)**: always
  have a backup. The primary path and the fallback path are complementary
  strategies that strengthen the overall approach.
- **Zhi-ji-zhi-bi (know yourself, know your enemy)**: assess resources and
  constraints. Understand the agent's own capabilities, the tools available,
  and the nature of the problem before engaging.

---

## Mandatory Planning Protocol

### Pre-Action Plan Requirement

The agent MUST output a `<plan>` tag before taking any substantive action. No
code generation, no tool calls, and no final answers until the plan is
established.

```
<plan>
Objective: [what needs to be achieved]
Resources: [available tools, APIs, context]
Constraints: [time, token budget, dependencies]
Primary Path (zheng): [main approach]
Fallback Path (qi): [backup if primary fails]
Success Criteria: [how to verify completion]
</plan>
```

### Resource Assessment Checklist

- [ ] Enumerate available tools and their current state.
- [ ] Check API rate limits and quotas.
- [ ] Assess context window budget remaining.
- [ ] Identify external dependencies and their status.
- [ ] Estimate token cost for primary path execution.
- [ ] Identify single points of failure in the plan.
- [ ] Verify that fallback path uses different resources than primary path.

---

## Dual-Path Generation

### Primary Path (Zheng)

- The conventional, expected approach.
- Optimized for the most likely scenario.
- Detailed step-by-step execution plan.
- Each step has explicit success/failure criteria.

### Fallback Path (Qi)

- Activated when primary path encounters obstacles.
- Alternative approach using different tools or strategies.
- Graceful degradation plan if resources are constrained.
- Pre-defined trigger conditions for switching from zheng to qi.

### Path Switching Triggers

| Trigger | Action |
|---------|--------|
| Primary tool returns error 2+ times | Switch to fallback tool or manual approach |
| Context window budget < 20% remaining | Compress plan, skip optional steps |
| External API unavailable | Fall back to local-only strategy |
| Intermediate result contradicts assumptions | Re-evaluate plan from current state |
| Time budget exceeded for current step | Skip to next step or switch path |

---

## Tree of Thought / Chain of Thought Integration

- For multi-step reasoning: generate thought tree with branching points.
- At each branch: evaluate and score alternatives before proceeding.
- Prune low-confidence branches early to conserve token budget.
- Maintain chain of reasoning visible to the user.
- At each step, reference the original plan to track progress.

### Thought Tree Structure

```
[Root: Problem Statement]
  |-- Branch A: [approach 1] -- confidence: [high/med/low]
  |     |-- Step A1: [action] -- result: [outcome]
  |     |-- Step A2: [action] -- result: [outcome]
  |-- Branch B: [approach 2] -- confidence: [high/med/low]
        |-- Step B1: [action] -- result: [outcome]
```

---

## Use Case Catalog

| Use Case | Trigger Signal | Expected Behavior |
|----------|---------------|-------------------|
| Complex task decomposition | Multi-part request, "build X with Y and Z" | Full plan with sequenced steps and dependencies |
| System architecture design | "design", "architect", infrastructure-level scope | Zheng path (primary design) + qi path (degradation) |
| Long debugging chains | Error persists after initial fix attempts | Systematic elimination, fallback hypotheses |
| Multi-step workflows | Sequential operations with dependencies | Ordered plan, checkpoint validation between steps |
| Resource-constrained tasks | Limited API calls, token budget, or time | Prioritized plan, optional steps marked |
| Risk assessment | "what could go wrong", failure mode analysis | Dual-path analysis, trigger conditions mapped |

---

## Anti-Patterns

- [ ] Do NOT use for simple, single-step tasks (overhead not justified).
- [ ] Do NOT use for creative brainstorming (use Dao instead).
- [ ] Do NOT use when immediate action is more valuable than planning.
- [ ] Avoid over-planning that delays execution beyond usefulness.
- [ ] Do NOT generate plans longer than the execution itself would take.
- [ ] Do NOT skip the plan phase even if the solution seems obvious.

---

## Militarism Notes Template

```
### Militarism Session Notes

**Objective**: [what was planned]

**Resources assessed**:
- Tools available: [list]
- Constraints identified: [list]
- Token budget: [estimate]

**Plan executed**:
- Primary path (zheng): [description]
- Fallback path (qi): [description]

**Path switching**:
- Occurred: [yes / no]
- Trigger: [what caused the switch]
- Outcome after switch: [result]

**Steps completed**:
- Step 1: [status] -- [outcome]
- Step 2: [status] -- [outcome]

**Outcome**:
[Whether the plan achieved the objective]
```
