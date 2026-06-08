"""Purpose: deterministic Intake Layer triage for MindReply.
Local test: python -m unittest discover src
"""

from __future__ import annotations

from dataclasses import dataclass


ACTIONS = {"reply", "schedule", "resolve", "escalate"}


@dataclass(frozen=True)
class TriageResult:
    importance: int
    urgency: int
    required_action: str
    synthesis: str
    confidence: float
    playbook_id: str

    def to_dict(self) -> dict:
        return {
            "importance": self.importance,
            "urgency": self.urgency,
            "required_action": self.required_action,
            "synthesis": self.synthesis,
            "confidence": self.confidence,
            "playbook_id": self.playbook_id,
        }


class TriageEngine:
    HIGH_RISK_TERMS = {"threat", "force", "blackmail", "harass", "illegal", "lawsuit", "regulator", "breach"}
    REPLY_TERMS = {"reply", "client", "customer", "email", "message", "fee", "price", "response", "proposal"}
    SCHEDULE_TERMS = {"follow up", "check in", "tomorrow", "next week", "calendar", "meeting", "later"}

    def classify(
        self,
        raw_input: str,
        source: str = "manual",
        user_context: dict | None = None,
        device_privacy_flag: bool = False,
        playbook_id: str | None = None,
    ) -> dict:
        text = " ".join(raw_input.split()).strip()
        lower = text.lower()
        matched_playbook = playbook_id or self._match_playbook(lower)
        action = self._required_action(lower, matched_playbook)
        urgency = self._urgency(lower, action)
        importance = self._importance(lower, source, matched_playbook, action)

        return TriageResult(
            importance=importance,
            urgency=urgency,
            required_action=action,
            synthesis=self._synthesis(text, action),
            confidence=0.86 if text else 0.0,
            playbook_id=matched_playbook,
        ).to_dict()

    def _required_action(self, lower: str, playbook_id: str) -> str:
        if any(term in lower for term in self.HIGH_RISK_TERMS) or "risk" in playbook_id:
            return "escalate"
        if any(term in lower for term in self.SCHEDULE_TERMS):
            return "schedule"
        if any(term in lower for term in self.REPLY_TERMS):
            return "reply"
        if playbook_id in {"finance-approval-flow", "compliance-audit-trail", "legal-risk-flag"}:
            return "escalate"
        return "resolve"

    def _urgency(self, lower: str, action: str) -> int:
        score = 35
        if any(term in lower for term in ["today", "urgent", "immediately", "deadline", "now"]):
            score += 42
        if action == "escalate":
            score += 18
        return min(score, 100)

    def _importance(self, lower: str, source: str, playbook_id: str, action: str) -> int:
        score = 48
        if source in {"gmail", "calendar", "extension"}:
            score += 6
        if playbook_id != "clear-next-move":
            score += 18
        if action == "escalate":
            score += 22
        if any(term in lower for term in ["board", "investor", "legal", "wire", "launch"]):
            score += 12
        return min(score, 100)

    def _match_playbook(self, lower: str) -> str:
        if any(term in lower for term in ["investor", "shareholder", "funding", "term sheet"]):
            return "investor-ir-triage"
        if any(term in lower for term in ["legal", "lawsuit", "regulator", "contract"]):
            return "legal-risk-flag"
        if any(term in lower for term in ["press", "journalist", "statement", "crisis"]):
            return "pr-crisis-triage"
        if any(term in lower for term in ["fee", "price", "proposal", "deal"]):
            return "deal-close-assistant"
        if any(term in lower for term in ["meeting", "follow up", "next step"]):
            return "meeting-outcome-actioner"
        if any(term in lower for term in ["audit", "policy", "breach"]):
            return "compliance-audit-trail"
        if any(term in lower for term in ["client", "customer", "complaint"]):
            return "customer-escalation"
        if any(term in lower for term in ["candidate", "interview", "hire"]):
            return "hiring-decision-helper"
        if any(term in lower for term in ["invoice", "payment", "wire", "approval"]):
            return "finance-approval-flow"
        if any(term in lower for term in ["launch", "release", "ship"]):
            return "product-launch-gatekeeper"
        if any(term in lower for term in ["family", "personal", "appointment"]):
            return "personal-life-triage"
        if any(term in lower for term in ["inbox", "newsletter", "fyi"]):
            return "exec-inbox-zero"
        return "clear-next-move"

    def _synthesis(self, text: str, action: str) -> str:
        if not text:
            return "No usable input was provided."
        if action == "escalate":
            return "This carries risk and needs review before movement."
        if action == "reply":
            return "This needs a calm response that reduces pressure and preserves the relationship."
        if action == "schedule":
            return "This needs a quiet follow-up moment rather than more wording now."
        return "This can be closed with a clear record and no further movement."
