# MindReply Multi-Agent Blueprint

This document versions the operating model implemented in `lib/moa.ts` and exposed by `/agent`, `/agents`, `/api/agent/orchestrate`, and `/api/agents`.

## Control Model

- User communicates with the Master Orchestrator Agent only.
- Specialist agents communicate with the Master Orchestrator Agent only.
- MOA assigns tasks; no specialist self-assigns.
- MOA decomposes goals, assigns tasks, validates outputs, resolves conflicts, and returns one final response.
- Specialists keep clear ownership boundaries and do not overwrite each other's domains.
- Outputs must be structured as code, config, JSON, steps, diagrams, or decision logs.

## Controller Contract

Role: Master Orchestrator Agent for the MindReply ecosystem.

Promise: Ensure order, clarity, stability, and perfect coordination across all MindReply agents while producing one unified, high-quality output for the user.

Core rules:

1. Only MOA talks to the user.
2. All other agents talk only to MOA.
3. MOA assigns tasks; no specialist self-assigns.
4. MOA merges, validates, and unifies all outputs.
5. MOA enforces strict domain boundaries.
6. MOA rejects unclear, conflicting, incomplete, or unstable outputs.
7. All outputs must be structured, clean, and actionable.

Rejection rules:

1. Reject outputs that overlap another agent domain.
2. Reject outputs that contradict the architecture.
3. Reject outputs that break naming conventions.
4. Reject outputs that are unclear or incomplete.
5. Reject outputs that introduce instability.

## Agent Layers

| Layer | Agents |
|---|---|
| Core Control | Master Orchestrator Agent |
| System & Infrastructure | Infrastructure, DevOps / CI-CD, Security |
| Product Development | Frontend, Backend, Database |
| Intelligence | AI Reasoning, AI Content, AI Automation |
| Experience & Growth | UX/UI, Growth, Support |
| Expansion | Research, Integration, Business |

## High-Level Flow

1. User request enters MOA.
2. MOA decomposes the goal into tasks.
3. MOA routes tasks to all relevant active agents.
4. Agents return structured outputs to MOA.
5. MOA validates coverage, resolves conflicts, and merges the result.
6. MOA returns one unified response to the user.

## Rollout

| Phase | Focus | Status |
|---|---|---|
| Phase 1: Stabilize | Vercel/GitHub/Next.js baseline, CI checks, frontend/backend/database safety | In progress |
| Phase 2: Automate | CI/CD, monitoring, error reporting, workflow automations | Queued |
| Phase 3: Expand | Growth, UX/UI, support, integrations, Cloudflare agent experiments | Queued |
| Phase 4: Scale | Performance, caching, multi-region, rate limiting, NVIDIA research lanes | Queued |

## Ecosystem Targets

| Ecosystem | Owner Agent | Phase |
|---|---|---|
| Vercel | Infrastructure | Phase 1 |
| GitHub | DevOps / CI-CD | Phase 1 |
| Browser verification | Frontend | Phase 1 |
| Neon Postgres | Database | Phase 1 |
| CircleCI | DevOps / CI-CD | Phase 2 |
| Sentry | Security | Phase 2 |
| OpenAI Platform | AI Reasoning | Phase 2, gated by secure key decision |
| Slack | Support | Phase 2 |
| Figma | UX/UI | Phase 3 |
| Outlook Email | AI Content | Phase 3 |
| Cloudflare Agents | Integration | Phase 3 |
| Public Equity Investing | Research | Phase 4 |
| NVIDIA AI-Q | Research | Phase 4, gated by runtime and credentials |
| NVIDIA NuRec | Research | Phase 4, gated by GPU/runtime/HF/NGC prerequisites |
| ChatGPT Apps | Integration | Phase 4 |

No external API key, NVIDIA deployment, Cloudflare Worker, or ChatGPT App submission package is created until MOA receives a separate explicit goal and the relevant credential/runtime gate is satisfied.
