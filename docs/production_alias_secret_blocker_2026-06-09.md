# Production Alias Recovery State - 2026-06-09

## Status

Production is usable for the paid Website Completion Package, but public alias control is still not deterministic.

The public custom domain is serving a verified Vercel production deployment that contains the Website Completion Package surface, `GBP 600`, `/contact`, `/api/version`, and the public `info@mind-reply.com` contact path. This keeps the urgent public Gmail exposure repaired.

A newer canonical Vercel deployment is ready with the stronger invoice-first package page:

- Latest ready deployment: `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T`
- Latest ready deployment URL: `https://mindreply-js5m73tfy-angellllkr-engs-projects.vercel.app`
- Latest ready commit: `e0cab2db420d8be63d9ead67cb7cf9d3e6869252`
- Commit message: `Clarify package invoice route and SEO proof`

The latest release-gate source commits are also on main:

- Live package-page verifier commit: `2e629f6ce5c7e4cc6c8a49c7764a63cd86f11075`
- Commit message: `Verify live package page invoice proof`
- Contract verifier commit: `fe1132b5252b5d22e8b4eef88aabf029e3c3d05c`
- Commit message: `Guard live package proof verifier contract`
- No-build alias workflow commit: `4c0cfe987d8bd1ed3915d84579eab8bfb42e43eb`
- No-build alias contract commit: `55480c5ede469cb324c5c000b70181e384d38604`

The custom domain still returns `/api/version` metadata for commit `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`, so the custom domain is not yet proven on the latest invoice-proof deployment.

## Live Evidence

- Public custom domain: `https://www.mind-reply.com/`
- Public custom domain commit currently proven by `/api/version`: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- `https://www.mind-reply.com/` serves the Website Completion Package surface.
- `https://www.mind-reply.com/contact` serves `info@mind-reply.com` rather than a personal Gmail address.
- `https://www.mind-reply.com/api/version` returns `status: ok` with deployment metadata.
- `https://www.mind-reply.com/website-completion-package` is live and sellable, but still shows the older `Invoice request path active` copy.

## New Deployment Evidence

Vercel connector fetch succeeded with HTTP `200` for:

- `https://mindreply-js5m73tfy-angellllkr-engs-projects.vercel.app/website-completion-package`

That deployment contains the improved package page proof:

- page title metadata: `Website Completion Package | MindReply`
- meta description: `A GBP 600 buying-friction rescue for overloaded websites, offers, replies, and follow-up paths. Request invoice-first scope through MindReply.`
- canonical URL: `https://www.mind-reply.com/website-completion-package`
- `Invoice-first request path active`
- `No payment link is required to begin`
- `billing name and billing email`
- `Scope first, invoice/payment before delivery`
- `paymentPath: invoice-first unless a configured direct payment link is present`
- public proof remains privacy-safe and no personal Gmail is exposed.

## No-Build Alias Recovery

A dedicated no-build alias workflow now exists:

- Workflow: `.github/workflows/vercel-alias-ready-deployment.yml`
- Runbook: `docs/no_build_alias_recovery.md`
- Confirm input: `alias-ready-deployment`
- Deployment URL input: `https://mindreply-js5m73tfy-angellllkr-engs-projects.vercel.app`
- Expected SHA input: `e0cab2db420d8be63d9ead67cb7cf9d3e6869252`
- Expected deployment id input: `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T`

The workflow does not create another build. It validates Vercel credentials, runs `vercel inspect`, aliases the ready deployment to `www.mind-reply.com` and `mind-reply.com`, waits until `/api/version` reports the expected SHA, then runs `npm run verify:live-revenue`.

## Release Gate Added

`npm run verify:live-revenue` now fetches the dedicated package page in addition to homepage, contact, health, version, package request, robots, sitemap, and geo-locale.

It now fails production if `/website-completion-package` does not prove:

- page reachability;
- Website Completion Package title;
- invoice-first request path;
- no payment link required to begin;
- billing name and billing email;
- scope first, invoice/payment before delivery;
- `paymentPath` receipt proof.

`npm run decision:verify` also guards that the live verifier contains those package-page checks and that the no-build alias workflow exists, so the release gate cannot be quietly softened without failing the source contract.

## Remaining Blockers

- Public aliases are still not proven on latest ready deployment `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T`.
- The no-build alias workflow still needs `VERCEL_TOKEN` for deterministic future alias repair.
- Owner email and Slack delivery secrets remain missing for GitHub Actions reports.
- Outlook direct sending remains rate-limited with `ErrorExceededMessageLimit`; owner updates may be drafted but not sent until the quota/account prompt is resolved.
- Live `/api/package-request` invalid-body behavior is covered by source and the live verifier script, but still needs a fresh runner/browser POST verification after local shell or GitHub Actions capacity is available.
- Direct deployment URLs may be protected on some routes, so public-domain proof and Vercel deployment proof must be recorded separately.

## Package Proof Added On Main

The Website Completion Package page on current `main` now shows a stronger close route and sample delivery receipt:

- `actionKind: website-completion`
- `riskLevel: low-to-medium`
- `confidence: medium until the owner accepts scope and payment route`
- `paymentPath: invoice-first unless a configured direct payment link is present`
- `rawContentRedacted: true`
- `inputHash: present; raw text absent`
- `ownerDecisionNeeded: confirm scope, route invoice or payment link, approve the next close-ready move`

This strengthens the GBP 600 offer by making the delivery object visible and inspectable rather than vague, while keeping the first paid route invoice-first if no payment link is configured.

## Assisted Close Playbook Added

Current `main` includes `docs/website_completion_assisted_close_playbook.md`.

This document gives the owner a practical sales motion that works even before another deployment is promoted:

- buyer qualification rules;
- GBP 600 package frame;
- redacted-context intake;
- invoice/payment handoff language;
- ten concise first-send messages;
- positive-reply, price-hesitation, scope-expansion, security-sensitive, and invoice-route templates;
- daily owner tracking fields;
- hard boundaries against fake revenue, fake staff, personal inbox exposure, and guaranteed-growth claims.

## Deployment Capacity Control Added

The Vercel ignored-build guard has two protection layers:

- Skip non-canonical projects when `VERCEL_PROJECT_ID` exposes a project id that is not canonical `mindreply`.
- Derive changed files from `git diff-tree --no-commit-id --name-only -r --root HEAD` when Vercel does not pass `MRAGENT_CHANGED_FILES`, then skip docs/report-only changes before the full build.

Duplicate Vercel project `mind-reply` has been observed canceling at the ignored-build step with the reason `Skipping non-canonical Vercel project prj_nETWN2SapvnbSWVXK4O5upJHF6bb`. This reduces avoidable builds once Vercel can start the ignored-build step.

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
- Use deployment URL `https://mindreply-js5m73tfy-angellllkr-engs-projects.vercel.app`.
- Keep `mindreply` as canonical production and `mind-reply` as non-production/storage only.

Required for first revenue close:

- Choose one route for the first paid package: payment link, invoice request, or manual owner approval for the first three buyers.

## Acceptance

- `https://www.mind-reply.com/` shows the Website Completion Package surface.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com` and no personal inbox.
- `https://www.mind-reply.com/website-completion-package` shows `Invoice-first request path active`, `No payment link is required to begin`, billing name/email language, scope-first close proof, and `paymentPath` receipt proof.
- `https://www.mind-reply.com/api/version` returns `status: ok` for expected commit `e0cab2db420d8be63d9ead67cb7cf9d3e6869252` after aliasing.
- `https://www.mind-reply.com/api/health` returns `status: ok` in the next live verifier pass.
- `/api/package-request` rejects invalid input with `400` in the next POST verifier pass.
- Latest ready deployment `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T` is promoted to public aliases.
- Owner report artifacts mark email and Slack as sent only after secrets exist.

## Current Judgment

MindReply is close enough to sell the Website Completion Package now. The public domain is safe and package-visible, while the latest ready deployment is materially better for invoice-first conversion. It is not safe to claim income, virality, or a fully autonomous reporting system yet. The fastest responsible path is: run the no-build alias workflow for `dpl_ihE5efSiypndY1g6j3jUzWZ4od1T`, get `VERCEL_TOKEN` for deterministic alias repair, choose the first payment/invoice route, and send the Website Completion Package outreach from the assisted-close playbook.
