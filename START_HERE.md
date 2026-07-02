# MindReply — Operator Start

## Current state
- Repository: `Mind-Reply/MindReply`
- Branch under cleanup: `go-live-cleanup`
- Classification: production web app with a private owner control plane
- Live public URL: https://project24053.websitepublisher.ai/
- Status: cleanup and validation required before any go-live claim

## What to do first
1. Verify secret handling.
2. Verify build, tests, and smoke checks.
3. Verify deployment and HTTPS.
4. Verify monitoring and rollback.
5. Verify the private control surface separately from the public site.

## Canonical docs
- `DEPLOYMENT_RUNBOOK.md`
- `GO_LIVE_CHECKLIST.md`
- `SECURITY_ROTATION.md`
- `POST_LAUNCH_MONITORING.md`
- `REPO_INVENTORY.md`
- `BLOCKERS.md`
- `ACCESS_REQUEST.md`

## Current rule
Do not treat the public site as production-complete until proof exists for build, smoke, monitoring, and rollback.