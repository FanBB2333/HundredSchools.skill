"""Heuristic school-prompt router for benchmark experiments.

The router is intentionally conservative:
* Use a school prompt only where the completed experiments showed a stable gain.
* Fall back to baseline or neutral_long when the evidence is weak or noisy.

This keeps the router suitable for research comparisons without silently
replacing the strongest default (baseline) in tasks where school prompts are
often harmful.
"""
from __future__ import annotations

from dataclasses import dataclass
import json

ROUTER_AUTO = "router_auto"

HIGH_CONFIDENCE_BBH_TO_MOHIST = {
    "causal_judgement",
    "date_understanding",
    "disambiguation_qa",
    "formal_fallacies",
    "geometric_shapes",
    "logical_deduction_five_objects",
    "logical_deduction_seven_objects",
    "movie_recommendation",
    "salient_translation_error_detection",
    "temporal_sequences",
    "tracking_shuffled_objects_seven_objects",
    "word_sorting",
}

HIGH_CONFIDENCE_BBH_TO_NEUTRAL = {
    "boolean_expressions",
    "multistep_arithmetic_two",
    "navigate",
    "sports_understanding",
    "tracking_shuffled_objects_five_objects",
}

# These BBH tasks did not show a reliable gain over baseline, so the router
# should stay conservative instead of forcing a school prompt.
LOW_CONFIDENCE_BBH_TASKS = {
    "hyperbaton",
    "logical_deduction_three_objects",
    "object_counting",
    "penguins_in_a_table",
    "reasoning_about_colored_objects",
    "ruin_names",
    "snarks",
    "tracking_shuffled_objects_three_objects",
    "web_of_lies",
}

FORMAT_SENSITIVE_HINTS = (
    "reply with only",
    "answer with only",
    "exactly",
    "strictly",
    "follow the instruction",
    "letter of the correct answer",
    "do not include",
    "end your response with",
)

LOGIC_HINTS = (
    "formal fallac",
    "logical deduction",
    "causal judgement",
    "causal judgment",
    "disambiguation",
    "geometric shape",
    "translation error",
    "track",
    "shuffled object",
    "word sorting",
)

CODE_HINTS = ("python function", "```python", "function body", "entry_point")
MATH_HINTS = ("grade-school math", "math word problem", "#### <number>")


@dataclass(frozen=True)
class RouteDecision:
    condition: str
    confidence: str
    reason: str


def _sample_text(sample: dict) -> str:
    meta = sample.get("meta") or {}
    prompt = sample.get("prompt") or ""
    meta_text = json.dumps(meta, ensure_ascii=False, sort_keys=True)
    return f"{prompt}\n{meta_text}".lower()


def route_school_condition(benchmark: str, sample: dict) -> RouteDecision:
    meta = sample.get("meta") or {}
    text = _sample_text(sample)

    if benchmark == "gsm8k" or any(token in text for token in MATH_HINTS):
        return RouteDecision(
            condition="baseline",
            confidence="high",
            reason="Math word problems consistently favored baseline over school prompts.",
        )

    if benchmark == "ifeval":
        return RouteDecision(
            condition="neutral_long",
            confidence="high",
            reason="IFEval is format-sensitive and neutral_long was the safest positive condition.",
        )

    if benchmark == "mmlu":
        return RouteDecision(
            condition="neutral_long",
            confidence="medium",
            reason="Across completed MMLU runs, neutral_long had the most consistent average gain.",
        )

    if benchmark == "truthfulqa":
        return RouteDecision(
            condition="baseline",
            confidence="medium",
            reason="TruthfulQA gains were small and unstable across schools, so baseline is safer.",
        )

    if benchmark == "humaneval" or any(token in text for token in CODE_HINTS):
        return RouteDecision(
            condition="baseline",
            confidence="high",
            reason="HumanEval improvements were likely format-sensitive; keep baseline until revalidated.",
        )

    if benchmark == "bbh":
        task = str(meta.get("task") or "").strip()
        if task in HIGH_CONFIDENCE_BBH_TO_MOHIST:
            return RouteDecision(
                condition="mohist",
                confidence="high",
                reason=f"BBH task '{task}' showed a strong and repeatable gain with mohist.",
            )
        if task in HIGH_CONFIDENCE_BBH_TO_NEUTRAL:
            return RouteDecision(
                condition="neutral_long",
                confidence="high",
                reason=f"BBH task '{task}' favored neutral_long with lower regression risk.",
            )
        if task in LOW_CONFIDENCE_BBH_TASKS:
            return RouteDecision(
                condition="baseline",
                confidence="high",
                reason=f"BBH task '{task}' did not show a stable gain over baseline.",
            )
        if any(token in text for token in LOGIC_HINTS):
            return RouteDecision(
                condition="mohist",
                confidence="low",
                reason="Prompt looks like logic/disambiguation/tracking, where mohist often helped in BBH.",
            )
        return RouteDecision(
            condition="neutral_long",
            confidence="low",
            reason="Unknown BBH task: use the least risky positive condition seen on average.",
        )

    if any(token in text for token in FORMAT_SENSITIVE_HINTS):
        return RouteDecision(
            condition="neutral_long",
            confidence="low",
            reason="Prompt looks format-constrained, so prefer the safer instruction-following variant.",
        )

    if any(token in text for token in LOGIC_HINTS):
        return RouteDecision(
            condition="mohist",
            confidence="low",
            reason="Prompt looks logic-heavy, so try the school with the best BBH logic gains.",
        )

    return RouteDecision(
        condition="baseline",
        confidence="low",
        reason="No high-confidence routing signal; stay with baseline.",
    )
