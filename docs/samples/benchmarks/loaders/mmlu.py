"""MMLU loader. Reads cais/mmlu parquet (all subjects, test split).

Standard 4-choice MCQ. We format as:
  Question: ...
  A. ...  B. ...  C. ...  D. ...
  Answer:
and expect the model to reply with A/B/C/D.
"""
from pathlib import Path
import pandas as pd

_LABELS = ["A", "B", "C", "D"]


def load(datasets_dir: Path, limit: int | None = None):
    parquet = datasets_dir / "mmlu" / "test.parquet"
    if not parquet.exists():
        raise FileNotFoundError(f"MMLU not found: {parquet}")
    df = pd.read_parquet(parquet)
    if limit:
        n_subjects = df["subject"].nunique()
        per_subject = max(1, limit // n_subjects)
        df = df.groupby("subject", group_keys=False).head(per_subject).head(limit)
    for idx, row in df.iterrows():
        choices = row["choices"]
        choice_text = "\n".join(f"{_LABELS[i]}. {choices[i]}" for i in range(len(choices)))
        prompt = (
            f"Answer the following multiple choice question. "
            f"Reply with only the letter (A, B, C, or D) of the correct answer.\n\n"
            f"Question: {row['question']}\n{choice_text}\nAnswer:"
        )
        yield {
            "dataset": "mmlu",
            "sample_id": f"mmlu_{idx:05d}",
            "prompt": prompt,
            "gold": _LABELS[int(row["answer"])],
            "meta": {"subject": row["subject"]},
        }
