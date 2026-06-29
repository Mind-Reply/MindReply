#!/usr/bin/env bash
set -euo pipefail

corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
pnpm build

if [ -n "${VERCEL_TOKEN:-}" ]; then
  echo "Vercel token detected - deployment should be handled via Vercel CLI or GitHub integration"
else
  echo "WARNING: VERCEL_TOKEN not set. Skipping automated deployment."
fi

echo "Build complete. Use CI/CD pipeline or Vercel dashboard for deployment."
