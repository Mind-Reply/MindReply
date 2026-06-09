# Security Policy

MindReply treats security as defensive care: protect private pressure, keep receipts narrow, and slow down risky movement before it leaves the system.

## Supported Surface

The supported production surface is the current `main` branch of `Mind-Reply/MindReply` and the active Vercel production deployment.

Primary surfaces:

- `/`
- `/agent`
- `/pack`
- `/privacy`
- `/mcp`
- `/api/health`
- `/api/agent`
- `/api/intake`

Unknown API paths are retired by middleware and should not be treated as supported integration points.

## Reporting A Vulnerability

Send security reports to `info@mind-reply.com` with:

- affected route or file;
- reproduction steps;
- impact summary;
- whether any secret, raw content, or receipt may be exposed;
- suggested fix if known.

Do not include live secrets in the report. If a secret may be compromised, rotate it in the provider first, then update GitHub/Vercel secrets.

## Owner Decision Desk

Security work reports to the owner decision desk before any change that affects behavior, access, data retention, delivery, billing, or production rollout.

Owner decision packets must include:

- affected surface;
- evidence from files, commands, logs, live endpoints, or connector results;
- impact and likelihood;
- recommended decision: patch, hold, rotate, rollback, configure, or escalate;
- rollback or rotation note;
- delivery status for email and Slack when configured.

The security pack may send all non-secret decision data by email. It must not send raw secrets, access tokens, private pressure text, credentials, or unredacted sensitive records. Urgent containment can pause exposure first, but the owner report still records what changed and why.

## Defensive Scope

Allowed:

- reviewing this repository;
- checking deployed MindReply surfaces you own or are authorized to test;
- reporting dependency, header, routing, privacy, and access-control issues;
- proposing patches that reduce exposure or improve recovery.

Not allowed:

- unauthorized access attempts against third-party systems;
- credential theft or secret extraction;
- stealth posting, spam, scraping, or evasion;
- destructive testing against production;
- publishing private findings before a fix window.

## Response Process

1. Acknowledge and classify the report.
2. Check whether raw pressure, receipts, secrets, or delivery channels are affected.
3. Prepare the owner decision packet for behavior, access, data, billing, delivery, or production changes.
4. Patch in GitHub on a scoped branch or direct `main` only for urgent low-risk fixes.
5. Verify with build, typecheck, MCP checks, and route checks.
6. Deploy through Vercel and confirm runtime logs.
7. Send an activation/security pack report after mitigation.

## Security Pack Automation

`npm run report:security-pack` emits the 8-lane defensive security pack with owner-decision routing.

`npm run report:activation-pack` emits the combined 8-lane security pack plus 28-lane promotion-readiness pack. The scheduled workflow is `.github/workflows/activation-pack-report.yml` and runs every 30 minutes by default.

Real email or Slack delivery requires configured secrets. Console output is safe by default.
