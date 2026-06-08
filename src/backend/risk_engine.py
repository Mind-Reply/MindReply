"""Risk Agent for legal-grade communication checks."""

from __future__ import annotations

from typing import Literal, TypedDict

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]
RiskLevel = Literal["low", "medium", "high"]


class RiskResult(TypedDict):
    synthesis: str
    recommended_action: ActionKind
    risk_level: RiskLevel
    reason: str
    block_execution: bool
    confidence: float


HIGH_RISK = ("legal", "claim", "breach", "liability", "termination", "harassment")
MEDIUM_RISK = ("refund", "angry", "board", "deadline", "sensitive", "confidential")


def assess_risk(synthesis: str, draft: str = "", user_context: str = "") -> RiskResult:
    text = " ".join(f"{synthesis} {draft} {user_context}".lower().split())
    if any(term in text for term in HIGH_RISK):
        return {
            "synthesis": synthesis,
            "recommended_action": "escalate",
            "risk_level": "high",
            "reason": "The signal carries legal, employment, or liability exposure.",
            "block_execution": True,
            "confidence": 0.94,
        }
    if any(term in text for term in MEDIUM_RISK):
        return {
            "synthesis": synthesis,
            "recommended_action": "reply",
            "risk_level": "medium",
            "reason": "The response needs a restrained tone and a narrow commitment.",
            "block_execution": False,
            "confidence": 0.82,
        }
    return {
        "synthesis": synthesis,
        "recommended_action": "reply",
        "risk_level": "low",
        "reason": "No material exposure detected in the provided signal.",
        "block_execution": False,
        "confidence": 0.76,
    }
