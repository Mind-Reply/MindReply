# Slack and Email Report Delivery

This document defines how MindReply operating reports leave GitHub Actions. It does not contain secrets.

## Delivery Surfaces

- Thread/log proof: every run writes the report to the GitHub Actions log.
- Artifact proof: every run uploads `mindreply-angel-pack-report.md` and `mindreply-delivery-receipt.json`.
- Slack: `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` repository secret.
- Generic webhook: `OPS_REPORT_WEBHOOK_URL` repository secret.
- Email through Resend: `RESEND_API_KEY`, `MINDREPLY_REPORT_EMAIL`, and `MINDREPLY_REPORT_FROM`.
- Correct Angel delivery address: `ANGELLLKR@GMAIL.COM`.
- Slack field reference: `SLACK_APP_FIELD_ID`, defaulting to `Xf0B6WHC2SBH`.

## Required GitHub Setup

Go to GitHub repo settings, then Secrets and variables, then Actions.

Secrets:

- `RESEND_API_KEY`
- `MINDREPLY_REPORT_EMAIL`
- `MINDREPLY_REPORT_EMAIL_ALLOWLIST`
- `MINDREPLY_REPORT_FROM`
- `MINDREPLY_SLACK_WEBHOOK_URL`
- `OPS_REPORT_WEBHOOK_URL` if a second webhook is used

Variables:

- `MINDREPLY_REPORT_ENABLED`
- `MINDREPLY_REPORT_DRY_RUN`
- `MINDREPLY_REPORT_CHANNELS`
- `MINDREPLY_REPORT_REQUIRE_DELIVERY`
- `SLACK_APP_FIELD_ID`

## Safety Defaults

Reports default to dry-run. External Slack, webhook, or email delivery happens only when all of these are true:

- `MINDREPLY_REPORT_ENABLED` is `true` or `1`.
- `MINDREPLY_REPORT_DRY_RUN` is `false` or `0`.
- `MINDREPLY_REPORT_CHANNELS` includes the target channel, such as `email`, `slack`, `webhook`, or `all`.
- The required provider secret exists.
- For email, every recipient is allowlisted. `ANGELLLKR@GMAIL.COM` is always the intended personal-pack recipient.

## Slack Notes

A Slack field ID is not a credential and cannot send messages by itself. Slack delivery needs an incoming webhook URL or an authorized Slack app connection.

The workflow uses Slack only when a Slack webhook secret exists and the `slack` channel is requested. Without that secret, the report still appears in the log and artifact.

## Email Notes

Email delivery uses Resend when `RESEND_API_KEY`, `MINDREPLY_REPORT_EMAIL`, and `MINDREPLY_REPORT_FROM` are configured. If email secrets are absent, the report stays available as an artifact.

Use `MINDREPLY_REPORT_EMAIL_ALLOWLIST=ANGELLLKR@GMAIL.COM` for Angel's personal pack until more recipients are intentionally added.

## Delivery Proof

Each run writes `mindreply-delivery-receipt.json` with:

- requested channels
- dry-run status
- correct Angel email
- Slack field ID
- per-channel status: `sent`, `dry-run`, `blocked`, `failed`, `not-configured`, or `skipped`
- provider HTTP status or provider ID when available

This proves whether the provider accepted the report. It does not prove that Gmail, Slack, or a downstream inbox rendered it.

## Verification

1. Trigger `MindReply Angel Pack Report` with `workflow_dispatch`.
2. Leave `dry_run=true` first and request `channels=email,slack`.
3. Confirm both artifacts exist.
4. Confirm `mindreply-delivery-receipt.json` shows the expected dry-run or not-configured state.
5. Configure secrets and variables.
6. Trigger one manual run with `dry_run=false` and `require_delivery=true`.
7. Confirm `mindreply-delivery-receipt.json` shows `sent` for the target channel.

## Safety Rules

- Never commit webhook URLs, API keys, tokens, private Slack invite links, or email provider secrets.
- Never include user secrets in report text.
- Treat reports as internal operating documents.
- Keep workflow permissions read-only unless a future feature truly requires write access.
