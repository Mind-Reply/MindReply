# Content Lab — AK11-K11

## Purpose
Content Lab is the language expansion layer of the AK11-K11 system. It transforms structured campaign outputs into multi-format, channel-ready messaging.

---

## Core Function

It does NOT create strategy.
It does NOT define direction.

It refines, expands, and adapts existing campaign structures into usable communication assets.

---

## Responsibilities

- Generate multiple copy variants per campaign concept
- Adapt tone for different channels (LinkedIn, ads, landing pages, email)
- Expand headlines into structured messaging sets
- Maintain consistency with Core Engine output
- Improve clarity, readability, and emotional resonance

---

## Input

```json
{
  "campaign_name": "string",
  "concept": "string",
  "tone": "string",
  "audience": "string",
  "channels": ["string"],
  "objective": "string"
}
```

---

## Output

```json
{
  "copy_variants": [
    {
      "channel": "string",
      "headline": "string",
      "body": "string"
    }
  ],
  "seo_titles": ["string"],
  "ad_variants": ["string"],
  "email_subject_lines": ["string"],
  "landing_page_copy": "string"
}
```

---

## Tone System

Content Lab follows the Atelier Brief language philosophy:

- Human-first phrasing
- Editorial clarity
- No mechanical or repetitive structure
- Premium but accessible vocabulary

Avoid:
- Over-technical phrasing
- Generic templated outputs

---

## Channel Logic

- LinkedIn → Insight-driven, professional tone
- Ads → Short, high-impact messaging
- Email → Conversational, persuasive clarity
- Landing pages → Structured narrative flow

---

## Design Principle

Content Lab increases expression without changing meaning.
It amplifies clarity, not complexity.
