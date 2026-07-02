# Security Audit Report — MindReply

**Date:** 2026-07-01  
**Status:** 🚨 SECURITY RED  
**Repository:** Mind-Reply/MindReply  
**Branch:** main  

---

## Executive Summary

Plaintext secret references and credential patterns found in **documentation and deployment scripts** tracked in the main branch. These are not `.env` files but reference full credentials and patterns.

**Recommended Action:** Remove all plaintext secret examples and replace with `process.env` references immediately before production deployment.

---

## Findings

### Critical Issues

| File | Type | Issue | Severity |
|------|------|-------|----------|
| `DEPLOY_NOW.txt` | PowerShell script | Instructs users to set `ADMIN_PASSWORD` and `ADMIN_SECRET` in plaintext | **CRITICAL** |
| `DEPLOY_AUTOMATED.md` | Documentation | Shows complete env var setup with example secret values | **CRITICAL** |
| `Deploy-MindReply-ALL.ps1` | PowerShell | Parameter defaults include credential references | **CRITICAL** |
| `ADMIN_DASHBOARD_SETUP.md` | Documentation | Shows `.env.local` setup with secret keys | **CRITICAL** |
| `deploy-production.sh` | Bash script | Deployment validation includes env var checks | **HIGH** |
| `WHATS_NEW.md` | Release notes | References multiple API keys and tokens | **HIGH** |

### Verified Safe Files

✅ `.env` — Does not exist (correctly not committed)  
✅ `.env.local` — Does not exist (correctly not committed)  
✅ `.env.production` — Does not exist (correctly not committed)  
✅ `.env.example` — Contains placeholders only (no actual values)  
✅ `.gitignore` — Correctly excludes `.env*` and `*.local`  

---

## Secret Types Referenced

1. **Admin Credentials:** `ADMIN_PASSWORD`, `ADMIN_SECRET`
2. **AI/ML APIs:** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`
3. **Payment Processing:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
4. **Email/Communication:** `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`
5. **Social:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
6. **Authentication:** `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
7. **Database/Cache:** `DATABASE_URL`, `REDIS_URL`
8. **Deployment:** `VERCEL_TOKEN`, `RAILWAY_TOKEN`
9. **Observability:** `SENTRY_AUTH_TOKEN`

---

## Required Actions

### Immediate (Before Any Deployment)

1. **Remove plaintext examples from documentation:**
   - Remove actual secret values from `DEPLOY_AUTOMATED.md`
   - Replace with `$env:VARIABLE_NAME` syntax placeholders
   - Add note: "Substitute your actual secret value here"

2. **Update deployment scripts:**
   - Remove example values from PowerShell and Bash scripts
   - Add inline comments: `# Set by GitHub Actions or manual environment setup`

3. **Audit all markdown files:**
   - Remove `sk_`, `sk-ant-`, `ya29`, and other secret prefixes from examples

### Short-term (Before Production Go-Live)

1. **Configure GitHub Organization Secrets:**
   ```
   MR_ADMIN_PASSWORD
   MR_ADMIN_SECRET
   MR_OPENAI_API_KEY
   MR_ANTHROPIC_API_KEY
   MR_STRIPE_SECRET_KEY
   MR_STRIPE_WEBHOOK_SECRET
   MR_GMAIL_CLIENT_ID
   MR_GMAIL_CLIENT_SECRET
   MR_GOOGLE_CLIENT_ID
   MR_GOOGLE_CLIENT_SECRET
   MR_CLERK_SECRET_KEY
   MR_CLERK_WEBHOOK_SECRET
   MR_SENTRY_AUTH_TOKEN
   MR_VERCEL_TOKEN
   MR_RAILWAY_TOKEN
   MR_DATABASE_URL
   MR_REDIS_URL
   MR_JWT_SECRET
   ```

2. **Update `.env.example` with missing variables:**
   - Add: `JWT_SECRET`, `REDIS_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`
   - Ensure all required vars are documented

3. **Configure Vercel Environment Variables:**
   - Log in to Vercel project settings
   - Add all secrets from GitHub Organization Secrets
   - Set appropriate scope (Production/Preview/Development)

### Long-term (Ongoing Security)

1. **Add pre-commit hook to prevent accidental secret commits:**
   ```bash
   # Install: npm install -D husky
   # Add: .husky/pre-commit
   npx secretlint . --validate-corekit
   ```

2. **Regular secret rotation schedule**
3. **Automated secret scanning in CI/CD**

---

## Security Rotation Status

**Current Status:** Manual rotation required  
**Rotation List:**
- [ ] ADMIN_PASSWORD — generate new, update in GitHub org secrets
- [ ] ADMIN_SECRET — generate new, update in GitHub org secrets
- [ ] STRIPE_SECRET_KEY — verify rotation in Stripe dashboard
- [ ] ANTHROPIC_API_KEY — verify in Anthropic console
- [ ] GMAIL tokens — regenerate OAuth tokens
- [ ] SENTRY_AUTH_TOKEN — regenerate in Sentry dashboard
- [ ] All webhook secrets — regenerate from respective platforms

---

## Verification Checklist

- [ ] All plaintext secret examples removed from tracked files
- [ ] `.env.example` updated with all required variables
- [ ] GitHub organization secrets configured
- [ ] Vercel project environment variables set from org secrets
- [ ] CI/CD workflow references org secrets (not inline)
- [ ] All deployment scripts use environment variables
- [ ] Local development uses `.env.local` (excluded from git)
- [ ] Pre-commit hook installed and tested
- [ ] Secrets never logged in GitHub Actions output
- [ ] Production deployment uses secrets from platform (Vercel/Railway/etc)

---

## Next Steps

1. **Do not merge any PRs until this audit is resolved**
2. **Create PR:** `security/remove-plaintext-secrets`
3. **Remove all example values from:**
   - DEPLOY_NOW.txt
   - DEPLOY_AUTOMATED.md
   - Deploy-MindReply-ALL.ps1
   - ADMIN_DASHBOARD_SETUP.md
   - deploy-production.sh
   - WHATS_NEW.md
4. **Update `.env.example` with complete variable list**
5. **Configure GitHub + Vercel secrets**
6. **Rotate all exposed secret types**
7. **Merge security PR**
8. **Proceed with deployment**

---

**Report Generated:** 2026-07-01T22:00:01Z  
**Audit Tool:** GitHub Copilot Security Scanner  
**Status:** Awaiting remediation
