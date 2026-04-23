"""Model preset registry. Each preset points to a vLLM OpenAI-compatible endpoint.

Per-benchmark overrides allow temperature / max_tokens to differ
(e.g. HumanEval typically uses temperature=0.2).
"""

PRESETS = {
    "qwen3.5-0.8b-it": {
        "api_base": "http://localhost:8001/v1",
        "model": "qwen3.5-0.8b",
        "hf_path": "/home/l1ght/models/Qwen/Qwen3.5-0.8B",
        "concurrency": 16,
        "max_tokens": 1024,
        "temperature": 0.0,
        # Paper baseline (Qwen3.5 README, non-thinking mode)
        "paper_baseline": {
            "mmlu_redux": 64.4,
            "ifeval": 68.2,
            "mmlu_pro": 29.7,
        },
    },
    "qwen3.5-2b-it": {
        "api_base": "http://localhost:8001/v1",
        "model": "qwen3.5-2b",
        "hf_path": "/home/l1ght/models/Qwen/Qwen3.5-2B",
        "concurrency": 12,
        "max_tokens": 1024,
        "temperature": 0.0,
        "paper_baseline": {
            "mmlu_redux": 73.9,
            "ifeval": 72.5,
            "mmlu_pro": 55.3,
        },
    },
    "gemma4-e2b-it": {
        "api_base": "http://localhost:8001/v1",
        "model": "gemma4-e2b",
        "hf_path": "/home/l1ght/models/google/gemma-4-E2B-it",
        "concurrency": 8,
        "max_tokens": 1024,
        "temperature": 0.0,
        "paper_baseline": {},
    },
}

# Per-benchmark decoding overrides
BENCHMARK_DECODING = {
    "gsm8k":      {"temperature": 0.0, "max_tokens": 1024},
    "ifeval":     {"temperature": 0.0, "max_tokens": 1280},
    "mmlu":       {"temperature": 0.0, "max_tokens": 16},
    "bbh":        {"temperature": 0.0, "max_tokens": 512},
    "humaneval":  {"temperature": 0.2, "top_p": 0.95, "max_tokens": 768},
    "truthfulqa": {"temperature": 0.0, "max_tokens": 16},
}
