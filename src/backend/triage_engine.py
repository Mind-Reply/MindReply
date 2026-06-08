"""Deterministic intake layer for the MindReply Executive Nervous System.

The contract is strict: one synthesis, one recommended action, no raw storage.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, NotRequired, TypedDict

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]
RiskLevel = Literal["low", "medium", "high"]


class TriageResult(TypedDict):
    synthesis: str
    recommended_action: ActionKind
    importance: int
    urgency: int
    risk_level: RiskLevel
    confidence: float
    playbook_id: NotRequired[str]


@dataclass(frozen=True)
class TriageSignal:
    keywords: tuple[str, ...]
    importance: int
    urgency: int
    action: ActionKind
    playbook_id: str


SIGNALS: tuple[TriageSignal, ...] = (
    TriageSignal(("urgent", "asap", "blocked", "deadline", "today"), 86, 91, "reply", "urgent-response"),
    TriageSignal(("legal", "contract", "claim", "breach", "liability"), 96, 88, "escalate", "risk-escalation"),
    TriageSignal(("book", "call", "meeting", "available", "schedule"), 70, 72, "schedule", "schedule-follow-up"),
    TriageSignal(("thanks", "resolved", "done", "complete", "approved"), 35, 26, "resolve", "mark-resolved"),
    TriageSignal(("invoice", "payment", "overdue", "billing", "refund"), 82, 76, "reply", "billing-clarity"),
    TriageSignal(("follow up", "checking in", "waiting", "pending"), 65, 66, "reply", "unresolved-task"),
)


def _normalize(value: str) -> str:
    return " ".join(value.lower().split())


def _clamp(value: int) -> int:
    return max(0, min(100, value))


def _risk(text: str) -> RiskLevel:
    high = ("legal", "claim", "breach", "liability", "termination", "harassment")
    medium = ("sensitive", "angry", "refund", "deadline", "urgent", "board")
    if any(term in text for term in high):
        return "high"
    if any(term in text for term in medium):
        return "medium"
    return "low"


def _synthesis(raw_input: str, action: ActionKind) -> str:
    cleaned = " ".join(raw_input.strip().split())
    if not cleaned:
        return "No usable signal was provided. Recommended action: resolve."
    if len(cleaned) > 132:
        cleaned = cleaned[:129].rstrip() + "..."
    return f"{cleaned} Recommended action: {action}."


def triage(raw_input: str, user_context: str = "", device_privacy_flag: bool = False) -> TriageResult:
    text = _normalize(f"{raw_input} {user_context}")
    matched = [signal for signal in SIGNALS if any(keyword in text for keyword in signal.keywords)]
    strongest = max(matched, key=lambda signal: signal.importance + signal.urgency) if matched else None
    risk_level = _risk(text)
    action: ActionKind = "escalate" if risk_level == "high" else strongest.action if strongest else "reply"

    confidence = 0.58 if device_privacy_flag else 0.62
    if matched:
        confidence = min(0.95, 0.64 + len(matched) * 0.08)

    result: TriageResult = {
        "synthesis": _synthesis(raw_input, action),
        "recommended_action": action,
        "importance": _clamp(strongest.importance if strongest else 45),
        "urgency": _clamp(strongest.urgency if strongest else 35),
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
    }
    if strongest:
        result["playbook_id"] = strongest.playbook_id
    return result


if __name__ == "__main__":
    print(triage("Urgent: client needs a reply before close of business today.", device_privacy_flag=True))
