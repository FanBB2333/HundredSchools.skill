"""MCQ scorer for MMLU / TruthfulQA style multiple-choice questions.

Extracts the predicted letter (A/B/C/D/...) from model output and compares
to gold. Uses progressively relaxed extraction:
  1. Exact single letter on first line
  2. "Answer: X" or "answer is X" pattern
  3. First capital letter A-Z found in the output
"""
import re

# Pattern: "the answer is X", "Answer: X", just "X" at start
_ANSWER_PATTERNS = [
    re.compile(r"^\s*([A-D])\s*[\.\)\:]?\s*$", re.MULTILINE),  # standalone letter
    re.compile(r"(?:answer|choice)\s*(?:is|:)\s*\(?([A-D])\)?", re.IGNORECASE),
    re.compile(r"\b([A-D])\b"),  # fallback: first A-D letter
]


def _extract_letter(text: str) -> str | None:
    if not text:
        return None
    for pat in _ANSWER_PATTERNS:
        m = pat.search(text)
        if m:
            return m.group(1).upper()
    return None


def score(prediction: str, gold: str, meta: dict | None = None) -> dict:
    pred = _extract_letter(prediction)
    correct = pred is not None and pred == gold.upper()
    return {
        "correct": bool(correct),
        "pred": pred,
        "gold": gold,
    }
