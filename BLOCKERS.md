# Blockers

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
- Manually trigger the "Live Deployment" workflow (`.github/workflows/live-deploy.yml`) or push to `main` to trigger an automatic deploy.
- If the Vercel project was deleted or the team account expired, a new project must be created and secrets updated.

### 2. No Next.js app in production

**Status:** BLOCKED
**Detected:** 2026-07-02

**What is needed to resolve:**
- The actual Next.js application (Campaign Studio with Clerk auth, Stripe billing, AI features) has no live production deployment.
- The websitepublisher.ai page is only a static marketing landing page and does not run the application code from this repository.
- A successful Vercel deployment (or alternative hosting) is required to bring the app live.

## Resolved

(none)
