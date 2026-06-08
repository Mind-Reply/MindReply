"""Purpose: calendar adapter for one follow-up or escalation event.
Local test: python -m unittest discover src
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path


class CalendarConnector:
    """Writes a single event payload to an outbox or returns it to a host adapter."""

    def __init__(self, path: str | None = None, env: dict | None = None) -> None:
        self.env = env or os.environ
        self.path = Path(path or self.env.get("MINDREPLY_CALENDAR_OUTBOX", "calendar-outbox.jsonl"))

    def ready(self) -> bool:
        return bool(self.env.get("MINDREPLY_CALENDAR_PROVIDER") or self.env.get("MINDREPLY_CALENDAR_OUTBOX"))

    def event_from_decision(self, decision: dict, delay_minutes: int = 60, persist: bool = False) -> dict:
        action = decision.get("recommendedAction") or decision.get("recommended_action") or {}
        kind = action.get("kind", "schedule")
        payload = action.get("payload", {}) if isinstance(action.get("payload", {}), dict) else {}
        starts_at = payload.get("starts_at") or payload.get("startsAt") or self._timestamp(delay_minutes)
        title = payload.get("title") or ("MindReply review" if kind == "escalate" else "MindReply follow-up")
        event = {
            "title": title,
            "starts_at": starts_at,
            "duration_minutes": int(payload.get("duration_minutes", 15)),
            "kind": "escalation" if kind == "escalate" else "follow_up",
            "synthesis": decision.get("synthesis", "Decision receipt available."),
            "receipt_id": (decision.get("receipt") or {}).get("id"),
        }
        if persist:
            self._write(event)
        return event

    def create_followup(self, title: str, delay_minutes: int = 60, note: str = "", persist: bool = True) -> dict:
        event = {
            "title": title,
            "starts_at": self._timestamp(delay_minutes),
            "duration_minutes": 15,
            "kind": "follow_up",
            "synthesis": note,
            "receipt_id": None,
        }
        if persist:
            self._write(event)
        return event

    def _timestamp(self, delay_minutes: int) -> str:
        return (datetime.now(timezone.utc) + timedelta(minutes=delay_minutes)).isoformat()

    def _write(self, event: dict) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, sort_keys=True) + "\n")
