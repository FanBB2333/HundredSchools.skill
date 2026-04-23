"""IFEval loader. HF format: google/IFEval ifeval_input_data.jsonl."""
from pathlib import Path
import json


def load(datasets_dir: Path, limit: int | None = None):
    jsonl = datasets_dir / "ifeval" / "ifeval_input_data.jsonl"
    if not jsonl.exists():
        raise FileNotFoundError(f"IFEval not found: {jsonl}")
    with open(jsonl, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if limit and i >= limit:
                break
            row = json.loads(line)
            yield {
                "dataset": "ifeval",
                "sample_id": str(row["key"]),
                "prompt": row["prompt"],
                "gold": None,
                "meta": {
                    "instruction_id_list": row["instruction_id_list"],
                    "kwargs": row["kwargs"],
                    "prompt": row["prompt"],
                },
            }
