"""Load benchmark JSONL records into memory for analysis.

Records come from the existing runner at
`docs/samples/benchmarks/run_general_eval.py`, which streams one JSON
object per (preset, benchmark, condition, sample_id) call into a
JSONL file under `docs/samples/benchmarks/results/<preset>.jsonl`.

We canonicalize the field names used by the analysis pipeline.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, Iterator, Sequence


def iter_records(jsonl_paths: Sequence[Path]) -> Iterator[dict]:
    for p in jsonl_paths:
        if not p.exists():
            continue
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                # Skip error rows from analysis (but keep for transparency)
                if rec.get("error"):
                    continue
                yield rec


def load_all(results_dir: Path) -> list[dict]:
    """Load all *.jsonl from a results directory."""
    paths = sorted(results_dir.glob("*.jsonl"))
    return list(iter_records(paths))


def filter_records(
    records: Iterable[dict],
    presets: Sequence[str] | None = None,
    benchmarks: Sequence[str] | None = None,
    conditions: Sequence[str] | None = None,
) -> Iterator[dict]:
    for rec in records:
        if presets and rec.get("preset") not in presets:
            continue
        if benchmarks and rec.get("benchmark") not in benchmarks:
            continue
        if conditions and rec.get("resolved_condition", rec.get("condition")) not in conditions:
            continue
        yield rec
