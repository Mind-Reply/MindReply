# Production Alias Recovery State - 2026-06-09

## Status

Production is usable for the paid Website Completion Package, but the public alias is still not proven on the strongest READY deployment.

The public custom domain currently serves a safe, sellable production deployment. It shows the Website Completion Package, `GBP 600`, `/contact`, `/api/version`, the 10-language footer strip, and the public `info@mind-reply.com` contact path. The urgent personal Gmail exposure is repaired on the fetched public surfaces.

The stronger READY deployment that should be promoted with the no-build alias workflow is:

- Latest READY deployment: `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`
- Latest READY deployment URL: `https://mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`
- Latest READY commit: `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`
- Commit message: `Guard latest alias recovery target`

This deployment contains the invoice-first Website Completion Package page and the updated no-build alias recovery contract. Later docs-only commits can remain unpromoted unless they change the public revenue surface.

## Live Evidence

- Public custom domain: `https://www.mind-reply.com/`
- Public custom domain commit currently proven by `/api/version`: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- `https://www.mind-reply.com/` serves `Reclaim 2+ hours daily within 24 hours`, the Website Completion Package surface, `GBP 600`, and the 10-language footer strip.
- `https://www.mind-reply.com/contact` serves `info@mind-reply.com` rather than a personal Gmail address.
- `https://www.mind-reply.com/api/version` returns `status: ok` with deployment metadata.
- `https://www.mind-reply.com/api/health` returns `status: ok`, but provider/blob/package email channels remain fallback until secrets exist.
- `https://www.mind-reply.com/api/package-request` rejects invalid input with `400`.
- `https://www.mind-reply.com/website-completion-package` is live and sellable, but still shows the older package-page wording instead of the invoice-first proof copy.

## New Deployment Evidence

Vercel connector proof for the current alias target:

- `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`
- URL: `mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`
- state: `READY`
- target: `production`
- commit: `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`
- `/api/version`: HTTP `200`, commit `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`
- `/website-completion-package`: HTTP `200`, rendered assets include `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`

The invoice-proof page contains:

- page title metadata: `Website Completion Package | MindReply`
- meta description for a `GBP 600` buying-friction rescue
- `Invoice-first request path active`
- `No payment link is required to begin`
- `billing name and billing email`
- `Scope first, invoice/payment before delivery`
- `paymentPath: invoice-first unless a configured direct payment link is present`
- privacy-safe proof; no personal Gmail exposure.

## No-Build Alias Recovery

A dedicated no-build alias workflow exists and has been updated to the current READY deployment:

- Workflow: `.github/workflows/vercel-alias-ready-deployment.yml`
- Runbook: `docs/no_build_alias_recovery.md`
- Confirm input: `alias-ready-deployment`
- Deployment URL input: `https://mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`
- Expected SHA input: `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7`
- Expected deployment id input: `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`

The workflow does not create another build. It validates Vercel credentials, runs `vercel inspect`, requires the expected SHA before aliasing, assigns `www.mind-reply.com` and `mind-reply.com`, waits until `/api/version` reports the expected SHA, then runs `npm run verify:live-revenue`.

## Release Gate

`npm run verify:live-revenue` fetches the dedicated package page in addition to homepage, contact, health, version, package request, robots, sitemap, and geo-locale.

It fails production if `/website-completion-package` does not prove:

- page reachability;
- Website Completion Package title;
- invoice-first request path;
- no payment link required to begin;
- billing name and billing email;
- scope first, invoice/payment before delivery;
- `paymentPath` receipt proof.

`npm run decision:verify` also guards that the live verifier contains those package-page checks and that the no-build alias workflow points at the current READY target.

## Remaining Blockers

- Public aliases are still not proven on latest READY deployment `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`.
- The no-build alias workflow still needs `VERCEL_TOKEN` in GitHub Actions for deterministic alias repair.
- Owner email and Slack delivery secrets remain missing for GitHub Actions reports.
- Outlook direct sending remains rate-limited with `ErrorExceededMessageLimit`; owner updates may be drafted but not sent until the quota/account prompt is resolved.
- Live revenue or income cannot be claimed until a payment, invoice, Stripe/Vercel Payments record, or owner-confirmed sales source exists.
- Direct deployment URLs may be protected on some routes, so public-domain proof and Vercel deployment proof must be recorded separately.

## Owner Action Needed

Required for deterministic production alias repair:

- `VERCEL_TOKEN`

Required for owner email and Slack reports:

- `MINDREPLY_REPORT_EMAIL`
- `MINDREPLY_REPORT_FROM`
- `RESEND_API_KEY`
- `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`

Required for Outlook direct sending:

- Resolve the Outlook daily sending quota / account verification prompt.

Required for Vercel alias continuity:

- Run `.github/workflows/vercel-alias-ready-deployment.yml` with `confirm=alias-ready-deployment`.
- Use deployment URL `https://mindreply-kbqlfz2h8-angellllkr-engs-projects.vercel.app`.
- Keep `mindreply` as canonical production and `mind-reply` as non-production/storage only.

Required for first revenue close:

- Choose one route for the first paid package: payment link, invoice request, or manual owner approval for the first three buyers.

## Acceptance

- `https://www.mind-reply.com/` shows the Website Completion Package surface.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com` and no personal inbox.
- `https://www.mind-reply.com/website-completion-package` shows `Invoice-first request path active`, `No payment link is required to begin`, billing name/email language, scope-first close proof, and `paymentPath` receipt proof.
- `https://www.mind-reply.com/api/version` returns `status: ok` for expected commit `85a86a6f94bca2f8f1d5ff69894ba4a85cb1ecd7` after aliasing.
- `https://www.mind-reply.com/api/health` returns `status: ok` in the live verifier pass.
- `/api/package-request` rejects invalid input with `400`.
- Latest READY deployment `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE` is promoted to public aliases.
- Owner report artifacts mark email and Slack as sent only after secrets exist.

## Current Judgment

MindReply is close enough to sell the Website Completion Package now. The public domain is safe and package-visible, while the latest READY deployment is materially better for invoice-first conversion. It is not safe to claim income, virality, or a fully autonomous reporting system yet. The fastest responsible path is: run the no-build alias workflow for `dpl_ALssxKSrgiWh3rJgNzmmyv5WZiPE`, get `VERCEL_TOKEN` for deterministic alias repair, choose the first payment/invoice route, and send the Website Completion Package outreach from the assisted-close playbook.
