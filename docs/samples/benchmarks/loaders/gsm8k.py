"""GSM8K loader. HF format: openai/gsm8k 'main' split parquet."""
from pathlib import Path
import pandas as pd

GSM8K_INSTRUCTION = (
    "Solve the following grade-school math word problem. Show your reasoning, "
    "then on the final line write exactly: \"#### <number>\" where <number> is "
    "the final numeric answer."
)


def _extract_gold(answer_field: str) -> str:
    # GSM8K answers end with "#### <number>"
    if "####" in answer_field:
        return answer_field.split("####")[-1].strip().replace(",", "")
    return answer_field.strip()


def load(datasets_dir: Path, limit: int | None = None):
    parquet = datasets_dir / "gsm8k" / "main" / "test-00000-of-00001.parquet"
    if not parquet.exists():
        raise FileNotFoundError(f"GSM8K not found: {parquet}")
    df = pd.read_parquet(parquet)
    if limit:
        df = df.head(limit)
    for idx, row in df.iterrows():
        yield {
            "dataset": "gsm8k",
            "sample_id": f"test_{idx:04d}",
            "prompt": f"{GSM8K_INSTRUCTION}\n\nProblem: {row['question']}",
            "gold": _extract_gold(row["answer"]),
            "meta": {},
        }
