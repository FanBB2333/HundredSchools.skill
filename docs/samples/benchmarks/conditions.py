"""Evaluation conditions.

Conditions cover the full HundredSchools v0.4 framework:
    - 6 Pre-Qin core schools
    - 8 Later additions (Western + Yangming)
    - 4 baselines: vanilla, neutral_long, cot, random_school
    - 1 dynamic option: router_auto

The 4 baselines map to tech-report-plan §8 (B1-B5):
    B1 vanilla            -> "baseline"
    B2 generic helpful    -> "neutral_long"
    B3 CoT                -> "cot"
    B4 best-fit prompt-eng -> per-task; selected outside this file
    B5 random-school      -> "random_school" (resolved per-sample)

`router_auto` is opt-in and resolves per sample to one of the fixed
conditions using benchmark-aware heuristics derived from completed
experiments.
"""
from __future__ import annotations

import random
from dataclasses import dataclass

from docs.samples.run_8b_benchmark_eval import SCHOOL_PROMPTS
from docs.samples.benchmarks.router import ROUTER_AUTO, route_school_condition

# ─── Baseline prompts ─────────────────────────────────────────────

NEUTRAL_LONG = (
    "You are a helpful, knowledgeable assistant. Be accurate, clear, and "
    "follow the user's instructions precisely. Take a moment to understand "
    "the request before answering. Avoid unnecessary padding, cite reasoning "
    "when it aids correctness, and do not produce content you are not asked to. "
    "Respond directly to what is asked, in the requested format, without "
    "redundant disclaimers or filler."
)

COT_PROMPT = (
    "You are a careful reasoning assistant. Think step by step before "
    "answering. Show your reasoning, then give the final answer clearly. "
    "Use chain-of-thought to break complex problems into smaller steps."
)

# ─── 14 schools + 3 fixed baselines (vanilla / neutral / cot) ──────

# Pre-Qin core (6) ordered first; later additions (8) ordered next.
SCHOOL_IDS = [
    # Pre-Qin core
    "dao", "confucian", "legal", "military", "mohist", "logician",
    # Later additions
    "socratic", "stoic", "falsificationist",
    "hegelian", "pragmatist", "yangming",
    "bacon", "wittgenstein",
]

CONDITIONS: dict[str, str | None] = {
    "baseline": None,
    "neutral_long": NEUTRAL_LONG,
    "cot": COT_PROMPT,
}
for _sid in SCHOOL_IDS:
    if _sid in SCHOOL_PROMPTS:
        CONDITIONS[_sid] = SCHOOL_PROMPTS[_sid]

# random_school is a special meta-condition resolved per-sample.
RANDOM_SCHOOL = "random_school"

DEFAULT_CONDITIONS = list(CONDITIONS.keys())
ALL_CONDITIONS = [*DEFAULT_CONDITIONS, RANDOM_SCHOOL, ROUTER_AUTO]


@dataclass(frozen=True)
class ResolvedCondition:
    resolved_condition: str
    system_prompt: str | None
    router_reason: str | None = None
    router_confidence: str | None = None


def _random_school_for_sample(sample: dict, seed_salt: str = "hs-random-school") -> str:
    """Deterministically pick a school from SCHOOL_IDS using sample_id hash.

    Determinism matters: rerunning the benchmark must pick the same school
    for each sample so results are reproducible.
    """
    key = f"{seed_salt}::{sample.get('sample_id', '')}::{sample.get('dataset', '')}"
    rng = random.Random(key)
    return rng.choice(SCHOOL_IDS)


def resolve_condition(requested_condition: str, benchmark: str, sample: dict) -> ResolvedCondition:
    if requested_condition == ROUTER_AUTO:
        decision = route_school_condition(benchmark, sample)
        return ResolvedCondition(
            resolved_condition=decision.condition,
            system_prompt=CONDITIONS[decision.condition],
            router_reason=decision.reason,
            router_confidence=decision.confidence,
        )
    if requested_condition == RANDOM_SCHOOL:
        chosen = _random_school_for_sample(sample)
        return ResolvedCondition(
            resolved_condition=chosen,
            system_prompt=CONDITIONS[chosen],
            router_reason="random_school baseline (deterministic by sample_id)",
            router_confidence="n/a",
        )
    if requested_condition not in CONDITIONS:
        raise KeyError(f"Unknown condition: {requested_condition}")
    return ResolvedCondition(
        resolved_condition=requested_condition,
        system_prompt=CONDITIONS[requested_condition],
    )
