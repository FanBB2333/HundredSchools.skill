<div align="center">

# 百家争鸣（HundredSchools）

> *"别再用一种思维方式解决所有问题。选对哲学。"*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-green)](https://agentskills.io)

<br>

Agent 该停的时候停不下来？<br>
输出幻觉却没有逻辑校验？<br>
严格格式任务被创意漂移带偏？<br>
复杂问题不做规划直接上手？<br>

**别再用一种思维方式解决所有问题。选对哲学。**

HundredSchools 是一个 [Agent Skill](https://agentskills.io)，将先秦诸子百家的六大学派<br>
映射为 LLM 推理、规划、生成和验证的具体控制策略。

[工作原理](#工作原理) · [快速开始](#快速开始) · [设计参考](#设计参考) · [测试结果](#测试结果)

</div>

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

### 其他 Agent 用法

将 `hundredschools/` 目录放置到你的 Agent 发现技能的路径下。请参考你的
Agent 文档获取具体路径。

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

<div align="center">

MIT License © [L1ght](https://github.com/FanBB2333)

</div>
