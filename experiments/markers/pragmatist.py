"""Pragmatist (实用主义) markers."""
from __future__ import annotations
import re

_PRACTICAL_EFFECT_RE = re.compile(
    r"\b(practical (?:effect|consequence|bearing)|in practice|"
    r"observable difference|downstream impact|will (?:change|affect))\b",
    re.I,
)
_CASH_VALUE_RE = re.compile(
    r"\b(cash[- ]?(?:out|value)|pay off|works in practice|"
    r"useful difference|operational outcome)\b",
    re.I,
)
_MEANS_END_RE = re.compile(
    r"\b(means to (?:that |this )?end|adoptable means|how you would|"
    r"steps to (?:get|achieve)|the means)\b",
    re.I,
)
_PROBLEMATIC_SITUATION_RE = re.compile(
    r"\b(problematic situation|the situation you (?:are|face)|"
    r"the difficulty here|specific context|in your context)\b",
    re.I,
)
_REVISE_ON_EVIDENCE_RE = re.compile(
    r"\b(revise (?:if|when)|update on evidence|provisional|"
    r"willing to revise|will reconsider if)\b",
    re.I,
)
_PRAGMATIC_TERM_RE = re.compile(
    r"\b(pragmatic|peirce|james|dewey|inquiry as|fallibilis(?:m|t))\b",
    re.I,
)


def _practical_effect(text: str, baseline: str | None = None) -> bool:
    return bool(_PRACTICAL_EFFECT_RE.search(text))


def _cash_value(text: str, baseline: str | None = None) -> bool:
    return bool(_CASH_VALUE_RE.search(text))


def _means_attached(text: str, baseline: str | None = None) -> bool:
    return bool(_MEANS_END_RE.search(text))


def _problematic_situation(text: str, baseline: str | None = None) -> bool:
    return bool(_PROBLEMATIC_SITUATION_RE.search(text))


def _revise_on_evidence(text: str, baseline: str | None = None) -> bool:
    return bool(_REVISE_ON_EVIDENCE_RE.search(text))


def _pragmatic_term(text: str, baseline: str | None = None) -> bool:
    return bool(_PRAGMATIC_TERM_RE.search(text))


MARKERS = {
    "practical_effect": _practical_effect,
    "cash_value": _cash_value,
    "means_attached": _means_attached,
    "problematic_situation": _problematic_situation,
    "revise_on_evidence": _revise_on_evidence,
    "pragmatic_term": _pragmatic_term,
}
