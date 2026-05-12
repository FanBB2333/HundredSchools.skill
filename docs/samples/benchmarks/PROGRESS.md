# HundredSchools 评测进展报告

**更新时间**: 2026-05-12 (最终版)

## 一、总体进展

| 模型 | 已完成组合 | 总计记录 | 进度 |
|------|-----------|---------|------|
| Qwen3.5-0.8B | 114/114 | 444,486 条 | ✅ 100% |
| Qwen3.5-2B | 114/114 | 444,486 条 | ✅ 100% |
| Qwen3.5-4B | 114/114 | 444,486 条 | ✅ 100% |
| Qwen3.5-9B | 114/114 | 444,486 条 | ✅ 100% |
| Qwen3.5-27B | 114/114 | 444,486 条 | ✅ 100% |

**组合定义**: 19 conditions × 6 benchmarks = 114 combos/model  
**总计**: 570 实验单元, 2,222,430 条记录

## 二、评测矩阵

### Conditions (19个)
- **基线 (3)**: baseline, neutral_long, cot
- **先秦核心 (6)**: dao, confucian, legal, military, mohist, logician
- **后续补充 (8)**: socratic, stoic, falsificationist, hegelian, pragmatist, yangming, bacon, wittgenstein
- **元条件 (2)**: random_school, router_auto

### Benchmarks (6个)
| Benchmark | 样本量 | max_tokens | 说明 |
|-----------|--------|-----------|------|
| MMLU | 14,042 | 16 | 多选题知识评估 |
| BBH | 6,511 | 512 | BigBench Hard 推理 |
| GSM8K | 1,319 | 1,024 | 数学推理 |
| TruthfulQA | 817 | 16 | 事实性多选 |
| IFEval | 541 | 1,280 | 指令遵从 |
| HumanEval | 164 | 768 | 代码生成 |

## 三、完成时间线

| 阶段 | 日期 | 内容 |
|------|------|------|
| Phase 1 | 2026-04-28 | 8 conditions × 6 benchmarks × 5 models (先秦学派) |
| Phase 2 | 2026-05-10 | 10 remaining conditions × 6 benchmarks × 5 models (后续学派) |
| Phase 3 | 2026-05-12 | router_auto × 6 benchmarks × 5 models |
| 数据修正 | 2026-05-12 | 4B/9B/27B router_auto 重跑 (修复 thinking mode) |

## 四、系统架构

### 推理服务
- **vLLM 0.19.1** + torch env (`/root/miniforge3/envs/torch/`)
- 8× NVIDIA GPU (48GB each)
- 27B 模型: TP=2 (2 GPU/实例)
- 4B/9B 模型: TP=1 (1 GPU/实例)

### 关键配置
```bash
# Qwen3.5 4B+ 必须禁用 thinking mode
--default-chat-template-kwargs '{"enable_thinking": false}'
```

### 关键文件
```
docs/samples/benchmarks/
  ├── run_general_eval.py       # 异步评测 runner (支持 resume)
  ├── models.py                 # 模型配置注册
  ├── conditions.py             # 19 conditions 定义
  ├── router.py                 # 任务感知路由规则
  ├── loaders/                  # 各 benchmark 数据加载器
  ├── scorers/                  # 各 benchmark 评分器
  ├── results/
  │   ├── summary.json          # 570 行聚合结果
  │   └── full/                 # 评测结果 (JSONL per model)
  └── ANALYSIS.md               # 详细分析报告
experiments/analysis/
  ├── run_analysis.py           # L1-L6 指标分析
  └── out/full/                 # 分析输出 (CSV + hypothesis sketch)
```

## 五、已知问题与修正

1. **Thinking Mode**: Qwen3.5 4B+ 默认启用 thinking mode，必须通过 chat template kwargs 禁用
2. **并行去重**: 多 worker 使用 --resume 会产生重复，需 (preset, benchmark, condition, sample_id) 键去重
3. **27B TruthfulQA baseline=0%**: 27B 在 TruthfulQA baseline 上输出格式异常，需进一步调查
4. **GPU 孤儿进程**: Docker 内 kill vLLM 进程后 GPU 内存不释放，需从 host 端处理

## 六、主要发现

详见 [ANALYSIS.md](./ANALYSIS.md)。核心结论：

- **router_auto 平均 +7.69pp vs baseline** (4/6 评测集排名第一)
- 先秦学派因轻量级 prompt 在短格式任务上有效
- 任务感知路由 > 任何单一学派 > baseline
