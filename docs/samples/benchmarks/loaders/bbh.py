"""BBH (BIG-Bench Hard) loader. Reads per-subtask jsonl files from lukaemon/bbh.

Each subtask file has {"task": ..., "input": ..., "target": ...}.
We use the standard CoT prompt format: present the input and ask for the answer
after "So the answer is".
"""
from pathlib import Path
import json


def load(datasets_dir: Path, limit: int | None = None):
    bbh_dir = datasets_dir / "bbh"
    if not bbh_dir.exists():
        raise FileNotFoundError(f"BBH not found: {bbh_dir}")
    jsonl_files = sorted(bbh_dir.glob("*.jsonl"))
    if not jsonl_files:
        raise FileNotFoundError(f"No jsonl files in {bbh_dir}")
    count = 0
    per_task_limit = None
    if limit:
        per_task_limit = max(1, limit // len(jsonl_files))
    for jf in jsonl_files:
        task_count = 0
        with open(jf, "r", encoding="utf-8") as f:
            for line in f:
                if per_task_limit and task_count >= per_task_limit:
                    break
                if limit and count >= limit:
                    return
                row = json.loads(line)
                task = row.get("task", jf.stem)
                prompt = (
                    f"Answer the following question. Think step by step. "
                    f"End your response with \"So the answer is <answer>.\"\n\n"
                    f"{row['input']}"
                )
                yield {
                    "dataset": "bbh",
                    "sample_id": f"{task}_{task_count:04d}",
                    "prompt": prompt,
                    "gold": row["target"].strip(),
                    "meta": {"task": task},
                }
                task_count += 1
                count += 1
