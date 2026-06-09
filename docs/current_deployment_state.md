# Current Deployment State

Checked: 2026-06-09

## Live Domain

- `https://www.mind-reply.com/`: reachable.
- `https://www.mind-reply.com/api/health`: `200 OK` on the last live check.
- `https://www.mind-reply.com/api/version`: `410 Gone` on the last live check.

The `410 Gone` version endpoint means production is still behind the repo state that includes `app/api/version/route.ts`.

## Vercel Project

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

The latest inspected ready production deployment was created from `main` at commit `0e612d39f58cb6f07094aa464e10a62da1879828`.

Recent Vercel history also showed multiple automatic, errored, or canceled deployments. The repo now uses a guarded Git deployment path instead of fully disabling Git deployments, because production must be able to receive urgent public-site fixes.

## Current GitHub Controls

- `vercel.json` allows Git deployments again.
- `scripts/vercel-ignore-build.mjs` skips preview deployments, non-main branches, duplicate Vercel projects, docs-only changes, and report-only changes.
- App changes on `main` are allowed to build the canonical production project.
- `MindReply Manual Vercel Production Deploy` remains available as a `workflow_dispatch` fallback.
- The manual deploy requires the exact confirmation phrase `deploy-production`.
- The manual deploy verifies the Vercel team id, project id, app contract, and live `/api/version` endpoint.

## Next Production Action

1. Let the guarded Vercel Git deployment attempt the latest `main` app/config change.
2. If Vercel still reports a quota or billing limit, confirm GitHub Actions secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Run `MindReply Manual Vercel Production Deploy` on `main`.
4. Type `deploy-production`.
5. Confirm the workflow live checks pass and `/api/version` returns `200`.

## Limit Position

Vercel's public limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. Source code cannot upgrade the account. The repo can only suppress low-value deployments and make production deployment intentional when quota is constrained.
