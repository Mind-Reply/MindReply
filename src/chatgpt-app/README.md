# MRagent ChatGPT App Scaffold

This folder defines the developer contract for exposing MRagent as a ChatGPT App through the existing `/mcp` endpoint.

The public site remains minimal. This scaffold does not include credentials, private strategy, provider keys, or founder-only operating notes.

## Archetype

Primary archetype: `react-widget` in product experience, `MCP render tool` for ChatGPT.

The live MCP route already exposes:

- `prepare_mindread`: returns one synthesis, one recommended action, risk, memory update, reply, and receipt.
- `render_mindread`: returns the same prepared result and attaches the MRagent widget resource.
- `fetch_receipt`: retrieves a privacy-safe receipt when storage is configured.

## Resource

Widget resource:

```text
ui://widget/mragent-mindread-v1.html
```

The widget listens for `window.openai` state and `ui/notifications/tool-result`, then renders the Mind Read, one action, risk gate, and receipt.

## Safety Defaults

- Raw input is not stored by default.
- Receipts use ids, hashes, redaction flags, and playbook metadata.
- The app never exposes provider names, tokens, hidden prompts, staffing claims, or internal strategy.
- High-risk text escalates instead of producing outbound wording.

## Local Checks

```bash
npm run mcp:verify
npm run decision:verify
```

## Submission Readiness

The root `chatgpt-app-submission.json` contains review-facing app info, tool annotations, and tests. Before public submission, verify organization ownership and app permissions in the OpenAI Platform dashboard.
