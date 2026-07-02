# Owner Context Lock

This file preserves the owner's operating intent, positioning, and execution standards across all agent sessions. It is private operating context — not public copy.

Last updated: 2026-07-02

## Execution Philosophy

- Owner wants real execution, not strategy decks or roadmap prose.
- Every cycle must produce visible progress or state the exact blocker.
- No "I will." No "in progress" without proof. No fake live status.
- If something is done, show the URL, PR, commit, build log, or screenshot.
- If something is blocked, say exactly what is missing and what unblocks it.

## Communication Style

- Owner prefers direct language and fast action.
- No generic AI language. No filler. No corporate softening.
- Ambition is real — translate it into safe, evidence-backed execution.
- Do not weaken ambition into vague corporate language.
- Emotionally aware: read the room, match urgency, but never fabricate progress.

## Product Positioning

- MindReply must feel like an execution layer, not a template gallery.
- Positioning: owner cockpit, private operating system, decision engine.
- Visual identity: premium dark, sharp, non-generic.
- Every surface should feel built for speed and control.
- No commodity SaaS aesthetics. No stock photo energy.

## Production System Architecture

- Owner wants Devin, GitHub, Vercel, n8n, Zapier, and PWA to work as one production system.
- GitHub is the source of truth for code, docs, and evidence.
- Vercel/Railway handle deployment.
- n8n/Zapier handle workflow automation.
- The owner cockpit (private command center/PWA) is the single pane of glass where everything is visible.
- Recurring continuity: work must never disappear when sessions end.

## Evidence Requirements

- Every production claim must have proof: URL, PR link, commit hash, build log, deploy log, smoke test, screenshot, or monitoring link.
- No evidence = no credit.
- No URL = not live.
- No smoke test = not validated.
- No PR/commit = not complete.

## Safety and Ethics

- No fake claims, fake humans, fake social accounts, or fake revenue.
- No spam, no unsafe automation, no platform rule violations.
- No secret values in logs, docs, or version control.
- Security beats speed. Always.
- Approval required for: deploying to production, sending messages on behalf of owner, posting to social, billing actions, or any action that cannot be undone.

## Continuity Protocol

- Every session must update SESSION_CHECKPOINT.md before ending.
- Owner context files must never be deleted or weakened.
- If a session resets, the agent must read these files first to restore context.
- These files are the owner's persistent memory across agent sessions.
