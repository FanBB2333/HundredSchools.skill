"""TruthfulQA MC1 loader. Reads truthfulqa/truthful_qa multiple_choice parquet.

MC1: single correct answer among choices. We format as standard MCQ and expect
the model to reply with a letter.
"""
from pathlib import Path
import pandas as pd
import string

_LABELS = list(string.ascii_uppercase)  # A, B, C, ...


def load(datasets_dir: Path, limit: int | None = None):
    parquet = datasets_dir / "truthfulqa" / "mc.parquet"
    if not parquet.exists():
        raise FileNotFoundError(f"TruthfulQA not found: {parquet}")
    df = pd.read_parquet(parquet)
    if limit:
        df = df.head(limit)
    for idx, row in df.iterrows():
        mc1 = row["mc1_targets"]
        choices = list(mc1["choices"])
        labels = list(mc1["labels"])
        gold_idx = labels.index(1)
        choice_text = "\n".join(
            f"{_LABELS[i]}. {choices[i]}" for i in range(len(choices))
        )
        prompt = (
            f"Answer the following multiple choice question. "
            f"Reply with only the letter of the correct answer.\n\n"
            f"Question: {row['question']}\n{choice_text}\nAnswer:"
        )
        yield {
            "dataset": "truthfulqa",
            "sample_id": f"tqa_{idx:04d}",
            "prompt": prompt,
            "gold": _LABELS[gold_idx],
            "meta": {},
        }
