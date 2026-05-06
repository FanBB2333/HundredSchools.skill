#!/usr/bin/env python3
"""Minimal OpenAI-compatible chat server backed by Transformers.

This is a fallback for local benchmark runs when vLLM cannot initialize a
model on the current GPU/kernel combination. It implements the subset of the
OpenAI API used by run_general_eval.py: POST /v1/chat/completions.
"""
from __future__ import annotations

import argparse
import asyncio
import time
import uuid
from dataclasses import dataclass
from typing import Any

import torch
from aiohttp import web
from transformers import AutoModelForCausalLM, AutoTokenizer


@dataclass
class GenerationJob:
    payload: dict[str, Any]
    future: asyncio.Future[dict[str, Any]]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--served-model-name", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument("--device-map", default="cuda:0")
    parser.add_argument("--dtype", default="bfloat16", choices=["auto", "bfloat16", "float16", "float32"])
    parser.add_argument("--max-batch-size", type=int, default=8)
    parser.add_argument("--batch-delay", type=float, default=0.05)
    parser.add_argument("--max-input-tokens", type=int, default=None)
    parser.add_argument("--request-timeout", type=float, default=900.0)
    parser.add_argument("--trust-remote-code", action="store_true", default=True)
    parser.add_argument("--enable-thinking", action="store_true")
    return parser.parse_args()


def resolve_dtype(name: str):
    if name == "auto":
        return "auto"
    return {
        "bfloat16": torch.bfloat16,
        "float16": torch.float16,
        "float32": torch.float32,
    }[name]


def request_key(payload: dict[str, Any]) -> tuple[int, float, float | None]:
    max_tokens = int(payload.get("max_tokens") or 16)
    temperature = float(payload.get("temperature") or 0.0)
    top_p_value = payload.get("top_p")
    top_p = float(top_p_value) if top_p_value is not None else None
    return max_tokens, temperature, top_p


def build_prompt(tokenizer, messages: list[dict[str, str]], enable_thinking: bool) -> str:
    return tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=enable_thinking,
    )


class ChatServer:
    def __init__(self, args: argparse.Namespace):
        self.args = args
        print(f"Loading tokenizer from {args.model_path}", flush=True)
        self.tokenizer = AutoTokenizer.from_pretrained(
            args.model_path,
            trust_remote_code=args.trust_remote_code,
        )
        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        self.tokenizer.padding_side = "left"

        print(f"Loading model from {args.model_path}", flush=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            args.model_path,
            dtype=resolve_dtype(args.dtype),
            device_map=args.device_map,
            trust_remote_code=args.trust_remote_code,
        )
        self.model.eval()
        self.device = next(self.model.parameters()).device
        self.queue: asyncio.Queue[GenerationJob] = asyncio.Queue()
        self.backlog: list[GenerationJob] = []
        print(
            f"Serving {args.served_model_name} on {args.host}:{args.port} "
            f"device={self.device} batch_size={args.max_batch_size}",
            flush=True,
        )

    async def health(self, request: web.Request) -> web.Response:
        return web.json_response({"status": "ok", "model": self.args.served_model_name})

    async def models(self, request: web.Request) -> web.Response:
        return web.json_response(
            {
                "object": "list",
                "data": [
                    {
                        "id": self.args.served_model_name,
                        "object": "model",
                        "created": int(time.time()),
                        "owned_by": "local",
                    }
                ],
            }
        )

    async def chat_completions(self, request: web.Request) -> web.Response:
        payload = await request.json()
        loop = asyncio.get_running_loop()
        future: asyncio.Future[dict[str, Any]] = loop.create_future()
        await self.queue.put(GenerationJob(payload=payload, future=future))
        try:
            result = await asyncio.wait_for(future, timeout=self.args.request_timeout)
        except asyncio.TimeoutError:
            return web.json_response({"error": "generation timeout"}, status=504)
        return web.json_response(result)

    async def worker(self) -> None:
        while True:
            first = self.backlog.pop(0) if self.backlog else await self.queue.get()
            key = request_key(first.payload)
            batch = [first]

            await asyncio.sleep(self.args.batch_delay)
            while len(batch) < self.args.max_batch_size:
                try:
                    job = self.queue.get_nowait()
                except asyncio.QueueEmpty:
                    break
                if request_key(job.payload) == key:
                    batch.append(job)
                else:
                    self.backlog.append(job)

            try:
                results = await asyncio.to_thread(self.generate_batch, batch)
                for job, result in zip(batch, results, strict=True):
                    if not job.future.done():
                        job.future.set_result(result)
            except Exception as exc:
                for job in batch:
                    if not job.future.done():
                        job.future.set_exception(exc)

    def generate_batch(self, jobs: list[GenerationJob]) -> list[dict[str, Any]]:
        max_tokens, temperature, top_p = request_key(jobs[0].payload)
        prompts = [
            build_prompt(
                self.tokenizer,
                job.payload.get("messages") or [],
                self.args.enable_thinking,
            )
            for job in jobs
        ]
        encode_kwargs: dict[str, Any] = {
            "return_tensors": "pt",
            "padding": True,
        }
        if self.args.max_input_tokens is not None:
            encode_kwargs.update({"truncation": True, "max_length": self.args.max_input_tokens})
        inputs = self.tokenizer(prompts, **encode_kwargs).to(self.device)

        generate_kwargs: dict[str, Any] = {
            "max_new_tokens": max_tokens,
            "do_sample": temperature > 0,
            "pad_token_id": self.tokenizer.pad_token_id,
            "eos_token_id": self.tokenizer.eos_token_id,
        }
        if temperature > 0:
            generate_kwargs["temperature"] = temperature
        if top_p is not None:
            generate_kwargs["top_p"] = top_p

        with torch.inference_mode():
            output_ids = self.model.generate(**inputs, **generate_kwargs)

        prompt_width = inputs["input_ids"].shape[1]
        prompt_lengths = inputs["attention_mask"].sum(dim=1).tolist()
        responses = []
        for job, sequence, prompt_len in zip(jobs, output_ids, prompt_lengths, strict=True):
            completion_ids = sequence[prompt_width:]
            content = self.tokenizer.decode(completion_ids, skip_special_tokens=True)
            completion_tokens = int(completion_ids.numel())
            prompt_tokens = int(prompt_len)
            responses.append(
                {
                    "id": f"chatcmpl-{uuid.uuid4().hex}",
                    "object": "chat.completion",
                    "created": int(time.time()),
                    "model": job.payload.get("model") or self.args.served_model_name,
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": content},
                            "finish_reason": "stop",
                        }
                    ],
                    "usage": {
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "total_tokens": prompt_tokens + completion_tokens,
                    },
                }
            )
        return responses


async def create_app(args: argparse.Namespace) -> web.Application:
    server = ChatServer(args)
    app = web.Application()
    app.add_routes(
        [
            web.get("/health", server.health),
            web.get("/v1/models", server.models),
            web.post("/v1/chat/completions", server.chat_completions),
        ]
    )

    async def start_worker(app: web.Application) -> None:
        app["worker_task"] = asyncio.create_task(server.worker())

    async def stop_worker(app: web.Application) -> None:
        task = app.get("worker_task")
        if task is not None:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    app.on_startup.append(start_worker)
    app.on_cleanup.append(stop_worker)
    return app


def main() -> None:
    args = parse_args()
    web.run_app(create_app(args), host=args.host, port=args.port)


if __name__ == "__main__":
    main()
