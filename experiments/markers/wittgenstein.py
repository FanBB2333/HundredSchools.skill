"""Wittgenstein (维特根斯坦) markers."""
from __future__ import annotations
import re

_LANG_GAME_RE = re.compile(
    r"\b(language[- ]game|sprachspiel|game[- ]shift|"
    r"different (?:game|domain) means|in this (?:game|context, the term))\b",
    re.I,
)
_USE_AS_MEANING_RE = re.compile(
    r"\b(meaning is use|use[- ]derived meaning|operative meaning|"
    r"how (?:the term )?is being used|use of the term)\b",
    re.I,
)
_FAMILY_RESEMBLANCE_RE = re.compile(
    r"\b(family resemblance|overlapping (?:similar|use)|"
    r"no single essence|multiplicity of uses)\b",
    re.I,
)
_DOMAIN_BOUNDARY_RE = re.compile(
    r"\b(at the (?:domain|context) boundary|crossing into|"
    r"in domain A .+ but in domain B|switches? game when|"
    r"the term shifts)\b",
    re.I,
)
_GLOSSARY_RE = re.compile(
    r"\b(glossary|term[- ]binding|bind(?:ing)? to (?:a |this )?(?:context|domain)|"
    r"per[- ]game definition)\b",
    re.I,
)
_WITTGENSTEIN_TERM_RE = re.compile(
    r"\b(wittgenstein|tractatus|philosophical investigations|forms of life|"
    r"private language)\b",
    re.I,
)


def _language_game(text: str, baseline: str | None = None) -> bool:
    return bool(_LANG_GAME_RE.search(text))


def _use_as_meaning(text: str, baseline: str | None = None) -> bool:
    return bool(_USE_AS_MEANING_RE.search(text))


def _family_resemblance(text: str, baseline: str | None = None) -> bool:
    return bool(_FAMILY_RESEMBLANCE_RE.search(text))


def _domain_boundary_marked(text: str, baseline: str | None = None) -> bool:
    return bool(_DOMAIN_BOUNDARY_RE.search(text))


def _glossary_present(text: str, baseline: str | None = None) -> bool:
    return bool(_GLOSSARY_RE.search(text))


def _wittgenstein_term(text: str, baseline: str | None = None) -> bool:
    return bool(_WITTGENSTEIN_TERM_RE.search(text))


MARKERS = {
    "language_game": _language_game,
    "use_as_meaning": _use_as_meaning,
    "family_resemblance": _family_resemblance,
    "domain_boundary_marked": _domain_boundary_marked,
    "glossary_present": _glossary_present,
    "wittgenstein_term": _wittgenstein_term,
}
