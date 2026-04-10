<div align="center">

# HundredSchools

> *"Let ancient wisdom guide modern agents."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-green)](https://agentskills.io)

<br>

Agents that overthink when they should stop?<br>
Outputs that hallucinate without a logic check?<br>
Strict formatting tasks sabotaged by creative drift?<br>
Complex problems tackled without a plan?<br>

**Stop using one mindset for every problem. Choose the right philosophy.**

HundredSchools is an [Agent Skill](https://agentskills.io) that maps six classical Chinese philosophical schools<br>
(pre-Qin Hundred Schools of Thought) into concrete control strategies<br>
for LLM inference, planning, generation, and validation.

[How It Works](#how-it-works) · [Quick Start](#quick-start) · [Design Reference](#design-reference)

</div>

---

## How It Works

| School | Philosophy | What the Agent Does |
|--------|-----------|---------------------|
| Daoism (dao) | Wu wei (non-action), natural flow | High-entropy exploration, early exiting, heuristic search |
| Confucianism (confucian) | Self-discipline, proper names (zhengming) | Value alignment, persona constraints, safety guardrails |
| Legalism (legal) | Uniform law, no exceptions | Strict type validation, structured output, forced retry |
| Militarism (military) | Temple calculations (miaosuan), know thy enemy | Complex planning, multi-step reasoning (ToT/CoT) |
| Mohism (mohist) | Frugal use (jieyong), universal love | Token throttling, minimal output, performance optimization |
| Logicism (logician) | Control names (xingming), verify facts | Formal logic validation, hallucination detection |

## Quick Start

### Use with any Agent Skills-compatible tool

Copy the `hundredschools/` directory into your project or agent's skill discovery path:

```
cp -r hundredschools/ /path/to/your/skills/
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
  assets/
    school-router-guide.md                # Dynamic school selection guide
    pipeline-examples.md                  # Multi-school pipeline examples
```

### Usage with Claude Code

Place the `hundredschools/` directory under `.claude/skills/` in your project root:

```
.claude/skills/hundredschools/SKILL.md
```

### Usage with other agents

Place the `hundredschools/` directory where your agent discovers skills. Refer to your
agent's documentation for the appropriate path.

## Design Reference

See [spec.md](spec.md) for the complete architecture and design specification,
including the school selection router, multi-school pipelines, and per-school
behavioral contracts.

---

<div align="center">

MIT License © [L1ght](https://github.com/FanBB2333)

</div>
