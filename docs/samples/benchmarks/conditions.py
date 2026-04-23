"""8 evaluation conditions: baseline + neutral_long + 6 schools."""
from docs.samples.run_8b_benchmark_eval import SCHOOL_PROMPTS

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

ALL_CONDITIONS = list(CONDITIONS.keys())
