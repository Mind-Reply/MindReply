# DEVIN_RESUME_PROMPT.md

## Resume Instructions for Next Devin Session

Read these files first:
- DEVIN_STATE.md
- SESSION_CHECKPOINT.md
- DEVIN_TASK_QUEUE.md
- NEXT_ACTIONS.md
- BLOCKERS.md
- AGENT_ACTION_LOG.md
- GLOBAL_EVIDENCE_REGISTRY.md
- FAILED_RUN_TRIAGE.md
- OWNER_CONTEXT_LOCK.md
- AGENT_OPERATING_CONTRACT.md

Do not start from scratch.
Continue from the latest branch, PR, commit, and task queue item.

## Priority Order

1. Fix failed Auto Orchestrator Runner.
2. Finish MindReply cleanup.
3. Build Owner Cockpit PWA.
4. Deploy preview URL.
5. Run smoke test.
6. Return evidence only.

## Required Output Format

```
STATUS:
INSPECTED:
CHANGED:
CREATED:
PR LINK:
BRANCH:
COMMIT HASH:
PREVIEW URL:
BUILD RESULT:
SMOKE TEST:
BLOCKERS:
EVIDENCE:
NEXT ACTION:
```

## Owner Goal

Create a production-ready MindReply system with cleaned repos, real URLs, private Owner Cockpit PWA, live checks, evidence registry, and safe automation.

## Rules

- No strategy-only updates.
- No silent stopping.
- No secret values in logs.
- No direct main mutation unless explicitly safe and approved.
- Every session updates SESSION_CHECKPOINT.md.
- Every action updates AGENT_ACTION_LOG.md.
- Every live claim updates GLOBAL_EVIDENCE_REGISTRY.md.
- Every blocker updates BLOCKERS.md.
- Every ending session writes a resume prompt.
