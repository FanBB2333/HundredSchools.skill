<div align="center">

# HundredSchools

> *"Stop using one mindset for every problem. Choose the right philosophy."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-green)](https://agentskills.io)

<br>

Agents that overthink when they should stop?<br>
Outputs that hallucinate without a logic check?<br>
Strict formatting tasks derailed by creative drift?<br>
Complex problems tackled without a plan?<br>

**Stop using one mindset for every problem. Choose the right philosophy.**

HundredSchools is an [Agent Skill](https://agentskills.io) that maps classical philosophical schools<br>
— six from pre-Qin China and eight later additions spanning early-modern empiricism,<br>
the Mediterranean tradition, modern Western philosophy, 20th-century philosophy of language,<br>
and Ming-dynasty Neo-Confucianism —<br>
into concrete control strategies for LLM inference, planning, generation, and validation.

[How It Works](#how-it-works) · [Quick Start](#quick-start) · [Design Reference](#design-reference) · [Test Results](#test-results)

</div>

---

## How It Works

### Pre-Qin core (六家)

| School | Philosophy | What the Agent Does |
|--------|-----------|---------------------|
| Daoism (dao) | Wu wei (non-action), natural flow | High-entropy exploration, early exiting, heuristic search |
| Confucianism (confucian) | Self-discipline, proper names (zhengming) | Value alignment, persona constraints, safety guardrails |
| Legalism (legal) | Uniform law, no exceptions | Strict type validation, structured output, forced retry |
| Militarism (military) | Temple calculations (miaosuan), know thy enemy | Complex planning, multi-step reasoning (ToT/CoT) |
| Mohism (mohist) | Frugal use (jieyong), universal love | Token throttling, minimal output, performance optimization |
| Logicism (logician) | Control names (xingming), verify facts | Formal logic validation, hallucination detection |

### Later additions (拓展八家)

| School | Philosophy | What the Agent Does |
|--------|-----------|---------------------|
| Socratic (socratic) | Elenchus, maieutics, productive aporia | Pre-answer interrogation, definition extraction, calibrated humility |
| Stoic (stoic) | Dichotomy of control, equanimity, logos | Controllable/uncontrollable partition, graceful degradation, retry-budget discipline |
| Falsificationist (falsificationist) | Bold conjecture under severe testing, demarcation | Falsifiability check on every claim, adversarial self-test, tagging of unfalsifiable claims |
| Hegelian (hegelian) | Dialectic, *Aufhebung*, determinate negation | Force counter-position before commit, produce non-averaging synthesis, test on concrete instances |
| Pragmatist (pragmatist) | Pragmatic maxim, truth as cash-value, fallibilism | Cash out meaning by practical effects, attach adoptable means to ends, pre-commit to revision |
| Yangming (yangming) | 知行合一, 致良知, 心即理 | Demand actionable form, mental walkthrough before commit, separate info-gap from willingness-gap |
| Bacon's Idols (bacon) | Idola tribus / specus / fori / theatri | Pre-commit four-idol pass, named-category bias inventory, mandatory substantive revision on hit |
| Wittgenstein (wittgenstein) | *Sprachspiel*, meaning-as-use, family resemblance | Track operative meaning across domains, tag game-shifts, allow family-resemblance multiplicity |

## Quick Start

### Use with any Agent Skills-compatible tool

Copy the `hundredschools/` directory into your project or agent's skill discovery path:

```
cp -r hundredschools/ /path/to/your/skills/
```

### Usage with Claude Code

Place under `.claude/skills/` in your project root:

```
.claude/skills/hundredschools/SKILL.md
```

### Usage with other agents

Place the `hundredschools/` directory where your agent discovers skills. Refer to your
agent's documentation for the appropriate path.

### Web Frontend

```bash
cd web && npm install && npm run dev
```

### Directory Structure

```
hundredschools/
  SKILL.md                               # Core skill instructions
  references/
    DAO-GUIDE.md                          # Daoism: heuristic exploration
    CONFUCIAN-GUIDE.md                    # Confucianism: alignment & safety
    LEGAL-GUIDE.md                        # Legalism: strict validation
    MILITARY-GUIDE.md                     # Militarism: strategic planning
    MOHIST-GUIDE.md                       # Mohism: efficiency optimization
    LOGICIAN-GUIDE.md                     # Logicism: logic & fact-checking
    SOCRATIC-GUIDE.md                     # Socratic: pre-answer interrogation
    STOIC-GUIDE.md                        # Stoic: control-dichotomy & graceful degradation
    FALSIFICATIONIST-GUIDE.md             # Popperian: falsifiability discipline
    HEGELIAN-GUIDE.md                     # Hegelian: dialectical synthesis
    PRAGMATIST-GUIDE.md                   # Pragmatist: outcome-driven evaluation
    YANGMING-GUIDE.md                     # Yangming: knowledge-action unity
    BACON-GUIDE.md                        # Bacon: named-category bias inventory
    WITTGENSTEIN-GUIDE.md                 # Wittgenstein: language-game shift detection
  assets/
    school-router-guide.md               # Dynamic school selection guide
    pipeline-examples.md                 # Multi-school pipeline examples
    decision-guide.md                    # Daily work decision guide
docs/
  case-studies.md                        # 15 cross-domain case studies
  test-results.md                        # Multi-dimensional evaluation results
  improvement-proposal.md               # Implementation plan
  safety-prompts.md                      # Safety evaluation samples (XGuard)
  safety-results.md                      # Safety evaluation results
  safety-report.md                       # Safety research report
  samples/
    safety_pipeline.py                   # Minimal safety pipeline example
web/                                     # React + Vite interactive frontend
```

## Design Reference

See [spec.md](spec.md) for the complete architecture and design specification.

## Test Results & Evaluation

- Interactive web report: `cd web && npm run dev`
- Detailed analysis: [docs/test-results.md](docs/test-results.md)
- 15 cross-domain case studies: [docs/case-studies.md](docs/case-studies.md)
- Multi-prompt evaluation: 5 prompts x 8 observable dimensions x 7 configurations
- Decision guide: [hundredschools/assets/decision-guide.md](hundredschools/assets/decision-guide.md)

## Safety Research (XGuard)

An ongoing study using [YuFeng-XGuard-Reason-0.6B](https://huggingface.co/Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B) to answer which school combinations work best for safety-critical tasks:

- Evaluation protocol: [docs/safety-prompts.md](docs/safety-prompts.md)
- Safety pipeline: Logician -> Legal -> Confucian -> XGuard

---

<div align="center">

MIT License © [L1ght](https://github.com/FanBB2333)

</div>
