# Owner Control Plane Spec

## Purpose
Private operator surface for repo status, deployments, monitoring, workflows, incidents, and approved actions.

## Modules
- secure owner login
- repo inventory
- brand inventory
- URL inventory
- deployment status
- uptime checks
- CI status
- connector status
- workflow status
- job status
- billing status
- inbox and approvals
- incidents and rollback controls
- daily report output
- private command webchat

## Rule
The public site and the private control surface must stay separate.

## MVP path
- Next.js
- auth
- database
- deployment host
- monitoring
- audit log
- command router
## Implementation — Owner Cockpit PWA (2026-07-02)

- Name: MindReply Owner Cockpit
- Positioning: Think clearly. Decide fast. Move forward.
- Stack: Next.js 15 (App Router) + TypeScript, inline dark-theme styling, PWA manifest via `app/manifest.ts`
- Public route: `/login` (auth placeholder — TODO: wire real owner-only auth)
- Private routes (under `/cockpit` because `/dashboard` is taken by the existing analytics dashboard):
  `/cockpit` (dashboard), `/cockpit/chat`, `/cockpit/repos`, `/cockpit/brands`, `/cockpit/sites`, `/cockpit/deployments`, `/cockpit/live-checks`, `/cockpit/blockers`, `/cockpit/evidence`, `/cockpit/agents`, `/cockpit/workflows`, `/cockpit/social-ads`, `/cockpit/legal`, `/cockpit/memory`, `/cockpit/settings`
- Dashboard cards: Live URLs · Blockers · Agent Actions · Evidence Registry · Brand Engine · Revenue Paths · Social/Ads Readiness · Legal/IP
- Command chat: local command router (`/cockpit/chat`); risky commands display APPROVAL REQUIRED; no send/publish/deploy actions
- Data: static registry in `lib/cockpit/data.ts` (MVP) — future connectors: GitHub, Vercel, Stripe, n8n/Zapier
- Rules: no live claim without verified URL; evidence before claims; no memory without consent
