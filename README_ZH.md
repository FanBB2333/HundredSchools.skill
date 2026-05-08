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

HundredSchools 是一个 [Agent Skill](https://agentskills.io)，将经典哲学流派——<br>
以先秦诸子百家六大学派为核心，并扩展纳入早期近代经验主义、地中海传统、<br>
近代西方哲学、二十世纪语言哲学与明代新儒学共八家——<br>
映射为 LLM 推理、规划、生成和验证的具体控制策略。

[工作原理](#工作原理) · [快速开始](#快速开始) · [设计参考](#设计参考) · [测试结果](#测试结果)

</div>

---

## 工作原理

### 先秦核心（六家）

| 学派 | 哲学理念 | Agent 行为 |
|------|---------|-----------|
| 道家 (dao) | 无为，顺应自然 | 高熵探索、提前退出、启发式搜索 |
| 儒家 (confucian) | 克己复礼、正名 | 价值对齐、人格约束、安全护栏 |
| 法家 (legal) | 一断于法、不容例外 | 严格类型校验、结构化输出、强制重试 |
| 兵家 (military) | 庙算、知己知彼 | 复杂规划、多步推理（ToT/CoT） |
| 墨家 (mohist) | 节用、兼爱 | Token 节流、最小输出、性能优化 |
| 名家 (logician) | 控名责实、验证事实 | 形式逻辑验证、幻觉检测 |

### 后续拓展（八家）

| 学派 | 哲学理念 | Agent 行为 |
|------|---------|-----------|
| 苏格拉底 (socratic) | 反诘 (elenchus)、产婆术、有产出的困惑态 | 作答前反诘、定义抽取、置信度校准 |
| 斯多葛 (stoic) | 可控划分、稳态、顺理而行 | "可控/不可控"划分、优雅降级、重试预算纪律 |
| 证伪 (falsificationist) | 大胆猜想 + 严苛检验、划界、可错论 | 每个断言附可证伪条件、对抗式自检、不可证伪断言标注 |
| 黑格尔学派 (hegelian) | 辩证、扬弃、规定的否定 | 承诺前先写最强反案、产出非折中式综合、在具体实例上检验 |
| 实用主义 (pragmatist) | 实用准则、真理的兑现价值、可错论 | 用实践效应兑现意义、目的必附可采纳手段、预先承诺按证据修订 |
| 阳明学 (yangming) | 知行合一、致良知、心即理 | 要求可采纳的行动形态、提交前心理走查、显式区分信息缺口与意愿缺口 |
| 培根四偶像 (bacon) | 部族 / 洞穴 / 市场 / 剧场偶像 | 提交前四偶像扫描、按命名类别清查认知偏误、命中时强制修订实质答案 |
| 维特根斯坦 (wittgenstein) | 语言游戏、意义即使用、家族相似 | 跨领域追踪术语操作性意义、标注游戏切换、允许家族相似型概念保留多义 |

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
    SOCRATIC-GUIDE.md                     # 苏格拉底：作答前反诘
    STOIC-GUIDE.md                        # 斯多葛：可控划分与优雅降级
    FALSIFICATIONIST-GUIDE.md             # 证伪学派：可证伪性纪律
    HEGELIAN-GUIDE.md                     # 黑格尔学派：辩证综合
    PRAGMATIST-GUIDE.md                   # 实用主义：后果导向评估
    YANGMING-GUIDE.md                     # 阳明学：知行合一
    BACON-GUIDE.md                        # 培根：按命名类别的偏误清单
    WITTGENSTEIN-GUIDE.md                 # 维特根斯坦：语言游戏切换检测
  assets/
    school-router-guide.md               # 动态学派选择指南
    pipeline-examples.md                 # 多学派流水线示例
    decision-guide.md                    # 日常工作决策指南
docs/
  case-studies.md                        # 15 个跨领域案例研究
  test-results.md                        # 多维度评测结果
  improvement-proposal.md               # 实施方案
  safety-prompts.md                      # 安全评测样本（XGuard）
  safety-results.md                      # 安全评测结果
  safety-report.md                       # 安全研究报告
  samples/
    safety_pipeline.py                   # 最小安全流水线示例
web/                                     # React + Vite 交互式前端
```

## 设计参考

完整架构和设计规范见 [spec.md](spec.md)。

## 测试结果与评测

- 交互式 Web 报告：`cd web && npm run dev`
- 详细分析：[docs/test-results.md](docs/test-results.md)
- 15 个跨领域案例研究：[docs/case-studies.md](docs/case-studies.md)
- 多提示词评测：5 个 prompt x 8 个可观察维度 x 7 种配置
- 决策指南：[hundredschools/assets/decision-guide.md](hundredschools/assets/decision-guide.md)

## 安全研究（XGuard）

使用 [YuFeng-XGuard-Reason-0.6B](https://huggingface.co/Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B) 开展研究，回答哪种学派组合最适合安全关键任务：

- 评测协议：[docs/safety-prompts.md](docs/safety-prompts.md)
- 安全流水线：名家 -> 法家 -> 儒家 -> XGuard

---

<div align="center">

MIT License © [L1ght](https://github.com/FanBB2333)

</div>
