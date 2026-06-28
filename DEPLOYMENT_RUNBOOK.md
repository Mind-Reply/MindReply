# Deployment Runbook

## Pre-release gates
- Secrets are stored outside Git and rotated when exposure is suspected.
- Production environment variables are managed through approved secret storage.
- CI must pass install, lint, type-check, tests, build, secret scanning, and smoke checks.

## Validation flows
- Contact flow
- Invoice flow
- Stripe checkout/webhook flow
- `/api/package-request` flow

## Deployment
Production deployment is blocked until all checks and sign-offs are complete.
