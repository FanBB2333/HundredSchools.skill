"""Socratic (苏格拉底) markers."""
from __future__ import annotations
import re

_QUESTION_BEFORE_ANSWER_RE = re.compile(r"\?\s*$|\?\s*\n", re.M)
_DEFINITION_QUERY_RE = re.compile(
    r"\b(what do you mean by|how do you define|in this context, .+ means|"
    r"clarify|operative meaning|what counts as)\b",
    re.I,
)
_APORIA_RE = re.compile(
    r"\b(I cannot answer because|the question is underspecified|"
    r"insufficient context|I do not know enough to|undefined here|"
    r"too vague to answer)\b",
    re.I,
)
_EPISTEMIC_TAG_RE = re.compile(
    r"\b(based on (?:user|your) input|from (?:training|prior knowledge)|"
    r"this is inference|I am uncertain because|grounded in)\b",
    re.I,
)
_BOUNDARY_PROBE_RE = re.compile(r"\b(boundary case|edge case|counter[- ]example|consider .+ instead)\b", re.I)
_ELENCHUS_RE = re.compile(r"\b(elenchus|maieutic|Socrat)\b", re.I)


def _has_question_marks(text: str, baseline: str | None = None) -> bool:
    return len(_QUESTION_BEFORE_ANSWER_RE.findall(text)) >= 1


def _definition_query(text: str, baseline: str | None = None) -> bool:
    return bool(_DEFINITION_QUERY_RE.search(text))


def _aporia_acknowledged(text: str, baseline: str | None = None) -> bool:
    return bool(_APORIA_RE.search(text))


def _epistemic_tagging(text: str, baseline: str | None = None) -> bool:
    return bool(_EPISTEMIC_TAG_RE.search(text))


def _boundary_probe(text: str, baseline: str | None = None) -> bool:
    return bool(_BOUNDARY_PROBE_RE.search(text))


def _elenchus_term(text: str, baseline: str | None = None) -> bool:
    return bool(_ELENCHUS_RE.search(text))


MARKERS = {
    "has_question_marks": _has_question_marks,
    "definition_query": _definition_query,
    "aporia_acknowledged": _aporia_acknowledged,
    "epistemic_tagging": _epistemic_tagging,
    "boundary_probe": _boundary_probe,
    "elenchus_term": _elenchus_term,
}
