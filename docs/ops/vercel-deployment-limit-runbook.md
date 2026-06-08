# Vercel Deployment Limit Runbook

## Current verified state

GitHub currently reports two Vercel contexts on PR #12:

- `Vercel - mind-reply`: passing
- `Vercel - mindreply`: failing with `upgradeToPro=build-rate-limit`

The passing project is the canonical project for this branch:

- Vercel project: `mind-reply`
- Project ID: `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`
- Team ID: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Passing deployment: `dpl_F7zxHrQr9FmqKgmBNQogKQFMGWRx`
- Preview URL: `https://mind-reply-evbls7d1w-angellllkr-engs-projects.vercel.app`
- Branch alias: `https://mind-reply-git-codex-executive-90aec2-angellllkr-engs-projects.vercel.app`

The failing `mindreply` context is a duplicate or old Vercel project/context. It points to:

`https://vercel.com/mr-64b2efc9?upgradeToPro=build-rate-limit`

That is an account or project quota condition. Repository code can reduce future waste, but it cannot remove the active billing/rate-limit block or upgrade the account.

## What is working now

- The `mind-reply` Vercel check is green for commit `bf6c0a12042da126bb816e508553f98450228dd3`.
- The preview homepage renders the new Executive Nervous System surface.
- `/api/health` returns `200` and reports Intake, Action, Memory, MRagent MCP tools, and privacy defaults ready.
- `/api/intake` rejects `GET` with `405`, which is expected because intake is a `POST` endpoint.

## Remaining launch blockers

1. `mind-reply.com` and `www.mind-reply.com` are not attached to the passing `mind-reply` project yet.
2. The passing Vercel project reports `live: false`; production needs a clean main deployment or promotion after merge.
3. The duplicate `mindreply` Vercel context still consumes/fails checks because of the build-rate-limit condition.
4. Provider-backed persistence is still fallback until production env vars are set in Vercel.

## Immediate recovery

1. Open the failing `Vercel - mindreply` status link from GitHub.
2. Decide one path:
   - Preferred: disconnect or disable the duplicate `mindreply` Vercel project/context from the GitHub repo.
   - Alternative: upgrade that project/team to Pro in Vercel Billing if it must remain active.
3. In the valid `mind-reply` Vercel project, attach these domains:
   - `mind-reply.com`
   - `www.mind-reply.com`
4. Set the canonical production branch to `main`.
5. Merge PR #12 only after required GitHub checks are acceptable.
6. Trigger a clean production deployment from `main` on the `mind-reply` project.
7. Verify:
   - `https://www.mind-reply.com/`
   - `https://www.mind-reply.com/agent`
   - `https://www.mind-reply.com/privacy`
   - `https://www.mind-reply.com/api/health`
   - `POST https://www.mind-reply.com/api/intake`

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

Code cannot upgrade billing, raise account quota, attach payment details, or confirm paid Vercel plan changes. Those actions must be confirmed in Vercel by the account owner.

## After recovery

1. Confirm only the canonical `mind-reply` Vercel project remains attached to the repo, or make the duplicate `mindreply` check non-required.
2. Confirm the green preview URL still renders the new homepage.
3. Confirm the custom domains point to the canonical `mind-reply` project.
4. Confirm GitHub Actions checks run and pass.
5. Merge PR #12 into `main`.
6. Redeploy production from `main`.
7. Confirm `mind-reply.com` and `www.mind-reply.com` resolve to the canonical project.
