# MRagent Front End Operating Pack

This pack explains how the current MindReply front end works and what each surface is responsible for.

## Surfaces

- `/`: the public front door. It frames MindReply as a composed pressure read and routes people toward MRagent or the Personal Pack.
- `/agent`: the live MRagent session. It accepts the charged text, sends it through the decision layer, and returns one synthesis, one recommended move, risk state, and a quiet receipt.
- `/pack`: Angel's private-facing pack surface. It shows delivery readiness, revenue truth, recent movement, and the four quiet lanes.
- `/privacy`: the restraint page. It explains why raw pressure is not kept as a default record.
- `/mcp`: the ChatGPT App connection surface for Developer Mode.

## How The Interaction Works

1. A user places the charged message or hesitation into MRagent.
2. The browser calls `/api/agent` with the message and source.
3. If the model/provider path is unavailable, the app falls back to `/api/intake`.
4. The decision layer returns a structured result: synthesis, mind read, recommended action, risk, memory summary, and receipt.
5. The UI renders the answer through the AI Elements message component, then displays the structured receipt below it.
6. Persistence remains privacy-safe: no raw input is stored by default, and Blob storage is private when configured.

## Personal Pack Reporting

The GitHub workflow `.github/workflows/personal-pack-report.yml` now runs every 30 minutes with a default 25-lane report pack.

The report covers:

- front door voice
- MRagent session
- Personal Pack
- privacy posture
- ChatGPT App surface
- receipt contract
- risk gate
- delivery readiness
- Slack readiness
- email readiness
- Vercel deploy state
- GitHub source state
- Figma preview
- FigJam map
- Code Connect readiness
- Remotion motion brief
- observability watch
- conversion source watch
- revenue truth
- transaction source watch
- positioning phrases
- promotion queue
- launch blockers
- gift material
- next move

Delivery is intentionally gated. Console output is not treated as real delivery when `MINDREPLY_REPORT_REQUIRE_DELIVERY=true`. Slack requires `MINDREPLY_SLACK_WEBHOOK_URL`. Email requires `RESEND_API_KEY`, `MINDREPLY_REPORT_EMAILS`, `MINDREPLY_REPORT_EMAIL_ALLOWLIST`, and `MINDREPLY_REPORT_FROM`.

## Motion Direction

A Remotion spot should show MindReply without loud product theatrics:

- Scene 1: a charged message sits on a quiet cream field.
- Scene 2: the words dim while pressure, protection, risk, and next move become visible.
- Scene 3: one composed reply appears beside a narrow receipt.
- Scene 4: the Personal Pack receives the status without exposing the original text.

Motion should be restrained: slow fades, precise reveals, no confetti, no exaggerated claims, no fake revenue.

## Promotion Positioning

Promotion should not promise hidden posting, guaranteed revenue, or platform-wide distribution without connected accounts. The safe posture is:

- publish only where accounts and permissions are real;
- report what was prepared, sent, or blocked;
- keep the language private, elegant, and specific;
- never invent transactions, audience response, or revenue.

Use this line as the campaign spine:

> Read the pressure. Move with grace. Keep the receipt narrow.

## Figma State

- Existing preview: https://www.figma.com/design/QLximv9mLCIwQB2GPgBgeG
- New direction file: https://www.figma.com/design/PuRHREBbTixXGxPsBEI1yz
- FigJam operating map: https://www.figma.com/board/G0lSiegpqHSoQDpmgoYKDL

The Figma MCP Starter limit blocked further frame placement and Code Connect mapping. Once the limit is cleared, the next Figma step is to place the four editable frames and map them to `app/page.tsx`, `components/MRAgentChat.tsx`, and `app/pack/page.tsx`.
