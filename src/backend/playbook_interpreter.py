"""Playbook interpreter for one-action decision flows."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Literal

ActionKind = Literal["reply", "schedule", "resolve", "escalate"]
ALLOWED_ACTIONS = {"reply", "schedule", "resolve", "escalate"}


class PlaybookError(ValueError):
    pass


def load_playbook(path: str | Path) -> dict[str, Any]:
    with Path(path).open("r", encoding="utf-8") as handle:
        playbook = json.load(handle)
    validate_playbook(playbook)
    return playbook


def validate_playbook(playbook: dict[str, Any]) -> None:
    required = {"playbook_id", "title", "description", "version", "triggers", "decision_tree", "actions", "verification", "audit"}
    missing = sorted(required - set(playbook))
    if missing:
        raise PlaybookError(f"Missing playbook fields: {', '.join(missing)}")

    nodes = playbook.get("decision_tree", {}).get("nodes", [])
    if not nodes:
        raise PlaybookError("Playbook must contain at least one decision node.")

    for node in nodes:
        action = node.get("action")
        if action not in ALLOWED_ACTIONS:
            raise PlaybookError(f"Unsupported action: {action}")


def decide_action(playbook: dict[str, Any], signal: dict[str, Any]) -> ActionKind:
    validate_playbook(playbook)
    requested = signal.get("recommended_action") or signal.get("required_action")
    nodes = playbook["decision_tree"]["nodes"]

    for node in nodes:
        if node.get("action") == requested:
            return node["action"]

    return nodes[0]["action"]


def load_seed_playbooks(seed_dir: str | Path = "playbooks/seed") -> list[dict[str, Any]]:
    return [load_playbook(path) for path in sorted(Path(seed_dir).glob("*.json"))]
