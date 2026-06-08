"""Silent memory store with redacted records."""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]


@dataclass(frozen=True)
class MemoryRecord:
    synthesis: str
    recommended_action: ActionKind
    signal_hash: str
    pattern: str
    updated_at: str


def _hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def remember(
    synthesis: str,
    recommended_action: ActionKind,
    signal: str = "",
    path: str | Path = ".mindreply/memory.jsonl",
) -> MemoryRecord:
    record = MemoryRecord(
        synthesis=" ".join(synthesis.split())[:320],
        recommended_action=recommended_action,
        signal_hash=_hash(signal),
        pattern="tone-follow-up-risk",
        updated_at=datetime.now(timezone.utc).isoformat(),
    )
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(asdict(record), sort_keys=True) + "\n")
    return record


def recent(path: str | Path = ".mindreply/memory.jsonl", limit: int = 5) -> list[MemoryRecord]:
    target = Path(path)
    if not target.exists():
        return []
    rows = target.read_text(encoding="utf-8").splitlines()[-limit:]
    return [MemoryRecord(**json.loads(row)) for row in rows if row.strip()]
