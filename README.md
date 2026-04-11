[English](#english) | [中文](#中文)

---

# English

# HundredSchools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)

Agents that overthink when they should stop?
Outputs that hallucinate without a logic check?
Strict formatting tasks derailed by creative drift?
Complex problems tackled without a plan?

**Stop using one mindset for every problem. Choose the right philosophy.**

HundredSchools maps six classical Chinese philosophical schools (pre-Qin Hundred Schools of Thought) into concrete control strategies for LLM inference, planning, generation, and validation.

[How It Works](#how-it-works) · [Quick Start](#quick-start) · [Design Reference](#design-reference) · [Test Results](#test-results)

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

### Use with any agent

Copy the `hundredschools/` directory into your project or agent's skill discovery path:

```
cp -r hundredschools/ /path/to/your/skills/
```

### Usage with Claude Code

Place under `.claude/skills/` in your project root:

```
.claude/skills/hundredschools/SKILL.md
```

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
  assets/
    school-router-guide.md               # Dynamic school selection guide
    pipeline-examples.md                 # Multi-school pipeline examples
```

## Design Reference

See [spec.md](spec.md) for the complete architecture and design specification.

## Test Results

- Visual report: [docs/results.html](docs/results.html)
- Detailed analysis: [docs/test-results.md](docs/test-results.md)

---

# 中文

# 百家争鸣（HundredSchools）

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)

Agent 该停的时候停不下来？
输出幻觉却没有逻辑校验？
严格格式任务被创意漂移带偏？
复杂问题不做规划直接上手？

**别再用一种思维方式解决所有问题。选对哲学。**

HundredSchools 将先秦诸子百家的六大学派映射为 LLM 推理、规划、生成和验证的具体控制策略。

[工作原理](#工作原理) · [快速开始](#快速开始) · [设计参考](#设计参考) · [测试结果](#测试结果)

---

## 工作原理

| 学派 | 哲学理念 | Agent 行为 |
|------|---------|-----------|
| 道家 (dao) | 无为，顺应自然 | 高熵探索、提前退出、启发式搜索 |
| 儒家 (confucian) | 克己复礼、正名 | 价值对齐、人格约束、安全护栏 |
| 法家 (legal) | 一断于法、不容例外 | 严格类型校验、结构化输出、强制重试 |
| 兵家 (military) | 庙算、知己知彼 | 复杂规划、多步推理（ToT/CoT） |
| 墨家 (mohist) | 节用、兼爱 | Token 节流、最小输出、性能优化 |
| 名家 (logician) | 控名责实、验证事实 | 形式逻辑验证、幻觉检测 |

## 快速开始

### 通用用法

将 `hundredschools/` 目录复制到你的项目或 Agent 的技能发现路径：

```
cp -r hundredschools/ /path/to/your/skills/
```

### Claude Code 用法

放在项目根目录的 `.claude/skills/` 下：

```
.claude/skills/hundredschools/SKILL.md
```

### Web 前端

```bash
cd web && npm install && npm run dev
```

### 目录结构

```
hundredschools/
  SKILL.md                               # 核心技能指令
  references/
    DAO-GUIDE.md                          # 道家：启发式探索
    CONFUCIAN-GUIDE.md                    # 儒家：对齐与安全
    LEGAL-GUIDE.md                        # 法家：严格校验
    MILITARY-GUIDE.md                     # 兵家：战略规划
    MOHIST-GUIDE.md                       # 墨家：效率优化
    LOGICIAN-GUIDE.md                     # 名家：逻辑与事实检查
  assets/
    school-router-guide.md               # 动态学派选择指南
    pipeline-examples.md                 # 多学派流水线示例
```

## 设计参考

完整架构和设计规范见 [spec.md](spec.md)。

## 测试结果

- 可视化报告：[docs/results.html](docs/results.html)
- 详细分析：[docs/test-results.md](docs/test-results.md)

---

MIT License © [L1ght](https://github.com/FanBB2333)
