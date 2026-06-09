# README: Observability Contract

MindReply observability stays quiet. It records system health and owner-critical events without demanding attention.

## Events

- intake.received
- action.prepared
- risk.blocked
- memory.updated
- owner.decision.prepared
- owner.export.held
- owner.export.prepared

## Required Fields

- event_name
- timestamp
- decision_id
- recommended_action
- redaction_level
- actor_role
- receipt_id

## Alert Conditions

- High-risk action without owner review.
- Export request without consent.
- Missing receipt.
- Mail delivery provider unavailable.
- Repeated memory write failure.

## Friction Removed

The owner does not need to inspect logs unless a trust boundary is crossed.

## Decision Simplified

Every alert maps to one owner action: review, hold, retry, or close.

## Trust Built

The system proves when it acted, when it paused, and why.
