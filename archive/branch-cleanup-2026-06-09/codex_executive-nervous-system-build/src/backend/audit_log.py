"""Purpose: append-only privacy-safe audit receipts for executed actions.
Local test: python -m unittest discover src
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path


class AuditLog:
    def __init__(self, path: str = "audit.jsonl", signing_key: str | None = None) -> None:
        self.path = Path(path)
        self.signing_key = signing_key or os.environ.get("MINDREPLY_AUDIT_SIGNING_KEY", "local-dev-signing-key")

    def record(
        self,
        raw_input: str,
        source: str,
        action_kind: str,
        playbook_id: str = "clear-next-move",
        playbook_version: str = "1.0",
        synthesis: str = "Decision recorded.",
        actor: str = "server",
        redaction_level: str = "full",
        rationale: str = "One recommended action was produced.",
    ) -> dict:
        timestamp = datetime.now(timezone.utc).isoformat()
        input_hash = hashlib.sha256(raw_input.encode("utf-8")).hexdigest()
        receipt = {
            "receipt_id": str(uuid.uuid4()),
            "timestamp": timestamp,
            "playbook_id": playbook_id,
            "playbook_version": playbook_version,
            "synthesis": synthesis,
            "action": action_kind,
            "actor": actor,
            "input_hash": input_hash,
            "source": source,
            "redaction_level": redaction_level,
            "rationale": rationale,
        }
        receipt["signatures"] = [{"key_id": "local-dev", "sig": self._sign(receipt)}]
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(receipt, sort_keys=True) + "\n")
        return {
            "id": receipt["receipt_id"],
            "receipt_id": receipt["receipt_id"],
            "timestamp": timestamp,
            "source": source,
            "playbook_id": playbook_id,
            "playbook_version": playbook_version,
            "signatures": receipt["signatures"],
        }

    def _sign(self, receipt: dict) -> str:
        payload = json.dumps({key: value for key, value in receipt.items() if key != "signatures"}, sort_keys=True).encode("utf-8")
        return hmac.new(self.signing_key.encode("utf-8"), payload, hashlib.sha256).hexdigest()
