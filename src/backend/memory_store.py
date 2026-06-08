"""Purpose: Memory Layer store for derived preferences only.
Local test: python -m unittest discover src
"""

from __future__ import annotations


class MemoryStore:
    def __init__(self) -> None:
        self._records: dict[str, list[dict]] = {}

    def update(self, user_id: str, raw_input: str, decision: dict, explicit_raw_retention: bool = False) -> dict:
        action = (decision.get("recommended_action") or decision.get("recommendedAction") or {}).get("kind", "resolve")
        derived = {
            "preferred_action": action,
            "tone": "calm",
            "input_length_bucket": self._bucket_length(len(raw_input)),
            "raw_retention": False,
        }
        self._records.setdefault(user_id, []).append(derived)
        return {
            "applied": True,
            "summary": "Decision memory adjusted quietly.",
        }

    def export(self, user_id: str) -> list[dict]:
        return list(self._records.get(user_id, []))

    def _bucket_length(self, length: int) -> str:
        if length < 120:
            return "short"
        if length < 800:
            return "medium"
        return "long"
