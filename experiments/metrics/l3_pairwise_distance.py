"""L3 — pairwise school distance.

For each (school A, school B) pair, compute the cosine distance between
mean embeddings of their outputs across all (sample × condition)
records. Operates over a set of records.

Default embedder: sentence-transformers `all-mpnet-base-v2`.
Fallback: TF-IDF cosine (no external dep).

The analysis notebook calls `pairwise_distance_matrix(records)` to
produce the H1 heatmap.
"""
from __future__ import annotations

from typing import Dict, Iterable, List, Sequence, Tuple
import math


def _try_sentence_transformer():
    try:
        from sentence_transformers import SentenceTransformer  # type: ignore

        model = SentenceTransformer("all-mpnet-base-v2")

        def encode(texts: Sequence[str]):
            return model.encode(list(texts), convert_to_numpy=True, normalize_embeddings=True)

        return encode
    except Exception:
        return None


def _tfidf_fallback():
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
        from sklearn.preprocessing import normalize  # type: ignore

        def encode(texts: Sequence[str]):
            vec = TfidfVectorizer(max_features=20_000, ngram_range=(1, 2))
            X = vec.fit_transform(list(texts))
            return normalize(X, norm="l2", axis=1).toarray()

        return encode
    except Exception:
        return None


def get_encoder():
    """Return a callable `encode(list_of_texts) -> np.ndarray (N, D)`.

    Prefers sentence-transformers; falls back to TF-IDF; raises if
    neither is available.
    """
    enc = _try_sentence_transformer()
    if enc is not None:
        return enc, "sentence-transformers/all-mpnet-base-v2"
    enc = _tfidf_fallback()
    if enc is not None:
        return enc, "sklearn/TfidfVectorizer"
    raise RuntimeError(
        "Neither sentence-transformers nor scikit-learn is installed. "
        "Install one to compute L3."
    )


def _cosine(u, v) -> float:
    # u, v are 1D arrays already L2-normalized
    return float(sum(a * b for a, b in zip(u, v)))


def _mean(vecs):
    if not len(vecs):
        return None
    n = len(vecs[0])
    out = [0.0] * n
    for v in vecs:
        for i in range(n):
            out[i] += float(v[i])
    norm = math.sqrt(sum(x * x for x in out)) or 1.0
    return [x / norm for x in out]


def pairwise_distance_matrix(
    records: Iterable[dict],
    schools: Sequence[str],
    output_field: str = "raw_output",
    school_field: str = "resolved_condition",
) -> Tuple[Dict[Tuple[str, str], float], Dict[str, int]]:
    """Compute pairwise cosine distances between school mean embeddings.

    Parameters
    ----------
    records  : iterable of result dicts (one per (sample, condition) call)
    schools  : list of school IDs to include (e.g. SCHOOL_IDS)
    output_field, school_field : record field names

    Returns
    -------
    dist_matrix : dict[(A, B)] -> cosine distance in [0, 2]
    counts      : dict[school] -> number of records included
    """
    encode, _ = get_encoder()

    # Group outputs per school
    grouped: Dict[str, List[str]] = {s: [] for s in schools}
    for rec in records:
        s = rec.get(school_field)
        if s in grouped:
            text = rec.get(output_field) or ""
            if text.strip():
                grouped[s].append(text)

    # Encode and compute mean embedding per school
    means: Dict[str, list] = {}
    for s, texts in grouped.items():
        if not texts:
            continue
        embs = encode(texts)
        means[s] = _mean(embs.tolist() if hasattr(embs, "tolist") else embs)

    # Pairwise cosine distance = 1 - cosine_similarity
    dist: Dict[Tuple[str, str], float] = {}
    keys = [s for s in schools if s in means]
    for i, a in enumerate(keys):
        for b in keys[i:]:
            if a == b:
                dist[(a, b)] = 0.0
            else:
                d = 1.0 - _cosine(means[a], means[b])
                dist[(a, b)] = d
                dist[(b, a)] = d

    counts = {s: len(grouped[s]) for s in schools}
    return dist, counts
