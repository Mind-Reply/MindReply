# Vercel Limit Resolution

## Current State

MindReply now protects the Vercel deployment quota with three controls:

1. Guarded Vercel Git deployments are allowed for `main` so urgent public-site fixes can ship.
2. `scripts/vercel-ignore-build.mjs` skips preview deployments, non-main branches, duplicate Vercel projects, docs-only changes, and report-only changes.
3. Manual production deployment remains available through CircleCI approval or `MindReply Manual Vercel Production Deploy` when a deliberate owner-approved deploy is needed.

The hourly owner report workflow does not deploy. It only checks state, writes private artifacts, and sends the owner report when delivery secrets exist.

## What Code Can Do

- Stop low-value deploy loops.
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
   - Guarded Git deploy: push an app/config change to `main` and let Vercel build it.
   - CircleCI: approve `hold_production_deploy`.
   - GitHub Actions: run `MindReply Manual Vercel Production Deploy` and type `deploy-production`.

## Operating Rule

Do not fully disable Git deployments while the public site is behind urgent revenue or privacy fixes. Keep the ignore-build guard strict, and only suppress low-value deployments that do not change the public app.

## Source Check

Vercel's published limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. This is why the repo suppresses previews, non-main branches, docs-only changes, and report-only changes while still allowing urgent `main` app/config fixes to deploy.

Reference: `https://vercel.com/docs/limits/overview`
