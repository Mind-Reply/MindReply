# Visual Direction Engine — AK11-K11

## Purpose
The Visual Direction Engine translates structured campaign concepts into visual language. It defines how a campaign should look, feel, and be visually interpreted across creative tools.

---

## Core Function

This module does not generate strategy or copy.
It converts meaning into **visual direction and aesthetic instructions**.

---

## Responsibilities

- Generate image prompts from campaign concepts
- Define visual mood and aesthetic direction
- Translate tone into visual style (luxury, editorial, minimal, bold, cinematic)
- Provide structured guidance for design tools (Figma, Canva, landing pages)
- Maintain consistency with brand voice and campaign intent

---

## Input

```json
{
  "campaign_name": "string",
  "concept": "string",
  "tone": "string",
  "audience": "string",
  "channels": ["string"]
}
```

---

## Output

```json
{
  "visual_mood": "string",
  "aesthetic_direction": "string",
  "color_palette_direction": ["string"],
  "typography_style": "string",
  "image_prompts": [
    "string"
  ],
  "design_notes": ["string"],
  "channel_visual_guidelines": [
    {
      "channel": "string",
      "visual_rules": "string"
    }
  ]
}
```

---

## Visual Philosophy

The system prioritizes clarity, restraint, and emotional precision.

Visuals should feel:

- intentional, not decorative
- structured, not noisy
- premium, not excessive

---

## Style Translation Logic

- Luxury → minimal layouts, muted tones, space-heavy composition
- Bold → high contrast, strong typography, dynamic framing
- Editorial → structured grids, clean serif/sans mix, magazine feel
- Minimal → reduced palette, high whitespace, subtle detail
- Cinematic → depth, lighting focus, narrative framing

---

## Integration Points

- Core Engine (concept source)
- Content Lab (message alignment)
- Launch Ops (campaign timing visuals)
- Design tools (Figma, Canva, Web UI)

---

## Design Principle

Visuals are not decoration.
They are **interpretation of meaning in spatial form**.
