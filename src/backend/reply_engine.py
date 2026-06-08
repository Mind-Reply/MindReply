"""Reply Agent for one calm response draft."""

from __future__ import annotations

from typing import Literal, TypedDict

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]


class ReplyResult(TypedDict):
    synthesis: str
    recommended_action: ActionKind
    draft: str
    confidence: float


def prepare_reply(synthesis: str, user_profile: str = "", risk_level: str = "low") -> ReplyResult:
    cleaned = " ".join(synthesis.strip().split()) or "The matter needs a concise response."
    if risk_level == "high":
        return {
            "synthesis": cleaned,
            "recommended_action": "escalate",
            "draft": "I am pausing this for review before responding.",
            "confidence": 0.91,
        }

    profile_hint = f" {user_profile.strip()}" if user_profile.strip() else ""
    return {
        "synthesis": cleaned,
        "recommended_action": "reply",
        "draft": f"Thanks for raising this. I understand the concern and will respond with the next step today.{profile_hint}",
        "confidence": 0.86,
    }
