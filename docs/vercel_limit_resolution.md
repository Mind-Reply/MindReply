# Vercel Limit Resolution

## Current State

MindReply now protects the Vercel deployment quota with three controls:

1. Vercel Git deployments are disabled in `vercel.json`.
2. CircleCI production deployment waits at `hold_production_deploy` for owner approval.
3. GitHub production deployment is manual only through `MindReply Manual Vercel Production Deploy`.

The hourly owner report workflow does not deploy. It only checks state, writes private artifacts, and sends the owner report when delivery secrets exist.

## What Code Can Do

- Stop automatic deploy loops.
- Require one deliberate owner action before production deploy.
- Verify the Vercel project id and team id before deploying.
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

Do not re-enable automatic Git deployments until the domain is stable, the deploy quota is no longer blocking work, and owner reports show green production verification.

## Source Check

Vercel's published limits list `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. This is why the repo now treats every production deploy as an owner-approved event instead of an automatic reaction to every push.

Reference: `https://vercel.com/docs/limits/overview`
