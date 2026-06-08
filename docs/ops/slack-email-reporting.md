# Slack and Email Report Delivery

This document defines how MindReply operating reports leave GitHub Actions. It does not contain secrets.

## Delivery Surfaces

- Slack: `SLACK_WEBHOOK_URL` repository secret.
- Generic webhook: `OPS_REPORT_WEBHOOK_URL` repository secret.
- Email through Resend: `RESEND_API_KEY` repository secret plus `OPS_REPORT_EMAIL_TO` and `OPS_REPORT_EMAIL_FROM`.
- Fallback email variables: `REPORT_TO_EMAIL` and `RESEND_FROM` repository variables.
- Optional Slack field label: `SLACK_APP_FIELD_ID` repository variable.

## Required GitHub Setup

Go to GitHub repo settings, then Secrets and variables, then Actions.

Secrets:

- `SLACK_WEBHOOK_URL`
- `OPS_REPORT_WEBHOOK_URL` if a second webhook is used
- `RESEND_API_KEY` if email sending is used
- `OPS_REPORT_EMAIL_TO`
- `OPS_REPORT_EMAIL_FROM`

Variables:

- `REPORT_TO_EMAIL`
- `RESEND_FROM`
- `SLACK_APP_FIELD_ID`

## Slack Notes

A Slack field ID is not a credential and cannot send messages by itself. Slack delivery needs an incoming webhook URL or an authorized Slack app connection.

The workflow uses Slack only when `SLACK_WEBHOOK_URL` exists. Without that secret, the report still appears as a GitHub Actions artifact.

## Email Notes

Email delivery uses Resend when `RESEND_API_KEY` and a recipient are configured. If email secrets are absent, the report stays available as an artifact.

## Safety Rules

- Never commit webhook URLs, API keys, tokens, or private Slack invite links.
- Never include user secrets in report text.
- Treat reports as internal operating documents.
- Keep workflow permissions read-only unless a future feature truly requires write access.

## Verification

1. Trigger `MindReply Angel Pack Report` with `workflow_dispatch`.
2. Confirm the artifact exists.
3. Confirm Slack receives the short report when `SLACK_WEBHOOK_URL` is configured.
4. Confirm email receives the text report when Resend secrets are configured.
5. If sending fails, inspect workflow logs for provider status only; do not print secret values.

