# Multi-School Pipeline Examples

This reference provides complete walkthroughs of multi-school pipelines where
complex tasks benefit from sequencing different philosophical approaches.

---

## How Pipelines Work

In a pipeline, the output of one school becomes the input context for the next.
Each school applies its own behavioral constraints during its active phase. The
agent transitions between schools at defined handoff points.

Pipeline syntax (conceptual):

> school_1 -> school_2 -> school_3

---

## Example 1: System Architecture Design

**Scenario**: Design a microservices architecture for an e-commerce platform.

**Pipeline**: military -> mohist -> logician -> legal

### Phase 1: Military (Strategic Planning)

- **Action**: Decompose the architecture task into components
- **Output**:
  - `<plan>` with objective, resources, constraints
  - Primary architecture (zheng): standard microservices with API gateway
  - Fallback architecture (qi): modular monolith with extraction points
  - Component list: auth service, product catalog, order management, payment,
    notification
  - Dependency map between services

### Phase 2: Mohist (Efficient Prototyping)

- **Input**: Military's component list and dependency map
- **Action**: Generate minimal viable definitions for each service
- **Output**:
  - Stripped-down API contracts (essential endpoints only)
  - Minimal data models (no redundant fields)
  - Lean infrastructure requirements

### Phase 3: Logician (Logic Validation)

- **Input**: Mohist's minimal definitions
- **Action**: Verify logical consistency across services
- **Output**:
  - Check: Do API contracts between services match? (caller expects what callee
    provides)
  - Check: Are data models consistent across service boundaries?
  - Check: Are there circular dependencies?
  - Flag any logical inconsistencies with [ISSUE] markers

### Phase 4: Legal (Format Enforcement)

- **Input**: Logician's validated and corrected definitions
- **Action**: Enforce strict output format
- **Output**:
  - Final API specs in OpenAPI/JSON Schema format
  - Validated against schema
  - Any format violations trigger retry

---

## Example 2: Creative Content with Quality Gate

**Scenario**: Generate marketing copy for a new product launch.

**Pipeline**: dao -> confucian -> logician

### Phase 1: Daoism (Creative Exploration)

- **Action**: Brainstorm taglines, angles, and messaging themes
- **Creativity**: Set to 2 (maximum divergence)
- **Output**:
  - 10+ diverse tagline candidates
  - 3-4 distinct messaging angles
  - Unexpected metaphors and associations
  - No self-censoring at this stage

### Phase 2: Confucianism (Tone Alignment)

- **Input**: Daoism's creative output
- **Action**: Filter and refine for brand voice compliance
- **Output**:
  - Remove any candidates that violate brand guidelines
  - Adjust tone to match target audience expectations
  - Ensure cultural sensitivity across markets
  - Rank remaining candidates by brand alignment score

### Phase 3: Logician (Claim Verification)

- **Input**: Confucianism's refined candidates
- **Action**: Verify factual claims and logical consistency
- **Output**:
  - Check each tagline for implicit claims that could be challenged
  - Flag any statements that could be misleading or unsubstantiated
  - Verify superlatives and comparisons are defensible
  - Final approved copy with verification notes

---

## Example 3: Data Pipeline with Strict Output

**Scenario**: Extract structured data from unstructured customer feedback and
generate a validated report.

**Pipeline**: logician -> mohist -> legal

### Phase 1: Logician (Semantic Analysis)

- **Action**: Analyze unstructured feedback for logical structure
- **Output**:
  - Identify distinct claims/complaints in each feedback entry
  - Classify sentiment per claim (not per entry)
  - Resolve ambiguous references ("it doesn't work" -> identify what "it"
    refers to)
  - Flag entries with contradictory statements

### Phase 2: Mohist (Compression)

- **Input**: Logician's structured analysis
- **Action**: Compress to essential data points
- **Output**:
  - One-line summary per feedback entry
  - Category tags (no redundant categories)
  - Severity score (1-5, no decimals, no hedging)
  - Strip all qualifiers and hedge words

### Phase 3: Legal (Format Enforcement)

- **Input**: Mohist's compressed data
- **Action**: Output as strict JSON with `--strict-mode`
- **Output**:
  - JSON array of feedback objects matching exact schema
  - Schema validation pass/fail
  - Any entry failing validation is retried individually
  - Final output: 100% schema-compliant JSON

---

## Pipeline Design Principles

1. **Start broad, narrow progressively**: Creative/planning schools first,
   validation/formatting schools last.
2. **Each school adds value**: Do not include a school that does not
   meaningfully transform the output.
3. **Handoff clarity**: The output of each phase must be a complete,
   self-contained input for the next phase.
4. **Fail early**: If a validation school (logician/legal) finds fundamental
   issues, loop back to the appropriate earlier school rather than patching at
   the end.
