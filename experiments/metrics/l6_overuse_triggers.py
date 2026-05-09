"""L6 — overuse-failure trigger rate.

Each school's GUIDE.md lists "Overuse Failure Modes". This metric encodes
**anti-markers**: signs that the school has been pushed too hard. The
analysis notebook reports L6 alongside L2 to show the
"fidelity vs over-application" tradeoff.

Anti-markers are intentionally narrow — they trigger only on clear cases
to avoid false positives.
"""
from __future__ import annotations

import re
from typing import Callable, Dict


_ANTI_MARKERS: Dict[str, Dict[str, Callable[[str], bool]]] = {
    "dao": {
        # drift: keeps offering possibilities where a decision is needed
        "under_commitment": lambda t: bool(
            re.search(r"\b(many possibilities|hard to say|too many options|no single answer)\b", t, re.I)
        )
        and not bool(re.search(r"\b(my recommendation|I recommend|the best path is)\b", t, re.I)),
        # false mystique: vagueness mistaken for wisdom
        "false_mystique": lambda t: bool(
            re.search(r"\b(it depends|sometimes|the answer may emerge|the way is mysterious)\b", t, re.I)
        )
        and len(t) < 200,
    },
    "confucian": {
        "empty_decorum": lambda t: bool(re.search(r"\b(with utmost respect|kindly|please)\b", t, re.I))
        and not bool(re.search(r"\b(however|but|I must|in fact)\b", t, re.I)),
    },
    "legal": {
        "rule_theater": lambda t: bool(re.search(r"^\s*\d+\.\s.+$", t, re.M)) and len(re.findall(r"^\s*\d+\.", t, re.M)) > 12,
    },
    "military": {
        "planning_overhead": lambda t: bool(re.search(r"<plan", t, re.I)) and len(t) > 3000,
    },
    "mohist": {
        "under_explained": lambda t: len(t) < 80,
    },
    "logician": {
        "pedantry": lambda t: len(re.findall(r"\b(strictly speaking|technically|by definition)\b", t, re.I)) > 3,
    },
    "socratic": {
        "question_loop": lambda t: t.count("?") >= 5 and not bool(re.search(r"\b(my answer|in conclusion|to commit)\b", t, re.I)),
    },
    "stoic": {
        "premature_surrender": lambda t: bool(re.search(r"\b(out of my control|cannot help)\b", t, re.I))
        and len(t) < 150,
    },
    "falsificationist": {
        "hyperskepticism": lambda t: bool(re.search(r"\b(cannot be sure|provisional|subject to revision)\b", t, re.I))
        and not bool(re.search(r"\b(my current best|best surviving)\b", t, re.I)),
    },
    "hegelian": {
        "synthesis_theater": lambda t: bool(re.search(r"\bsynthesis\b", t, re.I))
        and not bool(re.search(r"\b(determinate negation|preserve|transcend)\b", t, re.I)),
    },
    "pragmatist": {
        "what_works_now": lambda t: bool(re.search(r"\b(whatever works|just do)\b", t, re.I))
        and not bool(re.search(r"\b(downstream|long[- ]term)\b", t, re.I)),
    },
    "yangming": {
        "voluntarism": lambda t: bool(re.search(r"\b(just (?:do|act)|stop overthinking)\b", t, re.I)),
    },
    "bacon": {
        "disclaimer_inflation": lambda t: bool(re.search(r"\b(idol|bias)\b", t, re.I))
        and not bool(re.search(r"\b(revis|edit|chang)\b", t, re.I)),
    },
    "wittgenstein": {
        "game_relativism": lambda t: bool(re.search(r"\bit depends on (?:the|which) (?:game|context)\b", t, re.I))
        and not bool(re.search(r"\b(in this game|the active game is)\b", t, re.I)),
    },
}


def overuse_trigger_rate(text: str, school: str) -> float:
    """Returns fraction of overuse anti-markers that fire for this school."""
    antis = _ANTI_MARKERS.get(school, {})
    if not antis:
        return 0.0
    hits = sum(1 for fn in antis.values() if fn(text))
    return hits / len(antis)


def per_anti_marker(text: str, school: str) -> Dict[str, bool]:
    return {name: bool(fn(text)) for name, fn in _ANTI_MARKERS.get(school, {}).items()}
