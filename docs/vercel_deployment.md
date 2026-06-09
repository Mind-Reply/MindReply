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

Deploy flow:

1. `verify_mindreply` installs dependencies, checks reports, typechecks, runs Python tests, and builds the Next app.
2. `npm run release:audit` verifies report config, outbox delivery, decision-layer behavior, live deployment health, and Vercel deploy preflight state.
3. `hold_production_deploy` waits for manual owner approval on `main`.
4. `deploy_mindreply_vercel` runs only after that approval.
5. `npm run deploy:preflight` verifies the three Vercel variables match `.vercel/project.json`.
6. CircleCI runs `vercel pull`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.
7. `npm run deploy:verify-live` checks the production home page, health API, intake API, robots.txt, and sitemap.xml.

Manual GitHub deploy flow:

1. Open GitHub Actions.
2. Run `MindReply Manual Vercel Production Deploy`.
3. Type `deploy-production` in the confirmation field.
4. The workflow runs report config, owner state report, revenue blueprint, `verify:all`, and Vercel preflight.
5. The workflow runs `vercel pull`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.
6. The workflow checks `/`, `/api/health`, and `/api/version`, then sends the private owner deployment report when delivery secrets exist.

Quota control:

- `vercel.json` sets `git.deploymentEnabled` to `false`, so automatic Vercel Git deployments do not burn deploy quota.
- CircleCI verification runs on pushes, but production deploy waits at `hold_production_deploy` until the owner approves one intentional deploy.
- GitHub deployment is `workflow_dispatch` only and requires the exact confirmation phrase `deploy-production`.
- The Free-plan `api-deployments-free-per-day` limit cannot be removed in code. It is reduced by disabling automatic deploys, avoided by deploying only after verification, and eliminated only by Vercel plan/account changes outside this repo.
- Vercel Pro cannot be enabled from source code. The owner must upgrade the Vercel account/team billing plan in the Vercel dashboard, then rerun the approved deploy.

See `docs/vercel_limit_resolution.md` for the owner-side quota decision.

Vercel source check: `https://vercel.com/docs/limits/overview` lists `Deployments Created per Day` as `100` on Hobby and `6000` on Pro. Keep production deploys manual unless the account is upgraded and the owner explicitly re-enables automatic deployment.

Live verification after deploy:

- `https://www.mind-reply.com/`
- `https://www.mind-reply.com/api/health`
- `https://www.mind-reply.com/api/intake`
- `https://www.mind-reply.com/api/version`
- `https://www.mind-reply.com/robots.txt`
- `https://www.mind-reply.com/sitemap.xml`
