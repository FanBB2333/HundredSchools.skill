#!/usr/bin/env python3
"""Top-level analysis driver for the HundredSchools tech report.

Reads benchmark results JSONL produced by
docs/samples/benchmarks/run_general_eval.py and produces:

    - L1 (length) and L2 (marker recall) tables per (preset, school)
    - L3 pairwise distance matrix per preset
    - L4 cross-size identity per school
    - L5 task accuracy table (preset × condition × benchmark)
    - L6 overuse trigger rate per school
    - H1–H4 hypothesis test report (markdown)

Outputs go to `experiments/analysis/out/`. Figures are produced only
when matplotlib is installed; otherwise CSVs are produced.

Usage
-----
    python experiments/analysis/run_analysis.py \\
        --results-dir docs/samples/benchmarks/results \\
        --out-dir experiments/analysis/out

This script is intentionally pandas-friendly but does not require
pandas — falls back to stdlib csv.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import statistics
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT))

from experiments.markers import SCHOOL_IDS  # noqa: E402
from experiments.metrics import (  # noqa: E402
    length_ratio,
    marker_recall,
    overuse_trigger_rate,
)
from experiments.analysis.load_records import load_all, filter_records  # noqa: E402


SCHOOLS_AND_BASELINES = ["baseline", "neutral_long", "cot", *SCHOOL_IDS]


def baseline_text_lookup(records: list[dict]) -> dict[tuple[str, str, str], str]:
    """For each (preset, benchmark, sample_id), record the vanilla baseline output."""
    out: dict[tuple[str, str, str], str] = {}
    for rec in records:
        if rec.get("resolved_condition") == "baseline" or rec.get("condition") == "baseline":
            key = (rec["preset"], rec["benchmark"], rec["sample_id"])
            out[key] = rec.get("raw_output") or ""
    return out


def compute_per_record(records: list[dict]) -> list[dict]:
    """Augment each record with L1, L2 (for its own school), L6."""
    bases = baseline_text_lookup(records)
    out = []
    for rec in records:
        cond = rec.get("resolved_condition", rec.get("condition"))
        text = rec.get("raw_output") or ""
        base = bases.get((rec["preset"], rec["benchmark"], rec["sample_id"]))
        rec_a = dict(rec)
        rec_a["L1_length_ratio"] = length_ratio(text, base)
        if cond in SCHOOL_IDS:
            rec_a["L2_marker_recall"] = marker_recall(text, cond, base)
            rec_a["L6_overuse_rate"] = overuse_trigger_rate(text, cond)
        else:
            rec_a["L2_marker_recall"] = None
            rec_a["L6_overuse_rate"] = None
        out.append(rec_a)
    return out


def aggregate(records: list[dict], by: list[str], value: str) -> dict[tuple, float]:
    groups: dict[tuple, list[float]] = defaultdict(list)
    for rec in records:
        v = rec.get(value)
        if v is None:
            continue
        try:
            v = float(v)
        except (TypeError, ValueError):
            continue
        if math.isnan(v):
            continue
        key = tuple(rec.get(k) for k in by)
        groups[key].append(v)
    return {k: statistics.fmean(vs) for k, vs in groups.items()}


def write_csv(rows: list[dict], path: Path, fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)


def write_l1_l2_l6_table(records: list[dict], out_dir: Path) -> None:
    rows = []
    pairs = sorted({(r["preset"], r.get("resolved_condition", r.get("condition")))
                    for r in records})
    for preset, cond in pairs:
        ls = [r["L1_length_ratio"] for r in records
              if r["preset"] == preset
              and r.get("resolved_condition", r.get("condition")) == cond
              and r["L1_length_ratio"] is not None]
        l2s = [r["L2_marker_recall"] for r in records
               if r["preset"] == preset
               and r.get("resolved_condition", r.get("condition")) == cond
               and r["L2_marker_recall"] is not None]
        l6s = [r["L6_overuse_rate"] for r in records
               if r["preset"] == preset
               and r.get("resolved_condition", r.get("condition")) == cond
               and r["L6_overuse_rate"] is not None]
        rows.append({
            "preset": preset,
            "condition": cond,
            "n": len(ls),
            "L1_mean": round(statistics.fmean(ls), 4) if ls else None,
            "L2_mean": round(statistics.fmean(l2s), 4) if l2s else None,
            "L6_mean": round(statistics.fmean(l6s), 4) if l6s else None,
        })
    write_csv(rows, out_dir / "l1_l2_l6_summary.csv",
              ["preset", "condition", "n", "L1_mean", "L2_mean", "L6_mean"])


def write_l5_accuracy_table(records: list[dict], out_dir: Path) -> None:
    rows = []
    for (preset, cond, bench), n_correct in _accuracy_groups(records).items():
        n, c = n_correct
        rows.append({
            "preset": preset,
            "condition": cond,
            "benchmark": bench,
            "n": n,
            "correct": c,
            "accuracy": round(c / max(n, 1), 4),
        })
    rows.sort(key=lambda r: (r["preset"], r["benchmark"], r["condition"]))
    write_csv(rows, out_dir / "l5_accuracy.csv",
              ["preset", "condition", "benchmark", "n", "correct", "accuracy"])


def _accuracy_groups(records: list[dict]) -> dict[tuple[str, str, str], tuple[int, int]]:
    g: dict[tuple[str, str, str], list[int]] = defaultdict(lambda: [0, 0])
    for rec in records:
        cond = rec.get("resolved_condition", rec.get("condition"))
        key = (rec["preset"], cond, rec["benchmark"])
        score = rec.get("score") or {}
        if score.get("scorer_error"):
            continue
        g[key][0] += 1
        if score.get("correct"):
            g[key][1] += 1
    return {k: (v[0], v[1]) for k, v in g.items()}


def write_l3_distance_matrix(records: list[dict], out_dir: Path, presets: list[str]) -> None:
    """Write per-preset L3 cosine-distance matrix as CSV.

    Skipped silently if neither sentence-transformers nor scikit-learn
    is installed.
    """
    try:
        from experiments.metrics.l3_pairwise_distance import pairwise_distance_matrix
        for preset in presets:
            preset_records = [r for r in records if r["preset"] == preset]
            if not preset_records:
                continue
            schools = SCHOOL_IDS
            dist, counts = pairwise_distance_matrix(
                preset_records, schools,
                output_field="raw_output",
                school_field="resolved_condition",
            )
            rows = [{"school": s, "n": counts.get(s, 0),
                     **{t: round(dist.get((s, t), float("nan")), 4) for t in schools}}
                    for s in schools]
            write_csv(rows, out_dir / f"l3_distance_{preset}.csv",
                      ["school", "n", *schools])
    except Exception as e:
        (out_dir / "l3_skipped.txt").write_text(f"L3 skipped: {e}\n")


def write_l4_cross_size_identity(records: list[dict], out_dir: Path,
                                 small: str, large: str) -> None:
    try:
        from experiments.metrics.l4_cross_size_identity import cross_size_identity
        identity, counts = cross_size_identity(
            records, SCHOOL_IDS, small_preset=small, large_preset=large,
        )
        rows = [{"school": s,
                 "n_small": counts.get(s, (0, 0))[0],
                 "n_large": counts.get(s, (0, 0))[1],
                 "identity_cosine": round(identity[s], 4) if s in identity else None}
                for s in SCHOOL_IDS]
        write_csv(rows, out_dir / f"l4_identity_{small}_vs_{large}.csv",
                  ["school", "n_small", "n_large", "identity_cosine"])
    except Exception as e:
        (out_dir / "l4_skipped.txt").write_text(f"L4 skipped: {e}\n")


def hypothesis_report(records: list[dict], out_dir: Path) -> None:
    """Sketch H1–H4 verdicts. Currently writes summary stats only;
    reviewer-facing significance tests (paired t-test, Bonferroni)
    are produced by `analysis.ipynb` from the same CSVs."""
    out_lines = ["# Hypothesis Verdict Sketch", ""]

    # H1: requires L3 to have run
    l3_files = list(out_dir.glob("l3_distance_*.csv"))
    if l3_files:
        out_lines.append(f"- H1 inputs available: {len(l3_files)} preset(s) — see l3_distance_*.csv")
    else:
        out_lines.append("- H1 inputs missing — install sentence-transformers or scikit-learn")

    # H2a: marker recall vs preset size
    l1l2 = list(out_dir.glob("l1_l2_l6_summary.csv"))
    if l1l2:
        out_lines.append("- H2a inputs available — see l1_l2_l6_summary.csv")
    # H2b
    l4_files = list(out_dir.glob("l4_identity_*.csv"))
    if l4_files:
        out_lines.append(f"- H2b inputs available: {len(l4_files)} pair(s) — see l4_identity_*.csv")

    # H3: per-task winning school
    accs_path = out_dir / "l5_accuracy.csv"
    if accs_path.exists():
        out_lines.append("- H3 inputs available — see l5_accuracy.csv")

    out_lines.append("")
    out_lines.append("Detailed paired t-tests / Cohen's d / Bonferroni "
                     "are computed in analysis.ipynb from the CSVs above.")
    (out_dir / "hypothesis_sketch.md").write_text("\n".join(out_lines), encoding="utf-8")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--results-dir",
                   default=str(REPO_ROOT / "docs/samples/benchmarks/results"),
                   type=Path)
    p.add_argument("--out-dir",
                   default=str(REPO_ROOT / "experiments/analysis/out"),
                   type=Path)
    p.add_argument("--small-preset", default="qwen3.5-0.8b-it",
                   help="smallest preset for L4 cross-size identity")
    p.add_argument("--large-preset", default="qwen3.5-9b-it",
                   help="largest preset for L4 cross-size identity")
    p.add_argument("--presets", nargs="+", default=None,
                   help="restrict analysis to these presets")
    args = p.parse_args()

    print(f"Loading records from {args.results_dir}")
    records = load_all(args.results_dir)
    print(f"Loaded {len(records)} non-error records")
    if args.presets:
        records = list(filter_records(records, presets=args.presets))
        print(f"Filtered to {len(records)} records by --presets")

    print("Computing per-record L1, L2, L6 ...")
    records_aug = compute_per_record(records)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    print("Writing tables ...")
    write_l1_l2_l6_table(records_aug, args.out_dir)
    write_l5_accuracy_table(records_aug, args.out_dir)

    presets_present = sorted({r["preset"] for r in records_aug})
    write_l3_distance_matrix(records_aug, args.out_dir, presets_present)
    if args.small_preset in presets_present and args.large_preset in presets_present:
        write_l4_cross_size_identity(records_aug, args.out_dir,
                                     args.small_preset, args.large_preset)
    else:
        (args.out_dir / "l4_skipped.txt").write_text(
            f"L4 skipped: small={args.small_preset} large={args.large_preset} "
            f"presets_present={presets_present}\n"
        )

    hypothesis_report(records_aug, args.out_dir)
    print(f"Done. Outputs in {args.out_dir}")


if __name__ == "__main__":
    main()
