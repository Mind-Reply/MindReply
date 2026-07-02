# Blockers

Last updated: 2026-07-02T15:14Z
## Owner Cockpit PWA (2026-07-02)

- Gamma reference doc NOT ACCESSIBLE: https://gamma.app/docs/MindReply-Think-Clearly-Decide-Fast-Move-Forward-63v6w1k1grblo91 returns a 403 bot challenge ("Just a moment"). Concept recreated from the positioning: "MindReply helps overloaded founders, operators, and agencies turn pressure, messages, decisions, and scattered context into clear next actions."
- Owner-only auth NOT CONFIGURED: cockpit routes (`/cockpit/*`) are protected by a placeholder only. Real auth provider must be wired before treating the cockpit as private. See ACCESS_REQUEST.md.
- Route conflict: `/dashboard` is already used by the existing analytics dashboard, so the cockpit lives at `/cockpit` with section routes beneath it (`/cockpit/chat`, `/cockpit/repos`, ...).
- Custom domain: BLOCKED — DNS ACCESS REQUIRED for mind-reply.com and subdomains.
- Vercel production deploy: account rate limits affect CI checks (per environment notes); preview URL pending.

- Verification pending for the full repo fleet.
- Production proof still needs to be collected.
- External integration review still needs confirmation.

## Active Blockers

### 1. Vercel deployment not found (Critical)

**Status:** BLOCKED
**Detected:** 2026-07-02
**URL:** https://mindreply.vercel.app
**Error:** HTTP 404 — `DEPLOYMENT_NOT_FOUND`

**What is needed to resolve:**
- Verify that `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` GitHub secrets are correctly configured and the Vercel project still exists.
- Manually trigger the "Live Deployment" workflow or push to `main` to trigger deploy.
- If the Vercel project was deleted or the team account expired, a new project must be created and secrets updated.

### 2. Auto Orchestrator Runner startup failure

**Status:** BLOCKED
**Detected:** 2026-07-02
**Error:** Startup failure (exact logs TBD — needs inspection)

**What is needed to resolve:**
- Inspect the failed GitHub Actions run logs
- Identify root cause (likely missing secret, bad config, or dependency issue)
- Fix and re-run

### 3. PR #64 awaiting owner merge

**Status:** BLOCKED (waiting on owner)
**Detected:** 2026-07-02
**PR:** https://github.com/Mind-Reply/MindReply/pull/64

**What is needed to resolve:**
- Owner reviews and merges PR #64 (go-live-cleanup)
- Then security hardening can continue

### 4. No live Next.js app in production

**Status:** BLOCKED
**Detected:** 2026-07-02

**What is needed to resolve:**
- Successful Vercel deployment (depends on blocker #1)
- Or alternative hosting setup

### 5. Pre-existing type-check errors (non-blocking)

**Status:** LOW PRIORITY
**Detected:** 2026-07-02
**Files:** app/api/integrations/stream/route.ts, apps/backend/src/routes/briefs.ts

**What is needed to resolve:**
- Fix NextResponse.stream usage (doesn't exist in Next.js 15)
- Fix syntax errors in briefs.ts

## Resolved

(none yet)
