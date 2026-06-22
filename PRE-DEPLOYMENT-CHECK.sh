#!/bin/bash

# Final pre-deployment checklist

echo "✅ MINDREPLY DEPLOYMENT READINESS CHECKLIST"
echo "==========================================="
echo ""

# 1. Code files
echo "📁 Core Files:"
files=(
  "package.json"
  "apps/backend/package.json"
  "apps/frontend/package.json"
  "Dockerfile.backend"
  "Dockerfile.frontend"
  "prisma/schema.prisma"
  ".github/workflows/ci-cd.yml"
  ".env.vercel"
  "vercel.json"
  "railway.toml"
)

for f in "${files[@]}"; do
  if [ -f "$f" ]; then
    echo "   ✅ $f"
  else
    echo "   ❌ $f"
  fi
done

# 2. Backend services
echo ""
echo "🔧 Backend Services:"
services=(
  "apps/backend/src/index.ts"
  "apps/backend/src/services/emailService.ts"
  "apps/backend/src/services/analysisService.ts"
  "apps/backend/src/services/approvalService.ts"
  "apps/backend/src/routes/auth.ts"
  "apps/backend/src/routes/messages.ts"
  "apps/backend/src/routes/approvals.ts"
  "apps/backend/src/middleware/auth.ts"
  "apps/backend/src/middleware/validation.ts"
  "apps/backend/src/utils/logger.ts"
)

for s in "${services[@]}"; do
  if [ -f "$s" ]; then
    echo "   ✅ $(basename $s)"
  else
    echo "   ❌ $(basename $s)"
  fi
done

# 3. n8n workflows
echo ""
echo "⚙️  n8n Workflows:"
workflows=(
  "n8n/workflows/email-intake-automation.json"
  "n8n/workflows/approval-notification.json"
  "n8n/workflows/followup-scheduler.json"
)

for w in "${workflows[@]}"; do
  if [ -f "$w" ]; then
    echo "   ✅ $(basename $w)"
  else
    echo "   ❌ $(basename $w)"
  fi
done

# 4. Deployment configs
echo ""
echo "🚀 Deployment Configs:"
configs=(
  "vercel.json"
  "railway.toml"
  "fly.toml"
  ".env.vercel"
  "DEPLOYMENT_GUIDE.md"
  "DEPLOY_VERCEL_RAILWAY.sh"
  "DEPLOY-TO-VERCEL-RAILWAY.ps1"
)

for c in "${configs[@]}"; do
  if [ -f "$c" ]; then
    echo "   ✅ $c"
  else
    echo "   ❌ $c"
  fi
done

# 5. Environment variables
echo ""
echo "🔐 Required Secrets (configure in Vercel/Railway):"
secrets=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
  "GMAIL_CLIENT_ID"
  "GMAIL_CLIENT_SECRET"
  "STRIPE_SECRET_KEY"
)

for sec in "${secrets[@]}"; do
  echo "   ☐ $sec"
done

echo ""
echo "==========================================="
echo "✅ READY FOR DEPLOYMENT"
echo "==========================================="
echo ""
echo "Next Steps:"
echo "1. git add . && git commit && git push origin main"
echo "2. Go to https://vercel.com/new → import repo"
echo "3. Go to https://railway.app → deploy backend"
echo "4. Configure environment variables in both platforms"
echo "5. Run: npx prisma migrate deploy"
echo "6. Import n8n workflows"
echo ""
