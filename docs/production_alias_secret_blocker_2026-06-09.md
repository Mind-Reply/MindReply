# Production Alias Secret Blocker - 2026-06-09

## Status
Production is not yet repaired. The public custom domain is still serving the older deployment, while the verified ready Vercel deployment contains the current Website Completion Package surface and the public `info@mind-reply.com` contact path.

Repo `main` has continued to improve the sellable surface while production aliasing is blocked. The Website Completion Package page now includes a sample delivery receipt so buyers can inspect the proof object before purchase.

## Evidence
- Latest ready canonical deployment: `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`
- Latest ready deployment URL: `https://mindreply-ickm8ik48-angellllkr-engs-projects.vercel.app`
- Commit behind that deployment: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- Emergency alias workflow run: `https://github.com/Mind-Reply/MindReply/actions/runs/27202655044`
- Workflow failed at `Require Vercel token` because `VERCEL_TOKEN` is empty.
- The same run showed owner email and Slack delivery secrets are empty, so delivery is blocked rather than claimed.
- Current `main` includes `scripts/verify-package-delivery-proof.ts` and wires it into `npm run decision:verify`.
- Current Vercel commit checks for both `mindreply` and duplicate `mind-reply` are failing with Vercel `build-rate-limit` targets, so new production deployment is capacity-blocked too.
- Outlook owner email sending is rate-limited with `ErrorExceededMessageLimit`; an owner update draft was created instead of claiming a sent email.

## Package Proof Added
The Website Completion Package page now shows a `Sample delivery receipt` section with:
- `actionKind: website-completion`
- `riskLevel: low-to-medium`
- `confidence: medium until the owner accepts scope and payment route`
- `rawContentRedacted: true`
- `inputHash: present; raw text absent`
- `ownerDecisionNeeded: confirm scope, route invoice or payment link, approve the next close-ready move`

This strengthens the GBP 600 offer by making the delivery object visible and inspectable rather than vague.

## Owner Action Needed
Add these repository secrets/variables, then rerun the emergency alias repair workflow or wait for the next scheduled run.

Required for production alias repair:
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
- Owner report artifacts mark email and Slack as sent only after secrets exist.
- No production claim is made until live checks pass on the custom domain.

## Current Judgment
The product can move toward a strong launch only after the public domain is corrected. No income, delivery, or production recovery should be claimed until this acceptance list passes on the live domain.
