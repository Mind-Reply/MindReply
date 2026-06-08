import json
import re
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.backend.audit_log import create_receipt
from src.backend.followup_engine import plan_follow_up
from src.backend.memory_store import recent, remember
from src.backend.playbook_interpreter import ALLOWED_ACTIONS, decide_action, load_seed_playbooks, validate_playbook
from src.backend.reply_engine import prepare_reply
from src.backend.risk_engine import assess_risk
from src.backend.triage_engine import triage
from src.integrations.calendar_connector import schedule_hold
from src.integrations.gmail_connector import normalize_snippet


BLOCKED_TERMS = (
    "a" + "i",
    "chat" + "bot",
    "produc" + "tivity",
    "auto" + "mation",
    "opt" + "ions",
    "bo" + "ost",
    "ha" + "ck",
)
TEXT_TARGETS = ("app", "src", "site", "docs", "playbooks")


class ExecutiveNervousSystemTests(unittest.TestCase):
    def test_triage_reply_risk_memory_one_action(self) -> None:
        result = triage("Urgent client deadline today.", device_privacy_flag=True)
        risk = assess_risk(result["synthesis"])
        reply = prepare_reply(result["synthesis"], risk_level=risk["risk_level"])

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "memory.jsonl"
            memory = remember(result["synthesis"], result["recommended_action"], "raw text", path)
            retained = recent(path, limit=1)

        self.assertIn(result["recommended_action"], ALLOWED_ACTIONS)
        self.assertIn("synthesis", result)
        self.assertIn(reply["recommended_action"], ALLOWED_ACTIONS)
        self.assertIn(risk["risk_level"], {"low", "medium", "high"})
        self.assertEqual(memory.recommended_action, result["recommended_action"])
        self.assertEqual(retained[0].signal_hash, memory.signal_hash)

    def test_followup_and_connectors_return_single_prepared_action(self) -> None:
        followup = plan_follow_up("Deadline remains unresolved")
        mailbox = normalize_snippet("m-1", "sender@example.com", "Timeline", "Please reply today.")
        calendar = schedule_hold("Review client note")

        self.assertEqual(followup["recommended_action"], "schedule")
        self.assertEqual(mailbox["message_id"], "m-1")
        self.assertEqual(calendar["status"], "prepared")

    def test_seed_playbooks_match_action_contract(self) -> None:
        schema = json.loads((ROOT / "playbooks" / "schema.json").read_text(encoding="utf-8"))
        schema_actions = set(
            schema["properties"]["decision_tree"]["properties"]["nodes"]["items"]["properties"]["action"]["enum"]
        )
        self.assertEqual(schema_actions, ALLOWED_ACTIONS)

        playbooks = load_seed_playbooks(ROOT / "playbooks" / "seed")
        self.assertEqual(len(playbooks), 12)
        for playbook in playbooks:
            validate_playbook(playbook)
            action = playbook["decision_tree"]["nodes"][0]["action"]
            self.assertEqual(decide_action(playbook, {"required_action": action}), action)

    def test_audit_receipt_is_signed_and_redacted(self) -> None:
        result = triage("Legal claim mentioned in a client note.")
        receipt = create_receipt(
            playbook_id=result.get("playbook_id", "manual"),
            playbook_version="0.1.0",
            synthesis=result["synthesis"],
            recommended_action=result["recommended_action"],
            rationale="Risk review required.",
        )

        self.assertEqual(receipt["recommended_action"], "escalate")
        self.assertEqual(receipt["redaction_level"], "full")
        self.assertEqual(len(receipt["signatures"]), 1)
        self.assertNotIn("raw_input", receipt)

    def test_blocked_terms_are_absent_from_product_sources(self) -> None:
        scanned = []
        for folder in TEXT_TARGETS:
            for path in (ROOT / folder).rglob("*"):
                if path.is_file() and path.suffix.lower() in {".ts", ".tsx", ".css", ".py", ".md", ".html", ".yml", ".json", ".js"}:
                    scanned.append(path)
                    text = path.read_text(encoding="utf-8")
                    for term in BLOCKED_TERMS:
                        with self.subTest(path=path, term=term):
                            self.assertIsNone(re.search(rf"\b{re.escape(term)}\b", text, flags=re.IGNORECASE))

        self.assertGreater(len(scanned), 0)


if __name__ == "__main__":
    unittest.main()
