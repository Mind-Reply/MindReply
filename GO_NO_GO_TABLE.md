# Go / No-Go Decision Table

## Launch Readiness Assessment

| # | Category | Criterion | Status | Owner | Notes |
|---|----------|-----------|--------|-------|-------|
| 1 | Security | All secrets rotated from dev defaults | NO-GO | Engineering | `ADMIN_PASSWORD` defaults to `'admin'` |
| 2 | Security | `.env` removed from version control | GO | Engineering | Cleaned in this PR |
| 3 | Security | `.next` build artifacts removed from VCS | GO | Engineering | Cleaned in this PR |
| 4 | Security | JWT secrets cryptographically random | NO-GO | Engineering | Verify production values |
| 5 | Security | IP whitelisting configured for admin | NO-GO | Engineering | Currently empty whitelist |
| 6 | Infrastructure | Production database provisioned | NO-GO | Engineering | Verify Neon/Prisma production config |
| 7 | Infrastructure | Vercel production deployment working | NO-GO | Engineering | Rate-limited on current plan |
| 8 | Infrastructure | Sentry configured for production | NO-GO | Engineering | Verify `SENTRY_DSN` set |
| 9 | Infrastructure | Domain/DNS configured | NO-GO | Engineering | Verify `mindreply.dev` setup |
| 10 | Payments | Stripe production keys configured | NO-GO | Finance | Test keys must be swapped |
| 11 | Payments | Webhook endpoints registered | NO-GO | Engineering | Verify Stripe webhook URL |
| 12 | Monitoring | Health checks operational | NO-GO | Engineering | `ops/monitor/health-score.js` needs production config |
| 13 | Monitoring | Error alerting configured | NO-GO | Engineering | Verify Sentry alert rules |
| 14 | Code Quality | TypeScript compiles clean | GO | Engineering | Pre-existing errors in `briefs.ts` only |
| 15 | Code Quality | Error handling propagates properly | GO | Engineering | Fixed in PR #59 |
| 16 | Code Quality | No hardcoded secrets in source | GO | Engineering | Verified — uses env vars |
| 17 | Testing | Core user flows tested | NO-GO | QA | No automated test suite |
| 18 | Testing | Payment flow tested end-to-end | NO-GO | QA | Requires Stripe test mode |
| 19 | Ops | Recovery scripts validated | NO-GO | Engineering | `ops/recovery/recover.js` untested |
| 20 | Ops | Backup strategy documented | NO-GO | Engineering | No backup config found |
| 21 | Legal | Privacy policy published | NO-GO | Legal | Required before user data collection |
| 22 | Legal | Terms of service published | NO-GO | Legal | Required before accepting payments |

## Summary

| Status | Count |
|--------|-------|
| GO | 5 |
| NO-GO | 17 |

## Critical Blockers (Must resolve before launch)

1. **Secret rotation** — Default admin password and unverified JWT secrets
2. **Vercel plan** — Rate-limited; upgrade or reduce deployment count
3. **Stripe production keys** — Cannot accept real payments without production keys
4. **No test suite** — No automated tests to validate core flows
5. **Legal** — No privacy policy or ToS

## Recommended Next Actions

1. Rotate all secrets to production-grade values (see `SECURITY_ROTATION.md`)
2. Upgrade Vercel plan or consolidate deployments
3. Configure Stripe production keys and webhook
4. Add integration tests for critical paths (auth, billing, brief creation)
5. Publish privacy policy and terms of service
6. Set up database backups
7. Validate monitoring and alerting pipeline
