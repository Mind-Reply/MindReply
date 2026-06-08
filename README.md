# MindReply

MindReply is an Executive Nervous System and Decision Infrastructure Layer.

It sits between input and action. The product reduces scattered signal into one synthesis, one recommended action, and one quiet memory update.

## Product Contract

- Intake Layer reads the signal.
- Action Layer prepares the next move.
- Memory Layer adapts silently.
- Risk is checked before communication leaves the system.
- Raw content is excluded from receipts by default.

## Current Surface

- `/` shows the inline triage surface.
- `/api/intake` returns one synthesis and one recommended action.
- `/api/action` prepares or blocks the recommended action.
- `/api/memory` stores a redacted memory record.
- `src/edge/extension` contains the browser extension surface.
- `src/integrations` contains Gmail, IMAP, and calendar connectors.

## Backend Modules

- `src/backend/triage_engine.py`
- `src/backend/reply_engine.py`
- `src/backend/followup_engine.py`
- `src/backend/risk_engine.py`
- `src/backend/memory_store.py`
- `src/backend/audit_log.py`
- `src/backend/playbook_interpreter.py`

## Local Verification

```bash
python -m compileall src
node node_modules/next/dist/bin/next build
```

## Operating Principle

Subtract before adding. Clarify before drafting. Protect before acting. Make the next move obvious.
