"""Hegelian (黑格尔) markers."""
from __future__ import annotations
import re

_THESIS_ANTITHESIS_RE = re.compile(
    r"\b(thesis|antithesis|on the one hand|on the other hand|"
    r"counter[- ](?:case|argument|view|position))\b",
    re.I,
)
_SYNTHESIS_RE = re.compile(
    r"\b(synthesi[sz]e|synthesis|sublat(?:e|ion)|aufheb(?:en|ung)|"
    r"transcend the opposition|preserve what each side)\b",
    re.I,
)
_DETERMINATE_NEG_RE = re.compile(
    r"\b(determinate negation|specific premise that|load[- ]bearing premise|"
    r"premise that, if true)\b",
    re.I,
)
_NOT_AVERAGING_RE = re.compile(
    r"\b(not (?:simply|merely) (?:averag|split|compromis)|"
    r"not a middle ground|beyond compromise|reframe the disagreement)\b",
    re.I,
)
_HEGEL_TERM_RE = re.compile(r"\b(dialectic|hegel|truth is the whole|concrete universal)\b", re.I)
_CONTRADICTION_RE = re.compile(
    r"\b(contradiction|tension between|in tension|surfaced disagreement|"
    r"genuine conflict)\b",
    re.I,
)


def _thesis_antithesis(text: str, baseline: str | None = None) -> bool:
    return bool(_THESIS_ANTITHESIS_RE.search(text))


def _synthesis_attempted(text: str, baseline: str | None = None) -> bool:
    return bool(_SYNTHESIS_RE.search(text))


def _determinate_negation(text: str, baseline: str | None = None) -> bool:
    return bool(_DETERMINATE_NEG_RE.search(text))


def _not_averaging(text: str, baseline: str | None = None) -> bool:
    return bool(_NOT_AVERAGING_RE.search(text))


def _hegel_term(text: str, baseline: str | None = None) -> bool:
    return bool(_HEGEL_TERM_RE.search(text))


def _contradiction_surfaced(text: str, baseline: str | None = None) -> bool:
    return bool(_CONTRADICTION_RE.search(text))


MARKERS = {
    "thesis_antithesis": _thesis_antithesis,
    "synthesis_attempted": _synthesis_attempted,
    "determinate_negation": _determinate_negation,
    "not_averaging": _not_averaging,
    "hegel_term": _hegel_term,
    "contradiction_surfaced": _contradiction_surfaced,
}
