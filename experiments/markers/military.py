"""Military (兵家) markers."""
from __future__ import annotations
import re

_PLAN_BLOCK_RE = re.compile(r"<plan[\s>]|^#+\s*plan\b|^\s*plan:|^\s*## ?(?:plan|strategy)", re.I | re.M)
_STEPS_RE = re.compile(r"^\s*(?:step|\d+\.)\s+\S+", re.I | re.M)
_FALLBACK_RE = re.compile(r"\b(fallback|contingency|plan B|backup path|alternative path|if .+ fails)\b", re.I)
_RESOURCE_RE = re.compile(r"\b(resource|budget|capacity|constraint|risk|attack vector)\b", re.I)
_ZHENG_QI_RE = re.compile(r"\b(zheng[- ]qi|miao[- ]suan|primary path|secondary path)\b", re.I)
_THREAT_ASSESS_RE = re.compile(r"\b(threat (?:assessment|profile)|worst[- ]case|risk profile|known position)\b", re.I)


def _plan_block(text: str, baseline: str | None = None) -> bool:
    return bool(_PLAN_BLOCK_RE.search(text))


def _step_decomposition(text: str, baseline: str | None = None) -> bool:
    return len(_STEPS_RE.findall(text)) >= 3


def _fallback_present(text: str, baseline: str | None = None) -> bool:
    return bool(_FALLBACK_RE.search(text))


def _resource_assessment(text: str, baseline: str | None = None) -> bool:
    return bool(_RESOURCE_RE.search(text))


def _zheng_qi_term(text: str, baseline: str | None = None) -> bool:
    return bool(_ZHENG_QI_RE.search(text))


def _threat_assessment(text: str, baseline: str | None = None) -> bool:
    return bool(_THREAT_ASSESS_RE.search(text))


MARKERS = {
    "plan_block": _plan_block,
    "step_decomposition": _step_decomposition,
    "fallback_present": _fallback_present,
    "resource_assessment": _resource_assessment,
    "zheng_qi_term": _zheng_qi_term,
    "threat_assessment": _threat_assessment,
}
