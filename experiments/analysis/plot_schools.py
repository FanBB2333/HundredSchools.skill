#!/usr/bin/env python3
"""Generate school-effect plots from results/summary.json.

Reads `docs/samples/benchmarks/results/summary.json`, derives Δ vs baseline
per (preset, benchmark, condition), and emits five figures under
`docs/figures/`:

  1. heatmap_delta_pooled.png    — pooled (preset-averaged) Δ heatmap
  2. heatmap_delta_per_preset.png — one Δ heatmap per preset (faceted)
  3. scaling_curves.png          — accuracy vs model size per school, per benchmark
  4. school_strength_bar.png     — best-benchmark Δ per school
  5. school_radar.png            — normalized radar across benchmarks

Plus a tidy CSV at `experiments/analysis/out/tidy.csv` for downstream use.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
SUMMARY = ROOT / "docs/samples/benchmarks/results/summary.json"
FIG_DIR = ROOT / "docs/figures"
OUT_DIR = ROOT / "experiments/analysis/out"
FIG_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCHOOLS = ["dao", "confucian", "legal", "military", "mohist", "logician"]
SCHOOL_LABELS = {
    "dao": "Dao",
    "confucian": "Confucian",
    "legal": "Legalist",
    "military": "Military",
    "mohist": "Mohist",
    "logician": "Logician",
}
BENCH_ORDER = ["mmlu", "bbh", "gsm8k", "truthfulqa", "ifeval", "humaneval"]
BENCH_LABELS = {
    "mmlu": "MMLU\n(knowledge)",
    "bbh": "BBH\n(reasoning)",
    "gsm8k": "GSM8K\n(math)",
    "truthfulqa": "TruthfulQA\n(honesty)",
    "ifeval": "IFEval\n(instruction)",
    "humaneval": "HumanEval\n(code)",
}
PRESET_ORDER = [
    "qwen3.5-0.8b-it",
    "qwen3.5-2b-it",
    "qwen3.5-4b-it",
    "qwen3.5-9b-it",
    "qwen3.5-27b-it",
    "gemma4-e2b-it",
]
PRESET_SIZE = {
    "qwen3.5-0.8b-it": 0.8,
    "qwen3.5-2b-it": 2.0,
    "qwen3.5-4b-it": 4.0,
    "qwen3.5-9b-it": 9.0,
    "qwen3.5-27b-it": 27.0,
}


def load() -> pd.DataFrame:
    with SUMMARY.open() as fh:
        rows = json.load(fh)
    df = pd.DataFrame(rows)
    df["acc"] = df["acc"] * 100.0
    return df


def add_delta(df: pd.DataFrame) -> pd.DataFrame:
    base = (
        df[df.condition == "baseline"]
        .rename(columns={"acc": "base_acc"})[["preset", "benchmark", "base_acc"]]
    )
    out = df.merge(base, on=["preset", "benchmark"], how="left")
    out["delta"] = out["acc"] - out["base_acc"]
    return out


def heatmap(ax, mat, row_labels, col_labels, *, title, vmax=None, fmt="{:+.1f}"):
    if vmax is None:
        vmax = float(np.nanmax(np.abs(mat))) or 1.0
    im = ax.imshow(mat, cmap="RdBu_r", vmin=-vmax, vmax=vmax, aspect="auto")
    ax.set_xticks(range(len(col_labels)))
    ax.set_xticklabels(col_labels, rotation=0, fontsize=9)
    ax.set_yticks(range(len(row_labels)))
    ax.set_yticklabels(row_labels, fontsize=10)
    for i in range(mat.shape[0]):
        for j in range(mat.shape[1]):
            v = mat[i, j]
            if np.isnan(v):
                txt = "—"
            else:
                txt = fmt.format(v)
            color = "white" if abs(v) > vmax * 0.55 else "black"
            ax.text(j, i, txt, ha="center", va="center", fontsize=8, color=color)
    ax.set_title(title, fontsize=11)
    return im


def fig_pooled_heatmap(df: pd.DataFrame) -> Path:
    sub = df[df.condition.isin(SCHOOLS)]
    pooled = (
        sub.groupby(["condition", "benchmark"])["delta"].mean().reset_index()
    )
    mat = (
        pooled.pivot(index="condition", columns="benchmark", values="delta")
        .reindex(index=SCHOOLS, columns=BENCH_ORDER)
        .to_numpy()
    )
    fig, ax = plt.subplots(figsize=(8.5, 4.2))
    im = heatmap(
        ax,
        mat,
        [SCHOOL_LABELS[s] for s in SCHOOLS],
        [BENCH_LABELS[b] for b in BENCH_ORDER],
        title="Δ accuracy vs baseline, pooled across model sizes (percentage points)",
    )
    cbar = fig.colorbar(im, ax=ax, shrink=0.85)
    cbar.set_label("Δ pp")
    fig.tight_layout()
    path = FIG_DIR / "01_heatmap_delta_pooled.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def fig_per_preset_heatmap(df: pd.DataFrame) -> Path:
    presets = [p for p in PRESET_ORDER if p in df.preset.unique() and p.startswith("qwen")]
    fig, axes = plt.subplots(1, len(presets), figsize=(4.4 * len(presets), 4.6), sharey=True)
    if len(presets) == 1:
        axes = [axes]
    vmax_global = 0.0
    mats = []
    for p in presets:
        sub = df[(df.preset == p) & df.condition.isin(SCHOOLS)]
        mat = (
            sub.pivot(index="condition", columns="benchmark", values="delta")
            .reindex(index=SCHOOLS, columns=BENCH_ORDER)
            .to_numpy()
        )
        mats.append((p, mat))
        if mat.size:
            vmax_global = max(vmax_global, float(np.nanmax(np.abs(mat))))
    for ax, (p, mat) in zip(axes, mats):
        heatmap(
            ax,
            mat,
            [SCHOOL_LABELS[s] for s in SCHOOLS],
            [b.upper() for b in BENCH_ORDER],
            title=p,
            vmax=vmax_global,
        )
    fig.suptitle("Δ accuracy vs baseline per model size (pp)", fontsize=13)
    fig.tight_layout()
    path = FIG_DIR / "02_heatmap_delta_per_preset.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def fig_scaling(df: pd.DataFrame) -> Path:
    qwen = df[df.preset.str.startswith("qwen3.5") & df.preset.isin(PRESET_SIZE)].copy()
    qwen["size"] = qwen.preset.map(PRESET_SIZE)
    benches = BENCH_ORDER
    fig, axes = plt.subplots(2, 3, figsize=(13, 7.5), sharex=True)
    axes = axes.flatten()
    colors = plt.cm.tab10(np.linspace(0, 1, len(SCHOOLS) + 2))
    for ax, bench in zip(axes, benches):
        sub = qwen[qwen.benchmark == bench]
        if sub.empty:
            ax.set_visible(False)
            continue
        for c, color in zip(["baseline"] + SCHOOLS, colors):
            line = sub[sub.condition == c].sort_values("size")
            if line.empty:
                continue
            style = dict(marker="o", linewidth=2.0 if c == "baseline" else 1.3)
            if c == "baseline":
                style.update(color="black", linestyle="--", linewidth=2.0, label="baseline")
            else:
                style.update(color=color, label=SCHOOL_LABELS[c])
            ax.plot(line["size"], line["acc"], **style)
        ax.set_xscale("log")
        ax.set_xticks([0.8, 2, 4, 9])
        ax.set_xticklabels(["0.8B", "2B", "4B", "9B"])
        ax.grid(True, alpha=0.3)
        ax.set_title(BENCH_LABELS[bench].replace("\n", " — "))
        ax.set_ylabel("Accuracy (%)")
    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, loc="lower center", ncol=4, frameon=False, fontsize=9, bbox_to_anchor=(0.5, -0.02))
    fig.suptitle("Accuracy vs model size, by school (Qwen3.5 family)", fontsize=13)
    fig.tight_layout(rect=[0, 0.04, 1, 0.97])
    path = FIG_DIR / "03_scaling_curves.png"
    fig.savefig(path, dpi=160, bbox_inches="tight")
    plt.close(fig)
    return path


def fig_school_strength(df: pd.DataFrame) -> Path:
    sub = df[df.condition.isin(SCHOOLS)]
    pooled = sub.groupby(["condition", "benchmark"])["delta"].mean().reset_index()
    fig, ax = plt.subplots(figsize=(10, 5.5))
    x = np.arange(len(SCHOOLS))
    width = 0.12
    cmap = plt.cm.viridis(np.linspace(0.1, 0.9, len(BENCH_ORDER)))
    for i, bench in enumerate(BENCH_ORDER):
        vals = [
            pooled[(pooled.condition == s) & (pooled.benchmark == bench)]["delta"].mean()
            for s in SCHOOLS
        ]
        ax.bar(
            x + (i - 2.5) * width,
            vals,
            width=width,
            color=cmap[i],
            label=bench.upper(),
            edgecolor="white",
            linewidth=0.4,
        )
    ax.axhline(0, color="black", linewidth=0.8)
    ax.set_xticks(x)
    ax.set_xticklabels([SCHOOL_LABELS[s] for s in SCHOOLS])
    ax.set_ylabel("Δ accuracy vs baseline (pp)")
    ax.set_title("Per-school × per-benchmark Δ — pooled over Qwen3.5 sizes")
    ax.legend(loc="lower left", ncol=3, fontsize=9, frameon=False)
    ax.grid(True, axis="y", alpha=0.3)
    fig.tight_layout()
    path = FIG_DIR / "04_school_strength_bar.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def fig_radar(df: pd.DataFrame) -> Path:
    sub = df[df.condition.isin(SCHOOLS)]
    pooled = sub.groupby(["condition", "benchmark"])["delta"].mean().unstack()
    pooled = pooled.reindex(index=SCHOOLS, columns=BENCH_ORDER)
    norm = pooled.copy()
    for b in BENCH_ORDER:
        col = pooled[b]
        lo, hi = col.min(), col.max()
        rng = hi - lo if hi > lo else 1.0
        norm[b] = (col - lo) / rng
    angles = np.linspace(0, 2 * math.pi, len(BENCH_ORDER), endpoint=False).tolist()
    angles += angles[:1]
    n = len(SCHOOLS)
    cols = 3
    rows = math.ceil(n / cols)
    fig, axes = plt.subplots(rows, cols, subplot_kw=dict(projection="polar"), figsize=(4.4 * cols, 4.0 * rows))
    axes = axes.flatten()
    cmap = plt.cm.Set2(np.linspace(0, 1, n))
    for ax, school, color in zip(axes, SCHOOLS, cmap):
        vals = norm.loc[school].tolist()
        vals += vals[:1]
        ax.plot(angles, vals, color=color, linewidth=2)
        ax.fill(angles, vals, color=color, alpha=0.25)
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels([b.upper() for b in BENCH_ORDER], fontsize=9)
        ax.set_yticks([0.25, 0.5, 0.75])
        ax.set_yticklabels(["", "", ""])
        ax.set_ylim(0, 1)
        ax.set_title(SCHOOL_LABELS[school], fontsize=11, pad=10)
    for ax in axes[n:]:
        ax.set_visible(False)
    fig.suptitle("School profile (rank-normalized Δ per benchmark; 1 = best of the 6 schools)", fontsize=12)
    fig.tight_layout()
    path = FIG_DIR / "05_school_radar.png"
    fig.savefig(path, dpi=160)
    plt.close(fig)
    return path


def write_tidy(df: pd.DataFrame) -> Path:
    out = OUT_DIR / "tidy.csv"
    df.to_csv(out, index=False)
    return out


def write_strength(df: pd.DataFrame) -> Path:
    sub = df[df.condition.isin(SCHOOLS)]
    pooled = (
        sub.groupby(["condition", "benchmark"])["delta"]
        .agg(["mean", "std", "count"])
        .reset_index()
    )
    pooled = pooled.rename(columns={"mean": "delta_mean", "std": "delta_std", "count": "n_models"})
    pooled = pooled.sort_values(["condition", "delta_mean"], ascending=[True, False])
    out = OUT_DIR / "school_strength.csv"
    pooled.to_csv(out, index=False)
    return out


def main():
    df = load()
    df = add_delta(df)
    tidy = write_tidy(df)
    strength = write_strength(df)
    paths = [
        fig_pooled_heatmap(df),
        fig_per_preset_heatmap(df),
        fig_scaling(df),
        fig_school_strength(df),
        fig_radar(df),
    ]
    print("wrote", tidy)
    print("wrote", strength)
    for p in paths:
        print("wrote", p)


if __name__ == "__main__":
    main()
