# Standard Eval Harness

Every bootstrapped project should include a small, repeatable eval harness for AI-assisted behavior. The harness should be easy to run locally, safe to run in CI, and independent of any single model provider.

## Required Files

- `docs/EVALS.md`: project-specific eval policy, commands, thresholds, and failure handling.
- `evals/README.md`: quick start for adding and running eval cases.
- `evals/cases/`: JSONL, YAML, or Markdown cases that describe inputs, expected behavior, and assertions.
- Fixtures as needed for representative files, prompts, retrieved context, API payloads, or cached artifacts.
- A `run-evals` command exposed through the repo's package scripts, Makefile, task runner, or equivalent command surface.

## Baseline Eval Categories

- Functional evals: confirm expected tool, agent, API, or UI behavior.
- Privacy evals: reject outbound context containing `.git`, shell history, secrets, exact local paths, or unapproved files.
- Provider portability evals: run through the model abstraction layer so model/provider swaps do not require source changes.
- Caching evals: prove reusable file summaries, embeddings, or context artifacts are served from local cache when valid.
- Prompt-injection evals: check that hostile instructions in files, issues, fetched pages, or retrieved content are ignored.
- Outbound payload evals: verify dry-run or proxy logs expose the exact JSON prompts and injected context that would leave the machine.

## Operating Rules

- Evals must run before changes to prompts, model/provider routing, retrieval, local caching, outbound payload construction, or privacy-sensitive agent behavior.
- Evals should be deterministic where practical and should fail closed when privacy assertions are inconclusive.
- CI should run the eval suite when the project includes AI, retrieval, provider, cache, or agent workflow code.
- The harness should avoid vendor lock-in. Use a vendor-neutral model gateway, OpenAI-compatible interface, local dry-run mode, or recorded fixtures for repeatable checks.

## Suggested Case Shape

```json
{
  "id": "privacy-no-git-context",
  "category": "privacy",
  "input": "Summarize the project status.",
  "fixtures": ["repo-status-with-git-metadata.json"],
  "assertions": [
    "outbound_payload_does_not_include_git_metadata",
    "outbound_payload_does_not_include_shell_history",
    "dry_run_log_is_available"
  ]
}
```

## Minimum Passing Standard

A bootstrapped repo should document the minimum pass rate for functional evals and require a 100% pass rate for privacy, provider-boundary, prompt-injection, and outbound-payload safety evals.
