# Agent Operating Contract

All agents (Devin, GitHub Actions, n8n workflows, scripts) operating on MindReply repos must follow this contract. No exceptions.

## Evidence Rules

- No evidence = no credit.
- No URL = not live.
- No smoke test = not validated.
- No PR/commit/file path = not complete.
- No build log = build status unknown.
- No monitoring = not production-ready.
- No owner approval = no risky action.

## Security Rules

- Never store, log, print, echo, screenshot, or expose secret values.
- Never commit `.env` files with real values.
- Never commit tokens, API keys, passwords, or connection strings.
- If a secret is accidentally exposed, rotate it immediately and report.
- Use GitHub Secrets or environment-specific secret stores only.
- Least-privilege access for all tokens and integrations.

## Integrity Rules

- No fake profiles, personas, or social accounts.
- No fake testimonials, reviews, or social proof.
- No spam, bulk unsolicited messaging, or platform rule violations.
- No fake revenue claims or unverified payment evidence.
- No production labels without evidence.
- No "LIVE" status without a working URL and smoke test.

## Workflow Rules

- All code changes go through branches and PRs. No direct pushes to main.
- Each PR must be small, focused, and reviewable.
- Every agent action must be logged in AGENT_ACTION_LOG.md or equivalent.
- Production deploys require owner approval.
- Preview deploys are allowed without approval for validation.
- Sending messages, posting to social, or billing actions require owner approval.

## Session Rules

- Every session must read owner context files first to restore continuity.
- Every session must update SESSION_CHECKPOINT.md before ending.
- If context files are missing, create them from the templates in this repo.
- Do not delete or weaken owner context files.
- Do not overwrite SESSION_CHECKPOINT.md without preserving the previous state.

## Response Format

All agent responses must follow the format defined in OWNER_COMMAND_STYLE.md:

1. Start with a STATUS line.
2. Include INSPECTED, CHANGED, CREATED, LIVE/NOT LIVE, BLOCKERS, EVIDENCE, NEXT ACTION sections.
3. Every claim backed by evidence.
4. No vague plans — only exact next actions.

## Escalation Rules

- If blocked on access: create or update ACCESS_REQUEST.md with exact missing permission.
- If blocked on a decision: report the decision needed and options to the owner.
- If blocked on infrastructure: report the exact error, service, and required fix.
- Do not keep strategizing around a block. State it clearly and stop.

## Prohibited Actions

- Force-pushing to protected branches.
- Deleting branches without owner approval.
- Modifying security policies or compliance controls.
- Running destructive git commands (reset --hard, clean -fd) on shared branches.
- Skipping CI hooks or pre-commit checks.
- Deploying to production without passing build + smoke test.
- Any action that cannot be undone without explicit owner approval.
