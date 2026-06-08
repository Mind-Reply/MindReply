# MindReply Backend Layer

This directory contains the private Executive Nervous System mechanics.

## Layers

- Intake Layer: `triage_engine.py` classifies importance, urgency, source, and required action.
- Action Layer: `reply_engine.py` and `followup_engine.py` produce exactly one next movement.
- Memory Layer: `memory_store.py` stores derived preferences only. Raw input is excluded by default.

## Four Agents

- Triage Agent: assigns numeric importance, numeric urgency, required action, and playbook id.
- Reply Agent: creates one calm reply when movement is safe.
- Follow-Up Agent: creates one timed follow-up or escalation event.
- Risk Agent: blocks unsafe movement and requires review where needed.

## Receipts

`audit_log.py` writes hash-based receipts with playbook id, version, action, redaction level, and signatures. It must never write raw private text unless a later protected workflow captures explicit consent and retention settings.

## Playbooks

`playbook_interpreter.py` loads signed/versioned seed playbooks from `playbooks/seed`. Each playbook must validate against `playbooks/schema.json`.

## Verification

Run:

```bash
python -m unittest discover src
npm run decision:verify
```
