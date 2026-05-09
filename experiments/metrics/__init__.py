"""L1-L6 metrics for the HundredSchools tech-report experiments.

L1: output length ratio          (output_len / baseline_len)
L2: marker recall                (school fidelity by marker dict)
L3: pairwise school distance     (cosine in embedding space)
L4: cross-size school identity   (cosine across model sizes)
L5: task accuracy / score        (delegated to existing scorers)
L6: overuse-failure trigger rate (anti-markers per school)

L1, L2, L6 are computable per-record with no external model.
L3, L4 require a sentence embedding model — sentence-transformers is the
default; we fall back to TF-IDF when the model is unavailable.
L5 is computed by the standard scorers in
docs.samples.benchmarks.scorers and is referenced from the analysis
notebook rather than re-implemented here.
"""
from .l1_length import length_ratio
from .l2_marker_recall import marker_recall
from .l3_pairwise_distance import pairwise_distance_matrix
from .l4_cross_size_identity import cross_size_identity
from .l6_overuse_triggers import overuse_trigger_rate

__all__ = [
    "length_ratio",
    "marker_recall",
    "pairwise_distance_matrix",
    "cross_size_identity",
    "overuse_trigger_rate",
]
