# Current Deployment State

Checked: 2026-06-10

## Live Domain

- `https://www.mind-reply.com/`: reachable.
- `https://www.mind-reply.com/api/health`: `200 OK` on the last live check.
- `https://www.mind-reply.com/response-overload`: `404` on the last live check.

The `404` response-overload route means production is still behind merged `main` commit
`0b316420cc9857c88989066af08617685b4096fd`.

## Vercel Project

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

The latest inspected ready production deployment was created from `main` at commit `0e612d39f58cb6f07094aa464e10a62da1879828`.

Recent Vercel/GitHub status history showed three connected Vercel projects trying to deploy
the same commit and failing with `api-deployments-free-per-day`. The repo now disables Vercel
Git auto-deployments and uses the manual canonical deploy workflow for production.

## Current GitHub Controls

- `vercel.json` disables Vercel Git auto-deployments with `git.deploymentEnabled: false`.
- `scripts/vercel-ignore-build.mjs` remains as a secondary guard if Git deployments are re-enabled.
- App changes on `main` must ship through the canonical manual deploy workflow while the duplicate Vercel projects remain connected.
- `MindReply Manual Vercel Production Deploy` remains available as a `workflow_dispatch` fallback.
- The manual deploy requires the exact confirmation phrase `deploy-production`.
- The manual deploy verifies the Vercel team id, project id, app contract, and live `/api/version` endpoint.

## Next Production Action

1. Wait for the Vercel daily deployment quota to reset.
2. Confirm GitHub Actions secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Run `MindReply Manual Vercel Production Deploy` on `main`.
4. Type `deploy-production`.
5. Confirm the workflow live checks pass and `/response-overload` returns `200`.

## Limit Position

Vercel's public limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. Source code cannot upgrade the account. The repo can only suppress low-value deployments and make production deployment intentional when quota is constrained.
