"""HumanEval code execution scorer.

Extracts code from model output, prepends the function signature (prompt_code),
appends the test harness, and runs in a subprocess with resource limits.
pass@1: the test passes or not.
"""
import re
import subprocess
import tempfile
from pathlib import Path


def _extract_code(prediction: str, prompt_code: str) -> str:
    """Extract the function body from model output."""
    # Try to find a python code block
    m = re.search(r"```(?:python)?\s*\n(.+?)```", prediction, re.DOTALL)
    if m:
        code = m.group(1)
        # If the code block contains the full function (with def), use as-is
        if "def " in code:
            return code
        # Otherwise treat it as the function body
        return prompt_code + code

    # No code block: try to use the raw text as function body
    # Strip any leading explanation text
    lines = prediction.split("\n")
    code_lines = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        if not in_code:
            # Look for indented code or common code patterns
            if (line.startswith("    ") or line.startswith("\t") or
                    stripped.startswith("def ") or stripped.startswith("return ") or
                    stripped.startswith("if ") or stripped.startswith("for ") or
                    stripped.startswith("while ") or stripped.startswith("#")):
                in_code = True
                code_lines.append(line)
        else:
            code_lines.append(line)

    if code_lines:
        body = "\n".join(code_lines)
        if "def " in body:
            return body
        return prompt_code + body

    # Last resort: just append everything as the body
    return prompt_code + "    " + prediction.replace("\n", "\n    ")


def score(prediction: str, gold: str, meta: dict) -> dict:
    prompt_code = meta["prompt_code"]
    test_code = meta["test"]
    entry_point = meta["entry_point"]

    full_code = _extract_code(prediction, prompt_code)
    # Append the test harness
    program = f"{full_code}\n\n{test_code}\n\ncheck({entry_point})\n"

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(program)
        tmp_path = f.name

    try:
        result = subprocess.run(
            ["python", tmp_path],
            capture_output=True,
            text=True,
            timeout=10,
            env={"PATH": "/usr/bin:/usr/local/bin:/root/miniforge3/envs/torch/bin"},
        )
        passed = result.returncode == 0
        return {
            "correct": passed,
            "returncode": result.returncode,
            "stderr": result.stderr[:500] if result.stderr else "",
        }
    except subprocess.TimeoutExpired:
        return {"correct": False, "returncode": -1, "stderr": "timeout"}
    except Exception as e:
        return {"correct": False, "returncode": -1, "stderr": str(e)[:500]}
    finally:
        Path(tmp_path).unlink(missing_ok=True)
