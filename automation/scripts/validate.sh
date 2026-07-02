#!/usr/bin/env bash
set -euo pipefail

corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
pnpm lint
pnpm type-check
pnpm build
