"""BBH scorer. Extracts answer after 'So the answer is' or similar patterns.

BBH tasks have varied answer formats: (A)/(B)/..., True/False, or free text.
We do exact-match after normalization.
"""
import re

_ANSWER_PATTERNS = [
    re.compile(r"[Ss]o the answer is\s*[:\.]?\s*(.+?)(?:\.|$)", re.DOTALL),
    re.compile(r"[Tt]he answer is\s*[:\.]?\s*(.+?)(?:\.|$)", re.DOTALL),
    re.compile(r"[Aa]nswer\s*:\s*(.+?)(?:\n|$)"),
]

# For multiple-choice BBH tasks: extract (A), (B), etc.
_MC_RE = re.compile(r"\(([A-Z])\)")


def _normalize(s: str) -> str:
    s = s.strip().lower()
    # Remove surrounding parens/brackets
    s = re.sub(r"^[\(\[\{]|[\)\]\}]$", "", s).strip()
    return s


def _extract_answer(text: str) -> str:
    if not text:
        return ""
    for pat in _ANSWER_PATTERNS:
        m = pat.search(text)
        if m:
            return m.group(1).strip()
    # Fallback: last line
    lines = [l.strip() for l in text.strip().split("\n") if l.strip()]
    return lines[-1] if lines else ""


def score(prediction: str, gold: str, meta: dict | None = None) -> dict:
    pred_raw = _extract_answer(prediction)
    gold_norm = _normalize(gold)
    pred_norm = _normalize(pred_raw)
    correct = pred_norm == gold_norm
    # Also try MC letter matching: if gold is "(A)" style
    if not correct:
        gold_mc = _MC_RE.search(gold)
        pred_mc = _MC_RE.search(pred_raw) or _MC_RE.search(prediction)
        if gold_mc and pred_mc:
            correct = gold_mc.group(1) == pred_mc.group(1)
        elif gold_mc:
            correct = _normalize(pred_raw) == gold_mc.group(1).lower()
    return {
        "correct": bool(correct),
        "pred": pred_raw,
        "pred_norm": pred_norm,
        "gold_norm": gold_norm,
    }
