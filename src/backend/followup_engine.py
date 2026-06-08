"""Purpose: Action Layer follow-up scheduling for one next check.
Local test: python -m unittest discover src
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone


class FollowUpEngine:
    def schedule(self, triage: dict, minutes_from_now: int = 60, user_preferences: dict | None = None) -> dict:
        starts_at = datetime.now(timezone.utc) + timedelta(minutes=minutes_from_now)
        action = "escalate" if triage.get("required_action") == "escalate" else "remind"
        return {
            "next_check_timestamp": starts_at.isoformat(),
            "action": action,
            "rationale": "One quiet follow-up keeps the item contained.",
            "synthesis": triage.get("synthesis") or "The matter needs a timed follow-up.",
            "recommended_action": {
                "kind": "schedule" if action == "remind" else "escalate",
                "label": "Set the follow-up" if action == "remind" else "Hold and review",
                "payload": {
                    "title": "MindReply follow-up",
                    "starts_at": starts_at.isoformat(),
                    "duration_minutes": 15,
                },
            },
        }
