# Owner Security Decision Desk Report

Generated: 2026-06-09
Repo: Mind-Reply/MindReply
Production project: Vercel `mindreply`

## Current State

- GitHub `main` has the security owner decision desk in `scripts/activation-pack-report.ts`.
- The report script is module-scoped with `export {};`, which prevents the TypeScript global redeclare build error class.
- Public security fallback is `info@mind-reply.com`.
- Owner routing is private-env driven through `MINDREPLY_SECURITY_OWNER_EMAIL`.
- Security reports are explicitly redacted and evidence-first: no raw secrets, tokens, credentials, or private pressure text.

## Latest Important Commits

- `c51e38c9e25c12ec803574a201bc4a4e97b74921` - latest Vercel READY production deployment, adds owner decision desk.
- `810d97346e936b6ce5884d012c4a17349a53363b` - GitHub `main` fix that removes the personal-email fallback from the security owner script.

## Deployment Status

- Vercel production project `mindreply` is READY at commit `c51e38c...`.
- Newer fixed commit `810d973...` is blocked by Vercel build-rate-limit statuses on both `mindreply` and `mind-reply`.
- Do not create unnecessary commits or deployments until the build-rate window resets or the Vercel plan/quota is adjusted.

## Owner Decision Rule

The security team works directly with the owner through decision packets before changes that affect:

- access control or auth;
- data retention or storage;
- email/Slack delivery;
- production rollout;
- billing/payment behavior;
- ChatGPT app submission posture;
- integration credentials or external accounts.

Each decision packet should include:

- affected surface;
- evidence;
- risk level;
- recommended decision;
- rollback or rotation note;
- delivery status.

## Immediate Next Actions

1. Wait for Vercel build-rate limit to reset, or adjust Vercel plan/quota.
2. Re-run deployment for `main` so `810d973...` becomes production.
3. Verify `/pricing`, `/capabilities`, `/pack`, `/agent`, `/mcp`, and `/api/health` on the public domain.
4. Configure private environment values only in Vercel, not in public code:
   - `MINDREPLY_SECURITY_OWNER_EMAIL`
   - `MINDREPLY_REPORT_EMAILS`
   - `MINDREPLY_REPORT_EMAIL_ALLOWLIST`
   - `MINDREPLY_REPORT_FROM`
   - `RESEND_API_KEY` if email sending is enabled
5. Keep public user contact as `info@mind-reply.com` and route users to MRagent first.
