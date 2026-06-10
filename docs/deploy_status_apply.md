# MindReply Deploy Apply Status

Last checked: 2026-06-10 12:28 Europe/Kiev.

## Current State

- Production domain: `https://www.mind-reply.com`
- Live production commit from `/api/version`: `0957a3c7233801286c27b4edea4fb934bb2833de`
- GitHub `main` commit ready for deploy: `b05a8a9555308bd2100b85245fc18ce08c6a7220`
- Result: production is behind `main`.

## What Is Already Applied In Code

- MRagent copy/state fixes are on `main`.
- Footer language/country exposure fixes are on `main`.
- Google Translate route/provider changes are on `main`.
- Product, checkout, invoice-first, and contact route verifier fixes are on `main`.
- GitHub CI and MRagent verification passed on latest `main`.
- Vercel deploy workflow now passes code/verifier gates through typecheck.

## Current Deployment Blocker

The latest `Vercel Production Deploy` workflow passes the application gates, then stops at `Guard Vercel token` because no Vercel token is available in GitHub Actions:

- required secret: `VERCEL_TOKEN`
- accepted aliases in workflow: `VERCEL_ACCESS_TOKEN` or `VERCEL_API_TOKEN`
- project id: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- team id: `team_0plIJmQLgZC1wVv9zI2eVf3B`

Local CLI deploy also failed with Vercel account quota:

```text
Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day").
```

## Active Retry Path

A local Windows scheduled task exists:

- task: `MindReply Vercel Production Deploy Retry`
- command: `C:\Users\angel\OneDrive\Desktop\Mind-Reply\MindReply\scripts\deploy-vercel-prod.cmd`
- next run: `2026-06-11 13:27 Europe/Kiev`
- repeat: hourly for 12 hours

## Apply Next

1. Add a GitHub Actions secret named `VERCEL_TOKEN` for the Vercel account/team that owns `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`.
2. Re-run `Vercel Production Deploy` from GitHub Actions, or wait for the local retry task after the Vercel daily quota resets.
3. Verify deploy by checking `https://www.mind-reply.com/api/version` and confirming `deployment.commitSha` equals current `main`.
4. Verify public copy no longer contains stale footer/MRagent text:
   - `MRagent slows the moment before it moves`
   - `Auto country signal first`
   - legacy auto-background locale marker

## Completion Rule

Do not mark deployment complete until live `/api/version` matches GitHub `main` and the public homepage no longer contains the stale strings above.
