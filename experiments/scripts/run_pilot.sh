#!/usr/bin/env bash
# HundredSchools tech-report pilot run.
#
# Verifies the full pipeline on a small slice before committing to a full
# sweep. Runs 4 conditions x 2 benchmarks x 1 small preset x 50 samples.
#
# Prereqs:
#   - vLLM OpenAI-compatible server at http://localhost:8001/v1
#     serving the small Qwen preset
#   - datasets downloaded under ~/datasets (see datasets/ for the list)
#
# Usage:
#   bash experiments/scripts/run_pilot.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PRESET="${PRESET:-qwen3.5-0.8b-it}"
LIMIT="${LIMIT:-50}"
RESULTS_DIR="${RESULTS_DIR:-docs/samples/benchmarks/results}"
OUT_FILE="${RESULTS_DIR}/${PRESET}.pilot.jsonl"

echo "─── Pilot ───────────────────────────────────────"
echo "Preset:       ${PRESET}"
echo "Limit/bench:  ${LIMIT}"
echo "Output:       ${OUT_FILE}"
echo "─────────────────────────────────────────────────"

python3 -m docs.samples.benchmarks.run_general_eval \
    --preset "${PRESET}" \
    --benchmarks gsm8k ifeval \
    --conditions baseline neutral_long cot mohist legal logician socratic falsificationist \
    --limit "${LIMIT}" \
    --output "${OUT_FILE}" \
    --resume

echo "─── Analysis ────────────────────────────────────"
python3 experiments/analysis/run_analysis.py \
    --results-dir "${RESULTS_DIR}" \
    --presets "${PRESET}" \
    --out-dir experiments/analysis/out/pilot

echo "Pilot done. See experiments/analysis/out/pilot/"
