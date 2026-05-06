"""HumanEval loader. Reads openai/openai_humaneval parquet.

Columns: task_id, prompt, canonical_solution, test, entry_point.
We send the prompt (function signature + docstring) and ask the model to
complete the function body.
"""
from pathlib import Path
import pandas as pd


def load(datasets_dir: Path, limit: int | None = None):
    parquet = datasets_dir / "humaneval" / "test.parquet"
    if not parquet.exists():
        raise FileNotFoundError(f"HumanEval not found: {parquet}")
    df = pd.read_parquet(parquet)
    if limit:
        df = df.head(limit)
    for _, row in df.iterrows():
        prompt = (
            f"Complete the following Python function. "
            f"Return ONLY the function body (the code that comes after the signature). "
            f"Do not include the function signature or docstring.\n\n"
            f"```python\n{row['prompt']}```"
        )
        yield {
            "dataset": "humaneval",
            "sample_id": row["task_id"],
            "prompt": prompt,
            "gold": row["canonical_solution"],
            "meta": {
                "prompt_code": row["prompt"],
                "test": row["test"],
                "entry_point": row["entry_point"],
            },
        }
