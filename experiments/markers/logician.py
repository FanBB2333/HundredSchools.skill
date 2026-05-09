"""Logician (名家) markers."""
from __future__ import annotations
import re

_DEFINITION_RE = re.compile(
    r"\b(define|definition|means that|refers to|by .+ I mean|"
    r"is defined as|denotes)\b",
    re.I,
)
_DISTINCTION_RE = re.compile(
    r"\b(distinguish|distinction|not the same as|differs? from|"
    r"category|subclass|superclass|conflate|conflation)\b",
    re.I,
)
_SELF_REFLECT_RE = re.compile(
    r"\b(self[- ]reflect|self[- ]check|verify|verification|let me check|"
    r"on review|self[- ]consist|self[- ]audit|zi[- ]xing|zi[- ]fan)\b",
    re.I,
)
_FALLACY_RE = re.compile(
    r"\b(fallacy|fallacious|equivocation|begging the question|straw man|"
    r"ad hominem|偷换概念|tou[- ]huan)\b",
    re.I,
)
_KMZS_RE = re.compile(r"\b(kong[- ]ming[- ]ze[- ]shi|name[/ ]reality|ming[- ]shi[- ]xiang[- ]fu)\b", re.I)
_VERIF_TABLE_RE = re.compile(r"\|.*\|.*\|.*verif|^.*claim.*|.*test", re.I | re.M)


def _definition_attempt(text: str, baseline: str | None = None) -> bool:
    return bool(_DEFINITION_RE.search(text))


def _distinction_made(text: str, baseline: str | None = None) -> bool:
    return bool(_DISTINCTION_RE.search(text))


def _self_reflection(text: str, baseline: str | None = None) -> bool:
    return bool(_SELF_REFLECT_RE.search(text))


def _fallacy_named(text: str, baseline: str | None = None) -> bool:
    return bool(_FALLACY_RE.search(text))


def _kong_ming_ze_shi(text: str, baseline: str | None = None) -> bool:
    return bool(_KMZS_RE.search(text))


def _verification_structure(text: str, baseline: str | None = None) -> bool:
    return bool(_VERIF_TABLE_RE.search(text))


MARKERS = {
    "definition_attempt": _definition_attempt,
    "distinction_made": _distinction_made,
    "self_reflection": _self_reflection,
    "fallacy_named": _fallacy_named,
    "kong_ming_ze_shi": _kong_ming_ze_shi,
    "verification_structure": _verification_structure,
}
