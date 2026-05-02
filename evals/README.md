# Bootstrap Workflow Evals

Run the local eval harness before changing the bootstrap prompt, privacy boundaries, provider abstraction guidance, caching guidance, or outbound payload requirements.

```sh
npm run run-evals
```

The harness is intentionally small and dependency-free. Cases live in `evals/cases/*.jsonl` and assert that required bootstrap guidance remains present in the repository.

## Adding Cases

Each JSONL line should include:

- `id`: stable eval identifier
- `file`: repository-relative file to inspect
- `includes`: required strings
- `excludes`: forbidden strings, when useful

Prefer precise strings that represent durable requirements instead of broad prose fragments.
