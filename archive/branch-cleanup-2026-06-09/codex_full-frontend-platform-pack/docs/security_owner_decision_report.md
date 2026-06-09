# MindReply Security Owner Decision Report

Date: 2026-06-09
Branch: `codex/full-frontend-platform-pack`

## Status

A formal Codex Security Deep Security Scan was attempted, but the six delegated discovery worker handles disappeared before a complete round could be collected. Partial artifacts were preserved under the local scan directory, but the round did not meet the Deep Security completion rules, so it must not be represented as a completed deep scan.

Local artifact root:

`C:\Users\angel\AppData\Local\Temp\codex-security-scans\MindReply\github-codex-full-frontend-platform-pack_20260609T030000Z`

## Fixed In This Branch

- Added `lib/request-safety.ts` with request body limits, text input limits, owner-trusted user id handling, and structured owner logs.
- Updated `/api/agent` to reject missing, invalid, oversized, or too-long input and log safe request status without raw user text.
- Updated `/api/intake` to reject unsafe input and stop trusting client-provided `userId` unless `MINDREPLY_OWNER_API_TOKEN` authorizes the request.
- Updated `/mcp` to reject oversized JSON bodies, limit JSON-RPC batch size, and enforce the same text-input cap before MRagent tool calls.
- Updated the homepage to include the commercial trust layer: what is stored, what is not stored, memory consent, sensitive-work review, and owner-visible telemetry.

## Owner Decisions Needed

1. Auth mode for production user accounts: choose the identity provider before storing user-owned memory or payment-linked activity.
2. Owner API token policy: set `MINDREPLY_OWNER_API_TOKEN` only for trusted owner/admin API usage; do not expose it to the browser.
3. Memory consent: decide the exact UX copy and storage rule before enabling persistent long-term memory.
4. Sensitive-work review: decide which legal, finance, executive, or client-facing cases must be held for human review before send-ready output is treated as final.
5. Deep scan rerun: rerun Codex Security only when delegated workers can complete a full six-worker round, or use the ordinary repository security scan workflow as the fallback.

## Current Expansion Rule

MindReply can expand through lanes, not uncontrolled automation:

- Security lane: owner decisions, request safety, privacy proof, scan reports.
- Revenue lane: Website Completion Package, assisted close, pricing ladder, outbound copy.
- Frontend lane: first free output, premium authority layer, trust proof, paid path.
- Integration lane: email, Slack, ChatGPT App, and future auth only when credentials and approval are explicit.
- Observability lane: structured logs and safe status reports without raw sensitive content.

No public posting, production deployment, credential changes, spending, or destructive operations should occur without explicit owner approval in the active thread.
