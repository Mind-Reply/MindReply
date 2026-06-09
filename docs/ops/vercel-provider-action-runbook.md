# Vercel Provider Action Runbook

Generated: 2026-06-09

## Current Problem

The code branch is not the active blocker. The active blocker is provider-side Vercel configuration plus the Free daily deployment quota.

Angel confirmed the production Vercel project ID:

- Canonical project to keep: `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`.
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`.
- Production domains on canonical project: `www.mind-reply.com`, `mind-reply.com`, and `mind-reply.vercel.app`.
- Duplicate/lookalike project to disable or disconnect: `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.

Important name collision: the Git branch `mind-reply` is storage only. The Vercel project named `mind-reply` is not the canonical production project.

## Latest Provider Evidence

Recent Vercel evidence shows both Vercel projects can still react to the same GitHub repo:

- A main-branch push for commit `ad3bb9e205f1ada1aeeb50cb98f474cd964b3749` triggered production deployment attempts on both projects.
- `mindreply` latest production attempt: `dpl_CynSRRjhd4EWX1hBetK5aubxmK4E`, state `ERROR`.
- Duplicate `mind-reply` latest production attempt: `dpl_GT9CJM3NQwkTD7GPqqHKLtsX7LYx`, state `CANCELED`.
- Previous PR preview deployments for PR #12 reached `READY` on both projects before the branch deployment gate was added.

This proves the duplicate project is still connected at the provider layer. Repository code can reduce branch deployment spam, but it cannot remove duplicate Vercel project wiring or raise the Free plan deployment quota.

## Repo-Side Quota Guard

`vercel.json` now includes Vercel's Git deployment gate:

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

This protects PR and storage branches. It does not stop duplicate Vercel projects from both responding to a `main` push while both projects remain connected to GitHub.

## What Can Be Fixed In Code

Already done or in progress:

- Vercel ignore guard exists in `scripts/vercel-ignore-build.mjs`.
- Reporting-only files are classified so routine reports can avoid burning builds when Vercel honors the ignore script.
- `git.deploymentEnabled` blocks automatic deployments from temporary and storage branches.
- `docs/ops/branch-consolidation-report.md` maps which branches to keep and which to delete after production merge.
- PR #12 is the active production migration path.

## What Cannot Be Fixed In Code

These actions require Vercel/GitHub provider access in the dashboard or a correctly configured provider token:

1. Upgrade the Vercel plan or wait for the Free daily deployment quota reset.
2. Keep project `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3` as the only production project for `Mind-Reply/MindReply`.
3. Disable Git deployments or disconnect GitHub integration on duplicate project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.
4. Remove any duplicate required GitHub status context tied to the duplicate project.
5. Promote/redeploy from `main` only after PR #12 is merged cleanly and the duplicate project is disconnected or disabled.

## Fastest Dashboard Fix

1. Open Vercel dashboard.
2. Select team `angellllkr-engs-projects` / `team_0plIJmQLgZC1wVv9zI2eVf3B`.
3. Keep project `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`.
4. Confirm `mindreply` owns:
   - `www.mind-reply.com`
   - `mind-reply.com`
   - `mind-reply.vercel.app`
5. Open duplicate project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.
6. In the duplicate project's Git settings, disable Git deployments or disconnect the project from `Mind-Reply/MindReply`.
7. If deletion is desired, compare environment variables and domains first, then delete only after explicit owner approval.
8. In GitHub branch protection, remove duplicate required Vercel status contexts if present.
9. If immediate deploys are required, upgrade Vercel intentionally from the Vercel account; repository code cannot make the account Pro.

## Merge Sequence After Provider Fix

1. Stop the duplicate project first: disconnect/disable Vercel project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.
2. Sync/rebase PR #12 with latest `main`.
3. Run one intentional canonical check or preview only if needed.
4. Merge PR #12 into `main`.
5. Confirm one production deployment on `mindreply` reaches `READY`.
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
