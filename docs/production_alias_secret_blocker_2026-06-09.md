# Production Alias Recovery State - 2026-06-09

## Status
Production aliasing has recovered to the verified ready deployment, but current `main` is not deployed yet.

The public custom domain is now serving the ready canonical Vercel deployment `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`, which contains the Website Completion Package surface and the public `info@mind-reply.com` contact path. This removes the urgent public Gmail exposure from the live contact page.

Repo `main` has continued to improve the sellable surface after that deployment. The Website Completion Package page now includes a sample delivery receipt so buyers can inspect the proof object before purchase, but that newer proof section is not live until canonical `mindreply` can build again.

## Live Evidence
- Live production deployment resolved by Vercel: `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`
- Live production URL behind the custom domain: `https://mindreply-ickm8ik48-angellllkr-engs-projects.vercel.app`
- Commit behind live production: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- `https://www.mind-reply.com/` serves the Website Completion Package surface.
- `https://www.mind-reply.com/contact` serves `info@mind-reply.com` rather than a personal Gmail address.
- `https://www.mind-reply.com/api/version` returns `status: ok` with deployment metadata.
- `https://www.mind-reply.com/api/health` returns `status: ok` with MRagent/MCP health details.

## Remaining Blockers
- Current `main` is ahead of live production and canonical `mindreply` commit checks still fail with Vercel `build-rate-limit`.
- The emergency alias workflow still needs `VERCEL_TOKEN` for deterministic future alias repair.
- Owner email and Slack delivery secrets remain missing for GitHub Actions reports.
- Outlook direct sending remains rate-limited with `ErrorExceededMessageLimit`; owner updates may be drafted but not sent until the quota/account prompt is resolved.
- Live `/api/package-request` invalid-body behavior is covered by source and the live verifier script, but still needs a fresh runner/browser POST verification after local shell or GitHub Actions capacity is available.

## Package Proof Added On Main
The Website Completion Package page on current `main` now shows a `Sample delivery receipt` section with:
- `actionKind: website-completion`
- `riskLevel: low-to-medium`
- `confidence: medium until the owner accepts scope and payment route`
- `rawContentRedacted: true`
- `inputHash: present; raw text absent`
- `ownerDecisionNeeded: confirm scope, route invoice or payment link, approve the next close-ready move`

This strengthens the GBP 600 offer by making the delivery object visible and inspectable rather than vague.

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

Required for Vercel build continuity:
- Restore available Vercel deployment capacity or upgrade the project/team plan.
- Keep `mindreply` as canonical production and `mind-reply` as non-production/storage only.

## Acceptance
- `https://www.mind-reply.com/` shows the Website Completion Package surface.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com` and no personal inbox.
- `https://www.mind-reply.com/api/version` returns `status: ok`.
- `https://www.mind-reply.com/api/health` returns `status: ok`.
- `/api/package-request` rejects invalid input with `400`.
- Current `main` deploys to canonical `mindreply` once Vercel capacity is available.
- Owner report artifacts mark email and Slack as sent only after secrets exist.

## Current Judgment
The urgent public Gmail/privacy issue is repaired on production. The revenue system is not fully done because live production is not current `main`, build capacity is still limited, report delivery is still blocked, and no income should be claimed without payment, invoice, Stripe/Vercel Payments, or owner-confirmed sales data.
