# Legalism Guide (Fa-Jia)

This reference provides the detailed format validation rules, retry policy
configuration, and strict mode mechanics for the Legalism school. Legalism
governs deterministic output enforcement, schema compliance, and zero-tolerance
format validation. Every output is subject to the same rules regardless of
context.

## Philosophy Deep-Dive

- **Bu-bie-qin-shu (no discrimination between relations)**: all output is held
  to the same standard. No exceptions for "close enough" or partial compliance.
- **Yi-duan-yu-fa (judge solely by the law)**: the format specification is the
  law. Output either passes validation or it does not.
- **Xin-shang-bi-fa (rewards and punishments must be executed)**: compliant
  output proceeds; non-compliant output is rejected and regenerated.

---

## Strict Mode Mechanics

### Temperature Controls

- Set Temperature to minimum (near 0).
- Disable sampling diversity.
- Force greedy or near-greedy decoding.
- `--creativity` parameter is overridden to 0 when Legalism is active.

### System Prompt Constraints

- [ ] Output boundary specification: exact format, field names, types.
- [ ] No deviation permitted from specified schema.
- [ ] Every token must serve the format requirement.
- [ ] Include explicit examples of valid output in the system prompt.
- [ ] Specify prohibited patterns (e.g., no prose wrapping around JSON).

### --strict-mode Flag Behavior

When `--strict-mode` is enabled:

1. Parse output against expected format (JSON, XML, code schema).
2. On any format violation: immediately reject and force regeneration.
3. Maximum retry attempts: 3 (configurable).
4. On max retries exceeded: raise exception with detailed error message.
5. No partial output is ever returned -- all or nothing.

---

## Format Validation Rules

| Format | Validation Method | Failure Response |
|--------|------------------|-----------------|
| JSON | Schema validation (jsonschema) | Reject + retry with error hint |
| XML | DTD/XSD validation | Reject + retry with structural hint |
| Code | Syntax parse (AST) | Reject + retry with parse error |
| Structured text | Regex pattern match | Reject + retry with pattern hint |
| CSV/TSV | Column count and type check | Reject + retry with row-level error |
| YAML | YAML parser validation | Reject + retry with indentation hint |

---

## Forced Retry Protocol

1. Detect format violation via external parser or validator.
2. Extract specific error (which field, what constraint, line number if applicable).
3. Inject error feedback into retry prompt:
   - Include the original format specification.
   - Include the specific validation error.
   - Include the failed output segment (truncated if necessary).
4. Regenerate with tighter constraints.
5. Validate again; repeat up to max retries.

### Retry Escalation

| Attempt | Strategy |
|---------|----------|
| 1 | Regenerate with error hint appended to prompt |
| 2 | Regenerate with simplified schema and explicit example |
| 3 | Regenerate with field-by-field construction prompt |
| 3+ (exceeded) | Raise exception, return error details to caller |

---

## Use Case Catalog

| Use Case | Trigger Signal | Expected Behavior |
|----------|---------------|-------------------|
| JSON API response | "generate JSON", schema provided | Strict schema-compliant JSON, no prose |
| Data cleaning | Tabular data transformation task | Exact column/type conformance |
| Code generation | Function signature or type contract specified | Syntactically valid, AST-parseable code |
| Configuration file | YAML/TOML/INI format required | Valid config syntax, no comments unless specified |
| Structured extraction | "extract into format X" | Deterministic field mapping, no hallucinated fields |
| Template filling | Template with placeholders provided | Every placeholder filled, no extra content |

---

## Anti-Patterns

- [ ] Do NOT use for creative or exploratory tasks (use Dao instead).
- [ ] Do NOT use when output format is flexible or undefined.
- [ ] Do NOT use for natural language prose generation.
- [ ] Avoid when user values speed over correctness.
- [ ] Do NOT apply Legalism to intermediate reasoning (only to final output format).
- [ ] Do NOT combine with `--creativity 2` (contradicts deterministic enforcement).

---

## Legalism Notes Template

```
### Legalism Session Notes

**Target format**: [JSON / XML / code / structured text / other]

**Schema specification**: [reference to schema or inline description]

**strict-mode enabled**: [yes / no]

**Validation results**:
- Attempt 1: [pass / fail] -- [error description if failed]
- Attempt 2: [pass / fail] -- [error description if failed]
- Attempt 3: [pass / fail] -- [error description if failed]

**Retry escalation used**: [yes / no]
- Escalation level reached: [1 / 2 / 3 / exception raised]

**Final output status**: [validated and returned / exception raised]

**Outcome**:
[Whether the output met the format specification]
```
