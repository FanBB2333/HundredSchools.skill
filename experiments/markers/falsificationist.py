"""Falsificationist (证伪) markers."""
from __future__ import annotations
import re

_REFUTE_RE = re.compile(
    r"\b(would (?:refute|disprove|falsify)|could be wrong if|"
    r"this fails if|disprov(?:e|ing) condition|refutation criterion)\b",
    re.I,
)
_FALSIFIER_ATTACHED_RE = re.compile(
    r"\b(falsif(?:y|iable|ier)|test that would|observation that would|"
    r"empirical risk|risky prediction)\b",
    re.I,
)
_SEVERE_TEST_RE = re.compile(
    r"\b(severe test|stringent test|adversarial review|hostile reviewer|"
    r"strongest test|stress test)\b",
    re.I,
)
_ORIENTATION_TAG_RE = re.compile(
    r"\b(orientation[- ]only|directional|cannot in principle be wrong|"
    r"unfalsifiable|tautolog)\b",
    re.I,
)
_CONJECTURE_RE = re.compile(r"\b(conjecture|bold hypothesis|tentative claim|provisional)\b", re.I)
_RETIRED_PREMISE_RE = re.compile(r"\b(retire (?:the |this )?(?:assumption|premise)|previously assumed|"
                                  r"prior draft was wrong because)\b", re.I)


def _refutation_attached(text: str, baseline: str | None = None) -> bool:
    return bool(_REFUTE_RE.search(text))


def _falsifier_term(text: str, baseline: str | None = None) -> bool:
    return bool(_FALSIFIER_ATTACHED_RE.search(text))


def _severe_test_invoked(text: str, baseline: str | None = None) -> bool:
    return bool(_SEVERE_TEST_RE.search(text))


def _orientation_tag(text: str, baseline: str | None = None) -> bool:
    return bool(_ORIENTATION_TAG_RE.search(text))


def _conjecture_language(text: str, baseline: str | None = None) -> bool:
    return bool(_CONJECTURE_RE.search(text))


def _retired_premise(text: str, baseline: str | None = None) -> bool:
    return bool(_RETIRED_PREMISE_RE.search(text))


MARKERS = {
    "refutation_attached": _refutation_attached,
    "falsifier_term": _falsifier_term,
    "severe_test_invoked": _severe_test_invoked,
    "orientation_tag": _orientation_tag,
    "conjecture_language": _conjecture_language,
    "retired_premise": _retired_premise,
}
