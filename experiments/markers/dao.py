"""Daoist (道家) markers.

Daoist execution logic emphasizes: exploration without forcing, reframing,
multiple live perspectives, early exit. Markers detect those behaviors.
"""
from __future__ import annotations
import re

_ALT_RE = re.compile(
    r"\b(alternatively|another (?:path|option|approach|way|angle|frame|reading)|"
    r"or you could|on the other hand|reconsider|reframe|rethink)\b",
    re.I,
)
_HEDGE_RE = re.compile(
    r"\b(might|could|perhaps|may|possibly|consider|one possibility|tentative)\b",
    re.I,
)
_WUWEI_RE = re.compile(r"\b(wu[\s-]?wei|non[- ]forcing|non[- ]action|natural flow)\b", re.I)
_REFRAME_RE = re.compile(r"\b(reframe|reframing|reverse|invert|instead of|step back)\b", re.I)
_OPTIONS_LIST_RE = re.compile(r"^\s*(\d+\.|[-*])\s.*$\n.*^\s*(\d+\.|[-*])\s", re.M)


def _multi_alternatives(text: str, baseline: str | None = None) -> bool:
    return len(_ALT_RE.findall(text)) >= 2


def _hedged_language(text: str, baseline: str | None = None) -> bool:
    return len(_HEDGE_RE.findall(text)) >= 2


def _wuwei_term(text: str, baseline: str | None = None) -> bool:
    return bool(_WUWEI_RE.search(text))


def _reframing_language(text: str, baseline: str | None = None) -> bool:
    return bool(_REFRAME_RE.search(text))


def _enumerated_options(text: str, baseline: str | None = None) -> bool:
    return bool(_OPTIONS_LIST_RE.search(text))


def _early_exit_acknowledged(text: str, baseline: str | None = None) -> bool:
    return bool(re.search(r"\b(stop here|leave (?:room|space)|further pushing|when to stop)\b", text, re.I))


MARKERS = {
    "multi_alternatives": _multi_alternatives,
    "hedged_language": _hedged_language,
    "wuwei_term": _wuwei_term,
    "reframing_language": _reframing_language,
    "enumerated_options": _enumerated_options,
    "early_exit_acknowledged": _early_exit_acknowledged,
}
