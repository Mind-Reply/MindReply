# Current Deployment State

Checked: 2026-06-10

## Public Production

Live production is still behind GitHub `main`.

Verified live behavior:

- `https://www.mind-reply.com/`: `200 OK`.
- `https://www.mind-reply.com/contact`: `200 OK`.
- `https://www.mind-reply.com/products`: `404 Not Found`.
- `https://www.mind-reply.com/checkout`: `404 Not Found`.
- `https://www.mind-reply.com/api/version`: `200 OK`, reporting commit `0957a3c7233801286c27b4edea4fb934bb2833de`.
- `https://www.mind-reply.com/api/geo-locale`: `200 OK`, still showing supported locales `en, es, fr, de, pt, ar, hi, ja, zh, uk` without deployed `bg` support.

Homepage and contact samples do not expose Gmail, but the live footer still contains the stale auto-language signal that was already removed in source.

## GitHub Source

`main` is ahead of the live production commit by 72 commits when compared against live commit `0957a3c7233801286c27b4edea4fb934bb2833de`.

Source changes present on `main` but not yet live include:

- Shorter, calmer, more varied MRagent behavior in `lib/mragent.ts`.
- Google-backed translation route in `app/api/translate/route.ts`.
- Updated locale/market handling with Bulgarian support in source.
- Cleaned footer copy in `components/SiteFooter.tsx`.
- Product surface at `app/products/page.tsx`.
- Checkout surface at `app/checkout/page.tsx`.
- Fixed `GBP 600` Website Completion Package path and invoice option.
- Manual production deployment workflow at `.github/workflows/manual-vercel-production.yml`.

## Vercel Project

Canonical production project:

- Project: `mindreply`
- Team: `team_0plIJmQLgZC1wVv9zI2eVf3B`
- Project ID: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Latest inspected ready production deployment: `dpl_2rTwzQUoxBPAi2pNp3QDixhKFpuj`
- Latest ready production deployment URL: `mindreply-qid6qqljd-angellllkr-engs-projects.vercel.app`
- Latest ready production deployment commit: `0957a3c7233801286c27b4edea4fb934bb2833de`

The project metadata still points to the old ready deployment. No newer ready production deployment was visible in the Vercel deployment list at this check.

## Pro Account Note

The account may now be Pro, but the inspected Vercel project has not yet produced a new ready production deployment from current `main`. Pro status alone does not update production; the fixed manual workflow still needs to run once.

If the Pro upgrade is active, the next deploy attempt should no longer fail on the previous build-rate limit.

## Next Production Action

Run the canonical manual workflow:

1. Open GitHub Actions for `Mind-Reply/MindReply`.
2. Select `MindReply Manual Vercel Production Deploy`.
3. Run workflow on `main`.
4. Enter the confirmation exactly: `deploy-production`.
5. Confirm the workflow aliases `www.mind-reply.com` and `mind-reply.com`.
6. Confirm live checks pass for `/`, `/contact`, `/products`, `/checkout`, `/api/version`, `/api/health`, and `/api/geo-locale`.

Production should not be called fixed until `/api/version` reports the new `main` deployment and `/products` plus `/checkout` return `200 OK`.
