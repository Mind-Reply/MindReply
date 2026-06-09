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
from src.backend.owner_export import prepare_owner_mail_export
from src.backend.owner_security import prepare_owner_decision
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

    def test_owner_export_requires_consent_and_stays_redacted(self) -> None:
        blocked = prepare_owner_decision(
            "owner@example.com",
            "Client risk requires owner review.",
            "escalate",
            consent_granted=False,
        )
        self.assertFalse(blocked["export_allowed"])

        allowed = prepare_owner_decision(
            "owner@example.com",
            "Client risk requires owner review.",
            "escalate",
            consent_granted=True,
            redaction_level="partial",
        )
        export = prepare_owner_mail_export(allowed, receipt_id="receipt-1")

        self.assertTrue(allowed["export_allowed"])
        self.assertEqual(export["to"], "owner@example.com")
        self.assertEqual(export["recommended_action"], "escalate")
        self.assertIn("Raw content is excluded", export["body"])

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

    def test_hourly_owner_report_contract_is_wired(self) -> None:
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        workflow = (ROOT / ".github" / "workflows" / "hourly-owner-report.yml").read_text(encoding="utf-8")
        prompt = (ROOT / "docs" / "hourly_owner_goal_prompt.md").read_text(encoding="utf-8")

        self.assertIn('cron: "0 * * * *"', workflow)
        self.assertIn("ANGELLLKR@GMAIL.COM", workflow)
        self.assertIn("MINDREPLY_SLACK_WEBHOOK_URL", workflow)
        self.assertIn("SLACK_WEBHOOK_URL", workflow)
        self.assertIn("RESEND_API_KEY", workflow)

        for script in ("report:check", "launch:report", "audit:blueprint", "report:send"):
            self.assertIn(script, package["scripts"])
            self.assertIn(f"npm run {script}", workflow)

        self.assertIn("Website Completion Package", prompt)
        self.assertIn("Revenue-first", prompt)
        self.assertIn("redacted", prompt)
        self.assertIn("No public page may claim active internal staff count", prompt)


if __name__ == "__main__":
    unittest.main()
