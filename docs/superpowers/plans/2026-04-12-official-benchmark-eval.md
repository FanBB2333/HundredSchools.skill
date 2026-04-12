# Official Benchmark Evaluation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete evaluation pipeline for 4 official benchmarks (SimpleSafetyTests, XSTest, OR-Bench Hard, S-Eval zh) with 7 school conditions, supporting checkpoint/resume for ~20000 API calls.

**Architecture:** Dataset loaders read from local `datasets/` directory and produce unified sample format. Evaluation runner calls remote vLLM API with retry/checkpoint logic, saves results as JSONL in real-time. Analysis script generates metrics and markdown report.

**Tech Stack:** Python 3.10+, openai client, asyncio for concurrency, huggingface_hub for downloads

---

## File Structure

| File | Responsibility |
|------|----------------|
| `datasets/` | Local benchmark data (gitignored) |
| `docs/samples/results/` | Evaluation results (gitignored) |
| `docs/samples/benchmark_loaders.py` | Load 4 datasets, produce unified sample format |
| `docs/samples/run_official_benchmark_eval.py` | API evaluation with checkpoint/resume |
| `docs/samples/analyze_official_benchmark_results.py` | Generate metrics and report |
| `docs/xguard-official-benchmark-report.md` | Final report (generated) |
| `.gitignore` | Ignore datasets/ and results/ |

---

### Task 1: Update .gitignore and Create Directory Structure

**Files:**
- Modify: `.gitignore`
- Create: `datasets/.gitkeep`
- Create: `docs/samples/results/.gitkeep`

- [ ] **Step 1: Update .gitignore**

Add entries for datasets and results directories.

- [ ] **Step 2: Create directory structure**

Run:
```bash
mkdir -p datasets docs/samples/results
touch datasets/.gitkeep docs/samples/results/.gitkeep
```

- [ ] **Step 3: Verify structure**

Run:
```bash
ls -la datasets/ docs/samples/results/
cat .gitignore
```

Expected: Both directories exist with .gitkeep files, .gitignore contains datasets/ and docs/samples/results/

---

### Task 2: Download Benchmark Datasets

**Files:**
- Download to: `datasets/simple_safety_tests/`
- Download to: `datasets/xstest/`
- Download to: `datasets/or_bench/`
- Download to: `datasets/s_eval/`

- [ ] **Step 1: Download SimpleSafetyTests**

Run:
```bash
huggingface-cli download Bertievidgen/SimpleSafetyTests \
  --repo-type dataset \
  --local-dir datasets/simple_safety_tests
```

- [ ] **Step 2: Download XSTest**

Run:
```bash
huggingface-cli download Paul/XSTest \
  --repo-type dataset \
  --local-dir datasets/xstest
```

- [ ] **Step 3: Download OR-Bench Hard**

Run:
```bash
huggingface-cli download bench-llm/or-bench \
  --repo-type dataset \
  --local-dir datasets/or_bench
```

- [ ] **Step 4: Download S-Eval zh small**

Run:
```bash
huggingface-cli download IS2Lab/S-Eval \
  --repo-type dataset \
  --local-dir datasets/s_eval
```

- [ ] **Step 5: Verify downloads**

Run:
```bash
find datasets -maxdepth 2 -type f -name "*.csv" -o -name "*.jsonl" -o -name "*.parquet" 2>/dev/null | head -20
du -sh datasets/*
```

Expected: All 4 datasets downloaded with data files visible

---

### Task 3: Implement Benchmark Loaders

**Files:**
- Create: `docs/samples/benchmark_loaders.py`

- [ ] **Step 1: Create benchmark_loaders.py with unified sample structure**

The loader should:
1. Load each dataset from local files
2. Map to unified format: `{dataset, sample_id, prompt, expected_binary, group, risk_type, metadata}`
3. Provide `--summary` CLI for verification

- [ ] **Step 2: Test loaders**

Run:
```bash
python docs/samples/benchmark_loaders.py --summary
```

Expected:
```
SimpleSafetyTests: 100 samples, 100 unsafe
XSTest: 450 samples, 250 safe / 200 unsafe
OR-Bench Hard: ~1319 samples, all safe
S-Eval zh small: ~1000 samples, all unsafe
```

---

### Task 4: Implement Evaluation Runner with Checkpoint/Resume

**Files:**
- Create: `docs/samples/run_official_benchmark_eval.py`

- [ ] **Step 1: Implement core evaluation runner**

Features:
1. Load completed keys from JSONL on startup
2. Skip already-completed (dataset, sample_id, condition) tuples
3. Save each result immediately after completion (append to JSONL)
4. Update checkpoint file periodically
5. Support --resume, --force-restart, --status, --sample-limit flags
6. Configurable concurrency and timeout

- [ ] **Step 2: Test with smoke test**

Run:
```bash
python docs/samples/run_official_benchmark_eval.py \
  --datasets simple_safety_tests \
  --conditions baseline legal \
  --sample-limit 5 \
  --output docs/samples/results/smoke_test.jsonl
```

Expected: Creates JSONL with 10 records (5 samples x 2 conditions)

---

### Task 5: Implement Results Analysis Script

**Files:**
- Create: `docs/samples/analyze_official_benchmark_results.py`

- [ ] **Step 1: Implement analysis script**

Features:
1. Load JSONL results
2. Calculate per-dataset, per-condition metrics:
   - safe_accuracy (for datasets expecting safe)
   - unsafe_recall (for datasets expecting unsafe)
   - false_refusal_rate
3. Generate comparison tables
4. Output markdown report

- [ ] **Step 2: Test analysis**

Run:
```bash
python docs/samples/analyze_official_benchmark_results.py \
  --input docs/samples/results/smoke_test.jsonl \
  --output docs/samples/results/smoke_test_report.md
```

Expected: Generates markdown report with metrics tables

---

### Task 6: Full Evaluation Run

- [ ] **Step 1: Run full evaluation with resume support**

Run:
```bash
python docs/samples/run_official_benchmark_eval.py --resume
```

- [ ] **Step 2: Generate final report**

Run:
```bash
python docs/samples/analyze_official_benchmark_results.py \
  --input docs/samples/results/official_benchmark_results.jsonl \
  --output docs/xguard-official-benchmark-report.md
```

---

## Execution Notes

- Remote API: `http://100.71.234.15:8000/v1`
- Model: `YuFeng-XGuard-Reason-0.6B`
- Total API calls: ~20083 (2869 samples x 7 conditions)
- Checkpoint saves every 100 completions
- JSONL format allows safe interruption at any point
