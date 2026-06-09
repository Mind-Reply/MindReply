"""README: Owner mail export package for MindReply.

The export path prepares a redacted mail payload. Provider delivery is kept
outside this module so credentials never enter source code.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from src.backend.owner_security import require_owner

Action = Literal["reply", "schedule", "resolve", "escalate"]


@dataclass(frozen=True)
class OwnerMailExport:
    export_id: str
    timestamp: str
    to: str
    subject: str
    body: str
    recommended_action: Action
    redaction_level: str
    delivery_status: Literal["prepared"]


def prepare_owner_mail_export(
    decision: dict[str, object],
    *,
    receipt_id: str,
    source_label: str = "MindReply decision layer",
) -> dict[str, object]:
    require_owner(decision)
    owner_email = str(decision["owner_email"])
    action = str(decision["recommended_action"])
    if action not in {"reply", "schedule", "resolve", "escalate"}:
        raise ValueError("Export requires one valid action.")

    body = "\n".join(
        [
            "MindReply owner decision package",
            f"Source: {source_label}",
            f"Synthesis: {decision['synthesis']}",
            f"Recommended action: {action}",
            f"Redaction level: {decision['redaction_level']}",
            f"Receipt: {receipt_id}",
            "Raw content is excluded unless the owner explicitly exports it.",
        ]
    )

    return asdict(
        OwnerMailExport(
            export_id=str(uuid4()),
            timestamp=datetime.now(timezone.utc).isoformat(),
            to=owner_email,
            subject="MindReply owner decision package",
            body=body,
            recommended_action=action,  # type: ignore[arg-type]
            redaction_level=str(decision["redaction_level"]),
            delivery_status="prepared",
        )
    )
