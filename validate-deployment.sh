#!/bin/bash

# Quick validation before deployment

echo "🔍 Pre-Deployment Validation"
echo "============================"
echo ""

# Check required files
FILES=(
  "package.json"
  "Dockerfile.frontend"
  "Dockerfile.backend"
  "prisma/schema.prisma"
  ".github/workflows/ci-cd.yml"
  "vercel.json"
  "railway.toml"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "Environment Variables Required:"
echo "================================"

VARS=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
  "GMAIL_CLIENT_ID"
  "GMAIL_CLIENT_SECRET"
  "STRIPE_SECRET_KEY"
)

for var in "${VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "⚠️  $var (not set - will be set in deployment platform)"
  else
    echo "✅ $var (configured)"
  fi
done

echo ""
echo "Git Status:"
echo "==========="
git status --short || echo "Not a git repo"

echo ""
echo "✅ Validation complete!"
echo ""
echo "Next: Run deployment script"
echo "   bash DEPLOY_VERCEL_RAILWAY.sh"
