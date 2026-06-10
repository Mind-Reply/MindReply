# Current Deployment State

Checked: 2026-06-10

## Public Production

Live production is serving the revenue, privacy, and response-overload surfaces, but it is not fully current with source. The current source contains the clearer `Try MindReply Free` homepage CTA, while the live homepage still fails that verifier check.

Verified live behavior:

- `https://www.mind-reply.com/`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/pricing`: `200 OK`.
- `https://www.mind-reply.com/website-completion-package`: `200 OK`.
- `https://www.mind-reply.com/products`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/checkout`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/contact`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/response-overload`: `200 OK`.
- `https://www.mind-reply.com/api/health`: `200 OK`.
- `https://www.mind-reply.com/api/version`: `200 OK`, but deployment metadata is `null`.
- `https://www.mind-reply.com/api/geo-locale`: `200 OK`, recommends `bg` from Bulgaria and lists 11 supported locales: `en`, `es`, `fr`, `de`, `pt`, `ar`, `hi`, `ja`, `zh`, `uk`, `bg`.

Urgent privacy result: sampled public pages do not expose a personal Gmail address. Public contact remains `info@mind-reply.com`.

## GitHub Source

- Repository: `Mind-Reply/MindReply`
- Default branch: `main`
- Latest inspected `main` commit: `3684cc8936338413ae623f1a5826cfa2bf4a7c18`
- Latest inspected `main` message: `Add version metadata build fallback`

The report-delivery fallbacks in GitHub Actions now use `angellllkr@gmail.com` for owner-only reporting:

- `.github/workflows/hourly-owner-report.yml`
- `.github/workflows/manual-vercel-production.yml`

Local historical outbox reports were also corrected from the wrong uppercase/missing-letter Gmail variants to `angellllkr@gmail.com`.

Source now includes a build-time `/api/version` metadata fallback for manual prebuilt Vercel deployments. The next successful canonical deploy should report non-null commit, branch, environment, URL, and project production URL even when Vercel runtime Git variables are absent.

## Vercel Project

Canonical production project:

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Latest inspected ready production deployment: `dpl_BohRakPiHHtXdahTb1JPy3pTxn4q`
- Latest ready production deployment URL: `mindreply-cqy6b56j7-angellllkr-engs-projects.vercel.app`

The deployment has production aliases for `mind-reply.com`, `www.mind-reply.com`, `mr.mind-reply.com`, `v.mind-reply.com`, and the canonical Vercel app domains.

## Current Risk

The live domain has the needed revenue routes, Bulgarian locale support, response-overload landing page, and public-mailbox privacy fix. It should not be called fully source-current until the homepage `Try MindReply Free` verifier passes and the merged `/api/version` build fallback is present on production.

## Next Production Action

Wait for the Vercel daily deployment quota to reset, then run exactly one canonical production deploy from project `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`. After that, rerun `node scripts/verify-live-revenue-surface.mjs`; the current blocker is `api-deployments-free-per-day`.
