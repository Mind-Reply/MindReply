"""README: Owner decision security for MindReply.

This module keeps owner-level action explicit. It prepares an owner decision
record with consent, redaction, role, and receipt requirements before export or
execution can proceed.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

Action = Literal["reply", "schedule", "resolve", "escalate"]
Role = Literal["owner", "reviewer", "operator"]
Redaction = Literal["metadata", "partial", "full"]


@dataclass(frozen=True)
class OwnerDecision:
    decision_id: str
    timestamp: str
    owner_email: str
    role: Role
    synthesis: str
    recommended_action: Action
    consent_granted: bool
    redaction_level: Redaction
    export_allowed: bool
    reason: str


def prepare_owner_decision(
    owner_email: str,
    synthesis: str,
    recommended_action: Action,
    *,
    role: Role = "owner",
    consent_granted: bool = False,
    redaction_level: Redaction = "metadata",
) -> dict[str, object]:
    clean_owner = owner_email.strip().lower()
    clean_synthesis = " ".join(synthesis.split())[:320]
    allowed = bool(clean_owner and role == "owner" and consent_granted)
    reason = (
        "Owner consent verified; export can be prepared."
        if allowed
        else "Owner export is held until owner identity and consent are verified."
    )

    return asdict(
        OwnerDecision(
            decision_id=str(uuid4()),
            timestamp=datetime.now(timezone.utc).isoformat(),
            owner_email=clean_owner,
            role=role,
            synthesis=clean_synthesis,
            recommended_action=recommended_action,
            consent_granted=consent_granted,
            redaction_level=redaction_level,
            export_allowed=allowed,
            reason=reason,
        )
    )


def require_owner(decision: dict[str, object]) -> None:
    if decision.get("role") != "owner" or decision.get("export_allowed") is not True:
        raise PermissionError("Owner decision is not verified.")
