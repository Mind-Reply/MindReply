# Cloudflare Durable Objects Plan

Status: implementation-ready edge memory plan.

FigJam board: https://www.figma.com/board/YG4m53BsnwFSVDQCftc5Bz

## Purpose

MindReply needs stateful memory per workspace without exposing raw signal text. Durable Objects fit the Memory Layer because each workspace can keep one ordered, strongly consistent record stream, one follow-up alarm, and one latest synthesis.

## Coordination Atom

Use one `WorkspaceMemory` object per workspace key.

- Route with `WORKSPACE_MEMORY.getByName(workspace_key)`.
- Keep each workspace isolated.
- Store critical state in SQLite first.
- Use in-memory state only as a cache later.
- Do not use one global object for all customers.

## Stored Data

The object stores:

- synthesis
- recommended action
- hashed signal
- pattern label
- update timestamp
- next check timestamp
- surfaced timestamp

It does not store raw signal text.

## Runtime Shape

Worker route:

- `POST /memory?workspace_key=...`
- `GET /memory?workspace_key=...`

Object methods:

- `remember(input)` writes a redacted record and schedules the next check.
- `summary(limit)` returns the latest synthesis, recommended action, record count, and timestamp.
- `alarm()` marks due checks as surfaced, then schedules the next due check.

## Privacy Rules

- Raw signal text is hashed before persistence.
- The response returns only one synthesis and one recommended action.
- Receipts stay separate from raw content.
- Workspace keys must be stable, non-public identifiers.

## Deployment Path

1. Copy `wrangler.mindreply.example.jsonc` to `wrangler.jsonc` in the Cloudflare worker package.
2. Add Wrangler and Cloudflare worker tests when the edge package becomes active.
3. Deploy `src/edge/cloudflare/memory_durable_object.ts`.
4. Point the Next Memory Layer route to the Worker endpoint after owner review.

## Verification Contract

- The class is named `WorkspaceMemory`.
- Wrangler binds `WORKSPACE_MEMORY`.
- The migration uses `new_sqlite_classes`.
- Records include `signal_hash`, not raw signal text.
- Follow-up scheduling uses one object alarm per workspace.
