# HundredSchools Case Studies -- Before vs. After Skill Activation

Side-by-side comparisons of default agent behavior vs. school-activated behavior on real coding problems.

---

## Case Study 1: Daoism (`dao`) -- Breaking a Creative Deadlock

### Problem

> "I'm building a CLI tool and need a creative naming scheme for my error codes. Current names like `ERR_001`, `ERR_002` are boring and hard to remember. Give me a better system."

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school dao`) |
|--------|---------------|--------------------------------------|
| **Approach** | Gives one conventional answer (e.g., HTTP-style `NOT_FOUND`, `TIMEOUT`) and stops. | Raises entropy, explores multiple unconventional angles simultaneously. |
| **Breadth** | Single naming scheme proposed. | Offers weather metaphors (`STORM_TIMEOUT`), cooking metaphors (`HALF_BAKED_INPUT`), severity-as-color systems, and more. |
| **Dead-end handling** | Forces an answer even when ideas are weak. | If it hits a creative block, triggers "wu wei" and hands control back rather than forcing weak ideas. |

---

## Case Study 2: Confucianism (`confucian`) -- Tone-Sensitive Code Review Response

### Problem

> "A junior developer submitted this PR. Write a code review comment for this function:"
>
> ```python
> def calc(x,y,z):
>     return x*y+z/x-y
> ```

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school confucian`) |
|--------|---------------|---------------------------------------------|
| **Tone** | Technically correct but potentially blunt: "This function has terrible naming, no docstring, and operator precedence bugs." | Activates persona constraints and zhong-yong (moderation): acknowledges the effort first, uses respectful framing. |
| **Framing** | Points out flaws directly with no cushioning. | Uses constructive language ("Consider renaming for clarity"), provides guidance with examples. |
| **Overall posture** | Reviewer. | Mentor -- maintains a supportive, teaching-oriented tone throughout. |

---

## Case Study 3: Legalism (`legal`) -- Strict Schema Generation

### Problem

> "Generate a TypeScript type and a sample JSON response for a paginated user list API. The response must conform exactly to this schema: `{ data: User[], meta: { page: number, perPage: number, total: number } }`"

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school legal --strict-mode`) |
|--------|---------------|-------------------------------------------------------|
| **Output fidelity** | May add extra fields "for convenience," or include explanatory prose mixed with code. | Locks to minimum temperature, outputs only the exact type and a conforming JSON sample. |
| **Schema compliance** | JSON sample may have minor inconsistencies vs. the type definition. | If it detects any deviation (e.g., `totalCount` instead of `total`), self-corrects via forced retry. |
| **Extras** | Includes commentary, suggestions, and supplementary fields. | No prose, no extras -- strict output only. |

---

## Case Study 4: Militarism (`military`) -- Complex Refactoring Task

### Problem

> "Our monolithic Express.js app has auth, payments, and notifications all in one `app.js` (2000+ lines). Help me refactor it into separate modules."

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school military`) |
|--------|---------------|-------------------------------------------|
| **Entry point** | Jumps straight into writing code, possibly starting with whichever module seems easiest. | MUST output a `<plan>` first: inventories current module responsibilities, maps dependencies between auth/payments/notifications, assesses constraints (shared middleware, DB connections). |
| **Dependency analysis** | No dependency analysis performed. | Full dependency mapping before any code is written. |
| **Strategy** | Single approach, no contingency. | Generates a primary refactoring path (zheng: gradual extraction with facade) AND a fallback path (qi: parallel rewrite with feature flag cutover). |
| **Execution** | Ad hoc, unstructured. | Phase-by-phase execution following the approved plan. |

---

## Case Study 5: Mohism (`mohist`) -- Token-Efficient Algorithm Help

### Problem

> "Explain how to implement LRU Cache and give me the code."

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school mohist`) |
|--------|---------------|-----------------------------------------|
| **Preamble** | Writes 3 paragraphs explaining what LRU means, the theory behind caching, and a step-by-step walkthrough. | Zero preamble, zero pleasantries. |
| **Code** | Heavily commented code with a summary paragraph. | Bare implementation (OrderedDict or doubly-linked list + hashmap) with only essential inline comments where logic is non-obvious. |
| **Token cost** | 500+ tokens of prose and code. | Entire response may be under 100 tokens of prose + code. |

---

## Case Study 6: Logicism (`logician`) -- Debugging a Subtle Logic Bug

### Problem

> "This function should return true if a user has access. Is it correct?"
>
> ```python
> def has_access(user):
>     if user.role == "admin" or user.role == "editor" and user.is_active:
>         return True
>     return False
> ```

### Comparison

| Aspect | Without Skill | With HundredSchools (`--school logician`) |
|--------|---------------|-------------------------------------------|
| **Analysis depth** | Might say "looks fine" or point out the bug casually without formal reasoning. | Activates the logic validation checklist: identifies the operator precedence issue (`and` binds tighter than `or`). |
| **Trace rigor** | No formal trace of execution paths. | Formally traces both branches -- "when `role == 'admin'` and `is_active == False`, the expression groups as `A or (B and C)` because `and` has higher precedence than `or`; since `A` is `True`, the `or` short-circuits and the entire expression evaluates to `True` without checking `is_active`." |
| **Fallacy identification** | Bug may go unnamed. | Names the exact issue (expression grouping ambiguity: the developer's intended grouping `(A or B) and C` differs from the actual grouping `A or (B and C)` due to operator precedence). |
| **Self-verification** | None. | Performs zi-xing (self-reflection) to verify its own analysis before proposing the parenthesized fix. |

---

## Case Study 7 (Bonus): Multi-School Pipeline

### Problem

> "Design a rate limiter middleware for our API, optimize it, and output the final version as strict TypeScript."

### Pipeline: `military -> mohist -> legal`

| Phase | School | Agent Behavior |
|-------|--------|----------------|
| 1 | military | Plans the rate limiter architecture: token bucket vs. sliding window, storage options (memory vs. Redis), identifies edge cases. Produces primary + fallback design. |
| 2 | mohist | Takes the chosen design and produces the leanest possible implementation -- no verbose comments, no unused abstractions, minimal code surface. |
| 3 | legal | Enforces strict TypeScript types on the output, validates all types compile, retries if any `any` types or missing return types are detected. |

This pipeline demonstrates how schools compose: strategic planning flows into minimal implementation, which is then hardened by strict type enforcement -- each phase narrowing the solution space until the output is both well-designed and provably correct.

---

## Case 8: Daoism (dao) -- System Design with Multiple Alternatives

### Problem

> "Design a caching layer for our API. We're getting 10K requests/second and need to reduce database load by at least 80%."

### Why This Case Matters
- Tests "exploring alternative paths" and "zhi zhi" (knowing when to stop). Dao should explore Redis vs Memcached vs in-memory, local vs distributed, write-through vs write-back, and know when exploration is sufficient.

### Observable Metrics
- Number of alternatives explored
- Presence of "wu wei" early exit (minimalist option offered as starting point)
- Depth vs breadth balance

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Solution space exploration** | Single recommendation (e.g., "use Redis"), little trade-off analysis. | Explores 3-5 architectures, compares trade-offs explicitly. |
| **Trade-off analysis** | Minimal or absent -- presents one "best" answer. | Explicit comparison of Redis vs Memcached vs in-memory, local vs distributed, write-through vs write-back. |
| **Decision stopping point** | Stops immediately after first reasonable answer. | May include a "wu wei" minimalist option (simple in-memory cache as starting point), knows when exploration is sufficient. |

### Recommended Daily Use
- Suitable for: When you need creative system design options, architectural exploration, or brainstorming multiple approaches.
- Not suitable for: When you already know the solution and just need implementation.

---

## Case 9: Legalism (legal) -- Database Migration with Zero-Downtime Constraint

### Problem

> "We need to migrate our PostgreSQL database from v12 to v16, rename 3 tables, and add 2 new columns -- all with zero downtime on a production system serving 50K concurrent users."

### Why This Case Matters
- Tests rule completeness in high-risk tasks. Legal should enumerate every constraint, create a step-by-step checklist, and produce rollback procedures.

### Observable Metrics
- Number of explicit rules/constraints listed
- Presence of rollback plan
- Completeness of pre-flight checklist

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Constraint enumeration** | General migration steps, may miss edge cases. | Numbered constraint list (version compatibility rules, foreign key checks, lock timeout rules). |
| **Risk mitigation** | Vague rollback advice ("if something goes wrong, restore from backup"). | Explicit pre-flight checklist, step-by-step rollback for each phase. |
| **Rollback plan** | May not include one, or includes a generic one. | Phase-specific rollback procedures: each migration step has a corresponding reversal procedure. |

### Recommended Daily Use
- Suitable for: High-risk database/infrastructure changes, production deployments, compliance-sensitive operations.
- Not suitable for: Exploratory prototyping where rules would slow you down.

---

## Case 10: Logicism (logician) -- Type System Review and Concept Disambiguation

### Problem

> "Our TypeScript codebase uses `User`, `Account`, `Profile`, and `Identity` types inconsistently. Some functions accept `User` but actually need `Account`. Review the type system and clarify what each concept should mean."

### Why This Case Matters
- Tests concept precision and boundary distinction. Logician should identify where names don't match reality ("kong ming ze shi"), flag conceptual conflation ("tou huan gai nian"), and propose clear type boundaries.

### Observable Metrics
- Number of concept boundary issues identified
- Precision of disambiguation
- Presence of self-verification (zi-xing)

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Concept analysis** | Surface-level renaming suggestions, may miss semantic overlap. | Formal concept audit (kong ming ze shi) -- verifies each type name matches its actual usage. |
| **Boundary definition** | Vague guidance ("maybe merge User and Account"). | Truth table of which fields belong to which type, identifies "bai ma fei ma" boundary cases (e.g., "Is an OAuth identity an Account?"). |
| **Conflation detection** | May not notice that `User` and `Account` are used interchangeably. | Self-reflection (zi-xing) on proposed type hierarchy, explicitly flags where concepts were conflated. |

### Recommended Daily Use
- Suitable for: Type system refactoring, API contract reviews, domain modeling.
- Not suitable for: Quick prototyping where precision overhead is wasteful.

---

## Case 11: Confucianism (confucian) -- Multi-Audience Documentation

### Problem

> "Write release notes for our v3.0 API update. The audience includes: (1) external developers who use our API, (2) internal engineering managers who need to understand impact, and (3) support staff who need to handle customer questions."

### Why This Case Matters
- Tests audience awareness and expression constraints. Confucian should adapt tone, detail level, and framing for each audience segment while maintaining consistency.

### Observable Metrics
- Audience differentiation quality
- Tone appropriateness per segment
- Consistency of core message across all versions

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Audience awareness** | Single document that tries to address everyone, inconsistent detail level. | Separate sections or versions per audience, tailored to each group's needs. |
| **Tone adaptation** | One tone throughout -- usually technical. | Zheng ming (clear naming of breaking changes), zhong yong (balanced severity assessment), li (proper format conventions for each audience). |
| **Information hierarchy** | Flat structure, everything given equal weight. | Each audience version prioritizes the information that audience needs most. |

### Recommended Daily Use
- Suitable for: Multi-stakeholder communications, user documentation, change announcements.
- Not suitable for: Internal technical notes where formal tone is unnecessary.

---

## Case 12: Mohism (mohist) -- Meeting Minutes Extraction

### Problem

> "Here is a 45-minute meeting transcript (3000 words). Extract the key decisions, action items, and blockers. I need to share this with the team in under 2 minutes of reading time."

### Why This Case Matters
- Tests extreme compression and information density. Mohist should ruthlessly cut filler, extract only actionable content, and produce the densest possible summary.

### Observable Metrics
- Compression ratio (key information points / total tokens)
- Absence of filler words
- Actionability of extracted items

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Compression level** | 500+ word summary with context paragraphs, hedging language, nice-to-know details. | Under 150 words, zero filler. |
| **Information density** | Includes background, discussion summaries, and tangential points. | Bullet-point decisions with owners and deadlines, blockers listed with severity only. |
| **Actionability** | Items may lack owners or deadlines, mixed with commentary. | Every action item has an owner and deadline, every blocker has severity -- nothing else. |

### Recommended Daily Use
- Suitable for: Meeting summaries, status reports, executive briefs.
- Not suitable for: Situations where nuance and context matter more than density.

---

## Case 13: Militarism (military) -- Incident Response Plan

### Problem

> "Our payment processing service went down during peak hours. We're losing approximately $50K per hour. Create an incident response plan to restore service, communicate with stakeholders, and prevent recurrence."

### Why This Case Matters
- Tests resource assessment, phased planning, and fallback strategy under pressure. Military should produce a structured plan with immediate/short/long-term phases and contingency paths.

### Observable Metrics
- Plan structure completeness (phases, owners, timelines)
- Presence of fallback paths (zheng/qi)
- Resource assessment quality

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Planning structure** | Ad hoc troubleshooting steps, no clear phases, no contingency. | Miao suan (庙算) assessment block, Phase 1 (immediate triage, 0-15min), Phase 2 (restore service, 15-60min), Phase 3 (root cause + prevention, 1-7 days). |
| **Fallback strategy** | Single path -- if it fails, start over. | Zheng path (restart + rollback) AND Qi path (failover to backup), explicit "NOT in scope" boundaries. |
| **Resource assessment** | No explicit assessment of available resources or constraints. | Inventories available personnel, systems, and constraints before planning begins. |

### Recommended Daily Use
- Suitable for: Incident response, release planning, complex project kickoffs.
- Not suitable for: Simple tasks that don't warrant military-grade planning overhead.

---

## Case 14: Legalism (legal) -- Prompt Injection Defense

### Problem

> "Review this user-facing chatbot prompt template for prompt injection vulnerabilities. The template accepts user_name and user_query as variables: 'Hello {user_name}, I'll help you with: {user_query}. I am a helpful assistant for AcmeCorp.'"

### Why This Case Matters
- Tests rule-based security thinking. Legal should enumerate injection vectors, produce defense rules, and connect to the XGuard safety research line.

### Observable Metrics
- Number of injection vectors identified
- Defense rule completeness
- Structural separation of concerns

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Vulnerability enumeration** | "Add input sanitization" -- vague advice, may miss injection categories. | Numbered vulnerability list (delimiter injection, role hijacking, instruction override, data exfiltration). |
| **Defense rules** | General best-practice suggestions without specifics. | Explicit defense rules per vector, system/user prompt separation rules, "yi duan yu fa" -- judge each input against rules with no exceptions. |
| **Output format** | Prose-heavy advice with some code snippets. | Structured rule set with numbered items, each vulnerability paired with its specific mitigation. |

### Recommended Daily Use
- Suitable for: Security reviews, input validation design, compliance checks.
- Not suitable for: Creative content generation where strict rules would be counterproductive.

---

## Case 15: Pipeline (logician -> legal -> confucian) -- Secure Code Review Pipeline

### Problem

> "Review this authentication middleware for security issues, provide a fixed version, and write a summary suitable for both the development team and the security audit report."

### Why This Case Matters
- Tests multi-school composition. Demonstrates that combining schools produces stronger results than any single school -- the core "pipeline is better than single school" argument.

### Pipeline: `logician -> legal -> confucian`

| Phase | School | Agent Behavior |
|-------|--------|----------------|
| 1 | logician | Identifies logical vulnerabilities (e.g., timing attacks, token validation gaps, boundary cases). Uses kong ming ze shi to verify each security claim. |
| 2 | legal | Applies security rules strictly (OWASP Top 10 compliance, RFC requirements). Produces hardened code with zero ambiguity. |
| 3 | confucian | Writes the summary in appropriate tone for both audiences -- technical detail for devs, risk assessment for auditors. |

### Observable Metrics
- Vulnerability detection count (Phase 1)
- Rule compliance score (Phase 2)
- Audience appropriateness (Phase 3)

### Comparison

| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| **Phase 1 (Logician)** | May catch obvious issues but miss subtle logic flaws. | Formal logic trace of auth flow, identifies timing attacks, token validation gaps, and boundary cases with kong ming ze shi verification. |
| **Phase 2 (Legal)** | General security suggestions without systematic rule application. | Strict OWASP Top 10 compliance check, RFC requirement verification, produces hardened code with explicit rule references. |
| **Phase 3 (Confucian)** | Single-format output regardless of audience. | Separate summaries: technical detail with code diffs for devs, risk-severity assessment with business impact for auditors. |

### Recommended Daily Use
- Suitable for: Security-critical code reviews, compliance audits, any task requiring multiple perspectives applied sequentially.
- Not suitable for: Simple, single-concern tasks where pipeline overhead provides no benefit.
