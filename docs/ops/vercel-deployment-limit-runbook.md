# Vercel Deployment Limit Runbook

## Current signal

GitHub reports the active Vercel check as failed with this target:

`https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`

That is an account or project quota condition. Repository code can reduce future waste, but it cannot remove the active billing or rate-limit block.

## Immediate recovery

1. Open the failed Vercel status link from GitHub PR #12.
2. If the dashboard shows `upgradeToPro=build-rate-limit`, upgrade the team or project to Pro in Vercel Billing.
3. If not upgrading, wait for the current rate-limit window to clear. Vercel may require waiting before another deployment can build.
4. After the limit is clear, redeploy the latest commit on PR #12.
5. Verify the preview paths:
   - `/`
   - `/agent`
   - `/api/health`
   - `/api/intake`
   - `/mcp`

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

`node scripts/vercel-ignore-build.mjs`

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

Code cannot upgrade billing, raise account quota, or attach payment details. Those actions must be confirmed in Vercel by the account owner.

## After recovery

1. Confirm the Vercel check on PR #12 turns green.
2. Confirm GitHub Actions checks run and pass.
3. Merge PR #12 into `main` only after checks pass.
4. Redeploy production from `main`.
5. Confirm `mind-reply.com` and `www.mind-reply.com` resolve to the canonical project.
