# Sprint Tickets

Repo-local sprint tickets are optional execution records for turning a public-safe goal into a sprint with multiple implementation steps. They are useful when GitHub Issues are too coarse for day-to-day agent work, but they must never become a private planning system.

## Purpose

Use sprint tickets to capture:

- a sprint goal
- scoped implementation steps
- acceptance criteria
- validation commands
- blockers and follow-up decisions
- links back to public GitHub Issues and pull requests when available

Public GitHub Issues remain the shared roadmap and contribution surface. Repo-local sprint tickets are the working breakdown for a specific sprint or implementation pass.

## Suggested Structure

```text
.tickets/
  README.md
  sprints/
    2026-05-example-sprint/
      SPRINT.md
      STEP-001-example.md
      STEP-002-example.md
```

Use short, stable names. Prefer dates or sprint slugs over personal names.

## Sprint File

Each sprint should have a `SPRINT.md` file:

```md
# Sprint: <short public-safe name>

## Goal

<One clear outcome this sprint should achieve.>

## Scope

- <Included work>
- <Explicitly excluded work>

## Steps

- [ ] STEP-001 <title>
- [ ] STEP-002 <title>

## Acceptance Criteria

- <Observable completion condition>
- <Validation command or review condition>

## Links

- Issue: #
- Pull request: #
```

## Step File

Each step should be independently executable:

```md
# STEP-001 <title>

## Goal

<One concrete task.>

## Context

<Public-safe context needed to do the work.>

## Files Likely Touched

- `<path>`

## Acceptance Criteria

- <Expected behavior or artifact>

## Validation

- `<command>`

## Status

Todo

## Notes

<Public-safe blockers, decisions, or follow-ups.>
```

## Status Values

Use these statuses:

- `Todo`
- `Doing`
- `Blocked`
- `Review`
- `Done`

Do not encode private urgency, personal commitments, or sensitive context in status names.

## Privacy Rules

Never put these in sprint tickets:

- secrets, API keys, provider tokens, or credentials
- private planning context
- personal contact details
- exact local machine paths
- private addresses or sensitive location details
- unpublished contracts, agreements, or security-sensitive infrastructure details
- real user data or support records

If a ticket needs sensitive context, replace it with a public-safe placeholder and keep the private source outside the repo.

## Agent Workflow

Agents should:

- read `SPRINT.md` before starting a step
- update only the step they are actively working on
- keep acceptance criteria and validation commands current
- link related issues and pull requests
- mark a step `Done` only after validation passes or the skipped validation is explained
- avoid creating tickets for vague ideas that are not ready for execution
