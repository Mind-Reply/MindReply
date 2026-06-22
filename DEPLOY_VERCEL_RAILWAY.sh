#!/bin/bash

# Deploy to Vercel + Railway (Backend) + n8n Automation

set -e

echo "🚀 MindReply: GitHub → Vercel + Railway Deployment"
echo "=================================================="

# 1. Git operations
echo ""
echo "📦 Step 1: Pushing to GitHub..."
git add .
git commit -m "feat: production deployment infrastructure - Vercel + Railway + n8n" || true
git push origin main

echo "✅ Pushed to GitHub main branch"

# 2. Vercel Frontend Deployment
echo ""
echo "🎨 Step 2: Deploying Frontend to Vercel..."
echo "   Visit: https://vercel.com/new"
echo "   Select GitHub repository: Mind-Reply/MindReply"
echo "   Framework: Next.js"
echo "   Install Command: npm install"
echo "   Build Command: npm run build"
echo "   Output Directory: .next"
echo "   Environment Variables: Add from .env.vercel"

# 3. Railway Backend Deployment
echo ""
echo "🔧 Step 3: Deploying Backend to Railway..."
echo "   Visit: https://railway.app"
echo "   New Project → GitHub repo → Deploy"
echo "   Service: Backend"
echo "   Dockerfile: ./Dockerfile.backend"
echo "   Environment: Add secrets from .env.vercel"

# 4. n8n Deployment
echo ""
echo "⚙️  Step 4: Setting up n8n Automation..."
echo "   Option A: Railway Service (n8n image)"
echo "   Option B: n8n Cloud (https://n8n.cloud)"
echo "   Option C: Self-hosted (Docker)"

# 5. Database Setup
echo ""
echo "🗄️  Step 5: Database Setup..."
echo "   Create PostgreSQL instance:"
echo "   - Railway Postgres service, OR"
echo "   - Neon.tech (serverless), OR"
echo "   - AWS RDS"
echo "   Copy DATABASE_URL to environment variables"

# 6. Redis Setup
echo ""
echo "💾 Step 6: Redis Cache..."
echo "   - Railway Redis service, OR"
echo "   - Upstash (serverless)"

# 7. Secrets Configuration
echo ""
echo "🔐 Step 7: Configure Secrets..."
echo "   In each deployment platform:"
for secret in DATABASE_URL REDIS_URL JWT_SECRET OPENAI_API_KEY ANTHROPIC_API_KEY GMAIL_CLIENT_ID GMAIL_CLIENT_SECRET STRIPE_SECRET_KEY SENTRY_DSN N8N_ENCRYPTION_KEY; do
  echo "   ✓ $secret"
done

echo ""
echo "📋 Step 8: Run Migrations..."
echo "   After database created, run:"
echo "   npx prisma migrate deploy"

echo ""
echo "=================================="
echo "✅ DEPLOYMENT GUIDE COMPLETE"
echo "=================================="
echo ""
echo "Next Actions:"
echo "1. Push to GitHub: git push origin main"
echo "2. Connect Vercel: https://vercel.com/new"
echo "3. Connect Railway: https://railway.app"
echo "4. Add environment variables to each platform"
echo "5. Run database migrations"
echo "6. Verify deployments:"
echo "   - Frontend: https://yourdomain.vercel.app"
echo "   - Backend: https://api.railway.app/health"
echo ""
