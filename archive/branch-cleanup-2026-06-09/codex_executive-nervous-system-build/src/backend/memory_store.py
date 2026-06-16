"""Purpose: Memory Layer stores derived preferences without raw input.
Local test: python -m unittest discover src
"""

from __future__ import annotations


class MemoryStore:
    def __init__(self) -> None:
        self._records: dict[str, list[dict]] = {}

    def update(self, user_id: str, raw_input: str, decision: dict) -> dict:
        action = decision.get("recommended_action", {}).get("kind", decision.get("required_action", "resolve"))
        risk = decision.get("risk", {}).get("level", decision.get("risk_level", "low"))
        derived = {
            "preferred_action": action,
            "tone": "calm",
            "follow_up_bias": "contained",
            "risk_bias": "review" if risk in {"medium", "high"} else "normal",
            "signal_size": "short" if len(raw_input) < 240 else "long",
        }
        self._records.setdefault(user_id, []).append(derived)
        return {
            "applied": True,
            "summary": "Decision memory adjusted quietly.",
        }

    def export(self, user_id: str) -> list[dict]:
        return list(self._records.get(user_id, []))
