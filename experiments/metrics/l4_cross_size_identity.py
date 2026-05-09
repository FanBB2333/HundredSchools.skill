"""L4 — cross-size school identity.

For each school, compute the cosine similarity between its mean
embedding at the smallest model size and at the largest model size.

  identity(school) = cosine(mean_embed(school@small), mean_embed(school@large))

H2b says this should be > 0.6 averaged across the 14 schools.
"""
from __future__ import annotations

from typing import Dict, Iterable, Sequence, Tuple

from .l3_pairwise_distance import _mean, _cosine, get_encoder


def cross_size_identity(
    records: Iterable[dict],
    schools: Sequence[str],
    small_preset: str,
    large_preset: str,
    output_field: str = "raw_output",
    school_field: str = "resolved_condition",
    preset_field: str = "preset",
) -> Tuple[Dict[str, float], Dict[str, Tuple[int, int]]]:
    """Returns (per-school identity, per-school sample counts (small, large))."""
    encode, _ = get_encoder()

    small_groups: Dict[str, list] = {s: [] for s in schools}
    large_groups: Dict[str, list] = {s: [] for s in schools}

    for rec in records:
        s = rec.get(school_field)
        if s not in small_groups:
            continue
        text = rec.get(output_field) or ""
        if not text.strip():
            continue
        if rec.get(preset_field) == small_preset:
            small_groups[s].append(text)
        elif rec.get(preset_field) == large_preset:
            large_groups[s].append(text)

    identity: Dict[str, float] = {}
    counts: Dict[str, Tuple[int, int]] = {}
    for s in schools:
        n_s = len(small_groups[s])
        n_l = len(large_groups[s])
        counts[s] = (n_s, n_l)
        if n_s == 0 or n_l == 0:
            continue
        embs_s = encode(small_groups[s])
        embs_l = encode(large_groups[s])
        ms = _mean(embs_s.tolist() if hasattr(embs_s, "tolist") else embs_s)
        ml = _mean(embs_l.tolist() if hasattr(embs_l, "tolist") else embs_l)
        identity[s] = _cosine(ms, ml)
    return identity, counts
