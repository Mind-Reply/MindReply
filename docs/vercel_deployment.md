# Vercel Deployment

MindReply is linked to Vercel project `mindreply`.

Required CircleCI project environment variables:

- `VERCEL_TOKEN`: Vercel token with access to the team/project.
- `VERCEL_ORG_ID`: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID`: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

Required GitHub Actions secrets for the manual production deploy:

- `VERCEL_TOKEN`: Vercel token with access to the team/project.
- `VERCEL_ORG_ID`: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID`: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

## Git Deployment Policy

`vercel.json` disables Vercel Git auto-deployments with `git.deploymentEnabled: false`.
This stops duplicate connected Vercel projects from creating deployment statuses and burning
the daily deployment counter before the repo's ignore script can help.

`scripts/vercel-ignore-build.mjs` remains as a secondary guard for any project or environment
where Git deployments are manually re-enabled:

- Preview deployments are skipped.
- Non-main branches are skipped.
- Duplicate Vercel production projects are skipped.
- Docs-only and report-only changes are skipped.
- App or deployment-config changes on `main` must ship through the manual canonical deploy workflow.

This keeps urgent public-site fixes deployable through one controlled project while suppressing
the noisy Vercel Git deployment loop that was consuming capacity.

## CircleCI Deploy Flow

1. `verify_mindreply` installs dependencies, checks reports, typechecks, runs Python tests, and builds the Next app.
2. `npm run release:audit` verifies report config, outbox delivery, decision-layer behavior, live deployment health, and Vercel deploy preflight state.
3. `hold_production_deploy` waits for manual owner approval on `main`.
4. `deploy_mindreply_vercel` runs only after that approval.
5. `npm run deploy:preflight` verifies the three Vercel variables match `.vercel/project.json`.
6. CircleCI runs `vercel pull`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.
7. `npm run deploy:verify-live` checks the production home page, health API, intake API, robots.txt, and sitemap.xml.

## Manual GitHub Deploy Flow

1. Open GitHub Actions.
2. Run `MindReply Manual Vercel Production Deploy`.
3. Type `deploy-production` in the confirmation field.
4. The workflow runs report config, owner state report, revenue blueprint, `verify:all`, and Vercel preflight.
5. The workflow runs `vercel pull`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.
6. The workflow checks `/`, `/api/health`, and `/api/version`, then sends the private owner deployment report when delivery secrets exist.

## Quota Control

- `vercel.json` is the primary quota guard: Vercel Git auto-deployments are disabled.
- `scripts/vercel-ignore-build.mjs` is the secondary guard if Git deployments are re-enabled.
- CircleCI production deployment still waits at `hold_production_deploy` until owner approval.
- GitHub manual deployment is `workflow_dispatch` only and requires the exact confirmation phrase `deploy-production`.
- The Free-plan `api-deployments-free-per-day` limit cannot be removed in code. It is reduced by disabling duplicate Git-triggered deploys, avoided by deploying only after verification when manual deploy is used, and eliminated only by Vercel plan/account changes outside this repo.
- Vercel Pro cannot be enabled from source code. The owner must upgrade the Vercel account/team billing plan in the Vercel dashboard, then rerun or allow the deploy.

See `docs/vercel_limit_resolution.md` for the owner-side quota decision.

Vercel source check: `https://vercel.com/docs/limits/overview` lists `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. Keep low-value deploys suppressed unless the account is upgraded and owner reports show green production verification.

Live verification after deploy:

- `https://www.mind-reply.com/`
- `https://www.mind-reply.com/api/health`
- `https://www.mind-reply.com/api/intake`
- `https://www.mind-reply.com/api/version`
- `https://www.mind-reply.com/robots.txt`
- `https://www.mind-reply.com/sitemap.xml`
