# Vercel Provider Action Runbook

Generated: 2026-06-09

## Current Problem

The code branch is not the active blocker. The active blocker is provider-side Vercel configuration and the Free daily deployment quota.

Evidence from GitHub/Vercel:

- PR: `#12` (`codex/executive-nervous-system-main-sync`)
- GitHub combined status before the deployment gate: `failure`
- Vercel status contexts reported: `Deployment rate limited - retry in 24 hours`
- Failing target observed: `https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`
- Vercel project inspected: `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`
- Vercel project name: `mind-reply`
- Latest production deployments observed: `CANCELED`
- Last useful PR preview observed: `dpl_8N89VuWmX8oMhBT93U3P4Gtkfwxr`, `READY`, branch `codex/executive-nervous-system-main-sync`, commit `8f637a3f90f51d85ad1130b1e235703b90c4d29f`

## Repo-Side Quota Guard

`vercel.json` now includes Vercel's official Git deployment gate:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "codex/**": false,
      "mind-reply": false,
      "*": false
    }
  }
}
```

Effect:

- `main` remains the only automatic deployment branch.
- Temporary `codex/*` branches stop creating automatic Vercel deployments.
- The storage branch `mind-reply` does not deploy.
- Manual Vercel deploys can still be run intentionally when a preview is needed.

This is stronger than the ignored build step. The ignored build step can still create canceled deployment records; the Git deployment gate prevents automatic branch deployments from starting.

## What Can Be Fixed In Code

Already done or in progress:

- Vercel ignore guard exists in `scripts/vercel-ignore-build.mjs`.
- Reporting-only files are classified so routine reports can avoid burning builds when Vercel honors the ignore script.
- `git.deploymentEnabled` now blocks automatic deployments from temporary and storage branches.
- `docs/ops/branch-consolidation-report.md` maps which branches to keep and which to delete after production merge.
- PR #12 is the active production migration path.

## What Cannot Be Fixed In Code

These actions require Vercel/GitHub provider access in the dashboard or a correctly configured provider token:

1. Upgrade the Vercel plan or wait for the Free daily deployment quota reset.
2. Disconnect the duplicate/wrong Vercel project or integration that points status checks at `mr-64b2efc9`.
3. Remove any duplicate required GitHub status context named `Vercel - mindreply` if it is still configured as required.
4. Attach `mind-reply.com` and `www.mind-reply.com` to the canonical `mind-reply` project.
5. Promote/redeploy from `main` only after PR #12 is merged cleanly.

## Fastest Dashboard Fix

1. Open Vercel dashboard.
2. Select the team/project area that contains `mind-reply`.
3. Find any project or Git integration tied to `mr-64b2efc9`.
4. Disable Git deployments for the duplicate project or disconnect that project from `Mind-Reply/MindReply`.
5. Keep one deployment project only:
   - Project name: `mind-reply`
   - Framework: `Next.js`
   - Git repo: `Mind-Reply/MindReply`
   - Production branch: `main`
6. If immediate deploys are required, upgrade Vercel to Pro or wait for quota reset.
7. In GitHub branch protection, remove duplicate required status contexts if present.
8. Re-run the PR check or push one small sync commit after provider state is fixed.

## Merge Sequence After Provider Fix

1. Sync/rebase PR #12 with latest `main`.
2. Run one intentional canonical Vercel check or manual preview deploy.
3. Merge PR #12 into `main`.
4. Confirm production deployment reaches `READY`.
5. Attach/promote:
   - `mind-reply.com`
   - `www.mind-reply.com`
6. Smoke-check:
   - `/`
   - `/agent`
   - `/privacy`
   - `/api/health`
   - `/api/intake`
   - `/api/agent`
7. Delete stale temporary `codex/*` branches after useful work is merged or archived.

## Branch Policy

Keep only:

- `main`: production source of truth.
- `mind-reply`: storage/reference branch.

Temporary branches should be removed after production verification:

- `codex/executive-nervous-system-main-sync`
- `codex/executive-nervous-system-build`
- `codex/mragent-decision-chat`
- `codex/mindreply-moa-controller`
- `codex/executive-nervous-system`
- `codex/executive-nervous-system-rebrand`
- `codex/mindreply-moa-main`
- `codex/mindreply-moa-production-minimal`

## Owner Note

Billing upgrades cannot be performed safely from repository code. If a token or secret has been pasted into chat or committed anywhere, rotate it before continuing deployment work.
