"""Follow-Up Agent for one future check."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal, TypedDict

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]


class FollowUpResult(TypedDict):
    synthesis: str
    recommended_action: ActionKind
    next_check_timestamp: str
    rationale: str
    surface_to_user: bool
    confidence: float


def plan_follow_up(
    synthesis: str,
    status: str = "waiting",
    hours_from_now: int = 24,
    deadline_timestamp: str | None = None,
) -> FollowUpResult:
    now = datetime.now(timezone.utc)
    if deadline_timestamp:
        try:
            next_check = datetime.fromisoformat(deadline_timestamp.replace("Z", "+00:00"))
        except ValueError:
            next_check = now + timedelta(hours=hours_from_now)
    else:
        next_check = now + timedelta(hours=hours_from_now)

    action: ActionKind = "schedule" if status != "resolved" else "resolve"
    return {
        "synthesis": " ".join(synthesis.strip().split()) or "No synthesis provided.",
        "recommended_action": action,
        "next_check_timestamp": next_check.isoformat(),
        "rationale": "A single future check keeps the matter from drifting.",
        "surface_to_user": action == "schedule",
        "confidence": 0.82,
    }
