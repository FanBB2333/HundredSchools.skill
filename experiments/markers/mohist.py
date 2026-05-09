"""Mohist (墨家) markers."""
from __future__ import annotations
import re

_DOCSTRING_RE = re.compile(r'"""|\'\'\'')
_INLINE_COMMENT_RE = re.compile(r"^\s*#", re.M)
_INTRO_PHRASES_RE = re.compile(
    r"\b(here is|let me|to (?:answer|solve|address)|in this response|below is|"
    r"first,? let|i'll|i will (?:walk|explain|describe))\b",
    re.I,
)
_EXAMPLE_RE = re.compile(r"\b(example|usage|for instance|e\.g\.|demonstration|sample run)\b", re.I)
_JIE_YONG_RE = re.compile(r"\b(jie[- ]yong|frugal|节用|minimal output|stripped down)\b", re.I)


def _short_output(text: str, baseline: str | None = None) -> bool:
    """Output is shorter than baseline by at least 20%."""
    if not baseline:
        return len(text) < 600
    return len(text) < 0.8 * len(baseline)


def _no_docstring(text: str, baseline: str | None = None) -> bool:
    return not bool(_DOCSTRING_RE.search(text))


def _few_inline_comments(text: str, baseline: str | None = None) -> bool:
    lines = max(text.count("\n"), 1)
    comments = len(_INLINE_COMMENT_RE.findall(text))
    return comments / lines < 0.10


def _no_intro_padding(text: str, baseline: str | None = None) -> bool:
    head = text[:300]
    return not bool(_INTRO_PHRASES_RE.search(head))


def _no_example_block(text: str, baseline: str | None = None) -> bool:
    return not bool(_EXAMPLE_RE.search(text))


def _jie_yong_term(text: str, baseline: str | None = None) -> bool:
    return bool(_JIE_YONG_RE.search(text))


MARKERS = {
    "short_output": _short_output,
    "no_docstring": _no_docstring,
    "few_inline_comments": _few_inline_comments,
    "no_intro_padding": _no_intro_padding,
    "no_example_block": _no_example_block,
    "jie_yong_term": _jie_yong_term,
}
