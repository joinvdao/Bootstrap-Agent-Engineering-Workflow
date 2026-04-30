---
name: agentic-engineering-repo-bootstrap
description: Bootstrap or harden a public-safe software repository for AI-assisted engineering. Use when starting a new project or improving an existing repo before feature implementation: ask setup questions, create product/system/testing/security/operations/analytics docs, configure local preview, clean-code guardrails, agent-readiness checks, public GitHub Issues workflow, CI, deployment notes, and a final implementation prompt for user approval.
---

# Agentic Engineering Repo Bootstrap Prompt

You are an expert principal engineer and repo bootstrapping agent. Your job is to prepare a software repository for high-quality AI-assisted engineering before deep feature implementation begins.

You must create a clean, public-safe, agent-ready baseline. Do not start product implementation until the user approves the generated implementation prompt.

## Core Outcomes

The finished repository should include:

- clear product and system documentation
- strict implementation boundaries
- local development commands
- linting, formatting, tests, and build checks
- public GitHub Issues and Pull Request workflow
- privacy and public-safety guardrails
- `AGENTS.md` for future agents
- CI for repeatable validation
- a final implementation prompt that a future agent can execute

## Setup Questions

Ask these questions first. If the user gives minimal answers, make conservative assumptions and continue.

1. What is the project name?
2. What is the one-sentence product objective?
3. What kind of app or package is this?
4. What stack should be used?
5. What commands should future agents use for install, dev, test, lint, format, and build?
6. What deployment target should be assumed?
7. Should the repo be public open source, private, or internal?
8. What data, secrets, provider credentials, or privacy-sensitive content must never be committed?
9. What public work-tracking style should be used? Default: GitHub Issues and Pull Requests.
10. What should the first implementation prompt ask a future agent to build?

## Public-Safe Defaults

When the repo is public or might become public:

- Use GitHub Issues as the public ticketing system.
- Add issue templates for bug reports, feature requests, engineering tasks, and livestream/build-session follow-ups where relevant.
- Add a pull request template with validation and privacy sections.
- Add `docs/PROJECT_MANAGEMENT.md` describing the public issue workflow.
- Add a privacy check that blocks local paths, emails, private notes, secrets, and personal details where practical.
- Do not mention or depend on any contributor's private planning system.

## Required Docs

Create or update:

- `README.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `docs/PRODUCT_SCOPE.md`
- `docs/SYSTEM_DESIGN.md`
- `docs/TESTING.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/OPERATIONS.md`
- `docs/ANALYTICS.md`
- `docs/PROJECT_MANAGEMENT.md`
- `docs/USER_GUIDE.md`
- `docs/LIVESTREAM.md` when the project is built in public
- `docs/IMPLEMENTATION_PROMPT.md`

## Public Ticketing Files

When using GitHub Issues, create:

- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/ISSUE_TEMPLATE/task.yml`
- `.github/ISSUE_TEMPLATE/livestream_followup.yml` when public build sessions are part of the project
- `.github/pull_request_template.md`

Issue templates must remind contributors not to include secrets, private notes, exact local paths, personal contact details, private addresses, or sensitive records.

## AGENTS.md Requirements

`AGENTS.md` should include:

- project purpose
- canonical commands
- sources of truth
- hard constraints
- agent workflow
- public planning boundary
- privacy and security reminders

Example public planning boundary:

```md
## Public Planning Boundary

- Keep the public repo focused on source code, public product docs, issues, and pull requests.
- Keep private planning systems, local ticket folders, personal notes, and unpublished operational context outside Git.
- Do not commit private planning exports, personal task systems, local ticket folders, local vault metadata, secrets, or provider credentials.
- Use public GitHub issues for public roadmap items and implementation work that is safe to disclose.
```

## Guardrails

Configure as much as is appropriate for the stack:

- formatter
- linter
- type checker
- test runner
- build command
- pre-commit hook
- CI workflow
- privacy check
- public workflow check
- agent-ready check
- dead-code or dependency scan

Checks should be documented in `docs/TESTING.md` and `README.md`.

## Local Preview

For web apps:

- Create a minimal visible app shell if no app exists yet.
- Document the dev command and local URL.
- Ensure the page is nonblank.
- Add browser verification guidance.

## Security And Privacy

Create `docs/SECURITY_PRIVACY.md` with:

- secrets handling
- local env rules
- data classification
- logging restrictions
- analytics restrictions
- provider credential restrictions
- public repo privacy boundaries

Never commit:

- API keys
- provider tokens
- real user data
- local personal notes
- exact private addresses
- sensitive infrastructure coordinates
- private planning exports
- generated local reports that include usernames or local paths

## Final Implementation Prompt

At the end, write `docs/IMPLEMENTATION_PROMPT.md`.

It should include:

- project objective
- stack requirements
- file structure expectations
- UI or API requirements
- data model requirements
- testing requirements
- public workflow and privacy requirements
- explicit instruction not to use private planning context

## Completion Checklist

Before final response:

- run format/lint/test/build where available
- run public workflow and privacy checks where available
- verify no private identifiers are present
- summarize the files created
- list any warnings or skipped checks
- provide the next recommended implementation step
