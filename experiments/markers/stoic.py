"""Stoic (斯多葛) markers."""
from __future__ import annotations
import re

_PARTITION_RE = re.compile(
    r"\b(in (?:my|your|our) control|out of (?:my|your|our) control|"
    r"controllable|uncontrollable|within scope|outside scope|"
    r"things I can affect|things I cannot affect|可控|不可控)\b",
    re.I,
)
_ACCEPTANCE_RE = re.compile(
    r"\b(accept|acknowledge that|cannot be helped|outside my reach|"
    r"will replan|move on|not worth retrying)\b",
    re.I,
)
_PREMEDITATIO_RE = re.compile(
    r"\b(premeditat|anticipated failure|likely failure mode|"
    r"if .+ fails|expected obstacle)\b",
    re.I,
)
_NO_LOOP_RE = re.compile(
    r"\b(no further retries|will not retry|stopping here|"
    r"single attempt|one final attempt)\b",
    re.I,
)
_LOGOS_RE = re.compile(r"\b(dichotomy of control|stoic|logos|amor fati|epictetus|aurelius)\b", re.I)
_OBSTACLE_INTEGRATION_RE = re.compile(
    r"\b(the obstacle is|impediment becomes|incorporate (?:this )?into|"
    r"the way (?:through|forward)|stands in the way)\b",
    re.I,
)


def _control_partition(text: str, baseline: str | None = None) -> bool:
    return bool(_PARTITION_RE.search(text))


def _acceptance_phrasing(text: str, baseline: str | None = None) -> bool:
    return bool(_ACCEPTANCE_RE.search(text))


def _premeditatio(text: str, baseline: str | None = None) -> bool:
    return bool(_PREMEDITATIO_RE.search(text))


def _no_thrash(text: str, baseline: str | None = None) -> bool:
    return bool(_NO_LOOP_RE.search(text))


def _stoic_term(text: str, baseline: str | None = None) -> bool:
    return bool(_LOGOS_RE.search(text))


def _obstacle_integration(text: str, baseline: str | None = None) -> bool:
    return bool(_OBSTACLE_INTEGRATION_RE.search(text))


MARKERS = {
    "control_partition": _control_partition,
    "acceptance_phrasing": _acceptance_phrasing,
    "premeditatio": _premeditatio,
    "no_thrash": _no_thrash,
    "stoic_term": _stoic_term,
    "obstacle_integration": _obstacle_integration,
}
