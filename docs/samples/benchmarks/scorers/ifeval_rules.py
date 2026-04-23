"""IFEval rule-based scorer (strict + loose)."""
from .ifeval_lib.evaluation_lib import (
    InputExample,
    test_instruction_following_strict,
    test_instruction_following_loose,
)


def score(prediction: str, gold, meta: dict) -> dict:
    inp = InputExample(
        key=0,
        instruction_id_list=meta["instruction_id_list"],
        prompt=meta["prompt"],
        kwargs=meta["kwargs"],
    )
    p2r = {meta["prompt"]: prediction or ""}
    strict = test_instruction_following_strict(inp, p2r)
    loose = test_instruction_following_loose(inp, p2r)
    return {
        "correct": bool(strict.follow_all_instructions),  # strict prompt-level
        "strict_prompt": bool(strict.follow_all_instructions),
        "strict_inst_total": len(strict.follow_instruction_list),
        "strict_inst_correct": int(sum(strict.follow_instruction_list)),
        "loose_prompt": bool(loose.follow_all_instructions),
        "loose_inst_total": len(loose.follow_instruction_list),
        "loose_inst_correct": int(sum(loose.follow_instruction_list)),
    }
