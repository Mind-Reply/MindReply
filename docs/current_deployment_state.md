# Current Deployment State

Checked: 2026-06-10

## Public Production

Live production is serving the revenue, privacy, response-overload, and visitor-matched multilingual surfaces from `main`.

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
- `https://www.mind-reply.com/api/geo-locale`: `200 OK`, recommends language from visitor IP country first and browser language second.

Urgent privacy result: sampled public pages do not expose a personal Gmail address. Public contact remains `info@mind-reply.com`.

## GitHub Source

- Repository: `Mind-Reply/MindReply`
- Default branch: `main`
- Latest inspected `main` commit: `15a574ebcacdcca8bd08a0e3a0016d8e5ac232dc`
- Latest inspected `main` message: `Record live deployment blocker evidence`

The report-delivery fallbacks in GitHub Actions now use `angellllkr@gmail.com` for owner-only reporting:

- `.github/workflows/hourly-owner-report.yml`
- `.github/workflows/manual-vercel-production.yml`

Local historical outbox reports were also corrected from the wrong uppercase/missing-letter Gmail variants to `angellllkr@gmail.com`.

## Vercel Project

Canonical production project:

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Latest inspected ready production deployment: `dpl_E5akAEp6WuJ2LH7uLVWXRbJMmrNA`
- Latest ready production deployment URL: `mindreply-187pumxyn-angellllkr-engs-projects.vercel.app`

The deployment has production aliases for `mind-reply.com`, `www.mind-reply.com`, `mr.mind-reply.com`, `v.mind-reply.com`, and the canonical Vercel app domains.

## Current Risk

The live domain has the needed revenue routes, response-overload landing page, visitor-matched multilingual layer, and public-mailbox privacy fix. The main remaining platform risk is missing provider/persistence/package-request secrets, which keeps MRagent and package delivery in fallback mode.

## Next Production Action

After the visitor-matched multilingual SEO update is merged, run one canonical production deploy from project `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`, then rerun `node scripts/verify-live-revenue-surface.mjs`.
