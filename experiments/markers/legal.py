"""Legal (法家) markers."""
from __future__ import annotations
import re

_RULE_LANG_RE = re.compile(r"\b(rule \d+|article \d+|clause|RFC \d+|spec(?:ification)?|requirement|MUST|MUST NOT|SHALL|SHALL NOT)\b")
_NUMBERED_RE = re.compile(r"^\s*\d+\.\s+\S+", re.M)
_NO_EXCEPTION_RE = re.compile(
    r"\b(no exceptions?|zero tolerance|without exception|strict(?:ly)?|"
    r"per the (?:rule|law|spec))\b",
    re.I,
)
_VIOLATION_CITED_RE = re.compile(r"\b(violat(?:e|ion|es)|breach|out of compliance|fails (?:rule|check) \d*)\b", re.I)
_SCHEMA_RE = re.compile(r"(```(?:json|yaml|xml)|JSON schema|^\s*\{[\s\S]+\}\s*$|^\s*\[[\s\S]+\]\s*$)", re.M)


def _rule_language(text: str, baseline: str | None = None) -> bool:
    return bool(_RULE_LANG_RE.search(text))


def _numbered_structure(text: str, baseline: str | None = None) -> bool:
    return len(_NUMBERED_RE.findall(text)) >= 3


def _no_exception_phrasing(text: str, baseline: str | None = None) -> bool:
    return bool(_NO_EXCEPTION_RE.search(text))


def _violation_named(text: str, baseline: str | None = None) -> bool:
    return bool(_VIOLATION_CITED_RE.search(text))


def _schema_structure(text: str, baseline: str | None = None) -> bool:
    return bool(_SCHEMA_RE.search(text))


def _yi_duan_yu_fa(text: str, baseline: str | None = None) -> bool:
    return bool(re.search(r"\b(yi[- ]duan[- ]yu[- ]fa|judge by law|by the law alone)\b", text, re.I))


MARKERS = {
    "rule_language": _rule_language,
    "numbered_structure": _numbered_structure,
    "no_exception_phrasing": _no_exception_phrasing,
    "violation_named": _violation_named,
    "schema_structure": _schema_structure,
    "yi_duan_yu_fa": _yi_duan_yu_fa,
}
