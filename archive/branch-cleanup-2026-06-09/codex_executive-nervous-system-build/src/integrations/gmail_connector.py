"""Purpose: Gmail/IMAP intake adapter that sends only safe candidates into MindReply.
Local test: python -m unittest discover src
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class MailCandidate:
    source: str
    input: str
    consent_full_content: bool
    device_privacy_flag: bool
    metadata: dict

    def to_intake(self) -> dict:
        return {
            "source": self.source,
            "input": self.input,
            "consent_full_content": self.consent_full_content,
            "device_privacy_flag": self.device_privacy_flag,
            "metadata": self.metadata,
        }


class GmailConnector:
    """Header/snippet-first connector for Gmail or standard IMAP.

    The connector avoids network reads unless the host process has configured
    credentials. Raw body text is included only when explicit consent is supplied
    for that request.
    """

    REQUIRED_ENV = ("MINDREPLY_IMAP_HOST", "MINDREPLY_IMAP_USER", "MINDREPLY_IMAP_PASSWORD")

    def __init__(self, env: dict | None = None) -> None:
        self.env = env or os.environ

    def ready(self) -> bool:
        return all(self.env.get(name) for name in self.REQUIRED_ENV)

    def candidate_from_message(
        self,
        subject: str,
        sender: str,
        snippet: str,
        message_id: str | None = None,
        consent_full_content: bool = False,
        body: str | None = None,
        device_privacy_flag: bool = False,
    ) -> dict:
        safe_subject = self._compact(subject)
        safe_sender = self._compact(sender)
        safe_snippet = self._compact(snippet, limit=280)
        content = body if consent_full_content and body else f"From: {safe_sender}\nSubject: {safe_subject}\nSnippet: {safe_snippet}"
        candidate = MailCandidate(
            source="gmail",
            input=content,
            consent_full_content=bool(consent_full_content and body),
            device_privacy_flag=device_privacy_flag,
            metadata={
                "message_id": message_id,
                "subject_present": bool(safe_subject),
                "sender_present": bool(safe_sender),
                "body_included": bool(consent_full_content and body),
            },
        )
        return candidate.to_intake()

    def fetch_candidates(self, limit: int = 10) -> list[dict]:
        """Return candidate payloads when a host process wires IMAP access.

        This repository keeps the connector deterministic and dependency-light.
        Production workers can call `candidate_from_message` after reading mail
        through their approved Gmail or IMAP client.
        """

        if not self.ready():
            return []
        return []

    def batch_from_headers(self, messages: Iterable[dict]) -> list[dict]:
        return [
            self.candidate_from_message(
                subject=str(message.get("subject", "")),
                sender=str(message.get("sender", "")),
                snippet=str(message.get("snippet", "")),
                message_id=message.get("message_id"),
                consent_full_content=bool(message.get("consent_full_content", False)),
                body=message.get("body"),
                device_privacy_flag=bool(message.get("device_privacy_flag", False)),
            )
            for message in messages
        ]

    def _compact(self, value: str, limit: int = 160) -> str:
        compact = " ".join(value.split())
        return compact[:limit]
