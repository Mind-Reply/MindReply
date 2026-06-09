# Production Alias Secret Blocker - 2026-06-09

## Status
Production is not yet repaired. The public custom domain is still serving the older deployment, while the verified ready Vercel deployment contains the current Website Completion Package surface and the public `info@mind-reply.com` contact path.

## Evidence
- Latest ready canonical deployment: `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`
- Latest ready deployment URL: `https://mindreply-ickm8ik48-angellllkr-engs-projects.vercel.app`
- Commit behind that deployment: `8c8de8aba7c6ee20bbdbf4801a26b27122bbaac8`
- Emergency alias workflow run: `https://github.com/Mind-Reply/MindReply/actions/runs/27202655044`
- Workflow failed at `Require Vercel token` because `VERCEL_TOKEN` is empty.
- The same run showed owner email and Slack delivery secrets are empty, so delivery is blocked rather than claimed.

## Owner Action Needed
Add these repository secrets/variables, then rerun the emergency alias repair workflow or wait for the next scheduled run.

Required for production alias repair:
- `VERCEL_TOKEN`

Required for owner email and Slack reports:
- `MINDREPLY_REPORT_EMAIL`
- `MINDREPLY_REPORT_FROM`
- `RESEND_API_KEY`
- `MINDREPLY_SLACK_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`

## Acceptance
- `https://www.mind-reply.com/` shows the Website Completion Package surface.
- `https://www.mind-reply.com/contact` shows `info@mind-reply.com` and no personal inbox.
- `https://www.mind-reply.com/api/version` returns `status: ok`.
- `https://www.mind-reply.com/api/health` returns `status: ok`.
- `/api/package-request` rejects invalid input with `400`.
- Owner report artifacts mark email and Slack as sent only after secrets exist.

## Current Judgment
The product can move toward a strong launch only after the public domain is corrected. No income, delivery, or production recovery should be claimed until this acceptance list passes on the live domain.
