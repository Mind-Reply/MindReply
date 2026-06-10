# MRagent Front End Operating Pack

This pack explains how the current MindReply front end works and what each surface is responsible for.

## Surfaces

- `/`: the public front door. It now presents immediate operational relief, premium communication intelligence, the paid ladder, trust proof, promotion readiness, and owner-visible observability.
- `/agent`: the live MRagent session. It accepts charged text, explains the slow reply, and returns one synthesis, one recommended move, risk state, memory summary, and a quiet receipt.
- `/pack`: the private completion surface. It shows delivery readiness, revenue truth, promotion queue state, reporting lanes, and confirmed destination status.
- `/privacy`: the restraint page. It explains why raw pressure is not kept as a default record.
- `/mcp`: the ChatGPT App connection surface for Developer Mode.

## How The Interaction Works

1. A user places the charged message or hesitation into MRagent.
2. The browser calls `/api/agent` with the message and source.
3. If the model/provider path is unavailable, the app falls back to `/api/intake`.
4. The decision layer returns a structured result: synthesis, mind read, recommended action, risk, memory summary, and receipt.
5. The UI renders the answer through the AI Elements message component, then displays the structured receipt below it.
6. Persistence remains privacy-safe: no raw input is stored by default, and Blob storage is private when configured.

## Full Front End Map

The front end is intentionally not a marketing-only page. It is the usable product surface:

- Hero: `Reclaim 2+ hours daily within 24 hours` plus the first-output promise.
- Authority layer: executive communication intelligence, professional lexicons, tone, structure, empathy, persuasion, and compliance-aware refinement.
- Paid path: free first output, credits/package, Growth, and Pro.
- Trust proof: stored vs not stored, memory consent, sensitive-work review, request safety, and owner logs.
- Promotion readiness: MRadvertisingTeam, assisted close, and revenue-readiness language without fake posting claims.
- Completion pack: delivery status, real revenue counters, report lanes, and blockers.

## 40-Minute Reporting

The Codex app heartbeat `mindreply-40-minute-revenue-and-security-updates` runs every 40 minutes and produces a 7-section owner-facing report.

The report sections are:

1. Status
2. Changed
3. Security / Owner Decisions
4. Revenue Move
5. Website / Frontend
6. Blocked
7. Next Safe Action

Delivery is intentionally gated. The report writes to the thread first, then attempts Outlook delivery to `ANGELLLKR@GMAIL.COM`. Slack or other platform posting requires a connected destination and explicit approval in the active thread.

## Revenue-First Rule

This week, the priority is not infrastructure breadth. The priority is buying friction:

- make Website Completion Package the first paid offer;
- keep the first free output visible;
- add trust proof before asking for sensitive input;
- make credits, package, Growth, and Pro visible;
- use assisted close through email, booking, and direct follow-up;
- pause Slack/MCP polish unless it directly closes revenue.

## Automation Guardrails

The safe automation posture is:

- prepare campaign material, do not publish externally without connected accounts and explicit approval;
- report blockers directly instead of pretending an integration works;
- avoid stealth posting, guaranteed reach, or guaranteed revenue language;
- keep deployment work on guarded branches until production approval is explicit;
- keep transaction and revenue counters tied to real sources.

## Motion Direction

A Remotion spot should show MindReply without loud product theatrics:

- Scene 1: a charged message sits on a quiet field.
- Scene 2: the words dim while pressure, protection, risk, and next move become visible.
- Scene 3: one composed reply appears beside a narrow receipt.
- Scene 4: the Completion Pack receives the status without exposing the original text.

Motion should be restrained: slow fades, precise reveals, no fake revenue, no exaggerated claims.

## Promotion Positioning

Promotion should not promise hidden posting, guaranteed revenue, or platform-wide distribution without connected accounts. The safe posture is:

- publish only where accounts and permissions are real;
- report what was prepared, sent, or blocked;
- keep the language private, elegant, and specific;
- never invent transactions, audience response, or revenue.

Use this line as the campaign spine:

> Reclaim the hour. Rescue the message. Keep the receipt narrow.

## Figma State

- Existing preview: https://www.figma.com/design/QLximv9mLCIwQB2GPgBgeG
- New direction file: https://www.figma.com/design/PuRHREBbTixXGxPsBEI1yz
- FigJam operating map: https://www.figma.com/board/G0lSiegpqHSoQDpmgoYKDL

The connected Figma account currently reports a Starter plan with a View seat. That blocks creating new editable files, placing new frames, FigJam edits, and Code Connect mappings from this session. Once an edit-capable seat is available, the next Figma step is to place the editable frames and map them to `app/page.tsx`, `components/MRAgentChat.tsx`, and `app/pack/page.tsx`.

## Vercel And Observability

`vercel.json` disables deployments for every branch except `main`, which prevents duplicate preview deployment spam while frontend work is in progress. Production deployment still requires an explicit merge to `main` and a quota-safe release window.

Vercel Speed Insights is mounted in `app/layout.tsx`. This branch adds structured owner logs for `/api/agent`, `/api/intake`, and `/mcp`: request source, risk state, fallback/persistence status, batch size, rejection reason, and no raw user text.
