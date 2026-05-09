"""Yangming (阳明学) markers."""
from __future__ import annotations
import re

_NEXT_ACTION_RE = re.compile(
    r"\b(next (?:concrete |specific )?(?:action|step|move)|"
    r"you (?:can|could) (?:try|do|run)|first step is|"
    r"start by|begin by|attempt the following)\b",
    re.I,
)
_KNOWING_ACTING_RE = re.compile(
    r"\b(zhi[- ]xing[- ]he[- ]yi|knowledge[- ]action|knowing without acting|"
    r"知行合一|action[- ]grounded|adoptable)\b",
    re.I,
)
_GAP_DIST_RE = re.compile(
    r"\b(information gap|willingness gap|operational gap|"
    r"do not have the (?:info|information)|next step is .+ hard)\b",
    re.I,
)
_WALKTHROUGH_RE = re.compile(
    r"\b(walk through|walking through|mental walkthrough|"
    r"executing this would|would expose|trying this would)\b",
    re.I,
)
_MIND_PRINCIPLE_RE = re.compile(
    r"\b(xin[- ]ji[- ]li|mind[- ]is[- ]principle|心即理|致良知|"
    r"事上磨练|polish(?:ing)? in deeds)\b",
    re.I,
)
_CONCRETE_VERB_RE = re.compile(
    r"\b(run|execute|edit|create|delete|deploy|push|merge|click|open|launch|invoke|paste)\s+\S+",
    re.I,
)


def _next_action_present(text: str, baseline: str | None = None) -> bool:
    return bool(_NEXT_ACTION_RE.search(text))


def _knowing_acting_term(text: str, baseline: str | None = None) -> bool:
    return bool(_KNOWING_ACTING_RE.search(text))


def _info_vs_willingness_gap(text: str, baseline: str | None = None) -> bool:
    return bool(_GAP_DIST_RE.search(text))


def _walkthrough_present(text: str, baseline: str | None = None) -> bool:
    return bool(_WALKTHROUGH_RE.search(text))


def _xin_ji_li(text: str, baseline: str | None = None) -> bool:
    return bool(_MIND_PRINCIPLE_RE.search(text))


def _concrete_verb(text: str, baseline: str | None = None) -> bool:
    return len(_CONCRETE_VERB_RE.findall(text)) >= 1


MARKERS = {
    "next_action_present": _next_action_present,
    "knowing_acting_term": _knowing_acting_term,
    "info_vs_willingness_gap": _info_vs_willingness_gap,
    "walkthrough_present": _walkthrough_present,
    "xin_ji_li": _xin_ji_li,
    "concrete_verb": _concrete_verb,
}
