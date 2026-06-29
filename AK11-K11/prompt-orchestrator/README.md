# Prompt Orchestrator — AK11-K11

## Purpose
The Prompt Orchestrator translates raw human intent into structured, system-ready instructions for the Core Engine.

It acts as the interpretation layer between user thinking and deterministic output generation.

---

## Core Responsibilities

- Interpret user intent (goal, tone, urgency)
- Normalize ambiguous input into structured parameters
- Apply brand voice rules (Atelier Brief language system)
- Route request to correct downstream module
- Enforce consistency of output behavior

---

## Input Format

```json
{
  "brief": "string",
  "audience": "string",
  "product": "string",
  "tone": "string",
  "channels": ["string"],
  "budget": "string",
  "timeline": "string"
}
```

---

## Output Format

```json
{
  "normalized_intent": "string",
  "campaign_type": "string",
  "tone_profile": "string",
  "priority_focus": "string",
  "structured_brief": {
    "objective": "string",
    "audience": "string",
    "message_angle": "string"
  },
  "routing": {
    "target_module": "core-engine"
  }
}
```

---

## Tone System

The system avoids mechanical language.
It prefers:

- Editorial clarity
- Human phrasing
- Minimal abstraction

Avoid:

- Over-technical framing
- Generic automation terminology

---

## Routing Logic

- If request is conceptual → Core Engine
- If request is copy-focused → Content Lab
- If request is planning-focused → Launch Ops
- If request is visual → Visual Direction Engine

---

## Design Principle

This module does not generate content.
It shapes direction.
