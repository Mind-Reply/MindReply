import os
import tempfile
import unittest

from backend.audit_log import AuditLog
from backend.followup_engine import FollowUpEngine
from backend.memory_store import MemoryStore
from backend.playbook_interpreter import PlaybookInterpreter
from backend.reply_engine import ReplyEngine
from backend.risk_engine import RiskEngine
from backend.triage_engine import TriageEngine


class DecisionLayerTests(unittest.TestCase):
    def test_triage_returns_exact_numeric_contract(self):
        result = TriageEngine().classify(
            "A client replied that the fee is too high and they need a careful response today.",
            source="manual",
        )

        self.assertEqual(
            set(result.keys()),
            {"importance", "urgency", "required_action", "synthesis", "confidence", "playbook_id"},
        )
        self.assertEqual(result["required_action"], "reply")
        self.assertEqual(result["playbook_id"], "deal-close-assistant")
        self.assertIsInstance(result["importance"], int)
        self.assertIsInstance(result["urgency"], int)
        self.assertGreaterEqual(result["importance"], 0)
        self.assertLessEqual(result["importance"], 100)
        self.assertGreaterEqual(result["urgency"], 0)
        self.assertLessEqual(result["urgency"], 100)
        self.assertIn("synthesis", result)

    def test_reply_engine_returns_one_synthesis_and_one_action(self):
        triage = {
            "synthesis": "Client resistance is about price and trust.",
            "required_action": "reply",
            "importance": 72,
            "urgency": 51,
            "playbook_id": "deal-close-assistant",
        }

        result = ReplyEngine().draft("Client says the fee is too high.", triage)

        self.assertEqual(set(result.keys()), {"synthesis", "recommended_action"})
        self.assertEqual(result["recommended_action"]["kind"], "reply")
        self.assertEqual(set(result["recommended_action"].keys()), {"kind", "label", "payload"})
        self.assertNotIn("option", str(result).lower())

    def test_followup_engine_creates_single_calendar_payload(self):
        result = FollowUpEngine().schedule(
            {"synthesis": "The decision needs a quiet check-in.", "required_action": "schedule"},
            minutes_from_now=45,
        )

        self.assertEqual(result["recommended_action"]["kind"], "schedule")
        self.assertIn("next_check_timestamp", result)
        self.assertIn("starts_at", result["recommended_action"]["payload"])
        self.assertEqual(result["recommended_action"]["payload"]["duration_minutes"], 15)

    def test_risk_engine_escalates_high_risk_input(self):
        result = RiskEngine().assess(
            "Send a threat to pressure the client into paying today.",
            {"required_action": "reply"},
        )

        self.assertEqual(result["risk_level"], "high")
        self.assertEqual(result["level"], "high")
        self.assertTrue(result["escalate"])
        self.assertIn("owner", result["required_verification_roles"])

    def test_memory_store_derives_without_raw_input(self):
        store = MemoryStore()
        update = store.update(
            user_id="owner",
            raw_input="This exact private sentence must not be saved.",
            decision={"recommended_action": {"kind": "reply"}},
        )

        self.assertTrue(update["applied"])
        self.assertNotIn("This exact private sentence", str(store.export("owner")))

    def test_audit_log_writes_signed_hash_receipt(self):
        with tempfile.TemporaryDirectory() as directory:
            path = os.path.join(directory, "audit.jsonl")
            receipt = AuditLog(path).record(
                raw_input="Private client text.",
                source="manual",
                action_kind="reply",
                playbook_id="deal-close-assistant",
                playbook_version="1.0.0",
                synthesis="The client needs price reassurance without overexplaining.",
                redaction_level="derived-only",
            )

            self.assertIn("id", receipt)
            self.assertEqual(receipt["source"], "manual")
            self.assertEqual(receipt["playbook_id"], "deal-close-assistant")
            self.assertEqual(receipt["playbook_version"], "1.0.0")
            self.assertTrue(receipt["signatures"])
            with open(path, "r", encoding="utf-8") as handle:
                content = handle.read()
            self.assertIn("input_hash", content)
            self.assertIn("signatures", content)
            self.assertNotIn("Private client text.", content)

    def test_playbook_interpreter_loads_seed_playbooks(self):
        interpreter = PlaybookInterpreter()
        result = interpreter.select("The investor asks for the term sheet before Friday.")

        self.assertGreaterEqual(len(interpreter.playbooks), 12)
        self.assertEqual(
            set(result.keys()),
            {"playbook_id", "title", "recommended_action", "version"},
        )
        self.assertEqual(result["playbook_id"], "investor-ir-triage")
        self.assertIn(result["recommended_action"], {"reply", "schedule", "resolve", "escalate"})


if __name__ == "__main__":
    unittest.main()
