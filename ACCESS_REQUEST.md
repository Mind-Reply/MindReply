# Access Request

This document lists every access surface required to execute the MindReply
go-live and production-engine work, its current status, and the exact owner
action needed to unblock it.

Status legend:
- **GRANTED** — verified working this session
- **MISSING** — required, not available
- **UNKNOWN** — cannot verify without owner confirmation

## Summary

| # | Access | Status | Blocks | Owner action |
|---|--------|--------|--------|--------------|
| 1 | GitHub write (branches/PRs) | GRANTED | — | None — verified via PRs #59, #63, #64 |
| 2 | GitHub Actions / CI config | UNKNOWN | Custom CI, deploy workflows | Confirm agent may edit `.github/workflows/` |
| 3 | Vercel account (deploy/env) | MISSING | All deploys; env var config | Add agent to Vercel team OR provide `VERCEL_TOKEN` + org/project IDs |
| 4 | Vercel plan (rate limit) | MISSING | Every deploy ("rate limited — retry in 24h") | Upgrade plan or reduce project count |
| 5 | Domain / DNS | MISSING | Custom domains, HTTPS on brand URLs | Provide registrar/DNS (Cloudflare) access or delegate a zone |
| 6 | Secret store | MISSING | Secret rotation, prod config | Grant Vercel/GitHub Secrets access or a secure channel |
| 7 | Database (Neon/Postgres) | MISSING | Migrations, prod DB verification | Provide `DATABASE_URL` (scoped) or Neon project access |
| 8 | Stripe | MISSING | Checkout, webhooks, payment tests | Add agent to Stripe (restricted key) or provide test keys |
| 9 | Email / messaging (SMTP) | MISSING | Contact forms, notifications | Provide SMTP/provider creds (SendGrid/Postmark) |
| 10 | Analytics (GA) | MISSING | Event verification | Provide `GA_MEASUREMENT_ID` + `GA_API_SECRET` |
| 11 | Error monitoring (Sentry) | MISSING | Prod observability | Provide `SENTRY_DSN` + project access |
| 12 | n8n | MISSING | Workflow orchestration | Provide n8n instance URL + API key |
| 13 | Social accounts | MISSING | Any social launch | Owner-operated; agent cannot self-provision |
| 14 | Ads accounts | MISSING | Any ad campaign | Owner-operated; agent cannot self-provision |
| 15 | AI provider keys (OpenAI/Anthropic) | UNKNOWN | Runtime AI features | Confirm keys exist in deploy env |

## Detail

### 3 & 4 — Vercel (hosting + rate limit)
**Why:** Every preview/production deploy runs under the owner's Vercel account.
All 17+ Vercel checks on recent PRs fail with *"Deployment rate limited — retry
in 24 hours"*, which is an account-plan limit, not a code issue.
**Minimum permission:** a scoped `VERCEL_TOKEN` (Deploy + Env Read/Write) with
`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`, or add the agent to the Vercel team.
**Owner action:** upgrade the Vercel plan or consolidate the many projects to
stay under the free-tier build limit, and provide the token.
**Can work continue without it?** Code/docs work: yes. Any deploy or live-URL
evidence: no.

### 5 — Domain / DNS
**Why:** Brand sites need real HTTPS URLs; the site factory needs subdomains.
**Minimum permission:** DNS zone edit for the target domain(s), or delegate a
subdomain (e.g. `*.app.example.com`).
**Owner action:** grant Cloudflare/registrar access or create a delegated zone.

### 6 — Secret store & rotation
**Why:** `SECURITY_ROTATION.md` lists secrets that must be rotated before launch;
rotation requires write access to where they live (Vercel env / GitHub Secrets).
**Owner action:** grant access, or rotate manually and confirm by secret name
(never paste values here).

### 7 — Database (Neon / Postgres)
**Why:** Verifying prod readiness and running migrations needs DB access.
**Minimum permission:** a scoped `DATABASE_URL` (least privilege) or Neon project
membership.

### 8 — Stripe
**Why:** Checkout visibility, webhook signature verification, and payment smoke
tests are go-live gates.
**Minimum permission:** a restricted Stripe API key (test mode first) +
webhook signing secret.

### 9–11 — Email, Analytics, Sentry
**Why:** contact/request flows, event tracking, and error monitoring are
required for a verified launch.
**Owner action:** provide the respective credentials/DSNs.

### 12 — n8n
**Why:** connector/orchestration work in the wider engine depends on n8n.
**Owner action:** provide instance URL + API key (or confirm not in scope yet).

### 13 & 14 — Social & Ads
**Why:** Any social/ads launch requires owner-operated accounts. Per the
execution rules, the agent must not create fake accounts or automate human
identity. These remain owner-driven with explicit approval.

Only after this can execution mode proceed beyond planning and file scaffolding.

## Owner Cockpit PWA (2026-07-02)

- Owner-only auth: no auth provider configured for cockpit routes. Needed: Clerk (already a dependency) or Supabase Auth credentials, plus an owner allowlist. Until then, `/cockpit/*` is a placeholder-protected surface and must not be treated as private.
- Vercel: preview deployment relies on the repo's existing Vercel integration; account rate limits currently affect checks. Needed for production deploy: Vercel project access + owner approval.
- DNS: mind-reply.com and subdomains — DNS ACCESS REQUIRED.

## What can proceed WITHOUT any new access
- Repo cleanup, `.gitignore`, doc consolidation, code fixes (branch + PR)
- Site-factory *scaffolding* (manifests, templates, generator scripts) — without
  deploying
- Inventory, labeling, GO/NO-GO, security-audit documentation

## What is BLOCKED until access is granted
- Any live deployment or live-URL evidence (needs #3/#4)
- Custom domains / HTTPS on brand URLs (needs #5)
- Secret rotation completion (needs #6)
- Payment / DB / email / analytics / monitoring verification (needs #7–#11)
- Social / ads launches (needs #13/#14 + approval)
