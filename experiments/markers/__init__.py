"""School-specific marker dictionaries.

Each module in this package exposes a `MARKERS` dict mapping marker name
to a callable `(text: str, baseline: str | None = None) -> bool`.

`marker_recall = sum(m(out, base) for m in MARKERS.values()) / len(MARKERS)`

Markers are intentionally simple, regex/lexical/structural; they encode
testable behavioral commitments from each school's GUIDE.md execution
logic. They are public so reviewers can audit them.
"""
from __future__ import annotations

import importlib
from typing import Callable, Dict

# Pre-Qin core (6) + Later additions (8) = 14
SCHOOL_IDS = [
    "dao", "confucian", "legal", "military", "mohist", "logician",
    "socratic", "stoic", "falsificationist",
    "hegelian", "pragmatist", "yangming",
    "bacon", "wittgenstein",
]

MarkerFn = Callable[..., bool]


def load_markers(school: str) -> Dict[str, MarkerFn]:
    """Load the MARKERS dict for a single school by name."""
    if school not in SCHOOL_IDS:
        raise ValueError(f"Unknown school: {school}")
    mod = importlib.import_module(f".{school}", package=__name__)
    return mod.MARKERS  # type: ignore[attr-defined]


def all_markers() -> Dict[str, Dict[str, MarkerFn]]:
    """Load MARKERS for all 14 schools."""
    return {s: load_markers(s) for s in SCHOOL_IDS}
