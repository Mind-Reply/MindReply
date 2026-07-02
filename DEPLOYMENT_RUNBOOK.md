# Deployment Runbook

## Prerequisites

1. All required environment variables are set (see `START_HERE.md`)
2. All credentials rotated per `SECURITY_ROTATION.md`
3. `GO_NO_GO_TABLE.md` shows no critical NO-GO items
4. `GO_LIVE_CHECKLIST.md` items are checked off

## Pre-release Gates

- [ ] Secrets are stored outside Git (GitHub Secrets / Vercel env vars)
- [ ] Credentials rotated after `.env` commit incident
- [ ] CI passes: install, lint, type-check, build
- [ ] No committed `.env`, `.next`, or build artifacts
- [ ] Secret scanning passes (no hardcoded keys in source)

## Build and Verify Locally

```bash
npm install
npm run lint
npm run type-check
npm run build
```

## Validation Flows

Before promoting to production, verify these flows work:

1. **Homepage** — loads, renders correctly, no console errors
2. **Admin login** — `/admin` accepts correct password, rejects wrong password
3. **Admin chat** — authenticated admin can send messages via `/api/admin/chat`
4. **Health endpoint** — `GET /api/health` returns `{"status":"alive"}`
5. **Contact/request flow** — contact form submits successfully
6. **Stripe checkout** — payment flow initiates (test mode)
7. **Stripe webhook** — webhook signature verification works
8. **API error handling** — invalid requests return generic errors (no stack traces)

## Deploy to Preview

1. Push to a feature branch
2. Vercel creates a preview deployment automatically
3. Run validation flows against the preview URL
4. Verify HTTPS works on the preview URL

## Deploy to Production

1. Merge PR to `main` after all checks pass
2. Vercel deploys to production automatically
3. Verify production URL loads with HTTPS
4. Run validation flows against production URL
5. Verify Stripe webhooks point to production URL
6. Verify monitoring is receiving data (Sentry)

## Rollback

If issues are found after production deployment:

1. Go to Vercel Dashboard > Deployments
2. Find the last known-good deployment
3. Click "Promote to Production"
4. Verify the rollback resolved the issue
5. Investigate and fix the issue on a branch before re-deploying

## Post-Deploy Checklist

- [ ] Production URL loads with HTTPS
- [ ] Admin login works
- [ ] Health endpoint responds
- [ ] Stripe webhook is receiving events
- [ ] Sentry is receiving error reports
- [ ] Uptime monitoring is configured
- [ ] Update `GO_NO_GO_TABLE.md` with verified evidence
