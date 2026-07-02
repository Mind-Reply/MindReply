# Security Rotation Checklist

## Secret Rotation Schedule

| Secret | Location | Rotation Frequency | Last Rotated | Owner |
|--------|----------|-------------------|--------------|-------|
| `ANTHROPIC_API_KEY` | Vercel env | 90 days | — | Engineering |
| `ADMIN_PASSWORD` | Vercel env | 30 days | — | Engineering |
| `SENTRY_DSN` | Vercel env | On compromise | — | Engineering |
| `GA_MEASUREMENT_ID` | Vercel env | N/A (public) | — | Marketing |
| `GA_API_SECRET` | Vercel env | 90 days | — | Marketing |
| `SLACK_WEBHOOK` | Vercel env | 90 days | — | Engineering |
| `STRIPE_SECRET_KEY` | Vercel env | 90 days | — | Finance |
| `DATABASE_URL` | Vercel env | 90 days | — | Engineering |
| `JWT_SECRET` | Vercel env | 90 days | — | Engineering |

## Rotation Procedure

1. Generate new secret value
2. Update in provider dashboard (Vercel → Settings → Environment Variables)
3. Redeploy affected services
4. Verify health checks pass
5. Revoke old secret value
6. Update "Last Rotated" column in this table

## Emergency Rotation (Compromise Response)

1. Immediately revoke compromised credential at the provider
2. Generate and deploy replacement
3. Audit access logs for unauthorized usage
4. Notify team via Slack `#security` channel
5. Document incident in post-mortem

## Pre-Go-Live Checklist

- [ ] All secrets rotated from development values
- [ ] No `.env` files committed to version control
- [ ] Admin password changed from default (`admin`)
- [ ] JWT secrets are cryptographically random (≥32 bytes)
- [ ] Database credentials scoped to minimum required permissions
- [ ] Stripe keys are production (not test) keys
- [ ] Sentry DSN points to production project
- [ ] API keys scoped to minimum required permissions
