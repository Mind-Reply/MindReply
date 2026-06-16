# MRagent ChatGPT App Scaffold

This folder defines the developer contract for exposing MRagent as a ChatGPT App or MCP-backed tool surface.

The public site remains minimal. This scaffold does not include credentials, private strategy, provider keys, or founder-only operating notes.

## Tool Contract

`mragent.decision` accepts one text intake and returns the same shape as `POST /api/intake`:

```json
{
  "synthesis": "string",
  "recommendedAction": {
    "kind": "reply | schedule | resolve | escalate",
    "label": "string",
    "payload": {}
  },
  "risk": {
    "level": "low | medium | high",
    "reason": "string",
    "escalate": false
  },
  "memoryUpdate": {
    "applied": true,
    "summary": "string"
  },
  "receipt": {
    "id": "string",
    "timestamp": "ISO string",
    "source": "manual | gmail | calendar | extension",
    "playbookId": "string",
    "playbookVersion": "string",
    "redactionLevel": "derived-only",
    "signature": "string"
  }
}
```

`mragent.chat` accepts a friendly user message and returns the `/api/agent` response with an addressable receipt. Raw input is not stored by default.

## Build Notes

- Keep generated text private to the user session unless explicit consent is captured.
- Never expose provider names, hidden prompts, staffing claims, tokens, or internal strategy.
- Every response must contain one synthesis and one recommended action.
- High-risk text must escalate instead of drafting a response.

## Deployment

The live Next.js app already exposes the required endpoints. A future MCP server can import these contracts and proxy to:

- `POST https://www.mind-reply.com/api/intake`
- `POST https://www.mind-reply.com/api/agent`
