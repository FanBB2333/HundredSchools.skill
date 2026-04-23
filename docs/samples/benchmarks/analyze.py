#!/usr/bin/env python3
"""Aggregate JSONL results -> per-(model,benchmark,condition) accuracy +
delta tables vs baseline / neutral_long.

Usage:
    python analyze.py --inputs results/*.jsonl --out-dir results
"""
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path


def load_jsonl(paths):
    rows = []
    for p in paths:
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return rows


def aggregate(rows):
    # key: (preset, benchmark, condition) -> [n, correct, errs]
    agg = defaultdict(lambda: {"n": 0, "correct": 0, "err": 0,
                               "loose_p": 0, "strict_p": 0,
                               "strict_inst_total": 0, "strict_inst_correct": 0,
                               "loose_inst_total": 0, "loose_inst_correct": 0})
    for r in rows:
        key = (r["preset"], r["benchmark"], r["condition"])
        a = agg[key]
        a["n"] += 1
        sc = r.get("score") or {}
        if sc.get("correct"):
            a["correct"] += 1
        if r.get("error"):
            a["err"] += 1
        if r["benchmark"] == "ifeval":
            a["strict_p"] += int(sc.get("strict_prompt", False))
            a["loose_p"] += int(sc.get("loose_prompt", False))
            a["strict_inst_total"] += sc.get("strict_inst_total", 0)
            a["strict_inst_correct"] += sc.get("strict_inst_correct", 0)
            a["loose_inst_total"] += sc.get("loose_inst_total", 0)
            a["loose_inst_correct"] += sc.get("loose_inst_correct", 0)
    # finalize
    out = []
    for (preset, bench, cond), a in agg.items():
        n = a["n"]
        rec = {
            "preset": preset, "benchmark": bench, "condition": cond,
            "n": n, "err": a["err"],
            "acc": a["correct"] / n if n else 0.0,
        }
        if bench == "ifeval":
            rec["strict_prompt"] = a["strict_p"] / n if n else 0.0
            rec["loose_prompt"] = a["loose_p"] / n if n else 0.0
            rec["strict_inst"] = (a["strict_inst_correct"] / a["strict_inst_total"]) if a["strict_inst_total"] else 0.0
            rec["loose_inst"] = (a["loose_inst_correct"] / a["loose_inst_total"]) if a["loose_inst_total"] else 0.0
        out.append(rec)
    return out


CONDITION_ORDER = ["baseline", "neutral_long", "dao", "confucian", "legal",
                   "military", "mohist", "logician"]


def render_md(records):
    by_pb = defaultdict(dict)
    for r in records:
        by_pb[(r["preset"], r["benchmark"])][r["condition"]] = r

    lines = ["# General-capability benchmark summary\n"]
    presets = sorted({r["preset"] for r in records})
    benches = sorted({r["benchmark"] for r in records})

    for preset in presets:
        lines.append(f"## Preset: `{preset}`\n")
        for bench in benches:
            tbl = by_pb.get((preset, bench), {})
            if not tbl:
                continue
            lines.append(f"### {bench}\n")
            base = tbl.get("baseline", {}).get("acc", 0.0)
            neut = tbl.get("neutral_long", {}).get("acc", 0.0)
            cols = ["condition", "n", "err", "acc", "Δ vs baseline", "Δ vs neutral_long"]
            if bench == "ifeval":
                cols += ["strict_prompt", "loose_prompt", "strict_inst", "loose_inst"]
            lines.append("| " + " | ".join(cols) + " |")
            lines.append("|" + "|".join(["---"] * len(cols)) + "|")
            for cond in CONDITION_ORDER:
                if cond not in tbl:
                    continue
                r = tbl[cond]
                row = [cond, str(r["n"]), str(r["err"]),
                       f"{r['acc']*100:.2f}",
                       f"{(r['acc']-base)*100:+.2f}",
                       f"{(r['acc']-neut)*100:+.2f}"]
                if bench == "ifeval":
                    row += [f"{r['strict_prompt']*100:.2f}",
                            f"{r['loose_prompt']*100:.2f}",
                            f"{r['strict_inst']*100:.2f}",
                            f"{r['loose_inst']*100:.2f}"]
                lines.append("| " + " | ".join(row) + " |")
            lines.append("")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inputs", nargs="+", required=True, type=Path)
    ap.add_argument("--out-dir", type=Path, required=True)
    args = ap.parse_args()
    args.out_dir.mkdir(parents=True, exist_ok=True)
    rows = load_jsonl(args.inputs)
    records = aggregate(rows)
    md = render_md(records)
    (args.out_dir / "summary.md").write_text(md, encoding="utf-8")
    with open(args.out_dir / "summary.json", "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"Wrote {args.out_dir/'summary.md'} and summary.json ({len(records)} cells, {len(rows)} raw rows)")


if __name__ == "__main__":
    main()
