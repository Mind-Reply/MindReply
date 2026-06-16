# Vercel Limit Resolution

## Current State

MindReply now protects the Vercel deployment quota with three controls:

1. `vercel.json` disables Vercel Git auto-deployments so duplicate connected projects stop creating deployment attempts.
2. `scripts/vercel-ignore-build.mjs` remains as a secondary guard if Git deployments are later re-enabled.
3. Manual production deployment remains available through CircleCI approval or `MindReply Manual Vercel Production Deploy` when a deliberate owner-approved deploy is needed.

The hourly owner report workflow does not deploy. It only checks state, writes private artifacts, and sends the owner report when delivery secrets exist.

## What Code Can Do

- Stop low-value and duplicate Git-triggered deploy loops.
- Keep urgent `main` app/config fixes deployable.
- Require deliberate owner action for manual production deploys.
- Verify the Vercel project id and team id before manual deployment.
- Verify the live domain after deployment.
- Send a private owner receipt through configured email and Slack channels.

## What Code Cannot Do

Source code cannot make the account Pro from code, remove a provider billing limit, or increase account quota by itself. Those are Vercel account and billing controls.

## Owner Action To Remove The Limit

1. Open the Vercel dashboard for team `team_0plIJmQLgZC1wVv9zI2eVf3B`.
2. Upgrade the team/project plan if the daily deployment quota is blocking production work.
3. Confirm the secrets are set:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. Run one intentional deployment through either:
   - CircleCI: approve `hold_production_deploy`.
   - GitHub Actions: run `MindReply Manual Vercel Production Deploy` and type `deploy-production`.

## Operating Rule

Keep Vercel Git auto-deployments disabled until only the canonical `mindreply` project is connected to GitHub. Use the manual deploy workflow for production so one verified build spends one deployment.

## Source Check

Vercel's published limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. This is why the repo disables duplicate Git-triggered deployments and keeps urgent `main` app/config fixes behind one manual canonical deploy.

Reference: `https://vercel.com/docs/limits/overview`
