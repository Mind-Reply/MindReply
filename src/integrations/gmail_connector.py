"""Gmail and IMAP connector for consent-first message intake."""

from __future__ import annotations

import email
import imaplib
from dataclasses import asdict, dataclass
from email.message import Message


@dataclass(frozen=True)
class MailboxConfig:
    host: str
    port: int
    username: str
    password: str
    folder: str = "INBOX"
    use_ssl: bool = True


@dataclass(frozen=True)
class MessageSnippet:
    message_id: str
    sender: str
    subject: str
    snippet: str
    consent_granted: bool = False


def normalize_snippet(message_id: str, sender: str, subject: str, snippet: str) -> dict[str, object]:
    return asdict(
        MessageSnippet(
            message_id=message_id,
            sender=sender,
            subject=subject,
            snippet=" ".join(snippet.split())[:280],
        )
    )


def consent_card(message_id: str) -> dict[str, str]:
    return {
        "message_id": message_id,
        "title": "Proceed when ready.",
        "body": "MindReply can work from sender, subject, and snippet. Full message access requires explicit consent.",
    }


def _message_snippet(message: Message) -> str:
    if message.is_multipart():
        for part in message.walk():
            if part.get_content_type() == "text/plain":
                payload = part.get_payload(decode=True) or b""
                return payload.decode(part.get_content_charset() or "utf-8", errors="replace")
    payload = message.get_payload(decode=True)
    if isinstance(payload, bytes):
        return payload.decode(message.get_content_charset() or "utf-8", errors="replace")
    return str(message.get_payload())


def fetch_latest_snippet(config: MailboxConfig) -> dict[str, object] | None:
    client_class = imaplib.IMAP4_SSL if config.use_ssl else imaplib.IMAP4
    with client_class(config.host, config.port) as client:
        client.login(config.username, config.password)
        client.select(config.folder, readonly=True)
        status, data = client.search(None, "ALL")
        if status != "OK" or not data or not data[0]:
            return None
        latest_id = data[0].split()[-1]
        status, fetched = client.fetch(latest_id, "(RFC822)")
        if status != "OK" or not fetched:
            return None
        raw = fetched[0][1]
        if not isinstance(raw, bytes):
            return None
        message = email.message_from_bytes(raw)
        return normalize_snippet(
            message_id=str(message.get("Message-ID", latest_id.decode("ascii", errors="ignore"))),
            sender=str(message.get("From", "")),
            subject=str(message.get("Subject", "")),
            snippet=_message_snippet(message),
        )
