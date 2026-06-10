# Production Alias Status - 2026-06-10

## Current Read

MindReply is sellable on the public domain, but the public aliases are still not proven on the pinned invoice-proof deployment.

This file is intentionally about revenue and proof, not broad platform ambition. It records what can be claimed, what cannot be claimed, and the next action that removes buying friction.

## Public Domain Evidence

Fetched on 2026-06-10:

- `https://www.mind-reply.com/api/version` returns `status: ok` and commit `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com`, `Website Completion Package, GBP 600`, and the human handoff/contact form path.
- `https://www.mind-reply.com/website-completion-package` shows `Website Completion Package`, `GBP 600`, the ranked action queue, send-ready copy, receipt framing, assisted-close assets, privacy-safe trust proof, and the multilingual footer.
- `POST https://www.mind-reply.com/api/package-request` with an empty JSON body returns `400`, so invalid intake is rejected.

## Public Domain Gap

The public package page still shows the older wording:

- `Invoice request path active`

The pinned READY deployment shows the stronger invoice-first proof language:

- `Invoice-first request path active`
- `No payment link is required to begin`
- `billing name and billing email`
- `paymentPath: invoice-first unless a configured direct payment link is present`

Until the public aliases move, do not claim the public domain contains the stronger invoice-first package proof.

## Pinned Alias Target

Use the no-build alias workflow unless an operator deliberately chooses a newer READY deployment and updates all expected inputs together.

- Workflow: `.github/workflows/vercel-alias-ready-deployment.yml`
- Confirm input: `alias-ready-deployment`
- Deployment URL: `https://mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`
- Deployment id: `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`
- Expected SHA: `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`

This is a pinned verified target, not an infinite latest-deployment chase. Vercel may create newer READY deployments from workflow or documentation edits; do not chase them unless they materially change the public revenue surface.

## Current Deployment Blockers

- Public aliases are still serving commit `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`.
- Latest source-only commits are hitting Vercel build-rate-limit statuses.
- This local machine has no usable `git`, `gh`, `npm`, or Node execution path for deployment.
- Local environment variables are missing for `VERCEL_TOKEN`, `RESEND_API_KEY`, and Slack webhook delivery.
- GitHub Actions owner email/Slack delivery still requires configured secrets.

## Revenue Position

Safe to claim:

- MindReply has a public Website Completion Package offer at `GBP 600`.
- The public contact route no longer exposes the personal Gmail address in fetched contact/package surfaces.
- The package page frames a buying-friction rescue, ranked action queue, send-ready copy, and privacy-safe receipt.

Not safe to claim:

- income, booked revenue, subscriptions, or conversion results;
- autonomous staff or guaranteed growth;
- full email/Slack delivery automation;
- public alias recovery to the pinned deployment.

## Next Action

Run `.github/workflows/vercel-alias-ready-deployment.yml` from `main` with:

- `confirm=alias-ready-deployment`
- `deployment_url=https://mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`
- `expected_sha=85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`
- `expected_deployment_id=dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`

Required secret: `VERCEL_TOKEN`.

After the alias workflow succeeds, the proof gate is:

- `https://www.mind-reply.com/api/version` reports `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`.
- `https://www.mind-reply.com/website-completion-package` shows the invoice-first proof language.
- `npm run verify:live-revenue` passes in GitHub Actions.
