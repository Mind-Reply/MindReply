# Vercel Deployment Limit Runbook

## Current verified state

The active code path is PR #12:

- PR: `https://github.com/Mind-Reply/MindReply/pull/12`
- Branch: `codex/executive-nervous-system-main-sync`
- Vercel project: `mind-reply`
- Project ID: `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`
- Team ID: `team_0plIJmQLgZC1wVv9zI2eVf3B`

The failing or stale provider target observed during recovery was:

`https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`

That is an account, project, or GitHub-integration condition. Repository code can reduce future waste, but it cannot upgrade billing, attach a payment method, or disconnect a provider-side project integration without owner/provider access.

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

This is the main repo-side fix for the quota spiral. The ignored build step remains useful, but `git.deploymentEnabled` is stricter because it prevents branch deployments from starting.

## Manual production deployment

A manual workflow exists at:

`.github/workflows/manual-vercel-production.yml`

Use it only after PR #12 is merged or after the target branch is intentionally selected for production.

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

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

- `single-canonical`: one Vercel context exists and it targets the canonical `mind-reply` project.
- `needs-provider-action`: duplicate or quota-linked Vercel contexts still exist and must be disconnected, disabled, or made non-required provider-side.
- `not-verifiable`: no SHA was provided, GitHub was unreachable, or a token is needed for the repo/status endpoint.

## What is working now

- The canonical PR preview previously rendered the new MindReply Executive Nervous System surface.
- Preview `/api/health` previously returned `200` and reported Intake, Action, Memory, MRagent MCP tools, and privacy defaults ready.
- `https://www.mind-reply.com/agent` returns `200`.
- `https://www.mind-reply.com/api/health` returns `200` with the live health payload.
- The launch report gives a fresh proof artifact instead of relying only on static runbook deployment IDs.
- The status context audit gives a fresh proof artifact for duplicate Vercel status cleanup.
- Latest PR branch commits stopped receiving Vercel status entries after the `git.deploymentEnabled` gate, consistent with automatic PR deploy suppression.

## Remaining launch blockers

1. `https://www.mind-reply.com/` still serves the older `MindReply | Private Decision Support for Work Messages` production homepage, not the PR preview surface.
2. `mind-reply.com` and `www.mind-reply.com` still need to be attached or promoted to the canonical production project after merge/deploy readiness is confirmed.
3. The passing `mind-reply` project provider state has reported `live: false`.
4. The duplicate or wrong Vercel provider target `mr-64b2efc9` must be disconnected, disabled, or made non-required provider-side.
5. Provider-backed model replies and receipt persistence remain fallback until production env vars are configured in Vercel.
6. PR #12 must be synced/rebased with latest `main` before merge.

## Immediate recovery

1. Open the failing Vercel status link from GitHub if it appears again.
2. Decide one provider-side path:
   - Preferred: disconnect or disable the duplicate/wrong Vercel project/context from the GitHub repo.
   - Alternative: make the duplicate context non-required if it must temporarily remain attached.
   - Billing path: upgrade the Vercel team to Pro only if immediate deployment beyond the Free quota is required.
3. In the valid `mind-reply` Vercel project, attach or promote these domains:
   - `mind-reply.com`
   - `www.mind-reply.com`
4. Set the canonical production branch to `main`.
5. Sync/rebase PR #12 with current `main`.
6. Merge PR #12 only after required GitHub checks are acceptable.
7. Trigger exactly one clean production deployment from `main` using either Vercel's automatic main deployment or the manual workflow.
8. Verify with `npm run launch:report`, `npm run deploy:status-contexts -- <commit-sha>`, and provider dashboard evidence.

## Canonical project rules

Use one canonical Vercel project for `Mind-Reply/MindReply`:

- Framework preset: `Next.js`
- Root directory: `.`
- Install command: `npm install --prefer-offline --no-audit --fund=false --progress=false`
- Build command: `npm run build`
- Production branch: `main`
- Custom domains: `mind-reply.com` and `www.mind-reply.com`

Disconnect duplicate projects that point to stale repos, stale branches, or old root directories. Duplicate projects burn preview builds and make domain routing confusing.

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

1. Confirm only the canonical `mind-reply` Vercel project remains attached to the repo, or make the duplicate check non-required.
2. Confirm `npm run launch:report` shows the production surface and health endpoints ready.
3. Confirm `npm run deploy:status-contexts -- <commit-sha>` reports `single-canonical` or no duplicate Vercel contexts.
4. Confirm the custom domains point to the canonical `mind-reply` project.
5. Confirm GitHub Actions checks run and pass.
6. Merge PR #12 into `main`.
7. Redeploy production from `main` once.
8. Confirm `mind-reply.com` and `www.mind-reply.com` resolve to the canonical project.
