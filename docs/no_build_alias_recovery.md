# No-Build Alias Recovery

Use this when a Vercel deployment is already `READY` and the public custom domains are still serving an older deployment.

This path does not create a new build. It only re-points public aliases, waits for `/api/version` to match the expected commit, then runs the live revenue gate.

## Current Target

- Workflow: `.github/workflows/vercel-alias-ready-deployment.yml`
- Confirm input: `alias-ready-deployment`
- Deployment URL: `https://mindreply-js5m73tfy-angellllkr-engs-projects.vercel.app`
- Deployment id: `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T`
- Expected SHA: `e0cab2db420d8be63d9ead67cb7cf9d3e6869252`

## Required Secret

- `VERCEL_TOKEN`

The workflow also checks the canonical Vercel identifiers:

- `VERCEL_ORG_ID=team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID=prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

## What It Does

1. Confirms the operator typed `alias-ready-deployment`.
2. Requires the workflow to run from `main`.
3. Validates the deployment URL is a Vercel deployment URL.
4. Runs `vercel inspect` on the target.
5. Runs:
   - `vercel alias set <deployment-url> www.mind-reply.com`
   - `vercel alias set <deployment-url> mind-reply.com`
   - optional canonical Vercel alias assignment.
6. Polls `https://www.mind-reply.com/api/version` until it reports the expected SHA.
7. Runs `npm run verify:live-revenue`.
8. Attempts the owner report send and uploads report artifacts.

## Revenue Gate

The live revenue verifier now checks the dedicated package page, not only homepage/contact.

Production fails if `/website-completion-package` does not show:

- `Website Completion Package`
- `GBP 600`
- `Invoice-first request path active`
- `No payment link is required to begin`
- `billing name and billing email`
- `Scope first, invoice/payment before delivery`
- `paymentPath`
- `invoice-first unless a configured direct payment link is present`

## Why This Exists

The public domain is safe and sellable, but it has previously lagged behind the latest ready deployment. This workflow turns alias repair into a repeatable, proof-backed operation instead of another full production build.

Do not claim income, booked revenue, autonomous staff, or live proof until the workflow succeeds and the live verifier artifact is attached.
