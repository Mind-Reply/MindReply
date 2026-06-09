# Current Deployment State

Checked: 2026-06-09

## Live Domain

- `https://www.mind-reply.com/`: reachable.
- `https://www.mind-reply.com/api/health`: `200 OK`.
- `https://www.mind-reply.com/api/version`: `410 Gone`.

The `410 Gone` version endpoint means production is still behind the local repo, because the local app contains `app/api/version/route.ts`.

## Vercel Project

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

The latest inspected ready production deployment was created from `main` at commit `0e612d39f58cb6f07094aa464e10a62da1879828`.

Recent Vercel history also showed multiple automatic, errored, or canceled deployments. The repo now reduces that churn by disabling Vercel Git deployments and forcing production deployment through owner-approved paths only.

## Next Production Action

1. Push the current repo changes to GitHub.
2. Confirm GitHub Actions secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Open GitHub Actions.
4. Run `MindReply Manual Vercel Production Deploy`.
5. Type `deploy-production`.
6. Confirm the workflow live checks pass and `/api/version` returns `200`.

## Limit Position

Vercel's public limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. Source code cannot upgrade the account. The repo can only prevent unnecessary deploys and make each production deployment intentional.
