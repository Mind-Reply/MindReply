# MindReply

MindReply is an Executive Nervous System and Decision Infrastructure Layer. It sits between pressure and action so the next move becomes calm, visible, and defensible.

## MRagent

MRagent is the Mind Read surface for MindReply. It reflects what the pressure is really about, what the user's mindset is protecting, the calmer move, and one recommended action.

## Layers

- Intake Layer: reads the pressure and produces one synthesis.
- Mind Read Layer: reflects the pressure, mindset protection, and calmer move.
- Action Layer: returns one recommended action.
- Memory Layer: keeps derived preferences only when approved.

## Agents

- Triage Agent
- Reply Agent
- Follow-Up Agent
- Risk Agent

## Public Surface

- `/`
- `/agent`
- `/pack`
- `/privacy`
- `/mcp`
- `/api/intake`
- `/api/agent`
- `/api/health`

Old public surfaces are redirected into the decision layer.

## Front End Operating Pack

`docs/front_end_operating_pack.md` explains the full front-end system: Home, MRagent, Personal Pack, privacy posture, reporting cadence, Figma/FigJam state, Remotion motion direction, review guardrails, and observability watch.

Design links:

- Figma preview: https://www.figma.com/design/QLximv9mLCIwQB2GPgBgeG
- Front-end direction file: https://www.figma.com/design/PuRHREBbTixXGxPsBEI1yz
- FigJam operating map: https://www.figma.com/board/G0lSiegpqHSoQDpmgoYKDL

## ChatGPT App Surface

`/mcp` exposes the internal MRagent MCP Apps endpoint for ChatGPT Developer Mode.

Tools:

- `prepare_mindread`: prepares one synthesis, one action, risk gate, receipt, and persistence status.
- `render_mindread`: prepares the result and attaches the MRagent widget resource.
- `fetch_receipt`: fetches a privacy-safe receipt by id when Blob storage is configured.

Widget resource:

- URI: `ui://widget/mragent-mindread-v1.html`
- MIME: `text/html;profile=mcp-app`

## Personal Pack Preview

`/pack` is the operating surface for the MindReply pack. It shows delivery destinations, live preview links, truthful transaction/revenue counters, and current movement signals.

Users should ask MRagent first. If the question cannot be solved there, use `/contact` or write to `info@mind-reply.com`.

Revenue and transaction counters are environment-driven so the page does not invent numbers:

```bash
NEXT_PUBLIC_PACK_TRANSACTION_COUNT=0
NEXT_PUBLIC_PACK_REVENUE_TOTAL=$0
NEXT_PUBLIC_PACK_REVENUE_NOTE=No connected transaction source yet.
```

## Personal Pack Reports

`npm run report:personal-pack` generates a personal-only pulse with deploy status, MRagent links, the Figma preview, delivery status, the operating pack, a short "where you win" section, and one reusable material line.

The scheduled workflow is `.github/workflows/personal-pack-report.yml`. It can be run manually with `workflow_dispatch` or by cron. The workflow uses `*/30 * * * *`, which runs twice an hour.

## Activation Pack Reports

`npm run report:activation-pack` generates the activated security and promotion pack:

- 8-lane defensive security team: headers, routes, secrets, receipt privacy, dependencies, deployment protection, runtime observability, incident response.
- 28-lane social/ad preparation team: positioning, launch copy, channel drafts, Figma/Remotion queue, analytics readiness, revenue truth, distribution permission checks, and next move.
- Owner decision desk: security findings that affect behavior, access, data retention, delivery, billing, or production rollout are sent as owner decision packets before action.

The scheduled workflow is `.github/workflows/activation-pack-report.yml` and also runs every 30 minutes. It prepares and reports. It does not post externally, scrape audiences, run ads, attack systems, or claim revenue without connected and approved sources.

Sending is disabled by default. Console preview is safe without secrets.

Owner decision routing:

```bash
MINDREPLY_SECURITY_OWNER_EMAIL=angelllkr@gmail.com
MINDREPLY_SECURITY_PUBLIC_EMAIL=info@mind-reply.com
```

Decision packets include affected surface, evidence, impact, recommended decision, rollback or rotation note, and delivery status. They may include all non-secret security data needed for owner decisions, but they must not include raw secrets, access tokens, credentials, private pressure text, or unredacted sensitive records.

Required opt-in variables:

```bash
MINDREPLY_REPORT_ENABLED=true
MINDREPLY_REPORT_DRY_RUN=false
MINDREPLY_REPORT_CHANNELS=console,slack,email
MINDREPLY_REPORT_REQUIRE_DELIVERY=true
MINDREPLY_REPORT_PERSONAL_ONLY=true
MINDREPLY_REPORT_PERSONAL_LABEL=MindReply pack
MINDREPLY_REPORT_AGENT_COUNT=25
```

When `MINDREPLY_REPORT_REQUIRE_DELIVERY=true`, console output does not count as delivery. At least one Slack or email channel must return `sent`, or the workflow fails loudly.

Slack delivery uses a GitHub secret or deployment secret named `MINDREPLY_SLACK_WEBHOOK_URL`. A Slack app field id such as `Xf0B6WHC2SBH` and a workspace invite link are useful setup context, but they are not enough to send; the runtime needs a webhook URL or a connected Slack write destination. For phone-visible Slack updates, create an incoming webhook in the Mind Reply Slack workspace, point it at the preferred channel or direct-message workflow, and store the webhook URL only as `MINDREPLY_SLACK_WEBHOOK_URL`.

Email delivery uses GitHub or deployment secrets:

```bash
RESEND_API_KEY=
MINDREPLY_REPORT_EMAILS=angelllkr@gmail.com,info@mind-reply.com
MINDREPLY_REPORT_EMAIL_ALLOWLIST=angelllkr@gmail.com,info@mind-reply.com
MINDREPLY_REPORT_FROM=
```

`MINDREPLY_REPORT_EMAIL` is still supported as a single-recipient fallback. Prefer `MINDREPLY_REPORT_EMAILS` for explicit delivery lists.

When `MINDREPLY_REPORT_PERSONAL_ONLY=true`, every email recipient must appear in `MINDREPLY_REPORT_EMAIL_ALLOWLIST`.

## Local Commands

```bash
npm ci
npm run decision:verify
npm run mcp:verify
npm run report:personal-pack
npm run report:security-pack
npm run report:promotion-pack
npm run report:activation-pack
npm run typecheck
npm run build
python -m unittest discover src
```

## Environment

Use `.env` for the committed base configuration. Put real local-only secrets in `.env.local`, and set production secrets in the deployment provider. Integrations read credentials from environment variables and do not hardcode secrets.

Optional MRagent provider settings:

```bash
OPENAI_API_KEY=
MRAGENT_MODEL=gpt-5
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=https://www.mind-reply.com
```

When no provider key is configured, MRagent returns a deterministic privacy-safe Mind Read from the decision layer. When Blob storage is not configured, generation persistence reports `stored=false` while the response remains usable. When Blob storage is configured, MRagent writes private records and does not expose Blob URLs in tool output.
