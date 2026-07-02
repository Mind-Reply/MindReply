# MindReply — Repository Execution Inventory

## Confirmed repository
- Repository: Mind-Reply/MindReply
- Default branch: main
- Branch under cleanup: go-live-cleanup

## Current classification
- Classification: Production web app
- Basis: README describes a Next.js frontend, Express backend, campaign studio routes, deployment assets, and production validation flows.

## Current status
- Security status: Needs verification
- CI/CD status: Needs verification
- Build/test status: Needs verification
- Deployment status: Not verified
- Live URL: Not confirmed
- GO/NO-GO: HOLD

## Required next checks
1. Secret scan
2. Dependency audit
3. Build and test validation
4. Production smoke test
5. Deployment and HTTPS verification
6. Monitoring and rollback confirmation

## Evidence used for classification
- README indicates Next.js frontend, Express backend, `/health`, analytics, Stripe, OpenAI, and deployment assets.

## Notes
- This inventory is the control record for the go-live cleanup phase.
- No production claim should be made until validation evidence is collected.
# Repo Inventory

## Verified access
- GitHub org: `Mind-Reply`
- Target repo: `Mind-Reply/MindReply`
- Default branch: `main`
- Visibility: public
- Archived: false
- Permissions: admin, maintain, push, pull

## Initial scope
- Cleanup and GitOps hardening for MindReply
- Org-native CI/CD and state-driven deployment controls

## Notes
- This file is the starting inventory and will be expanded with branch, workflow, release, and deployment evidence.
