# FAILED_RUN_TRIAGE.md

## Purpose

Document every failed CI/CD or automation run with exact log evidence, root cause analysis, and fix status.

Last updated: 2026-07-02T15:14Z

---

## Failed Runs

### Run 1: Auto Orchestrator Runner — Startup Failure

| Field | Value |
|-------|-------|
| Workflow | TBD — needs inspection |
| Run link | TBD — needs inspection |
| Date | TBD |
| Error | TBD — startup failure reported by owner |
| Root cause | TBD — needs log inspection |
| Fix status | TODO |
| Fix branch | TBD |
| Fix PR | TBD |

**Log excerpt:**
```
(pending — will be populated after inspecting GitHub Actions logs)
```

**Resolution steps:**
1. Identify the exact workflow file
2. Pull the failed run logs
3. Identify root cause
4. Fix and re-run
5. Update this file with evidence

---

### Run 2: Vercel Deployment — 404 DEPLOYMENT_NOT_FOUND

| Field | Value |
|-------|-------|
| Workflow | .github/workflows/live-deploy.yml (if exists) |
| Run link | N/A — manual check |
| Date | 2026-07-02 |
| Error | HTTP 404 — DEPLOYMENT_NOT_FOUND at https://mindreply.vercel.app |
| Root cause | Vercel project missing, secrets misconfigured, or team account expired |
| Fix status | BLOCKED — owner must verify Vercel project/secrets |
| Fix branch | N/A |
| Fix PR | N/A |

**Log excerpt:**
```
HTTP 404
{"code": "DEPLOYMENT_NOT_FOUND"}
```

**Resolution steps:**
1. Owner verifies VERCEL_ORG_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN secrets
2. Owner confirms Vercel project exists
3. Re-trigger deploy
4. Verify 200 response

---

## Template for New Entries

```markdown
### Run N: [Workflow Name] — [Brief Error]

| Field | Value |
|-------|-------|
| Workflow | |
| Run link | |
| Date | |
| Error | |
| Root cause | |
| Fix status | |
| Fix branch | |
| Fix PR | |

**Log excerpt:**
(paste exact error)

**Resolution steps:**
1. ...
```
