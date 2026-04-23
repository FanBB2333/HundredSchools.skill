"""Numeric scorer for GSM8K-style: extract last number, compare to gold."""
import re

_NUM_RE = re.compile(r"-?\d+(?:\.\d+)?")


def _norm(s: str) -> str | None:
    if s is None:
        return None
    s = s.replace(",", "").strip()
    try:
        v = float(s)
        # canonicalize integer-valued floats
        if v.is_integer():
            return str(int(v))
        return str(v)
    except ValueError:
        return None


def score(prediction: str, gold: str, meta: dict | None = None) -> dict:
    # Prefer the number after "####" if present (matches gold format)
    pred_after = None
    if "####" in prediction:
        tail = prediction.split("####")[-1]
        m = _NUM_RE.search(tail)
        if m:
            pred_after = m.group(0)
    if pred_after is None:
        nums = _NUM_RE.findall(prediction)
        pred_after = nums[-1] if nums else None
    pred_norm = _norm(pred_after)
    gold_norm = _norm(gold)
    correct = pred_norm is not None and pred_norm == gold_norm
    return {
        "correct": bool(correct),
        "pred": pred_after,
        "pred_norm": pred_norm,
        "gold_norm": gold_norm,
    }
