# Manual Deploy Click Path

Use this when production must update without burning deployments on every push.

## Before Clicking Deploy

Confirm these GitHub Actions secrets or variables exist:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

`VERCEL_TOKEN` must be a secret. `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` may be secrets or repository variables.

Expected values for the linked project:

- `VERCEL_ORG_ID`: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID`: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

## Readiness Check Without Deploying

Run this first when you want proof that production can deploy without spending one deployment:

1. Open `https://github.com/Mind-Reply/MindReply/actions`.
2. Select `MindReply Deployment Readiness Check`.
3. Click `Run workflow` on branch `main`.
4. Confirm it builds the Vercel production artifact and reports whether `/api/version` is already live.

This workflow does not run `vercel deploy`.

## Deploy

1. Open `https://github.com/Mind-Reply/MindReply/actions`.
2. Select `MindReply Manual Vercel Production Deploy`.
3. Click `Run workflow`.
4. Select branch `main`.
5. In `confirm`, type exactly:

```text
deploy-production
```

6. Click `Run workflow`.

## Pass Criteria

The workflow must pass:

- `npm run report:check`
- `npm run launch:report`
- `npm run audit:blueprint`
- `npm run verify:all`
- Vercel team/project id preflight
- Vercel build and production deploy
- Live checks for `/`, `/api/health`, and `/api/version`

## After Deploy

Confirm:

- `https://www.mind-reply.com/api/health` returns `200`.
- `https://www.mind-reply.com/api/version` returns `200`.
- No unexpected new automatic deployments appear in Vercel.

## Pro Limit Note

The repo can stop waste. It cannot upgrade billing. If the Vercel Hobby deployment cap still blocks work, upgrade the Vercel team in the Vercel dashboard, then run this manual workflow once.
