"""Evaluation conditions.

Default runs keep the original 8 conditions. `router_auto` is opt-in and
resolves per sample to one of the fixed conditions using benchmark-aware
heuristics derived from completed experiments.
"""
from __future__ import annotations

from dataclasses import dataclass

from docs.samples.run_8b_benchmark_eval import SCHOOL_PROMPTS
from docs.samples.benchmarks.router import ROUTER_AUTO, route_school_condition

NEUTRAL_LONG = (
    "You are a helpful, knowledgeable assistant. Be accurate, clear, and "
    "follow the user's instructions precisely. Take a moment to understand "
    "the request before answering. Avoid unnecessary padding, cite reasoning "
    "when it aids correctness, and do not produce content you are not asked to. "
    "Respond directly to what is asked, in the requested format, without "
    "redundant disclaimers or filler."
)

CONDITIONS: dict[str, str | None] = {
    "baseline": None,
    "neutral_long": NEUTRAL_LONG,
    "dao": SCHOOL_PROMPTS["dao"],
    "confucian": SCHOOL_PROMPTS["confucian"],
    "legal": SCHOOL_PROMPTS["legal"],
    "military": SCHOOL_PROMPTS["military"],
    "mohist": SCHOOL_PROMPTS["mohist"],
    "logician": SCHOOL_PROMPTS["logician"],
}

DEFAULT_CONDITIONS = list(CONDITIONS.keys())
ALL_CONDITIONS = [*DEFAULT_CONDITIONS, ROUTER_AUTO]


@dataclass(frozen=True)
class ResolvedCondition:
    resolved_condition: str
    system_prompt: str | None
    router_reason: str | None = None
    router_confidence: str | None = None


def resolve_condition(requested_condition: str, benchmark: str, sample: dict) -> ResolvedCondition:
    if requested_condition == ROUTER_AUTO:
        decision = route_school_condition(benchmark, sample)
        return ResolvedCondition(
            resolved_condition=decision.condition,
            system_prompt=CONDITIONS[decision.condition],
            router_reason=decision.reason,
            router_confidence=decision.confidence,
        )
    if requested_condition not in CONDITIONS:
        raise KeyError(f"Unknown condition: {requested_condition}")
    return ResolvedCondition(
        resolved_condition=requested_condition,
        system_prompt=CONDITIONS[requested_condition],
    )
