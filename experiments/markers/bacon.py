"""Bacon (培根) markers."""
from __future__ import annotations
import re

_IDOL_NAMED_RE = re.compile(
    r"\b(idol(?:s)? of (?:the )?(?:tribe|cave|marketplace|theater|theatre)|"
    r"idola tribus|idola specus|idola fori|idola theatri|"
    r"四偶像|部族偶像|洞穴偶像|市场偶像|剧场偶像)\b",
    re.I,
)
_TRIBE_DIAG_RE = re.compile(
    r"\b(species[- ]level|narrative[- ]arc bias|anthropomorph|"
    r"pattern (?:overfit|matching)|too clean a story)\b",
    re.I,
)
_CAVE_DIAG_RE = re.compile(
    r"\b(training[- ]data (?:idiosyn|quirk|over[- ]represent)|"
    r"my priors are sharpest|over[- ]represented topic)\b",
    re.I,
)
_MARKET_DIAG_RE = re.compile(
    r"\b(loaded (?:term|word|vocabulary)|jargon (?:hides|smuggles)|"
    r"unstated (?:value|premise)|conclusion smuggled)\b",
    re.I,
)
_THEATER_DIAG_RE = re.compile(
    r"\b(best practice (?:may not |whose )|paradigm (?:bound|import)|"
    r"received doctrine|how it has always been done|"
    r"original premises (?:may )?no longer)\b",
    re.I,
)
_REVISION_RE = re.compile(
    r"\b(revis(?:ed|ing) (?:the |my )?(?:answer|draft)|substantive (?:change|edit)|"
    r"removing the bias|updated my view because)\b",
    re.I,
)


def _idol_named(text: str, baseline: str | None = None) -> bool:
    return bool(_IDOL_NAMED_RE.search(text))


def _tribe_diagnosed(text: str, baseline: str | None = None) -> bool:
    return bool(_TRIBE_DIAG_RE.search(text))


def _cave_diagnosed(text: str, baseline: str | None = None) -> bool:
    return bool(_CAVE_DIAG_RE.search(text))


def _market_diagnosed(text: str, baseline: str | None = None) -> bool:
    return bool(_MARKET_DIAG_RE.search(text))


def _theater_diagnosed(text: str, baseline: str | None = None) -> bool:
    return bool(_THEATER_DIAG_RE.search(text))


def _substantive_revision(text: str, baseline: str | None = None) -> bool:
    return bool(_REVISION_RE.search(text))


MARKERS = {
    "idol_named": _idol_named,
    "tribe_diagnosed": _tribe_diagnosed,
    "cave_diagnosed": _cave_diagnosed,
    "market_diagnosed": _market_diagnosed,
    "theater_diagnosed": _theater_diagnosed,
    "substantive_revision": _substantive_revision,
}
