# MindReply 8-Workstream Agent Map

This map turns the requested sub-agent spread into repo-controlled operating lanes. It does not claim external staff are hired; it defines the working responsibilities and evidence each lane must produce.

## 1. Infrastructure Agent

- Owns Vercel, domain, preview, production readiness, and deployment blockers.
- Current next move: clear Vercel `upgradeToPro=build-rate-limit`, then redeploy PR #12.
- Evidence: Vercel check passes and `/api/health` responds.

## 2. DevOps Agent

- Owns GitHub Actions, scheduled reports, CI gates, and artifacts.
- Current next move: keep `ops:report` and `ops:pack` passing.
- Evidence: report artifacts are generated from scheduled or manual workflow runs.
- Schedule note: `*/23 * * * *` runs at minutes 0, 23, and 46 UTC each hour. It is the lightweight GitHub-native 23-minute slot pattern, not a perfect rolling interval.

## 3. Security Agent

- Owns secrets hygiene, public-surface leaks, private prompts, and safe provider configuration.
- Current next move: scan for committed tokens before merge.
- Evidence: no secrets in repo; provider keys exist only in dashboards.

## 4. Frontend Agent

- Owns `/`, `/agent`, and the minimal decision interface.
- Current next move: keep the public surface calm, sharp, and free of internal language.
- Evidence: public routes expose one synthesis and one recommended action only.

## 5. MRagent Agent

- Owns warm conversational behavior and the one-action response contract.
- Current next move: preserve friendly, slow, helpful replies while avoiding provider or strategy leakage.
- Evidence: `/api/agent` returns a useful response with a receipt.

## 6. Integration Agent

- Owns Gmail/IMAP, calendar, browser-extension intake, and privacy-safe handoff.
- Current next move: keep intake opt-in and avoid raw body storage by default.
- Evidence: connectors emit headers/snippets/metadata first, not raw archives.

## 7. Growth Agent

- Owns revenue pack framing, founder invite language, and conversion path.
- Current next move: package the first paid outcome as handled decisions, not a feature menu.
- Evidence: user sees a direct annual setup or credit-load path after first value.

## 8. Product Design Agent

- Owns the high-end minimal look and Figma/design handoff.
- Current next move: produce a previewable interface concept once deployment is unblocked.
- Evidence: first viewport shows category, input, synthesis, action, risk, and receipt without clutter.

## Personal Angel Pack In Every Report

Every scheduled report must include a private Angel Pack section:

- One completed or current implementation move.
- One revenue packaging move, such as annual setup or credit-load refinement.
- One small practical gift idea: dashboard snapshot, branded workflow checklist, automation audit, or growth brief.
- One verification checklist so the idea can become shipped work instead of noise.

## Delivery Hooks

Use runtime configuration only:

- `SLACK_WEBHOOK_URL` for Slack incoming webhook delivery.
- `RESEND_API_KEY` plus `OPS_REPORT_EMAIL_TO` or `REPORT_TO_EMAIL` for email delivery.
- `OPS_REPORT_WEBHOOK_URL` for any other approved webhook.

No Slack webhook URL, email key, OAuth token, or mailbox credential is allowed in committed files.

## Operating Rule

All workstreams report through the Master Orchestrator. No lane publishes internal strategy, secrets, staffing claims, provider instructions, or private revenue mechanics to customer-facing pages.
