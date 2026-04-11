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
