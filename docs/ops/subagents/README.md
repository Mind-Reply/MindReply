# MindReply Sub-Agent Operating Briefs

These files define the active work lanes for the private MindReply operating system. They are internal operating notes, not public website copy.

## Control Rules

- Master Orchestrator Agent owns assignment, validation, and user-facing summaries.
- Sub-agents work only inside their lane and never publish public claims directly.
- No secrets, tokens, provider keys, billing actions, or private strategy are written to public code or copy.
- Every output must include one concrete next move, the verification evidence needed, and any owner-side blocker.
- Revenue, deployment, and communication changes must be traceable through GitHub commits, workflow artifacts, or provider dashboard evidence.

## Active Lanes

1. Infrastructure Agent - Vercel, domains, deployment limits, SSL, routing.
2. DevOps Agent - GitHub Actions, report loops, artifacts, CI handoff.
3. Security Agent - secret handling, public-surface checks, provider-risk guardrails.
4. Frontend Agent - first viewport, minimal decision surface, mobile polish.
5. MRagent Agent - warm decision chat, one synthesis, one action, receipt behavior.
6. Integration Agent - Slack/email/Gmail/calendar/browser-extension intake and delivery.
7. Revenue Agent - Angel Pack, annual setup, credit-load offer, conversion path.
8. Product Design Agent - high-end visual system, preview language, component discipline.

## Reporting Cadence

The scheduled report workflow is configured in `.github/workflows/angel-pack-report.yml`. It creates an artifact every run and sends Slack/email only when provider secrets are configured.

