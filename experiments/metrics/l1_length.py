"""L1 — output length ratio.

length_ratio(output, baseline_output)
    = len(output) / len(baseline_output)
    when baseline_output is given; otherwise falls back to a fixed
    reference length.

Operates on raw text (character count). For token-based ratios the
benchmark records also store `tokens`, which is preferable when
available — the analysis notebook uses tokens by default and falls back
to characters.
"""
from __future__ import annotations


def length_ratio(output: str, baseline: str | None = None, fallback_chars: int = 600) -> float:
    out_len = max(len(output), 1)
    base_len = max(len(baseline) if baseline else fallback_chars, 1)
    return out_len / base_len
