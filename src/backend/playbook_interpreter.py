"""Purpose: select one signed/versioned playbook for an intake.
Local test: python -m unittest discover src
"""

from __future__ import annotations

import json
from pathlib import Path


ACTIONS = {"reply", "schedule", "resolve", "escalate"}
REQUIRED_KEYS = {"playbook_id", "title", "description", "version", "triggers", "decision_tree", "actions", "verification", "audit"}


class PlaybookInterpreter:
    def __init__(self, seed_dir: str | None = None) -> None:
        root = Path(__file__).resolve().parents[2]
        self.seed_dir = Path(seed_dir) if seed_dir else root / "playbooks" / "seed"
        self.playbooks = self._load_playbooks()

    def select(self, raw_input: str) -> dict:
        lower = raw_input.lower()
        for playbook in self.playbooks:
            for trigger in playbook.get("triggers", []):
                pattern = str(trigger.get("pattern", "")).lower()
                if pattern and pattern in lower:
                    return self._result(playbook)
        return {
            "playbook_id": "clear-next-move",
            "title": "Clear next move",
            "recommended_action": "resolve",
            "version": "1.0",
        }

    def validate(self, playbook: dict) -> None:
        missing = REQUIRED_KEYS - set(playbook.keys())
        if missing:
            raise ValueError(f"Playbook missing keys: {sorted(missing)}")
        for node in playbook.get("decision_tree", {}).get("nodes", []):
            action = node.get("action")
            if action not in ACTIONS:
                raise ValueError(f"Invalid action: {action}")
        if not isinstance(playbook.get("audit", {}).get("signed"), bool):
            raise ValueError("Playbook audit.signed must be boolean")

    def _load_playbooks(self) -> list[dict]:
        if not self.seed_dir.exists():
            return []
        playbooks: list[dict] = []
        for path in sorted(self.seed_dir.glob("*.json")):
            with path.open("r", encoding="utf-8") as handle:
                playbook = json.load(handle)
            self.validate(playbook)
            playbooks.append(playbook)
        return playbooks

    def _result(self, playbook: dict) -> dict:
        first_node = playbook.get("decision_tree", {}).get("nodes", [{}])[0]
        return {
            "playbook_id": playbook["playbook_id"],
            "title": playbook["title"],
            "recommended_action": first_node.get("action", "resolve"),
            "version": playbook["version"],
        }
