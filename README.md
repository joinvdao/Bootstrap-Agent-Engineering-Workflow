# Agent Bootstrap Prompt

A reusable agentic engineering bootstrap prompt for setting up AI-assisted software repositories before feature implementation begins.

This is a public VDAO.io community resource. It is designed for Codex, Claude, Cline, Qwen Code, GLM, MiniMax, or another capable coding agent.

## What It Does

- Asks a compact set of product setup questions that work even with minimal answers.
- Creates core docs: product scope, system design, testing, security/privacy, operations, analytics, user guide, project management, livestream/build notes, and agent instructions.
- Sets up VS Code/Cline ergonomics with `AGENTS.md`, optional `.clinerules/`, `.vscode` recommendations, and editor-safe workflow rules.
- Makes localhost work from the start with a documented dev command, localhost URL, and minimal visible app shell for web projects.
- Sets up clean-code guardrails: linting, formatting, tests, pre-commit hooks, dead-code scans, public workflow checks, privacy checks, and agent-readiness checks.
- Uses GitHub Issues and Pull Requests as the public ticketing system.
- Configures CI and scheduled cleanup PRs so the repo stays clean over time.
- Documents deployment expectations, including Vercel + GitHub setup when chosen.
- Produces a final implementation prompt for the user to review before product build begins.

## Public Ticketing System

This repo uses GitHub Issues as the public ticket system:

- Bug Report
- Feature Request
- Engineering Task
- Livestream Follow-Up

See `docs/PUBLIC_TICKETING.md`.

## How To Use

Give `SKILL.md` to your coding agent as the operating prompt. If your agent supports skills, install or reference this repository as a skill source. If it does not, paste the contents of `SKILL.md` into the agent and answer the setup questions.

The agent should not start product implementation immediately. It should first create the repo baseline, run verification, confirm local preview where applicable, then propose an implementation prompt for user approval.

## Privacy Boundary

Do not commit private planning systems, personal notes, local task exports, exact local paths, secrets, provider tokens, personal contact details, or sensitive geospatial records. Public work belongs in GitHub Issues and Pull Requests.

## License

MIT License. See `LICENSE`.
