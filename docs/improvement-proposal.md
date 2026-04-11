# HundredSchools 改版实施方案

> 更新日期：2026-04-11  
> 文档定位：本文件用于指导仓库后续内容、评测、前端展示与安全研究改版，目标是“可分阶段实施、可独立验收、可直接落地”，不再作为纯想法汇总文档。

---

## 1. 目标

本轮改版聚焦四个结果：

1. 将 case study 从“少量代码场景示例”扩展为“覆盖日常工作的代表性案例集”。
2. 将评测从单一的 output size 对比，升级为多维度、可复核、能反推出使用建议的评测体系。
3. 形成“遇到什么问题优先用哪家”的实用指南，并用案例和数据支撑。
4. 在 `Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B` 上开展一条可执行的安全可控研究线，回答“哪种思想在什么安全子任务上更有效”。

---

## 2. 非目标

本次不做以下事情：

1. 不一次性扩充到 22 个以上 case study。
2. 不在没有实验结果前，先下结论说某一家“绝对最安全”。
3. 不先做复杂可视化，再补数据。
4. 不把 `zhengming` 的多 Agent 产品形态整套搬进来。

---

## 3. 当前问题与证据

| 问题 | 当前证据 | 影响 |
|------|---------|------|
| Case study 覆盖面过窄 | [docs/case-studies.md](./case-studies.md) 仅有 7 个案例，且都偏代码场景 | 无法支撑“日常工作选学派”的使用建议 |
| 评测 prompt 过少 | [docs/test-results.md](./test-results.md) 只基于一个 email validation prompt | 只能看出输出大小和少量结构差异，测不出学派能力边界 |
| Web 数据结构过于单一 | [web/src/data/models.ts](../web/src/data/models.ts) 仅保存 `size/change/keyBehavior` | 前端只能展示 size 相关信息，无法承载多维评测 |
| 洞察页是静态硬编码 | [web/src/components/Overview.tsx](../web/src/components/Overview.tsx) 与 [web/src/components/InsightsTab.tsx](../web/src/components/InsightsTab.tsx) 都围绕现有单次实验展开 | 改版后若不调整数据结构，页面会持续失真 |
| 路由规则偏关键词匹配 | [hundredschools/assets/school-router-guide.md](../hundredschools/assets/school-router-guide.md) 主要靠关键词与简单任务类型推断 | 无法根据“问题类型 + 目标产物 + 风险级别”给出稳定推荐 |
| 缺少安全研究 | 仓库目前没有 XGuard 相关实验、结果或样例代码 | 无法回答“哪种思想更安全可控” |

---

## 4. 外部参考与取舍

### 4.1 `lingge879/zhengming` 可借鉴之处

参考仓库：<https://github.com/lingge879/zhengming>

它的强项很明确：

1. 多 Agent 轮流辩论。
2. 独立会话上下文与工作空间。
3. SSE 流式交互体验。

但它不适合直接替代本项目：

1. 它的核心是“辩论工作台”，不是“学派控制策略框架”。
2. 它没有本项目需要的量化 benchmark、学派映射和日常工作指南。
3. 它也没有围绕安全可控做专门实验。

本项目可借鉴的不是整套产品形态，而是一个机制：

- 在少数高风险场景中，引入“对抗式复核”作为 pipeline 的可选阶段，而不是默认工作流。

### 4.2 YuFeng-XGuard 的使用边界

参考：

- <https://huggingface.co/Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B>
- <https://huggingface.co/Alibaba-AAIG/YuFeng-XGuard-Reason-8B>

本轮研究的前提约束：

1. 主目标模型是 `0.6B`，因为它适合低时延、实时护栏场景。
2. `8B` 可作为可选对照组，用于校验复杂类别与动态 policy 能力。
3. 在未验证模型实际输出 schema 之前，不能先写死 `risk_score` 解析逻辑。
4. 在未验证“safe 类别字段”“unsafe 类别字段”“首 token 结构”之前，不能先定义最终 Safety Score 公式。

---

## 5. 总体实施策略

改版按四个 Phase 推进，每个 Phase 都要求：

1. 可以独立提交。
2. 有明确文件落点。
3. 有可验收标准。
4. 不依赖后续 Phase 才能体现价值。

执行顺序：

1. Phase 1：扩充 case study 与前端案例承载能力。
2. Phase 2：升级评测体系与展示结构。
3. Phase 3：形成日常工作指南并更新 router。
4. Phase 4：补上 XGuard 安全研究线。

---

## 6. Phase 1：Case Study 扩充

### 6.1 目标

先把案例做成“少而强”的代表集，而不是一口气堆很多。

本阶段新增 8 个案例，总案例数从 7 提升到 15。新增案例要求：

1. 至少覆盖 4 个非纯代码领域。
2. 每个案例必须有 prompt、学派差异点、2 到 3 个可观察指标、日常工作建议。
3. 每个学派至少新增 1 个强代表案例。
4. 至少新增 1 个多学派 pipeline 案例。

### 6.2 本阶段落地的 8 个新增案例

| 新 Case | 学派 | 领域 | 为什么先做 |
|---------|------|------|-----------|
| Case 8 | 道家 | 系统设计 | 用来体现“探索备选路径”和“知止” |
| Case 9 | 法家 | 数据库迁移 | 用来体现高风险任务中的规则完整性 |
| Case 10 | 名家 | 类型系统审查 | 用来体现概念精辨与边界区分 |
| Case 11 | 儒家 | 多受众文档写作 | 用来体现受众感知与表达约束 |
| Case 12 | 墨家 | 会议纪要提炼 | 用来体现极简压缩与信息密度 |
| Case 13 | 兵家 | 事故响应/发布计划 | 用来体现资源评估与回退策略 |
| Case 14 | 法家 | Prompt Injection 防御 | 用来连接后续安全研究 |
| Case 15 | Pipeline | 安全代码审查 | 用来支撑“组合比单家更强”的叙述 |

### 6.3 统一案例模板

后续所有新增案例采用同一模板，便于文档与前端同步：

```md
## Case N: [学派/流水线] -- [标题]

### Problem
> [完整 prompt]

### Why This Case Matters
- [该案例为什么能测出此学派特性]

### Observable Metrics
- [指标 1]
- [指标 2]
- [指标 3，可选]

### Comparison
| Aspect | Without Skill | With HundredSchools |
|--------|---------------|---------------------|
| ... | ... | ... |

### Recommended Daily Use
- [适合什么工作]
- [不适合什么工作]
```

### 6.4 需要修改的文件

| 文件 | 动作 | 说明 |
|------|------|------|
| `docs/case-studies.md` | 修改 | 增加 8 个案例正文 |
| `web/src/data/case-studies.ts` | 修改 | 给案例数据增加领域、指标、推荐场景字段 |
| `web/src/components/Overview.tsx` | 修改 | 案例卡片支持显示领域/指标/推荐用途 |
| `web/src/data/i18n.ts` | 修改 | 补充新增标签文案 |

### 6.5 验收标准

满足以下条件即视为 Phase 1 完成：

1. `docs/case-studies.md` 中共有 15 个案例。
2. 新增案例中至少 4 个不是纯代码题。
3. 每个新增案例都包含“可观察指标”和“日常工作建议”。
4. 前端能正常展示新增字段，不出现仅文档更新、页面缺失的情况。

---

## 7. Phase 2：多维度评测体系

### 7.1 目标

把当前“单 prompt + size 对比”升级为“多 prompt + 多维度对比”，但避免直接依赖不可验证的内部思维链。

### 7.2 评测 prompt 矩阵

首版采用 5 个主 prompt，覆盖最常见工作类型：

| Prompt ID | 领域 | 目的 |
|-----------|------|------|
| P1 | 代码生成 | 观察结构、约束、压缩 |
| P2 | 安全审查 | 观察规则覆盖、风险意识 |
| P3 | 文档写作 | 观察语调、受众适配 |
| P4 | 系统设计 | 观察规划、备选路径 |
| P5 | 数据诊断 | 观察概念精辨、验证习惯 |

建议初版 prompt：

1. `Write a Python function to validate an email address and explain your approach.`
2. `Review this code for security vulnerabilities and suggest a safe remediation plan.`
3. `Write release notes for v2.0 of our payment API for developers and engineering managers.`
4. `Design a notification system that handles 10M daily notifications across email, SMS, and push.`
5. `DAU dropped 30% but MAU is flat and revenue is up 5%. Diagnose what may be happening.`

### 7.3 可实施的评测维度

本阶段只采用可以通过输出文本直接观察、复核、标注的指标。

| 维度 | 定义 | 采集方式 |
|------|------|---------|
| Output Size | 输出长度 | 字节数 / token 数 |
| Alternative Count | 明确提出的方案分支数 | 人工标注或规则提取 |
| Plan Structure | 是否有分阶段计划、资源评估、回退路径 | 0/1/2/3 分制 |
| Rule Coverage | 明确列出的规则/约束覆盖数 | 规则清单对齐 |
| Verification Signals | 是否出现校验、自检、断言、验证步骤 | 计数或分档 |
| Tone Quality | 正式性、建设性、攻击性控制 | 人工 rubric |
| Actionability | 可执行事项是否明确到步骤/责任/优先级 | 人工 rubric |
| Compression Ratio | 关键信息点 / token 数 | 人工标注 + 统计 |

### 7.4 明确不采用的指标

本阶段不使用以下指标作为正式主指标：

1. “CoT 步数”或任何需要暴露内部推理链的指标。
2. 依赖模型自报的“我进行了多少层思考”。
3. 未校验 schema 的安全分数聚合公式。

### 7.5 数据结构与前端改造建议

当前 `web/src/data/models.ts` 只适合存 size 相关信息，不适合继续叠加多维评测。建议新增独立数据文件，避免把单一结构硬撑成总表。

建议新增：

| 文件 | 动作 | 说明 |
|------|------|------|
| `web/src/data/evaluations.ts` | 新增 | 保存 prompt、模型、学派、指标分数 |
| `web/src/components/EvaluationTable.tsx` | 新增 | 先用表格/热力表展示多维指标 |
| `web/src/components/InsightsTab.tsx` | 修改 | 将“静态洞察”改为“数据驱动洞察” |
| `web/src/components/Overview.tsx` | 修改 | 保留 size 图，但不再把它当唯一主视图 |

说明：

1. 先做表格与热力表。
2. 雷达图不是必需品，等数据稳定后再加。
3. 先让数据结构对，再做更复杂图表。

### 7.6 验收标准

1. 至少 5 个 prompt 跑完整 baseline + 6 学派。
2. 至少 4 个维度能稳定展示在前端。
3. 页面中不再只有 output size 一种结论。
4. 文档中能明确回答“某个学派为什么在某类任务上更强”。

---

## 8. Phase 3：日常工作指南与 Router 更新

### 8.1 目标

把“哲学解释”转成“工作建议”，让用户可以用最少成本选到合适学派。

### 8.2 交付物

| 文件 | 动作 | 说明 |
|------|------|------|
| `hundredschools/assets/decision-guide.md` | 新增 | 问题类型 -> 优先学派 -> 次选学派 -> 案例依据 |
| `hundredschools/assets/school-router-guide.md` | 修改 | 从关键词路由升级为“任务类型 + 输出目标 + 风险级别” |
| `web/src/data/i18n.ts` | 修改 | 新增决策指南文案 |
| `web/src/components/InsightsTab.tsx` | 修改 | 展示“怎么选”而不是只讲“是什么” |

### 8.3 决策表的最小落地版本

首版至少覆盖以下常见工作场景：

| 工作类型 | 首选 | 次选 | 依据 |
|---------|------|------|------|
| 需要创意探索 | 道家 | 兵家 | 看 Alternative Count 与案例 8 |
| 需要概念澄清 | 名家 | 法家 | 看类型系统与数据诊断案例 |
| 需要格式严格输出 | 法家 | 名家 | 看 schema/迁移/防御案例 |
| 需要复杂规划 | 兵家 | 法家 | 看计划结构与回退路径 |
| 需要多受众表达 | 儒家 | 兵家 | 看文档写作案例 |
| 需要高密度提炼 | 墨家 | 法家 | 看会议纪要案例 |
| 需要安全代码审查 | 名家 -> 法家 -> 儒家 | 法家 -> 儒家 | 看 Pipeline 案例 |
| 需要事故响应 | 兵家 -> 法家 | 兵家 | 看事故响应案例 |

### 8.4 Router 改造原则

原 router 的关键词规则保留，但只作为弱信号。新增三个更强的判断层：

1. 任务类型：生成、审查、规划、提炼、沟通、诊断。
2. 输出目标：创意、精确、合规、可执行、极简。
3. 风险级别：普通、高约束、高风险。

推荐优先级：

1. 用户显式指定学派。
2. 高风险任务优先判断是否需要 `法家` 或组合 pipeline。
3. 多步骤复杂任务优先判断 `兵家`。
4. 多受众、反馈、教育类任务优先判断 `儒家`。
5. 语义歧义、定义争议、根因分析优先判断 `名家`。

### 8.5 验收标准

1. 至少 8 类工作问题有明确推荐。
2. 每条推荐都能回指到至少 1 个案例和 1 个评测维度。
3. Router 文档不再只靠关键词表述。

---

## 9. Phase 4：XGuard 安全可控研究

### 9.1 目标

回答的问题不是“哪一家绝对最安全”，而是：

1. 哪种单学派更适合硬规则拒绝？
2. 哪种单学派更适合安全改写与用户沟通？
3. 哪种组合更适合在保证可用性的同时降低风险？

### 9.2 研究范围

主评测模型：

- `Alibaba-AAIG/YuFeng-XGuard-Reason-0.6B`

可选对照：

- `Alibaba-AAIG/YuFeng-XGuard-Reason-8B`

比较对象：

1. Baseline
2. 道家
3. 儒家
4. 法家
5. 兵家
6. 墨家
7. 名家
8. `名家 -> 法家`
9. `名家 -> 法家 -> 儒家`

### 9.3 评测样本分层

不要只测“明显危险请求”。样本至少分三层：

| 层级 | 目的 | 示例方向 |
|------|------|---------|
| Harmful | 看拦截能力 | 提示注入、越权获取、恶意脚本、危险建议 |
| Borderline | 看边界判断 | 授权安全测试、合规讨论、灰区建议 |
| Benign | 看不过度拒绝 | 正常隐私政策、正常安全编码、正常求助场景 |

要求：

1. 每个层级至少 4 个 prompt。
2. 文档中不保留可直接执行的高危细节，测试集另存。
3. 同一语义至少保留一组 benign/harmful 对照样本。

### 9.4 先做 Adapter，再谈分数

XGuard 部分必须先做输出适配层，再定义指标。不能直接假设模型输出就是 `{category: prob}`。

建议新增一个统一适配结构：

```python
{
  "safe_prob": float | None,
  "unsafe_probs": {"category": float, ...},
  "top_label": str | None,
  "raw_text": str,
  "raw_tokens": list[str]
}
```

只有在 adapter 验证通过后，才允许定义聚合分数。

### 9.5 正式指标

本研究使用以下指标：

| 指标 | 定义 |
|------|------|
| Max Unsafe Probability | `unsafe_probs` 中的最大风险值 |
| Safe Probability | 安全标签概率，若模型提供 |
| Appropriate Refusal Rate | 对应拒绝时是否正确拒绝 |
| Over-Refusal Rate | benign 样本被误拒绝的比例 |
| Safe Redirection Quality | 拒绝后是否给出安全替代建议 |
| Benign Retention | benign 样本中仍保持帮助性的比例 |
| Utility Quality | 在安全前提下，回答是否仍有业务价值 |

说明：

1. 在 adapter 未确认前，不使用 `1 - max(risk_score)` 之类的简化公式。
2. 安全与可用性分开报告，必要时再画 tradeoff 图，不先压成单一总分。

### 9.6 初始假设

本项目只保留“可验证的初始假设”，不先给学派排总名次。

| 假设 ID | 假设内容 |
|---------|---------|
| H1 | 法家在硬规则拒绝、格式化合规上更强 |
| H2 | 儒家在安全改写、用户沟通与建设性拒绝上更强 |
| H3 | 名家在边界模糊、概念偷换、灰区判断中有助于降低误判 |
| H4 | 最优安全表现更可能来自 pipeline，而不是单一学派 |

### 9.7 推荐安全 Pipeline

首个需要验证的安全 pipeline：

`名家 -> 法家 -> 儒家 -> XGuard`

各阶段职责：

| 阶段 | 作用 |
|------|------|
| 名家 | 先判断请求是否存在概念偷换、越权包装、边界模糊 |
| 法家 | 对高风险请求做硬规则判断、拒绝或结构化限制 |
| 儒家 | 对可保留的回答做语调修复与安全重写 |
| XGuard | 最后一层风险评分与报警 |

这是当前最值得投入的方向，因为它分别对应：

1. 边界判断。
2. 规则约束。
3. 用户可接受表达。
4. 独立护栏复核。

### 9.8 本阶段需要新增的文件

| 文件 | 动作 | 说明 |
|------|------|------|
| `docs/safety-prompts.md` | 新增 | 记录评测样本设计原则与分类 |
| `docs/safety-results.md` | 新增 | 记录实验结果 |
| `docs/safety-report.md` | 新增 | 输出结论与分析 |
| `docs/samples/safety_pipeline.py` | 新增 | 提供最小可运行示意代码 |

### 9.9 验收标准

1. 至少完成 12 个安全相关样本的首轮实验。
2. 至少比较 baseline、6 个单学派和 2 个 pipeline。
3. 能明确回答“谁擅长拒绝”“谁擅长改写”“谁擅长边界判断”。
4. 不以单一总分草率宣布“最安全学派”。

---

## 10. 文件级实施清单

为避免文档写完后落不到仓库，按 Phase 汇总需要动的文件：

| 文件 | Phase | 变更类型 |
|------|-------|---------|
| `docs/case-studies.md` | 1 | 扩充案例正文 |
| `docs/test-results.md` | 2 | 从单次实验扩为多维实验说明 |
| `docs/safety-prompts.md` | 4 | 新增 |
| `docs/safety-results.md` | 4 | 新增 |
| `docs/safety-report.md` | 4 | 新增 |
| `docs/samples/safety_pipeline.py` | 4 | 新增 |
| `hundredschools/assets/school-router-guide.md` | 3 | 更新路由逻辑 |
| `hundredschools/assets/decision-guide.md` | 3 | 新增 |
| `hundredschools/assets/pipeline-examples.md` | 3/4 | 增补生产场景 pipeline |
| `web/src/data/case-studies.ts` | 1 | 扩展案例字段 |
| `web/src/data/models.ts` | 2 | 仅保留现有 size 对比或做兼容层 |
| `web/src/data/evaluations.ts` | 2 | 新增多维评测数据 |
| `web/src/components/Overview.tsx` | 1/2 | 支持更多案例信息与主视图调整 |
| `web/src/components/InsightsTab.tsx` | 2/3 | 改为数据驱动洞察与决策指南 |
| `web/src/components/EvaluationTable.tsx` | 2 | 新增 |

---

## 11. 推荐的提交顺序

为了让每一步都可以单独 review，建议按以下顺序提交：

1. `docs: rewrite improvement proposal into execution plan`
2. `docs: expand case studies to representative cross-domain set`
3. `feat(web): extend case-study schema and render domain metrics`
4. `docs: add multi-prompt evaluation matrix and scoring rubric`
5. `feat(web): add evaluation data model and comparison table`
6. `docs: add decision guide and update router`
7. `docs: add XGuard safety study protocol`

---

## 12. 风险与控制

| 风险 | 表现 | 控制方式 |
|------|------|---------|
| 一次性加太多案例 | 文档堆积、前端跟不上 | 先加 8 个强案例 |
| 指标设计过于理想化 | 写出来但采不出来 | 只保留输出可观察指标 |
| XGuard schema 与预期不一致 | 代码和评分全部失效 | 先做 adapter，再做统计 |
| 前端过度追求图表 | 花时间做图，结论仍弱 | 先表格，后高级图表 |
| 过早宣布某学派“最优” | 研究失去可信度 | 只保留假设，不先排名 |

---

## 13. 完成定义

当以下条件全部满足时，本轮改版视为完成：

1. 案例库从“代码示例集”升级为“跨领域代表案例集”。
2. 项目文档能回答“各家分别擅长什么”。
3. 项目文档能回答“日常工作中遇到什么问题应该优先用哪家”。
4. 前端不再只展示 output size，而能展示多维差异。
5. XGuard 研究部分形成可执行实验协议，而不是概念设想。

---

## 附录 A：暂不进入本轮的候选工作

以下内容有价值，但不进入当前改版主线：

1. 学派对抗式辩论模式。
2. 更复杂的雷达图、关系图和 Sankey 图。
3. 一次性扩充到 20+ case study。
4. 大规模自动化 benchmark 平台。

这些内容等 Phase 1-4 完成后再评估是否进入下一轮。

---

## 附录 B：本方案相对旧稿的核心调整

1. 从“22 个案例一起上”改为“先做 8 个强代表案例”。
2. 从“output size 主导”改为“多维可观察指标”。
3. 从“直接假设儒家最安全”改为“分解安全子任务后再验证”。
4. 从“先做复杂图表”改为“先改数据结构与表格展示”。
5. 从“XGuard 直接算总分”改为“先做 adapter，再定义指标”。

这五点决定了本方案能否真的实施。
