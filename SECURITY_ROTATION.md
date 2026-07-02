# Security Rotation Checklist

Last reviewed: 2026-07-02

## Credential Inventory

| Secret | Location | Committed to Repo? | Rotation Needed | Owner Action Required |
|--------|----------|-------------------|-----------------|----------------------|
| `OPENAI_API_KEY` | GitHub Secrets / Vercel env | NO — placeholder only | YES — verify provenance | Verify key scope, rotate if it predates this audit |
| `ANTHROPIC_API_KEY` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Verify key scope, rotate if it predates this audit |
| `STRIPE_SECRET_KEY` | GitHub Secrets / Vercel env | NO — placeholder `sk_live_...` in docs only | YES — verify provenance | Rotate in Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Regenerate in Stripe Dashboard > Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | GitHub Secrets / Vercel env | NO | REVIEW | Publishable keys are public; verify correct environment (live vs test) |
| `CLERK_SECRET_KEY` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Rotate in Clerk Dashboard |
| `CLERK_WEBHOOK_SECRET` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Regenerate in Clerk Dashboard |
| `DATABASE_URL` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Rotate DB password, update connection string |
| `GOOGLE_CLIENT_ID` | GitHub Secrets / Vercel env | NO | NO — client IDs are not secret | OK |
| `GOOGLE_CLIENT_SECRET` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Rotate in Google Cloud Console |
| `GMAIL_CLIENT_ID` | GitHub Secrets / Vercel env | NO | NO — client IDs are not secret | OK |
| `GMAIL_CLIENT_SECRET` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Rotate in Google Cloud Console |
| `SENTRY_DSN` | GitHub Secrets / Vercel env | NO | NO — DSNs are semi-public | Verify correct project |
| `SENTRY_AUTH_TOKEN` | GitHub Secrets / Vercel env | NO | YES — verify provenance | Rotate in Sentry > Settings > Auth Tokens |
| `VERCEL_TOKEN` | GitHub Secrets | NO | YES — verify provenance | Rotate in Vercel > Settings > Tokens |
| `ADMIN_PASSWORD` | GitHub Secrets / Vercel env | NOT SET | YES — must be set | Set a strong password (32+ chars) |
| `ADMIN_TOKEN_SECRET` | GitHub Secrets / Vercel env | NOT SET | YES — must be set | Generate with `openssl rand -hex 32` |
| `JWT_SECRET` | GitHub Secrets / Vercel env | NOT SET | YES — must be set | Generate with `openssl rand -hex 64` |

## .next/ Build Artifacts

**STATUS: REMOVED FROM VERSION CONTROL**

The `.next/` directory (98 files including webpack cache, build manifests, compiled pages) was committed to the repository. These build artifacts can leak internal paths and configuration.

- **Action taken:** `git rm -r --cached .next/ apps/admin-dashboard/.next/` — removed from tracking
- **`.gitignore` already contained `.next/`** but files were added before the ignore rule existed
- **`tsconfig.tsbuildinfo`** also removed from tracking; `*.tsbuildinfo` added to `.gitignore`

## .env Files

**STATUS: REMOVED FROM VERSION CONTROL**

`.env` and `.env.template` were committed to the repository (commit `c13d7d4` renamed `.env.example` to `.env`). These files have been removed from version control. However, **the values remain in git history**.

## GitHub Secrets

A token is stored in GitHub Secrets for this repo (per owner statement).

- Secret name: UNKNOWN — owner must verify
- Permission scope: UNKNOWN — owner must verify
- Rotation needed: UNKNOWN — owner must verify provenance and scope
- Recommendation: Replace with fine-grained PAT or GitHub App installation token scoped to required repos only

## Rotation Priority

### Immediate (before go-live)

1. **Set `ADMIN_PASSWORD`** — admin auth returns 503 without it
2. **Set `ADMIN_TOKEN_SECRET`** — token signing requires this
3. **Set `JWT_SECRET`** — backend auth service will not start without it
4. **Rotate `STRIPE_SECRET_KEY`** — `.env` was committed to the repo; assume key was exposed
5. **Rotate `DATABASE_URL`** password — if it was ever in the committed `.env`

### Before production

6. Rotate all `*_SECRET` and `*_API_KEY` values if they were ever present in `.env` or `.env.template`
7. Verify all GitHub Secrets match the rotated values
8. Verify Vercel environment variables match
9. Remove any plaintext credential references from docs/scripts

## Rotation Procedure

1. Generate new credential at the provider (Stripe, Clerk, Google, etc.)
2. Update GitHub Secrets: Settings > Secrets and variables > Actions
3. Update Vercel env vars: Project Settings > Environment Variables
4. Update any other deployment targets (Railway, Docker, etc.)
5. Verify the application works with the new credential
6. Revoke/delete the old credential at the provider
7. Record the rotation date below

## Rotation Log

| Date | Secret | Rotated By | Verified Working | Notes |
|------|--------|-----------|------------------|-------|
| — | — | — | — | No rotations recorded yet |

## Committed `.env` Incident

On or before 2026-07-02, `.env` and `.env.template` were committed to the repository. These files have been removed from version control in this cleanup PR. However, **the values remain in git history**.

**Required owner actions:**

1. Rotate every secret that was ever present in `.env` or `.env.template`
2. Consider using `git filter-repo` or BFG Repo Cleaner to purge history (optional but recommended)
3. Verify no secrets leaked to forks or CI logs
