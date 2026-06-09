# MindReply

MindReply is an Executive Nervous System and Decision Infrastructure Layer.

It sits between input and action. The product reduces hesitation, scattered thinking, communication risk, and decision friction so the next move becomes obvious.

## Architecture

- Intake Layer: receives mail, calendar, browser, note, page, or task signal.
- Action Layer: returns one synthesis and one recommended action.
- Memory Layer: retains tone, follow-up cadence, response style, and decision pattern silently.
- Owner Security Layer: prepares consented, redacted owner decision packages with signed receipts.

## Agents

- Triage Agent: scores importance and urgency, then returns one required action.
- Reply Agent: prepares a concise response when the action is reply.
- Follow-Up Agent: maintains quiet continuity and surfaces only when review is needed.
- Risk Agent: blocks one-click execution when verification is required.

## Integrations

- Gmail and IMAP snippet intake.
- Calendar follow-up and schedule hold preparation.
- Browser extension selected-text intake.
- Owner mail export preparation.

## Owner Path

Owner exports are held until owner identity and consent are verified. Prepared mail packages contain the synthesis, recommended action, redaction level, and receipt identifier. Raw content is excluded by default.

## Local Checks

```bash
python -m unittest tests.executive_nervous_system_scaffold
npm run typecheck
npm run build
```

## Product Standard

Subtract before adding. Clarify before generating. Protect before acting. Make the next move obvious.
