"""Calendar connector for holds and follow-up checks."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4


def next_follow_up(hours_from_now: int = 24) -> dict[str, str]:
    timestamp = datetime.now(timezone.utc) + timedelta(hours=hours_from_now)
    return {
        "next_check_timestamp": timestamp.isoformat(),
        "recommended_action": "schedule",
        "rationale": "Follow-up window reached without resolution.",
    }


def schedule_hold(title: str, minutes: int = 15) -> dict[str, object]:
    now = datetime.now(timezone.utc)
    end = now + timedelta(minutes=minutes)
    return {
        "event_id": str(uuid4()),
        "title": title[:80],
        "starts_at": now.isoformat(),
        "ends_at": end.isoformat(),
        "duration_minutes": minutes,
        "status": "prepared",
    }


def ics_payload(title: str, starts_at: datetime, minutes: int = 15) -> str:
    ends_at = starts_at + timedelta(minutes=minutes)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    start = starts_at.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    end = ends_at.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return "\n".join(
        [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//MindReply//Decision Infrastructure//EN",
            "BEGIN:VEVENT",
            f"UID:{uuid4()}",
            f"DTSTAMP:{stamp}",
            f"DTSTART:{start}",
            f"DTEND:{end}",
            f"SUMMARY:{title[:80]}",
            "END:VEVENT",
            "END:VCALENDAR",
        ]
    )
