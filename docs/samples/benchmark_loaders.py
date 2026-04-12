"""
Benchmark Loaders for HundredSchools Official Evaluation

Loads 4 benchmark datasets from local files and produces unified sample format:
{
    "dataset": str,        # Dataset name
    "sample_id": str,      # Unique ID within dataset
    "prompt": str,         # The input prompt
    "expected_binary": str, # "safe" or "unsafe"
    "group": str,          # Category/type for grouping (optional)
    "risk_type": str,      # Risk type if available (optional)
    "metadata": dict,      # Original fields preserved
}

Usage:
    python benchmark_loaders.py --summary
    python benchmark_loaders.py --dataset simple_safety_tests --limit 5
"""

import argparse
import csv
import json
from pathlib import Path
from typing import Generator, Iterator

# Base directory for datasets
DATASETS_DIR = Path(__file__).parent.parent.parent / "datasets"


def load_simple_safety_tests(limit: int | None = None) -> Iterator[dict]:
    """
    Load SimpleSafetyTests dataset.
    
    Source: https://huggingface.co/datasets/Bertievidgen/SimpleSafetyTests
    - 100 harmful prompts designed to test refusal
    - All samples should be classified as unsafe
    """
    csv_path = DATASETS_DIR / "simple_safety_tests" / "sst_test_cases.csv"
    
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    
    count = 0
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if limit and count >= limit:
                break
            
            yield {
                "dataset": "simple_safety_tests",
                "sample_id": row["id"],
                "prompt": row["prompt"],
                "expected_binary": "unsafe",  # All prompts are harmful
                "group": row.get("harm_area", ""),
                "risk_type": row.get("category", ""),
                "metadata": {
                    "harm_area": row.get("harm_area", ""),
                    "category": row.get("category", ""),
                    "counter": row.get("counter", ""),
                },
            }
            count += 1


def load_xstest(limit: int | None = None) -> Iterator[dict]:
    """
    Load XSTest dataset.
    
    Source: https://huggingface.co/datasets/Paul/XSTest
    - 450 prompts (250 safe + 200 unsafe)
    - Tests exaggerated safety / over-refusal
    - label == "safe" -> expected safe; others -> expected unsafe
    """
    csv_path = DATASETS_DIR / "xstest" / "xstest_prompts.csv"
    
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    
    count = 0
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if limit and count >= limit:
                break
            
            # Map label to binary
            label = row.get("label", "").strip().lower()
            expected = "safe" if label == "safe" else "unsafe"
            
            yield {
                "dataset": "xstest",
                "sample_id": str(row["id"]),
                "prompt": row["prompt"],
                "expected_binary": expected,
                "group": row.get("type", ""),
                "risk_type": row.get("focus", ""),
                "metadata": {
                    "type": row.get("type", ""),
                    "label": row.get("label", ""),
                    "focus": row.get("focus", ""),
                    "note": row.get("note", ""),
                },
            }
            count += 1


def load_or_bench_hard(limit: int | None = None) -> Iterator[dict]:
    """
    Load OR-Bench Hard dataset.
    
    Source: https://huggingface.co/datasets/bench-llm/or-bench
    - 1318 hard safe prompts (looks suspicious but should be allowed)
    - Tests over-refusal on edge cases
    - All samples should be classified as safe
    """
    csv_path = DATASETS_DIR / "or_bench" / "or-bench-hard-1k.csv"
    
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    
    count = 0
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            if limit and count >= limit:
                break
            
            yield {
                "dataset": "or_bench_hard",
                "sample_id": str(idx),
                "prompt": row["prompt"],
                "expected_binary": "safe",  # All are safe prompts
                "group": row.get("category", ""),
                "risk_type": None,
                "metadata": {
                    "category": row.get("category", ""),
                },
            }
            count += 1


def load_s_eval_zh_small(limit: int | None = None) -> Iterator[dict]:
    """
    Load S-Eval Chinese small dataset.
    
    Source: https://huggingface.co/datasets/IS2Lab/S-Eval
    - 1000 Chinese harmful prompts
    - Tests risk detection in Chinese
    - All samples should be classified as unsafe
    """
    jsonl_path = DATASETS_DIR / "s_eval" / "S-Eval_base_risk_zh_small.jsonl"
    
    if not jsonl_path.exists():
        raise FileNotFoundError(f"Dataset not found: {jsonl_path}")
    
    count = 0
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            if limit and count >= limit:
                break
            
            if not line.strip():
                continue
            
            row = json.loads(line)
            
            yield {
                "dataset": "s_eval_zh_small",
                "sample_id": row.get("traceid", str(idx)),
                "prompt": row["prompt"],
                "expected_binary": "unsafe",  # All are harmful
                "group": row.get("risk_type", ""),
                "risk_type": row.get("risk_type", ""),
                "metadata": {
                    "traceid": row.get("traceid", ""),
                    "risk_type": row.get("risk_type", ""),
                    "ext": row.get("ext", ""),
                },
            }
            count += 1


# Dataset registry
LOADERS = {
    "simple_safety_tests": load_simple_safety_tests,
    "xstest": load_xstest,
    "or_bench_hard": load_or_bench_hard,
    "s_eval_zh_small": load_s_eval_zh_small,
}

ALL_DATASETS = list(LOADERS.keys())


def load_dataset(name: str, limit: int | None = None) -> Iterator[dict]:
    """Load a dataset by name."""
    if name not in LOADERS:
        raise ValueError(f"Unknown dataset: {name}. Available: {ALL_DATASETS}")
    return LOADERS[name](limit=limit)


def load_all_datasets(limit: int | None = None) -> Generator[tuple[str, Iterator[dict]], None, None]:
    """Load all datasets, yielding (dataset_name, samples_iterator) pairs."""
    for name in ALL_DATASETS:
        yield name, load_dataset(name, limit=limit)


def get_dataset_stats(name: str) -> dict:
    """Get statistics for a dataset."""
    samples = list(load_dataset(name))
    
    safe_count = sum(1 for s in samples if s["expected_binary"] == "safe")
    unsafe_count = sum(1 for s in samples if s["expected_binary"] == "unsafe")
    
    groups = {}
    for s in samples:
        g = s["group"] or "unknown"
        groups[g] = groups.get(g, 0) + 1
    
    return {
        "name": name,
        "total": len(samples),
        "safe": safe_count,
        "unsafe": unsafe_count,
        "groups": groups,
    }


def print_summary():
    """Print summary of all datasets."""
    print("=" * 70)
    print("BENCHMARK DATASETS SUMMARY")
    print("=" * 70)
    print()
    
    total_samples = 0
    
    for name in ALL_DATASETS:
        try:
            stats = get_dataset_stats(name)
            total_samples += stats["total"]
            
            print(f"📊 {name}")
            print(f"   Total: {stats['total']} samples")
            print(f"   Safe: {stats['safe']} | Unsafe: {stats['unsafe']}")
            
            if stats["groups"]:
                print(f"   Groups ({len(stats['groups'])}):")
                for g, c in sorted(stats["groups"].items(), key=lambda x: -x[1])[:5]:
                    print(f"     - {g}: {c}")
                if len(stats["groups"]) > 5:
                    print(f"     ... and {len(stats['groups']) - 5} more")
            print()
            
        except FileNotFoundError as e:
            print(f"❌ {name}: NOT FOUND")
            print(f"   {e}")
            print()
    
    print("=" * 70)
    print(f"TOTAL: {total_samples} samples across {len(ALL_DATASETS)} datasets")
    print(f"Expected API calls: {total_samples} samples × 7 conditions = {total_samples * 7}")
    print("=" * 70)


def print_samples(dataset: str, limit: int = 5):
    """Print sample prompts from a dataset."""
    print(f"\n📝 Sample prompts from {dataset}:")
    print("-" * 50)
    
    for i, sample in enumerate(load_dataset(dataset, limit=limit)):
        prompt_preview = sample["prompt"][:100] + "..." if len(sample["prompt"]) > 100 else sample["prompt"]
        print(f"\n[{sample['sample_id']}] ({sample['expected_binary']})")
        print(f"  Group: {sample['group']}")
        print(f"  Prompt: {prompt_preview}")


def main():
    parser = argparse.ArgumentParser(description="Benchmark dataset loaders")
    parser.add_argument("--summary", action="store_true", help="Print summary of all datasets")
    parser.add_argument("--dataset", type=str, choices=ALL_DATASETS, help="Show samples from specific dataset")
    parser.add_argument("--limit", type=int, default=5, help="Number of samples to show")
    args = parser.parse_args()
    
    if args.summary:
        print_summary()
    elif args.dataset:
        print_samples(args.dataset, args.limit)
    else:
        # Default: print summary
        print_summary()


if __name__ == "__main__":
    main()
