# MindReply 60-Agent Operating Model

## Purpose

This model defines 60 permanent operating roles for MindReply across professional advisory, platform operations, payments, analytics, security, content, and growth. It is a staffing blueprint and operating contract; it does not claim humans are already hired until access, shifts, and accountability are assigned.

## Field Coverage

- Engineering Ops: 20 roles
- Advertising And Paid Growth: 12 roles
- SEO And Content: 10 roles
- Engagement And Community: 8 roles
- Ad Ops And Analytics QA: 6 roles
- Security And Compliance: 4 roles

Total: 60 roles.

## Permanent Coverage Rules

- Every field has one owner, one backup, and one escalation contact.
- Every shift produces a written handoff with evidence.
- P0 events pause ad spend until checkout, auth, and tracking are verified.
- Professional advisory roles must not provide regulated advice beyond platform-approved scope without human professional review.
- Platform operators must never paste secrets into chat or public logs.

## Hiring Priority

Phase 1:
- Vercel Deployment Watch
- Stripe Checkout Monitor
- Stripe Webhook Verifier
- Clerk Session Auditor
- Google Ads Conversion Monitor
- GTM And Meta Pixel QA
- Sentry/Monitoring Operator
- Search Console Operator
- Incident Commander
- Security Access Auditor

Phase 2:
- Clinical Boundary Reviewer
- Legal Communication Reviewer
- Financial Client Communication Reviewer
- Landing Page Conversion Analyst
- Search Console Monitor
- Dashboard Metrics Analyst

Phase 3:
- Fill remaining specialist desks and backups until all 60 roles have owners.

## Daily Output

Each active role reports:
- Status: green, amber, or red.
- Evidence link or screenshot.
- Action taken.
- Risk remaining.
- Next owner.

## Source Of Truth

The structured roster is available in code at:
- `lib/agent-roster.ts`
- `GET /api/agents/roster`

Operators use:
- `docs/production-runbook.md`
- `docs/production-audit-checklist.md`
- `docs/background-agent-hiring-brief.md`
