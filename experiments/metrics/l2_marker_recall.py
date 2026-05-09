"""L2 — school marker recall.

`marker_recall(text, school)` returns
    (number of MARKERS hits) / (total markers in school)

If `baseline` is given, markers that take a baseline argument can use it
(e.g., mohist's `short_output` compares to baseline length).
"""
from __future__ import annotations

from typing import Dict

from experiments.markers import load_markers


def marker_recall(text: str, school: str, baseline: str | None = None) -> float:
    markers = load_markers(school)
    if not markers:
        return 0.0
    hits = 0
    for fn in markers.values():
        try:
            hits += int(bool(fn(text, baseline)))
        except TypeError:
            # marker doesn't accept baseline; call with text only
            hits += int(bool(fn(text)))
    return hits / len(markers)


def per_marker_hits(text: str, school: str, baseline: str | None = None) -> Dict[str, bool]:
    """Return per-marker hit/miss for transparency / debugging."""
    out: Dict[str, bool] = {}
    markers = load_markers(school)
    for name, fn in markers.items():
        try:
            out[name] = bool(fn(text, baseline))
        except TypeError:
            out[name] = bool(fn(text))
    return out
