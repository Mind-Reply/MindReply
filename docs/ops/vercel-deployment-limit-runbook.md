# Vercel Deployment Limit Runbook

## Current verified state

GitHub currently reports two Vercel contexts on PR #12:

- `Vercel - mind-reply`: passing on the canonical preview project.
- `Vercel - mindreply`: stale or duplicate provider-side context that links to `upgradeToPro=build-rate-limit`.

The passing project for this branch is:

- Vercel project: `mind-reply`
- Project ID: `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`
- Team ID: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Latest manually verified PR head before the launch-report addition: `12abee691dba149bb9e5c983c55a33998326086b`
- Latest manually verified preview deployment: `dpl_6jPe4d99jvDe2ponqDbMLTG2giXX`
- Deployment URL: `https://mind-reply-2n0cpzkac-angellllkr-engs-projects.vercel.app`
- Branch alias: `https://mind-reply-git-codex-executive-90aec2-angellllkr-engs-projects.vercel.app`

The duplicate or stale `mindreply` context points to:

`https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`

That is an account, project, or GitHub-integration condition. Repository code can reduce future waste, but it cannot remove the active billing/rate-limit block, upgrade the account, or disconnect a provider-side project integration.

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

## What is working now

- The canonical preview alias renders the new MindReply Executive Nervous System surface.
- Preview `/api/health` returns `200` and reports Intake, Action, Memory, MRagent MCP tools, and privacy defaults ready.
- `https://www.mind-reply.com/agent` returns `200`.
- `https://www.mind-reply.com/api/health` returns `200` with the live health payload.
- The launch report gives a fresh proof artifact instead of relying only on static runbook deployment IDs.

## Remaining launch blockers

1. `https://www.mind-reply.com/` still serves the older `MindReply | Private Decision Support for Work Messages` production homepage, not the PR preview surface.
2. `mind-reply.com` and `www.mind-reply.com` still need to be attached or promoted to the canonical production project after merge/deploy readiness is confirmed.
3. The passing `mind-reply` project provider state has reported `live: false`.
4. The duplicate `mindreply` Vercel context still appears as a failing or stale GitHub status context because of the build-rate-limit link.
5. Provider-backed model replies and receipt persistence remain fallback until production env vars are configured in Vercel.

## Immediate recovery

1. Open the failing `Vercel - mindreply` status link from GitHub.
2. Decide one provider-side path:
   - Preferred: disconnect or disable the duplicate `mindreply` Vercel project/context from the GitHub repo.
   - Alternative: make the duplicate context non-required if it must temporarily remain attached.
   - Billing path: upgrade that project/team to Pro only if the owner confirms it must remain active and paid.
3. In the valid `mind-reply` Vercel project, attach or promote these domains:
   - `mind-reply.com`
   - `www.mind-reply.com`
4. Set the canonical production branch to `main`.
5. Merge PR #12 only after required GitHub checks are acceptable.
6. Trigger exactly one clean production deployment from `main` on the canonical `mind-reply` project.
7. Verify with `npm run launch:report` plus any provider dashboard evidence.

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

`vercel.json` uses `ignoreCommand`:

```bash
node scripts/vercel-ignore-build.mjs
```

The guard allows builds for:

- production deployments
- `main`
- `codex/executive-nervous-system-main-sync`
- branches starting with `release/`
- branches starting with `deploy/`
- extra branches listed in `MINDREPLY_VERCEL_BUILD_BRANCHES`

It skips unrelated preview branches so old experiments stop consuming build quota.

To force a one-off build from the dashboard, set one of these env vars to `1` for that deployment context:

- `MINDREPLY_FORCE_VERCEL_BUILD`
- `VERCEL_FORCE_BUILD`

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

1. Confirm only the canonical `mind-reply` Vercel project remains attached to the repo, or make the duplicate `mindreply` check non-required.
2. Confirm `npm run launch:report` shows the preview surface and health endpoints ready.
3. Confirm the custom domains point to the canonical `mind-reply` project.
4. Confirm GitHub Actions checks run and pass.
5. Merge PR #12 into `main`.
6. Redeploy production from `main` once.
7. Confirm `mind-reply.com` and `www.mind-reply.com` resolve to the canonical project.
