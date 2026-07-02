# DEVIN_TASK_QUEUE.md

## Task Queue

Status values: TODO | IN_PROGRESS | BLOCKED | DONE | NO-GO

---

### Task 1: Fix failed Auto Orchestrator Runner startup failure

| Field | Value |
|-------|-------|
| Task ID | TQ-001 |
| Repo | Mind-Reply/MindReply |
| Branch | main (investigate), then fix branch |
| Files expected | .github/workflows/auto-orchestrator*.yml, ops/ scripts |
| Evidence required | Passing GitHub Actions run link |
| Owner approval required | NO |
| Current status | TODO |
| Next action | Inspect failed workflow runs, identify root cause, fix and re-run |

---

### Task 2: Create or update FAILED_RUN_TRIAGE.md with exact log evidence

| Field | Value |
|-------|-------|
| Task ID | TQ-002 |
| Repo | Mind-Reply/MindReply |
| Branch | agent/permanent-continuity-system |
| Files expected | FAILED_RUN_TRIAGE.md |
| Evidence required | Exact error logs from failed runs |
| Owner approval required | NO |
| Current status | TODO |
| Next action | Pull failed run logs from GitHub Actions, document in FAILED_RUN_TRIAGE.md |

---

### Task 3: Complete MindReply security cleanup

| Field | Value |
|-------|-------|
| Task ID | TQ-003 |
| Repo | Mind-Reply/MindReply |
| Branch | agent/go-live-cleanup or cleanup/hardening-phase-1 |
| Files expected | SECURITY_ROTATION.md, .env.example updated, secrets audit |
| Evidence required | PR merged, no secrets in VCS |
| Owner approval required | YES (merge to main) |
| Current status | BLOCKED (awaiting owner merge of PR #64) |
| Next action | Owner merges PR #64, then continue hardening |

---

### Task 4: Create cleanup branch/PR if missing

| Field | Value |
|-------|-------|
| Task ID | TQ-004 |
| Repo | Mind-Reply/MindReply |
| Branch | cleanup/hardening-phase-1 |
| Files expected | Cleanup commits |
| Evidence required | PR link |
| Owner approval required | NO |
| Current status | DONE (branch exists) |
| Next action | N/A — branch exists at origin |

---

### Task 5: Create Owner Cockpit PWA

| Field | Value |
|-------|-------|
| Task ID | TQ-005 |
| Repo | Mind-Reply/MindReply |
| Branch | agent/owner-cockpit-pwa |
| Files expected | app/cockpit/, manifest.json, service-worker, cockpit UI components |
| Evidence required | Working preview URL, PWA install prompt |
| Owner approval required | YES (design review) |
| Current status | TODO |
| Next action | Scaffold PWA in agent/owner-cockpit-pwa branch |

---

### Task 6: Deploy Owner Cockpit preview URL

| Field | Value |
|-------|-------|
| Task ID | TQ-006 |
| Repo | Mind-Reply/MindReply |
| Branch | agent/owner-cockpit-pwa |
| Files expected | Vercel/Netlify preview deployment |
| Evidence required | Live preview URL returning 200 |
| Owner approval required | NO (preview only) |
| Current status | BLOCKED (depends on TQ-005) |
| Next action | Deploy after TQ-005 scaffold is complete |

---

### Task 7: Run smoke test

| Field | Value |
|-------|-------|
| Task ID | TQ-007 |
| Repo | Mind-Reply/MindReply |
| Branch | N/A — test against deployed URL |
| Files expected | LIVE_CHECK_REPORT.md updated |
| Evidence required | HTTP 200 on root, /api/health, manifest.json |
| Owner approval required | NO |
| Current status | BLOCKED (depends on TQ-006) |
| Next action | Run smoke test after preview deploy exists |

---

### Task 8: Create LIVE_CHECK_REPORT.md

| Field | Value |
|-------|-------|
| Task ID | TQ-008 |
| Repo | Mind-Reply/MindReply |
| Branch | Current working branch |
| Files expected | LIVE_CHECK_REPORT.md |
| Evidence required | HTTP response codes, timestamps |
| Owner approval required | NO |
| Current status | DONE (file exists) |
| Next action | Update after next smoke test |

---

### Task 9: Create GLOBAL_EVIDENCE_REGISTRY.md

| Field | Value |
|-------|-------|
| Task ID | TQ-009 |
| Repo | Mind-Reply/MindReply |
| Branch | Current working branch |
| Files expected | GLOBAL_EVIDENCE_REGISTRY.md |
| Evidence required | File committed |
| Owner approval required | NO |
| Current status | DONE (file exists, will be updated) |
| Next action | Keep updating as evidence is collected |

---

### Task 10: Create next production plan only after URL/evidence exists

| Field | Value |
|-------|-------|
| Task ID | TQ-010 |
| Repo | Mind-Reply/MindReply |
| Branch | N/A |
| Files expected | PRODUCTION_PLAN.md |
| Evidence required | At least one live URL verified |
| Owner approval required | YES |
| Current status | BLOCKED (no live URL yet) |
| Next action | Wait for TQ-006 and TQ-007 to complete |
