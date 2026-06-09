# Vercel Deployment Limit Runbook

## Current verified state

The active code path is PR #12:

- PR: `https://github.com/Mind-Reply/MindReply/pull/12`
- Branch: `codex/executive-nervous-system-main-sync`
- Canonical Vercel project to keep: `mindreply`
- Canonical project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Team ID: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Domains already attached to canonical project: `www.mind-reply.com`, `mind-reply.com`, `mind-reply.vercel.app`
- Duplicate/lookalike Vercel project to disable or disconnect: `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`

Important name collision: the Git branch `mind-reply` is storage/reference only. The Vercel project named `mind-reply` is not canonical.

The failing or stale provider target observed during recovery was:

`https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`

That is an account, project, quota, or GitHub-integration condition. Repository code can reduce future waste, but it cannot upgrade billing, attach a payment method, delete a provider-side project, or disconnect a provider-side integration without owner/provider access.

## Latest duplicate-project evidence

Recent Vercel evidence shows both projects can still react to the same GitHub repo:

- Main commit `ad3bb9e205f1ada1aeeb50cb98f474cd964b3749` triggered production attempts on both projects.
- Canonical `mindreply` production attempt: `dpl_CynSRRjhd4EWX1hBetK5aubxmK4E`, state `ERROR`.
- Duplicate `mind-reply` production attempt: `dpl_GT9CJM3NQwkTD7GPqqHKLtsX7LYx`, state `CANCELED`.

This confirms the duplicate project is still connected at the provider layer. The duplicate project must be disabled, disconnected, or made non-required in provider settings to stop duplicate main-branch deployment attempts.

## Automatic deployment policy

`vercel.json` now uses Vercel's `git.deploymentEnabled` gate:

```json
"git": {
  "deploymentEnabled": {
    "main": true,
    "codex/**": false,
    "mind-reply": false,
    "*": false
  }
}
```

Effect:

- `main` is the only branch eligible for automatic Vercel deployments.
- `codex/*` branches do not create automatic preview deployments.
- `mind-reply` remains storage/reference only and does not deploy.
- Manual Vercel deploys remain available through the GitHub Actions workflow below.

This is the main repo-side fix for the quota spiral. It protects temporary and storage branches. It does not stop duplicate Vercel projects from both responding to `main` while both projects remain connected to GitHub.

## Manual production deployment

A manual workflow exists at:

`.github/workflows/manual-vercel-production.yml`

Use it only after PR #12 is merged or after the target branch is intentionally selected for production.

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` = `team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID` = `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

Manual deploy steps:

1. Open GitHub repo `Mind-Reply/MindReply`.
2. Go to **Actions**.
3. Select **Manual Vercel Production Deploy**.
4. Click **Run workflow**.
5. Confirm the selected branch is `main` for production.
6. Let the workflow run:
   - `npm ci`
   - `npm run verify:all`
   - `vercel pull --environment=production`
   - `vercel build --prod`
   - `vercel deploy --prebuilt --prod`
7. Smoke-check production after deployment.

This gives one deliberate deployment instead of one deployment per commit.

## Launch readiness command

Run this read-only command whenever deployment truth needs to be refreshed:

```bash
npm run launch:report
```

It probes these endpoints without deploying, changing credentials, changing domains, deleting data, or spending money:

- preview `/`
- preview `/agent`
- preview `/api/health`
- production `/`
- production `/agent`
- production `/api/health`

The command writes `mindreply-launch-readiness.json` and exits successfully by default even when production is stale. To make it fail unless production is fully launch-ready, run:

```bash
MINDREPLY_REQUIRE_LAUNCH_READY=1 npm run launch:report
```

## Status context audit command

Run this read-only command whenever GitHub/Vercel status truth needs to be refreshed:

```bash
npm run deploy:status-contexts -- <commit-sha>
```

In GitHub Actions, the SHA can come from `GITHUB_SHA`. Locally, pass the PR head SHA or set `MINDREPLY_STATUS_SHA`:

```bash
MINDREPLY_STATUS_SHA=<commit-sha> npm run deploy:status-contexts
```

The command writes `mindreply-vercel-status-audit.json` and exits successfully by default, even if duplicate Vercel contexts remain. To make it fail unless there is exactly one canonical Vercel context, run:

```bash
MINDREPLY_REQUIRE_SINGLE_VERCEL_CONTEXT=1 npm run deploy:status-contexts -- <commit-sha>
```

Interpretation:

- `single-canonical`: one Vercel context exists and it targets canonical `mindreply`.
- `needs-provider-action`: duplicate or quota-linked Vercel contexts still exist and must be disconnected, disabled, or made non-required provider-side.
- `not-verifiable`: no SHA was provided, GitHub was unreachable, or a token is needed for the repo/status endpoint.

## What is working now

- `mindreply` owns `www.mind-reply.com`, `mind-reply.com`, and `mind-reply.vercel.app`.
- `https://www.mind-reply.com/agent` previously returned `200`.
- `https://www.mind-reply.com/api/health` previously returned `200` with the live health payload.
- The launch report gives a fresh proof artifact instead of relying only on static runbook deployment IDs.
- The status context audit gives a fresh proof artifact for duplicate Vercel status cleanup.
- Latest PR branch commits stopped receiving Vercel status entries after the `git.deploymentEnabled` gate, consistent with automatic PR deploy suppression.

## Remaining launch blockers

1. The duplicate Vercel project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb` is still connected and can react to main-branch pushes.
2. Main-branch deployment attempts can still hit the Free daily deployment limit until the duplicate project is disconnected and quota resets.
3. `https://www.mind-reply.com/` still needs a fresh smoke-check after a clean `mindreply` production deployment.
4. Provider-backed model replies and receipt persistence remain fallback until production env vars are configured in Vercel.
5. PR #12 must be synced/rebased with latest `main` before merge.

## Immediate recovery

1. Open Vercel dashboard.
2. Keep project `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`.
3. Confirm `mindreply` still owns:
   - `mind-reply.com`
   - `www.mind-reply.com`
   - `mind-reply.vercel.app`
4. Open duplicate project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.
5. Disable Git deployments or disconnect that duplicate project from `Mind-Reply/MindReply`.
6. In GitHub branch protection, remove duplicate Vercel required contexts if they are configured.
7. Wait for the Free quota reset, or upgrade the Vercel team intentionally if immediate deployment beyond the Free quota is required.
8. Sync/rebase PR #12 with current `main`.
9. Merge PR #12 only after required GitHub checks are acceptable.
10. Trigger exactly one clean production deployment from `main` on `mindreply` using either Vercel's automatic main deployment or the manual workflow.
11. Verify with `npm run launch:report`, `npm run deploy:status-contexts -- <commit-sha>`, and provider dashboard evidence.

## Canonical project rules

Use one canonical Vercel project for `Mind-Reply/MindReply`:

- Project name: `mindreply`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Framework preset: `Next.js`
- Root directory: `.`
- Install command: `npm install --prefer-offline --no-audit --fund=false --progress=false`
- Build command: `npm run build`
- Production branch: `main`
- Custom domains: `mind-reply.com` and `www.mind-reply.com`

Disconnect duplicate projects that point to stale repos, stale branches, old root directories, or the same GitHub repo. Duplicate projects burn builds and make domain routing confusing.

## Build quota guard

`vercel.json` still uses `ignoreCommand`:

```bash
node scripts/vercel-ignore-build.mjs
```

The guard skips reporting/docs/workflow-only changes when Vercel reaches the ignored build step. The branch deployment gate runs earlier and is the stronger protection against preview quota burn.

To force a one-off build from the dashboard or CLI, use an intentional manual deployment path rather than changing the gate permanently.

## Upload scope guard

`.vercelignore` keeps support material out of Vercel runtime uploads:

- GitHub workflow metadata
- local agent/codex folders
- reports, logs, coverage, and artifacts
- private docs and planning files
- Python/integration/browser-extension scaffolds not used by the Next.js runtime
- imported PDFs, Word files, ZIPs, and 7z archives

Do not ignore `app`, `components`, `lib`, `public`, `package.json`, lockfiles, config files, or `scripts/vercel-ignore-build.mjs`.

## What code cannot do

Code cannot upgrade billing, raise account quota, attach payment details, confirm paid Vercel plan changes, delete duplicate Vercel projects, or disconnect GitHub integrations. Those actions must be confirmed in Vercel by the account owner.

## After recovery

1. Confirm only canonical `mindreply` remains attached to the repo, or make the duplicate check non-required.
2. Confirm `npm run launch:report` shows the production surface and health endpoints ready.
3. Confirm `npm run deploy:status-contexts -- <commit-sha>` reports `single-canonical` or no duplicate Vercel contexts.
4. Confirm the custom domains still point to canonical `mindreply`.
5. Confirm GitHub Actions checks run and pass.
6. Merge PR #12 into `main`.
7. Redeploy production from `main` once.
8. Confirm `mind-reply.com` and `www.mind-reply.com` resolve to canonical `mindreply`.
