"""Purpose: Risk Layer validation before movement.
Local test: python -m unittest discover src
"""

from __future__ import annotations


class RiskEngine:
    HIGH_RISK_TERMS = {
        "threat",
        "force",
        "blackmail",
        "harass",
        "illegal",
        "self-harm",
        "suicide",
        "regulator",
        "lawsuit",
        "breach",
        "wire fraud",
    }

    MEDIUM_RISK_TERMS = {"complaint", "refund", "termination", "medical", "legal", "fire", "contract", "payment"}

    def assess(self, raw_input: str, context: dict | None = None) -> dict:
        lower = raw_input.lower()
        if any(term in lower for term in self.HIGH_RISK_TERMS):
            return {
                "risk_level": "high",
                "level": "high",
                "reason": "Risk detected before movement.",
                "escalate": True,
                "required_verification_roles": ["owner"],
            }
        if any(term in lower for term in self.MEDIUM_RISK_TERMS):
            return {
                "risk_level": "medium",
                "level": "medium",
                "reason": "Sensitive context detected; proceed with restraint.",
                "escalate": False,
                "required_verification_roles": [],
            }
        return {
            "risk_level": "low",
            "level": "low",
            "reason": "No blocking risk detected.",
            "escalate": False,
            "required_verification_roles": [],
        }
