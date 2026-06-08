"""Purpose: Action Layer reply drafting for one calm next move.
Local test: python -m unittest discover src
"""

from __future__ import annotations


class ReplyEngine:
    def draft(self, raw_input: str, triage: dict, tone_profile: dict | None = None) -> dict:
        synthesis = triage.get("synthesis") or "The message needs a calm response."
        playbook_id = triage.get("playbook_id", "clear-next-move")
        draft = self._draft_for_playbook(playbook_id)

        return {
            "synthesis": synthesis,
            "recommended_action": {
                "kind": "reply",
                "label": "Send the prepared reply",
                "payload": {"draft": draft, "playbook_id": playbook_id},
            },
        }

    def _draft_for_playbook(self, playbook_id: str) -> str:
        if playbook_id == "deal-close-assistant":
            return (
                "Thank you for being direct. I understand the concern. The next step is to confirm the decision point, "
                "protect the relationship, and agree the timing without diluting the value."
            )
        if playbook_id == "customer-escalation":
            return (
                "I understand this needs care. I will keep the next step clear: confirm what happened, name what will be checked, "
                "and return with one measured update."
            )
        return (
            "Thank you for the clarity. I have the signal. The next step is to respond once, keep the pressure contained, "
            "and leave a clean record."
        )
