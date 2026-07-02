# ACCESS REQUEST

## Current State
No verified production execution access has been confirmed. System treated as NOT VERIFIED.

## Missing Access (Required)

### 1. GitHub
- Write access across all listed repositories
- Permission to create branches, PRs, workflows
- Permission to manage issues and labels

### 2. Hosting / Deployment
- Vercel / Netlify / Railway / Cloudflare / VPS access
- Ability to deploy frontend + backend services

### 3. Secrets / Environment
- No access to:
  - API keys (Stripe, OpenAI, email, etc.)
  - CI/CD secrets
  - Database credentials

### 4. CI/CD
- No confirmed access to pipeline configuration execution
- No verified ability to trigger production deployments

### 5. Database
- No verified access to production or staging databases

### 6. n8n / Workflows
- No verified workflow execution or control access

### 7. Payment / Billing
- Stripe or equivalent payment system access not confirmed

### 8. Domain / DNS
- No confirmed DNS or domain control access

### 9. Observability
- No access to logs, monitoring, uptime dashboards

## Why This Blocks Execution
Without the above access, no production-level changes, deployments, or verifiable system modifications can be executed or validated.

## Required Next Step
Provide explicit access or credentials for:
- GitHub org/repo admin or write-level token
- Deployment platform access
- Secret management system access
- Database + workflow systems

Only after this can execution mode proceed beyond planning and file scaffolding.

## Owner Cockpit PWA (2026-07-02)

- Owner-only auth: no auth provider configured for cockpit routes. Needed: Clerk (already a dependency) or Supabase Auth credentials, plus an owner allowlist. Until then, `/cockpit/*` is a placeholder-protected surface and must not be treated as private.
- Vercel: preview deployment relies on the repo's existing Vercel integration; account rate limits currently affect checks. Needed for production deploy: Vercel project access + owner approval.
- DNS: mind-reply.com and subdomains — DNS ACCESS REQUIRED.
