# Current Deployment State

Checked: 2026-06-10

## Public Production

Live production is serving the revenue and privacy surface, but deployment provenance is still incomplete.

Verified live behavior:

- `https://www.mind-reply.com/`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/contact`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/products`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/checkout`: `200 OK`, no Gmail exposed, public mailbox present.
- `https://www.mind-reply.com/api/health`: `200 OK`.
- `https://www.mind-reply.com/api/version`: `200 OK`, but deployment metadata is `null`.
- `https://www.mind-reply.com/api/geo-locale`: `200 OK`, recommends `bg` from Bulgaria and lists 11 supported locales: `en`, `es`, `fr`, `de`, `pt`, `ar`, `hi`, `ja`, `zh`, `uk`, `bg`.

Urgent privacy result: sampled public pages do not expose a personal Gmail address. Public contact remains `info@mind-reply.com`.

## GitHub Source

- Repository: `Mind-Reply/MindReply`
- Default branch: `main`
- Latest inspected `main` commit: `282a2406286200c7fdabeed9a703b6ea89b0947a`
- Latest inspected `main` message: `Fix live robots verifier path boundary`

The report-delivery fallbacks in GitHub Actions now use `angellllkr@gmail.com` for owner-only reporting:

- `.github/workflows/hourly-owner-report.yml`
- `.github/workflows/manual-vercel-production.yml`

Local historical outbox reports were also corrected from the wrong uppercase/missing-letter Gmail variants to `angellllkr@gmail.com`.

## Vercel Project

Canonical production project:

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Latest inspected ready production deployment: `dpl_BohRakPiHHtXdahTb1JPy3pTxn4q`
- Latest ready production deployment URL: `mindreply-cqy6b56j7-angellllkr-engs-projects.vercel.app`
- Deployment metadata branch: `codex/deploy-ready-bulgarian`
- Deployment metadata commit: `37a347eb43adccc4260a3b16cde88d9018c1cbc7`

The live domain has the needed revenue routes, Bulgarian locale support, and public-mailbox privacy fix. It should not be called fully proven until `/api/version` reports non-null deployment metadata and the expected production branch/commit can be matched.

## Pro Account Note

The connector confirms the Vercel project is accessible and has a fresh ready production deployment. It does not expose billing-tier proof, so Pro status is not verified from this session. If Pro is active, the higher deployment allowance should help avoid the earlier deployment-rate bottleneck, but it does not replace live verification.

## Next Production Action

1. Fix or configure `/api/version` so production reports commit, branch, environment, URL, and project production URL.
2. Run the canonical manual workflow on `main`: `MindReply Manual Vercel Production Deploy`.
3. Confirm the workflow aliases `www.mind-reply.com` and `mind-reply.com`.
4. Rerun live checks for `/`, `/contact`, `/products`, `/checkout`, `/api/version`, `/api/health`, and `/api/geo-locale`.
5. Treat production as clean only after `/api/version` reports non-null metadata and public routes remain free of Gmail.
