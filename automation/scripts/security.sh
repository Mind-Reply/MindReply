#!/usr/bin/env bash
set -euo pipefail

corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
pnpm audit --audit-level high

echo "Scanning tracked files for committed environment files..."
if git ls-files | grep -E '(^|/)\.env(\.|$)' >/dev/null; then
  echo "Committed environment file detected"
  git ls-files | grep -E '(^|/)\.env(\.|$)'
  exit 1
fi

echo "Security checks completed."
