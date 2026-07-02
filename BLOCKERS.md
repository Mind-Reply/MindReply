# Blockers

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
