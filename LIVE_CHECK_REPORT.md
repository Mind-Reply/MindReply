# LIVE_CHECK_REPORT

Last updated: 2026-07-02

## Owner Cockpit PWA — local smoke test (branch `agent/owner-cockpit-pwa`)

Environment: local production build (`npm run build` + `next start`, Next.js 15.5.20). Preview URL pending Vercel deployment on the PR.

| Check | Result | Evidence |
|-------|--------|----------|
| `/login` loads | PASS | HTTP 200 |
| `/cockpit` (dashboard) loads | PASS | HTTP 200 |
| `/cockpit/chat` loads and commands respond | PASS | HTTP 200; local command router with APPROVAL REQUIRED gating |
| All 13 section routes load | PASS | HTTP 200 for repos, brands, sites, deployments, live-checks, blockers, evidence, agents, workflows, social-ads, legal, memory, settings |
| `/manifest.webmanifest` served | PASS | HTTP 200; valid manifest JSON with icon, standalone display, dark theme color |
| `/cockpit-icon.svg` served | PASS | HTTP 200 |
| Production build passes | PASS | `next build` — compiled successfully, all routes prerendered |
| Type check passes | PASS | `npx tsc --noEmit` exit 0 |
| Mobile layout works | PASS | responsive auto-fill grid + horizontally scrollable sticky nav |
| No secrets in browser source | PASS | cockpit pages use static data only (`lib/cockpit/data.ts`); no env vars referenced |
| HTTPS works | NOT LIVE | requires Vercel preview URL |
| Preview URL works | NOT LIVE | no preview deployment yet — pending PR checks |

Rule: no live claim without a verified URL. HTTPS/preview rows update only with evidence.
