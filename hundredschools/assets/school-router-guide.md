# Dynamic School Router Guide

This reference provides the intent classification heuristics and decision
logic for automatically selecting the most appropriate philosophical school
when the user does not specify `--school` explicitly.

---

## Intent Classification Heuristics

| User Intent Signal | Keywords / Patterns | Recommended School |
|--------------------|--------------------|--------------------|
| Seeking creativity or ideas | "brainstorm", "ideas", "creative", "what if", "imagine" | dao |
| Formal/professional tone needed | "email", "formal", "professional", "polite", "customer" | confucian |
| Strict data/format output | "JSON", "API", "schema", "parse", "validate", "exact" | legal |
| Complex planning or decomposition | "plan", "architecture", "design", "break down", "steps" | military |
| Efficiency/compression needed | "optimize", "compress", "shorter", "minimal", "efficient", "brief" | mohist |
| Logic/reasoning/fact-checking | "prove", "logic", "verify", "fact-check", "contradiction", "analyze argument" | logician |

> **Note:** Keyword matching is a weak signal. For stronger routing, combine with the task type, output goal, and risk level dimensions below.

---

## Decision Flowchart

The router follows this priority sequence:

1. **Explicit school parameter**: If `--school` is provided, use it directly.
   Skip all heuristics.
2. **Strong keyword match**: Scan the user prompt for strong signal keywords
   (see table above). If a single school scores significantly higher, select it.
3. **Task type inference**: Analyze the structural characteristics of the
   request:
   - Contains a format specification (JSON schema, XML DTD) -> legal
   - Asks for multiple alternatives or possibilities -> dao
   - Requires multi-step planning with dependencies -> military
   - Asks for shorter/faster/cheaper output -> mohist
   - Contains logical premises or asks for verification -> logician
   - Requires tone/persona/role compliance -> confucian
4. **Ambiguous intent**: If no single school dominates, default to the agent's
   standard behavior (no school override). Optionally, suggest relevant schools
   to the user.

---

## Enhanced Routing Layers

The following three layers provide stronger routing signals than keyword matching alone.

### Layer 1: Task Type Classification

| Task Type | Signal Patterns | Primary School |
|-----------|----------------|---------------|
| Generation | "write", "create", "generate", "build", "implement" | Depends on goal (see Layer 2) |
| Review | "review", "check", "audit", "verify", "analyze" | logician or legal |
| Planning | "plan", "design", "architect", "break down", "strategy" | military |
| Extraction | "summarize", "extract", "compress", "key points" | mohist |
| Communication | "explain to", "write for", "document for", "present to" | confucian |
| Diagnosis | "debug", "diagnose", "why is", "root cause", "investigate" | logician |

### Layer 2: Output Goal Classification

| Output Goal | Signal Patterns | Primary School |
|-------------|----------------|---------------|
| Creative / divergent | "alternatives", "options", "brainstorm", "explore" | dao |
| Precise / exact | "exact", "strict", "conform", "match schema" | legal |
| Compliant / rule-based | "comply", "RFC", "standard", "regulation" | legal |
| Executable / actionable | "action items", "next steps", "plan", "timeline" | military |
| Minimal / dense | "brief", "short", "concise", "TL;DR" | mohist |

### Layer 3: Risk Level Assessment

| Risk Indicator | Signal Patterns | Recommendation |
|---------------|----------------|---------------|
| Normal | Default for most requests | Use best single school |
| High constraint | "production", "schema", "migration", "compliance" | Include legal in pipeline |
| High risk | "security", "payment", "authentication", "incident" | Pipeline with logician -> legal |

---

## Updated Priority Sequence

The router now follows this enhanced priority:

1. **Explicit school parameter**: If `--school` is provided, use it directly.
2. **Risk level assessment**: If high-risk indicators are detected, recommend a pipeline (e.g., `logician -> legal`).
3. **Task type + output goal**: Combine Layer 1 and Layer 2 to identify the best school.
4. **Keyword fallback**: Use the keyword heuristics table as a weak signal when other layers are ambiguous.
5. **Ambiguous intent**: If no signal dominates, default to standard behavior or suggest top 2 candidates.

---

## Confidence Thresholds

| Confidence Level | Action |
|-----------------|--------|
| High (>0.8) | Auto-select school, proceed without confirmation |
| Medium (0.5-0.8) | Auto-select school, but state which school was chosen and why |
| Low (<0.5) | Do not auto-select. Present top 2 candidate schools to the user with brief rationale, ask for selection |

---

## Default Behavior

When no school is selected (either explicitly or via router):

- The agent operates in its standard mode without philosophical persona
  injection.
- All default model parameters apply.
- No school-specific execution rules are enforced.

---

## Router Override Rules

- User can always override the router by specifying `--school` explicitly.
- If the user disagrees with the auto-selected school, switch immediately
  without argument.
- The router should never insist on a school selection.
