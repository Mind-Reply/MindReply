# Production Alias Recovery State - 2026-06-09

## Status

Production is usable for the paid Website Completion Package, but public alias control is still not deterministic.

The public custom domain is serving the verified canonical Vercel deployment `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`, which contains the Website Completion Package surface, `GBP 600`, `/contact`, `/api/version`, and the public `info@mind-reply.com` contact path. This removes the urgent public Gmail exposure from the live contact page.

A newer canonical Vercel deployment is also ready:

- Latest ready deployment: `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6`
- Latest ready deployment URL: `https://mindreply-9kt5b50z4-angellllkr-engs-projects.vercel.app`
- Latest ready commit: `8a448fcde687c4c53f42d73f8556d6876a124661`
- Commit message: `feat: add priority market footer strip`

The custom domain still returns `/api/version` metadata for commit `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`, so the latest market-priority footer and SEO refinements are not yet proven live on the public domain.

## Live Evidence

- Public custom domain: `https://www.mind-reply.com/`
- Public custom domain deployment currently proven by `/api/version`: `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`
- Public custom domain commit currently proven by `/api/version`: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- `https://www.mind-reply.com/` serves the Website Completion Package surface.
- `https://www.mind-reply.com/contact` serves `info@mind-reply.com` rather than a personal Gmail address.
- `https://www.mind-reply.com/api/version` returns `status: ok` with deployment metadata.
- `https://www.mind-reply.com/api/health` has previously returned `status: ok` with MRagent/MCP health details and should be rerun in the next live verifier pass.
- Latest deployment `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6` renders the priority-market SEO metadata and footer strip on its deployment URL.

## Remaining Blockers

- Public aliases are still not proven on the latest ready deployment `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6`.
- The emergency alias workflow still needs `VERCEL_TOKEN` for deterministic future alias repair.
- Owner email and Slack delivery secrets remain missing for GitHub Actions reports.
- Outlook direct sending remains rate-limited with `ErrorExceededMessageLimit`; owner updates may be drafted but not sent until the quota/account prompt is resolved.
- Live `/api/package-request` invalid-body behavior is covered by source and the live verifier script, but still needs a fresh runner/browser POST verification after local shell or GitHub Actions capacity is available.
- Direct deployment URLs may be protected on some routes, so public-domain proof and Vercel deployment proof must be recorded separately.

## Package Proof Added On Main

The Website Completion Package page on current `main` shows a `Sample delivery receipt` section with:

- `actionKind: website-completion`
- `riskLevel: low-to-medium`
- `confidence: medium until the owner accepts scope and payment route`
- `rawContentRedacted: true`
- `inputHash: present; raw text absent`
- `ownerDecisionNeeded: confirm scope, route invoice or payment link, approve the next close-ready move`

This strengthens the GBP 600 offer by making the delivery object visible and inspectable rather than vague.

## Assisted Close Playbook Added

Current `main` now includes `docs/website_completion_assisted_close_playbook.md`.

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

The Vercel ignored-build guard now has two protection layers:

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

Required for Vercel build and alias continuity:

- Promote or alias `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6` to `www.mind-reply.com` and `mind-reply.com` when Vercel execution access is available.
- Keep `mindreply` as canonical production and `mind-reply` as non-production/storage only.

Required for first revenue close:

- Choose one route for the first paid package: payment link, invoice request, or manual owner approval for the first three buyers.

## Acceptance

- `https://www.mind-reply.com/` shows the Website Completion Package surface.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com` and no personal inbox.
- `https://www.mind-reply.com/api/version` returns `status: ok`.
- `https://www.mind-reply.com/api/health` returns `status: ok` in the next live verifier pass.
- `/api/package-request` rejects invalid input with `400` in the next POST verifier pass.
- Latest ready deployment `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6` is promoted to public aliases.
- Owner report artifacts mark email and Slack as sent only after secrets exist.

## Current Judgment

The urgent public Gmail/privacy issue is repaired on production and the paid offer is real enough to sell from today. It is not safe to claim income, virality, or a fully autonomous reporting system yet. The fastest responsible path is: keep production stable, get `VERCEL_TOKEN` for deterministic alias repair, choose the first payment/invoice route, and send the Website Completion Package outreach from the assisted-close playbook.