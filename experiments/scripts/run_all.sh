#!/usr/bin/env bash
# HundredSchools tech-report full sweep.
#
# 6 sizes x 19 conditions x 8 benchmarks. Streams results JSONL with
# checkpoint/resume. Re-running picks up where the previous run stopped.
#
# Prereqs:
#   - vLLM OpenAI-compatible server reachable at the api_base configured
#     in docs/samples/benchmarks/models.py for each preset
#   - datasets downloaded under ~/datasets
#
# Override knobs via env vars:
#   PRESETS    space-separated preset list
#   BENCHMARKS space-separated benchmark list
#   CONDITIONS space-separated condition list
#   LIMIT      samples per benchmark (default 200; HumanEval 164 cap applied internally)
#
# Usage:
#   bash experiments/scripts/run_all.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

DEFAULT_PRESETS="qwen3.5-0.8b-it qwen3.5-2b-it qwen3.5-4b-it qwen3.5-9b-it qwen3.5-27b-it"
DEFAULT_BENCHMARKS="gsm8k ifeval mmlu bbh humaneval truthfulqa"
DEFAULT_CONDITIONS=" \
    baseline neutral_long cot \
    dao confucian legal military mohist logician \
    socratic stoic falsificationist hegelian pragmatist yangming bacon wittgenstein \
    random_school"

PRESETS="${PRESETS:-$DEFAULT_PRESETS}"
BENCHMARKS="${BENCHMARKS:-$DEFAULT_BENCHMARKS}"
CONDITIONS="${CONDITIONS:-$DEFAULT_CONDITIONS}"
LIMIT="${LIMIT:-200}"
RESULTS_DIR="${RESULTS_DIR:-docs/samples/benchmarks/results}"

mkdir -p "${RESULTS_DIR}"

echo "═══ HundredSchools full sweep ═══════════════════════"
echo "Presets:    ${PRESETS}"
echo "Benchmarks: ${BENCHMARKS}"
echo "Conditions: ${CONDITIONS}"
echo "Limit:      ${LIMIT}"
echo "Results:    ${RESULTS_DIR}"
echo "═════════════════════════════════════════════════════"

for preset in ${PRESETS}; do
    out="${RESULTS_DIR}/${preset}.jsonl"
    echo "── Running ${preset} ───────────────────────────────"
    python3 -m docs.samples.benchmarks.run_general_eval \
        --preset "${preset}" \
        --benchmarks ${BENCHMARKS} \
        --conditions ${CONDITIONS} \
        --limit "${LIMIT}" \
        --output "${out}" \
        --resume
done

echo "═══ Analysis ═══════════════════════════════════════"
python3 experiments/analysis/run_analysis.py \
    --results-dir "${RESULTS_DIR}" \
    --out-dir experiments/analysis/out/full

echo "═══ Done ═══════════════════════════════════════════"
echo "Tables under experiments/analysis/out/full/"
