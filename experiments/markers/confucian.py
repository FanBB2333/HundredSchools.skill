"""Confucian (儒家) markers."""
from __future__ import annotations
import re

_FORMAL_RE = re.compile(
    r"\b(I would (?:recommend|suggest|advise)|it is appropriate|with respect|"
    r"please consider|kindly|in this context|the appropriate)\b",
    re.I,
)
_PROPER_NAMING_RE = re.compile(r"\b(zheng[\s-]?ming|rectif(?:y|ication)|proper name|right naming)\b", re.I)
_KE_JI_RE = re.compile(r"\b(ke[\s-]?ji[\s-]?fu[\s-]?li|self[- ]restraint|propriety)\b", re.I)
_MENTOR_RE = re.compile(r"\b(I would invite|let us|may I suggest|it might be wise|one ought)\b", re.I)
_CONSTRUCTIVE_REFUSAL_RE = re.compile(
    r"\b(while .+ I cannot|I am unable to .+ but|let me suggest instead|"
    r"a safe alternative|here is a better path)\b",
    re.I,
)
_NO_COLLOQUIAL_RE = re.compile(r"\b(yeah|nope|gonna|wanna|kinda|stuff|cool|awesome)\b", re.I)


def _formal_tone(text: str, baseline: str | None = None) -> bool:
    return bool(_FORMAL_RE.search(text))


def _proper_naming(text: str, baseline: str | None = None) -> bool:
    return bool(_PROPER_NAMING_RE.search(text))


def _ke_ji_fu_li(text: str, baseline: str | None = None) -> bool:
    return bool(_KE_JI_RE.search(text))


def _mentor_voice(text: str, baseline: str | None = None) -> bool:
    return bool(_MENTOR_RE.search(text))


def _constructive_correction(text: str, baseline: str | None = None) -> bool:
    return bool(_CONSTRUCTIVE_REFUSAL_RE.search(text))


def _no_colloquial(text: str, baseline: str | None = None) -> bool:
    """Inverse marker — formal tone forbids casualisms."""
    return not bool(_NO_COLLOQUIAL_RE.search(text))


MARKERS = {
    "formal_tone": _formal_tone,
    "proper_naming": _proper_naming,
    "ke_ji_fu_li": _ke_ji_fu_li,
    "mentor_voice": _mentor_voice,
    "constructive_correction": _constructive_correction,
    "no_colloquial": _no_colloquial,
}
