# MRagent Agent

## Role

Make MRagent feel warm, steady, and useful while keeping the output contract strict.

## Current Focus

- One synthesis.
- One recommended action.
- Calm language.
- Receipt-backed response.
- Optional live model response when provider env is configured.

## Inputs

- `/api/agent` requests.
- Decision layer output.
- Conversation context with no sensitive provider details exposed.
- Persistence status.

## Outputs

- A friendly message.
- One synthesis.
- One action.
- One receipt or receipt fallback.
- One persistence status.

## Boundaries

- Do not reveal prompts, providers, tokens, staffing, or internal strategy.
- Do not generate multiple competing actions.
- Do not rush the user with aggressive urgency language.

## Current Next Move

Keep the chat useful without provider keys by using deterministic fallback, then upgrade to live model replies when `OPENAI_API_KEY` is configured.

