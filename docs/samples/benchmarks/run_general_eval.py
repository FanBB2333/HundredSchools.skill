#!/usr/bin/env python3
"""HundredSchools general-capability benchmark runner.

Runs benchmarks (gsm8k, ifeval, ...) across (preset, condition) pairs against a
vLLM OpenAI-compatible endpoint. Streams results to JSONL for resume safety.

Example
-------
    python run_general_eval.py \
        --preset qwen3.5-0.8b-it \
        --benchmarks gsm8k ifeval \
        --conditions baseline neutral_long mohist legal \
        --limit 50

Run from repo root so `docs.samples.*` imports resolve.
"""
from __future__ import annotations

import argparse
import asyncio
import fcntl
import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT))

from openai import AsyncOpenAI  # noqa: E402

from docs.samples.benchmarks.conditions import (  # noqa: E402
    ALL_CONDITIONS,
    DEFAULT_CONDITIONS,
    resolve_condition,
)
from docs.samples.benchmarks.models import PRESETS, BENCHMARK_DECODING  # noqa: E402
from docs.samples.benchmarks.loaders import gsm8k as gsm8k_loader  # noqa: E402
from docs.samples.benchmarks.loaders import ifeval as ifeval_loader  # noqa: E402
from docs.samples.benchmarks.loaders import mmlu as mmlu_loader  # noqa: E402
from docs.samples.benchmarks.loaders import bbh as bbh_loader  # noqa: E402
from docs.samples.benchmarks.loaders import humaneval as humaneval_loader  # noqa: E402
from docs.samples.benchmarks.loaders import truthfulqa as truthfulqa_loader  # noqa: E402
from docs.samples.benchmarks.scorers import numeric as numeric_scorer  # noqa: E402
from docs.samples.benchmarks.scorers import ifeval_rules as ifeval_scorer  # noqa: E402
from docs.samples.benchmarks.scorers import mcq as mcq_scorer  # noqa: E402
from docs.samples.benchmarks.scorers import bbh_router as bbh_scorer  # noqa: E402
from docs.samples.benchmarks.scorers import code_exec as code_exec_scorer  # noqa: E402

LOADERS = {
    "gsm8k": gsm8k_loader.load,
    "ifeval": ifeval_loader.load,
    "mmlu": mmlu_loader.load,
    "bbh": bbh_loader.load,
    "humaneval": humaneval_loader.load,
    "truthfulqa": truthfulqa_loader.load,
}

SCORERS = {
    "gsm8k": numeric_scorer.score,
    "ifeval": ifeval_scorer.score,
    "mmlu": mcq_scorer.score,
    "bbh": bbh_scorer.score,
    "humaneval": code_exec_scorer.score,
    "truthfulqa": mcq_scorer.score,
}

ALL_BENCHMARKS = list(LOADERS.keys())

DATASETS_DIR = Path.home() / "datasets"
RESULTS_DIR = Path(__file__).parent / "results"


def make_key(preset: str, benchmark: str, condition: str, sample_id: str) -> str:
    return f"{preset}::{benchmark}::{condition}::{sample_id}"


def load_completed(output_file: Path) -> set[str]:
    done = set()
    if not output_file.exists():
        return done
    with open(output_file, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                r = json.loads(line)
                done.add(make_key(r["preset"], r["benchmark"], r["condition"], r["sample_id"]))
            except Exception:
                continue
    return done


async def call_chat(
    client: AsyncOpenAI,
    model: str,
    system_prompt: str | None,
    user_prompt: str,
    max_tokens: int,
    temperature: float,
    top_p: float | None,
    timeout: float,
    max_retries: int = 3,
) -> dict:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_prompt})
    last_err = None
    for attempt in range(max_retries):
        try:
            t0 = time.time()
            kwargs = dict(model=model, messages=messages, max_tokens=max_tokens, temperature=temperature)
            if top_p is not None:
                kwargs["top_p"] = top_p
            resp = await asyncio.wait_for(client.chat.completions.create(**kwargs), timeout=timeout)
            latency_ms = int((time.time() - t0) * 1000)
            content = resp.choices[0].message.content or ""
            return {
                "raw_output": content,
                "latency_ms": latency_ms,
                "tokens": resp.usage.completion_tokens if resp.usage else 0,
                "error": None,
                "retries": attempt,
            }
        except asyncio.TimeoutError:
            last_err = f"timeout {timeout}s"
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
        await asyncio.sleep(1.5 * (attempt + 1))
    return {"raw_output": "", "latency_ms": 0, "tokens": 0, "error": last_err, "retries": max_retries}


async def run(args):
    preset_cfg = PRESETS[args.preset]
    api_base = args.api_base or preset_cfg["api_base"]
    model_name = args.model or preset_cfg["model"]
    concurrency = args.concurrency or preset_cfg["concurrency"]

    output_file = Path(args.output)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    completed = load_completed(output_file) if args.resume else set()
    if not args.resume and output_file.exists():
        output_file.unlink()

    # Build task list
    tasks = []
    for bench in args.benchmarks:
        loader = LOADERS[bench]
        samples = list(loader(args.datasets_dir, limit=args.limit))
        if args.shard_count > 1:
            samples = [
                sample
                for idx, sample in enumerate(samples)
                if idx % args.shard_count == args.shard_index
            ]
        for sample in samples:
            for cond in args.conditions:
                key = make_key(args.preset, bench, cond, sample["sample_id"])
                if key not in completed:
                    tasks.append((bench, sample, cond, key))

    total = len(tasks) + len(completed)
    print(f"Preset={args.preset} model={model_name} api={api_base}")
    print(f"Benchmarks={args.benchmarks} conditions={args.conditions}")
    if args.shard_count > 1:
        print(f"Shard={args.shard_index}/{args.shard_count}")
    print(f"Tasks total={total} remaining={len(tasks)} completed={len(completed)} concurrency={concurrency}")
    print(f"Output: {output_file}")
    if not tasks:
        print("Nothing to do.")
        return

    client = AsyncOpenAI(base_url=api_base, api_key="not-needed")
    sem = asyncio.Semaphore(concurrency)
    done_count = 0
    correct_count = 0
    err_count = 0
    t_start = time.time()
    write_lock = asyncio.Lock()

    async def process(bench, sample, cond, key):
        nonlocal done_count, correct_count, err_count
        dec = BENCHMARK_DECODING.get(bench, {})
        max_tokens = dec.get("max_tokens", preset_cfg["max_tokens"])
        temperature = dec.get("temperature", preset_cfg["temperature"])
        top_p = dec.get("top_p")
        timeout = args.timeout
        resolved = resolve_condition(cond, bench, sample)
        async with sem:
            res = await call_chat(client, model_name, resolved.system_prompt, sample["prompt"],
                                  max_tokens, temperature, top_p, timeout)
        try:
            score = SCORERS[bench](res["raw_output"], sample.get("gold"), sample.get("meta") or {})
        except Exception as e:
            score = {"correct": False, "scorer_error": f"{type(e).__name__}: {e}"}
        record = {
            "preset": args.preset,
            "model": model_name,
            "benchmark": bench,
            "condition": cond,
            "resolved_condition": resolved.resolved_condition,
            "sample_id": sample["sample_id"],
            "gold": sample.get("gold"),
            "raw_output": res["raw_output"],
            "score": score,
            "latency_ms": res["latency_ms"],
            "tokens": res["tokens"],
            "error": res["error"],
            "ts": datetime.now().isoformat(timespec="seconds"),
        }
        if resolved.router_reason is not None:
            record["router_reason"] = resolved.router_reason
            record["router_confidence"] = resolved.router_confidence
        async with write_lock:
            with open(output_file, "a", encoding="utf-8") as f:
                fcntl.flock(f.fileno(), fcntl.LOCK_EX)
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
                fcntl.flock(f.fileno(), fcntl.LOCK_UN)
            done_count += 1
            if score.get("correct"):
                correct_count += 1
            if res["error"]:
                err_count += 1
            if done_count % 20 == 0 or done_count == len(tasks):
                elapsed = time.time() - t_start
                rate = done_count / max(elapsed, 1e-6)
                eta = timedelta(seconds=int((len(tasks) - done_count) / max(rate, 1e-9)))
                acc = correct_count / done_count
                print(f"[{done_count}/{len(tasks)}] acc={acc:.3f} err={err_count} "
                      f"elapsed={timedelta(seconds=int(elapsed))} eta={eta}")

    await asyncio.gather(*[process(b, s, c, k) for (b, s, c, k) in tasks])
    print(f"DONE. correct={correct_count}/{len(tasks)} err={err_count} "
          f"elapsed={timedelta(seconds=int(time.time()-t_start))}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--preset", required=True, choices=list(PRESETS.keys()))
    p.add_argument("--benchmarks", nargs="+", default=ALL_BENCHMARKS, choices=ALL_BENCHMARKS)
    p.add_argument("--conditions", nargs="+", default=DEFAULT_CONDITIONS, choices=ALL_CONDITIONS)
    p.add_argument("--limit", type=int, default=None, help="limit samples per benchmark")
    p.add_argument("--datasets-dir", type=Path, default=DATASETS_DIR)
    p.add_argument("--output", type=Path, default=None)
    p.add_argument("--api-base", default=None)
    p.add_argument("--model", default=None)
    p.add_argument("--concurrency", type=int, default=None)
    p.add_argument("--timeout", type=float, default=120.0)
    p.add_argument("--resume", action="store_true")
    p.add_argument("--shard-index", type=int, default=0, help="0-based sample shard index")
    p.add_argument("--shard-count", type=int, default=1, help="number of sample shards")
    args = p.parse_args()
    if args.shard_count < 1:
        p.error("--shard-count must be >= 1")
    if args.shard_index < 0 or args.shard_index >= args.shard_count:
        p.error("--shard-index must be in [0, shard-count)")

    if args.output is None:
        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        args.output = RESULTS_DIR / f"{args.preset}.jsonl"

    asyncio.run(run(args))


if __name__ == "__main__":
    main()
