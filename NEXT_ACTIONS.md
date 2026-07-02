# NEXT_ACTIONS.md

Last updated: 2026-07-02T15:14Z

## Immediate Next Actions (Priority Order)

1. **Inspect failed Auto Orchestrator Runner** — check `.github/workflows/` for orchestrator workflows, pull logs from failed runs, identify root cause.

2. **Document failure in FAILED_RUN_TRIAGE.md** — paste exact error, link to run, note root cause and fix.

3. **Fix the failure** — commit fix to a branch, open PR, verify green CI.

4. **Continue security cleanup** — once PR #64 is merged by owner, continue with remaining hardening tasks.

5. **Scaffold Owner Cockpit PWA** — on `agent/owner-cockpit-pwa` branch, create minimal PWA shell with manifest, service worker, dark UI.

## Blocked Actions (Cannot proceed without owner)

- Merge PR #64 (go-live-cleanup) — owner must review/merge
- Production deploy — requires verified Vercel config and owner approval
- Production plan — requires live URL first
