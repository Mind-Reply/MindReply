"""Append-only signed receipts with raw content redacted by default."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal
from uuid import uuid4

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]


def _signature(payload: dict[str, object], key: bytes) -> str:
    body = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    digest = hmac.new(key, body, hashlib.sha256).digest()
    return base64.b64encode(digest).decode("ascii")


def create_receipt(
    playbook_id: str,
    playbook_version: str,
    synthesis: str,
    recommended_action: ActionKind,
    rationale: str,
    key_id: str = "local-dev",
    key: bytes = b"mindreply-local-dev-key",
    actor: Literal["device", "server"] = "device",
    redaction_level: Literal["partial", "full"] = "full",
) -> dict[str, object]:
    unsigned = {
        "receipt_id": str(uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "playbook_id": playbook_id,
        "playbook_version": playbook_version,
        "synthesis": synthesis,
        "recommended_action": recommended_action,
        "actor": actor,
        "redaction_level": redaction_level,
        "rationale": rationale,
    }
    return {**unsigned, "signatures": [{"key_id": key_id, "sig": _signature(unsigned, key)}]}


def append_receipt(receipt: dict[str, object], path: str | Path) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(receipt, sort_keys=True) + "\n")
