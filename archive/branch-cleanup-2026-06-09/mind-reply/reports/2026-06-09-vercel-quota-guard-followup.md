# Vercel Quota Guard Follow-Up

Generated: 2026-06-09
Repo: Mind-Reply/MindReply
Production project: Vercel `mindreply`

## Summary

The canonical Vercel project is still rate-limited for new `main` builds, but GitHub `main` now contains source-side fixes that reduce future wasted builds and remove public personal-email examples.

## Current Deployment Evidence

- Latest canonical READY deployment: `dpl_B1uCWkrdru1eXmXYjvDtXVE2Yje6`
- READY commit: `c51e38c9e25c12ec803574a201bc4a4e97b74921`
- Latest `main` is ahead of the READY deployment.
- Latest checked Vercel statuses for new `main` commits: `build-rate-limit` on `mindreply`; alternate `mind-reply` has varied between success and rate-limit.

## Source Fixes Now On Main

- `e5bde683dcd27939d4391f947180385edc185322`: removes personal Gmail from public README examples.
- `8c6b02a3436da13ff8373072348cc9a7902ee56c`: wraps `/api/mcp` route handlers locally so Next can recognize route config more reliably.
- `a124c5327c1af2cb6e6ee471e70a2af5cd68011f`: expands `scripts/vercel-ignore-build.mjs` so docs, reports, and report-only scripts skip production builds.

## Vercel Quota Guard Changes

The ignore-build guard now treats these as non-runtime changes:

- `.github/`
- `docs/`
- `reports/`
- `site/automation/`
- `site/design/`
- `site/media/`
- `README.md`
- `SECURITY.md`
- report JSON files
- personal/security/promotion/activation report scripts
- `scripts/vercel-ignore-build.mjs`

App code changes such as `app/page.tsx` and route changes still build.

## Privacy Status

Public repo examples now use:

```bash
MINDREPLY_SECURITY_OWNER_EMAIL=
MINDREPLY_SECURITY_PUBLIC_EMAIL=info@mind-reply.com
MINDREPLY_REPORT_EMAILS=info@mind-reply.com
MINDREPLY_REPORT_EMAIL_ALLOWLIST=info@mind-reply.com
```

Owner email should be configured only as a private GitHub/Vercel secret.

## Next Action

When Vercel build-rate quota clears, deploy latest `main` and verify:

- `/pricing`
- `/capabilities`
- `/agent`
- `/pack`
- `/mcp`
- `/api/mcp`
- `/api/health`
- public domain no longer serving stale 404s

Do not spend further production build attempts on docs/report-only changes unless the guard itself needs validation.
