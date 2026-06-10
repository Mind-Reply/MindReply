# Slack and Email Report Delivery

This document defines how MindReply operating reports leave GitHub Actions. It does not contain secrets.

## Delivery Surfaces

- GitHub Actions: `MindReply Hourly Owner Report` is the persistent hourly owner-report automation.
- Codex heartbeat: local thread pulses are companion status loops only.
- Thread/log proof: every run writes the report to the GitHub Actions log.
- Artifact proof: every run uploads `reports/outbox/hourly-owner-report-latest.md` and `reports/outbox/hourly-owner-delivery-receipt-latest.json`.
- Slack: `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` repository secret.
- Slack DM onboarding: owner may provide a Slack direct-message invite out of band; record only its availability with `MINDREPLY_SLACK_DM_INVITE_AVAILABLE=true`, never the raw invite URL.
- Email through Resend: `RESEND_API_KEY`, `MINDREPLY_REPORT_EMAIL`, and `MINDREPLY_REPORT_FROM`.
- Required delivery email: the owner address stored in `MINDREPLY_REPORT_EMAIL`.

## Required GitHub Setup

Go to GitHub repo settings, then Secrets and variables, then Actions.

Secrets:

- `RESEND_API_KEY`
- `MINDREPLY_REPORT_EMAIL`
- `MINDREPLY_REPORT_EMAILS` if more owner recipients are intentionally added
- `MINDREPLY_REPORT_FROM`
- `MINDREPLY_SLACK_WEBHOOK_URL`
- `SLACK_WEBHOOK_URL` if using the fallback Slack webhook name

Variables:

- `MINDREPLY_SLACK_DM_INVITE_AVAILABLE`
- `MINDREPLY_REPORT_ENABLED`
- `MINDREPLY_REPORT_DRY_RUN`
- `MINDREPLY_REPORT_CHANNELS`
- `NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Safety Defaults

External Slack or email delivery happens only when all of these are true:

- `MINDREPLY_REPORT_ENABLED` is `true` or `1`.
- `MINDREPLY_REPORT_DRY_RUN` is `false` or `0`.
- `MINDREPLY_REPORT_CHANNELS` includes the target channel, such as `email` or `slack`.
- The required provider secret exists.
- The owner report recipient must be configured through secrets before external delivery is enabled.

## Slack Notes

A Slack field ID is not a credential and cannot send messages by itself. Slack delivery needs an incoming webhook URL or an authorized Slack app connection.

If the owner provides a Slack DM invite link in chat, use it only for manual connector/workspace onboarding. Do not paste it into source, reports, public pages, workflow YAML, or artifacts. After the DM is connected or a Slack destination is ready, set `MINDREPLY_SLACK_DM_INVITE_AVAILABLE=true` and configure `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` for persistent workflow delivery.

The workflow uses Slack only when a Slack webhook secret exists and the `slack` channel is requested. Without that secret, the report still appears in the log and artifact.

## Codex Heartbeat Notes

Local Codex heartbeats can still inspect the project and write short thread updates, but the persistent delivery path is the hourly GitHub Actions workflow.

Do not delete, pause, or replace user-created MindReply heartbeat automations without explicit permission. Companion pulses are allowed when explicitly requested, but delivery proof should come from GitHub Actions artifacts and provider receipts.

## Email Notes

Email delivery uses Resend when `RESEND_API_KEY`, `MINDREPLY_REPORT_EMAIL`, and `MINDREPLY_REPORT_FROM` are configured. If email secrets are absent, the report stays available as an artifact.

Use `MINDREPLY_REPORT_EMAILS` only when more private owner recipients are intentionally added.

## Delivery Proof

Each run writes `reports/outbox/hourly-owner-delivery-receipt-latest.json` with:

- requested channels
- dry-run status
- email recipient configured status
- Slack webhook configured status
- Slack DM invite availability status
- per-channel status: `sent`, `dry-run`, `blocked`, `failed`, `disabled`, or `skipped`

This proves whether the provider accepted the report. It does not prove that Gmail, Slack, or a downstream inbox rendered it.

## Hourly Owner Ops

Hourly owner reports must follow `docs/hourly_owner_ops_pack.md`. The required style is discreet, short, and decision-led. Security findings are redacted before leaving the backend/report layer. Azure, Vercel observability, CircleCI, and Cloudflare notes are included only as readiness status or owner decisions, not as public claims.

The hourly GitHub Actions schedule is the persistent automation. It runs every hour on `main`, targets the owner email through `MINDREPLY_REPORT_EMAIL`, requests Slack delivery through `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`, and stores artifacts even when provider secrets are missing. Do not hard-code personal addresses in workflow logic; put the owner recipient in GitHub Actions secrets.

## Verification

1. Trigger `MindReply Hourly Owner Report` with `workflow_dispatch`.
2. Leave `dry_run=true` first and request `channels=email,slack`.
3. Confirm both artifacts exist.
4. Confirm `reports/outbox/hourly-owner-delivery-receipt-latest.json` shows the expected dry-run or blocked state.
5. Configure secrets and variables.
6. Trigger one manual run with `dry_run=false`.
7. Confirm `reports/outbox/hourly-owner-delivery-receipt-latest.json` shows `sent` for the target channel.

## Safety Rules

- Never commit webhook URLs, API keys, tokens, private Slack invite links, or email provider secrets.
- Never include user secrets in report text.
- Treat reports as internal operating documents.
- Keep workflow permissions read-only unless a future feature truly requires write access.
