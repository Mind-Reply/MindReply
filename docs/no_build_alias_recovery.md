# No-Build Alias Recovery

Use this when a Vercel deployment is already `READY` and the public custom domains are still serving an older deployment.

This path does not create a new build. It only re-points public aliases, waits for `/api/version` to match the expected commit, then runs the live revenue gate.

## Current Target

- Workflow: `.github/workflows/vercel-alias-ready-deployment.yml`
- Confirm input: `alias-ready-deployment`
- Deployment URL: `https://mindreply-deuio7she-angellllkr-engs-projects.vercel.app`
- Deployment id: `dpl_AQWnPEDmLtFmfqPobMShwaAB7SAn`
- Expected SHA: `55480c5ede469cb324c5c000b70181e384d38604`
- Commit message: `Guard no-build alias workflow contract`

This is the newest READY production-target deployment verified by the Vercel connector on 2026-06-09. It includes the invoice-first Website Completion Package page and the source release-gate contract for the no-build alias workflow.

## Required Secret

- `VERCEL_TOKEN`

The workflow also checks the canonical Vercel identifiers:

- `VERCEL_ORG_ID=team_0plIJmQLgZC1wVv9zI2eVf3B`
- `VERCEL_PROJECT_ID=prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`

## What It Does

1. Confirms the operator typed `alias-ready-deployment`.
2. Requires the workflow to run from `main`.
3. Validates the deployment URL is a Vercel deployment URL.
4. Runs `vercel inspect` on the target and requires the expected SHA to appear before aliasing.
5. Runs:
   - `vercel alias set <deployment-url> www.mind-reply.com`
   - `vercel alias set <deployment-url> mind-reply.com`
   - optional canonical Vercel alias assignment.
6. Polls `https://www.mind-reply.com/api/version` until it reports the expected SHA.
7. Runs `npm run verify:live-revenue`.
8. Attempts the owner report send and uploads report artifacts.

## Revenue Gate

The live revenue verifier checks the dedicated package page, not only homepage/contact.

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
