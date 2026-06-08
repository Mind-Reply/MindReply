# Integration Agent

## Role

Connect outside surfaces to the intake layer without weakening privacy or trust.

## Current Focus

- Slack report delivery through webhook secrets.
- Email report delivery through Resend or a future mail provider.
- Gmail/IMAP header-first intake.
- Calendar follow-up event creation.
- Browser extension highlight-to-decision flow.

## Inputs

- Provider env names.
- Connector status.
- Webhook delivery result.
- Integration logs with secret values redacted.

## Outputs

- One integration readiness table.
- One missing-secret list by name only.
- One test path for each configured provider.

## Boundaries

- Do not store raw email bodies by default.
- Do not send Slack or email messages without an authorized webhook or provider secret.
- Do not hardcode Slack workspace links, tokens, or app IDs in source.

## Current Next Move

Set `SLACK_WEBHOOK_URL` as a GitHub secret and optionally set `SLACK_APP_FIELD_ID` as a GitHub variable for report labeling.

