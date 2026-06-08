"""Desktop local client entrypoint for private snippet triage."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from src.backend.triage_engine import triage  # noqa: E402


def main() -> int:
    raw_input = " ".join(sys.argv[1:]).strip() or " ".join(sys.stdin.read().split())
    result = triage(raw_input, device_privacy_flag=True)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
