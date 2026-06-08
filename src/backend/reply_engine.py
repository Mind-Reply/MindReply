"""Purpose: Action Layer reply drafting for one calm response.
Local test: python -m unittest discover src
"""

from __future__ import annotations


class ReplyEngine:
    def draft(self, raw_input: str, triage: dict, user_profile: dict | None = None) -> dict:
        synthesis = triage.get("synthesis") or "The message needs a calm response."
        action = triage.get("required_action", "reply")
        if action != "reply":
            return {
                "synthesis": synthesis,
                "recommended_action": {
                    "kind": action,
                    "label": "Proceed when ready",
                    "payload": {"rationale": synthesis},
                },
            }

        tone = (user_profile or {}).get("tone", "calm")
        draft = self._draft_for_tone(tone)
        return {
            "synthesis": synthesis,
            "recommended_action": {
                "kind": "reply",
                "label": "Send the prepared reply",
                "payload": {"draft": draft},
            },
        }

    def _draft_for_tone(self, tone: str) -> str:
        if tone == "formal":
            return "Thank you for being direct. I understand the concern and want to keep the next step clear. Let us confirm the decision point and agree the timing."
        return "Thank you for being direct. I understand the concern. The next step is to confirm the decision point, protect the relationship, and agree the timing."
