# Open Source Repo References

This file records public repositories reviewed as bootstrap workflow references. A reference is not approval for production use.

## weikengchen/claude-code-dream-skill

- URL: https://github.com/weikengchen/claude-code-dream-skill
- Description: Claude Code skill for passive repository audits that surface stale docs, doc/code drift, missing tests, lingering TODOs, and other maintenance concerns into `.dream/review.md`.
- Visibility: public
- Archived: no
- Forked here: no, fork was not requested
- License metadata: no GitHub license detected; README says "Do whatever you want with it", but there is no explicit `LICENSE` file in the repository metadata checked on 2026-05-12.
- Relevance: integrated as a model-agnostic "Passive Dream Audit" pattern for bootstrap-generated `AGENTS.md`, `docs/OPERATIONS.md`, and `docs/TICKETS.md`.

Adopted pattern:

- flag, do not fix
- resumable state in `.dream/`
- staged inventory, scout, pair-scout, filter, and review flow
- cheap/strong/strongest model roles generalized behind the project model abstraction
- final human-readable review queue at `.dream/review.md`

Safety boundary:

- `.dream/` is local audit state and should be ignored by Git and agent context by default.
- Acting on findings should happen in a separate sprint, issue, pull request, or implementation session.
