#!/usr/bin/env pwsh

# Windows PowerShell deployment to Vercel + Railway

Write-Host "🚀 MindReply Deployment: GitHub → Vercel + Railway" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Git
Write-Host "📦 Step 1: Checking Git status..." -ForegroundColor Yellow
git status

# Step 2: Add changes
Write-Host ""
Write-Host "📝 Step 2: Staging changes..." -ForegroundColor Yellow
git add .
git commit -m "feat: production deployment - Vercel + Railway + n8n" -ErrorAction SilentlyContinue
Write-Host "✅ Changes staged" -ForegroundColor Green

# Step 3: Push to GitHub
Write-Host ""
Write-Host "📤 Step 3: Pushing to GitHub main..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

# Step 4: Vercel setup instructions
Write-Host ""
Write-Host "🎨 Step 4: Vercel Frontend Setup" -ForegroundColor Yellow
Write-Host "   1. Go to https://vercel.com/new" -ForegroundColor Cyan
Write-Host "   2. Import GitHub repo: Mind-Reply/MindReply" -ForegroundColor Cyan
Write-Host "   3. Framework: Next.js (auto-detected)" -ForegroundColor Cyan
Write-Host "   4. Build Settings:" -ForegroundColor Cyan
Write-Host "      - Build Command: npm run build" -ForegroundColor Cyan
Write-Host "      - Output Directory: .next" -ForegroundColor Cyan
Write-Host "   5. Environment Variables:" -ForegroundColor Cyan
Write-Host "      NEXT_PUBLIC_API_URL=https://api.railway.app" -ForegroundColor Cyan
Write-Host "   6. Deploy!" -ForegroundColor Cyan

# Step 5: Railway setup instructions
Write-Host ""
Write-Host "🔧 Step 5: Railway Backend Setup" -ForegroundColor Yellow
Write-Host "   1. Go to https://railway.app" -ForegroundColor Cyan
Write-Host "   2. New Project → Deploy from GitHub" -ForegroundColor Cyan
Write-Host "   3. Select: Mind-Reply/MindReply" -ForegroundColor Cyan
Write-Host "   4. Service Settings:" -ForegroundColor Cyan
Write-Host "      - Dockerfile: ./Dockerfile.backend" -ForegroundColor Cyan
Write-Host "      - Port: 3001" -ForegroundColor Cyan
Write-Host "   5. Add Environment Variables (from .env.vercel)" -ForegroundColor Cyan
Write-Host "   6. Deploy!" -ForegroundColor Cyan

# Step 6: Database setup
Write-Host ""
Write-Host "🗄️  Step 6: Database Setup" -ForegroundColor Yellow
Write-Host "   Option A: Railway → New Service → PostgreSQL 15" -ForegroundColor Cyan
Write-Host "   Option B: Neon.tech (serverless postgres)" -ForegroundColor Cyan
Write-Host "   Option C: AWS RDS / GCP Cloud SQL" -ForegroundColor Cyan
Write-Host "   Copy CONNECTION STRING to DATABASE_URL" -ForegroundColor Cyan

# Step 7: Redis setup
Write-Host ""
Write-Host "💾 Step 7: Redis Cache" -ForegroundColor Yellow
Write-Host "   Option A: Railway → New Service → Redis 7" -ForegroundColor Cyan
Write-Host "   Option B: Upstash (serverless redis)" -ForegroundColor Cyan
Write-Host "   Copy URL to REDIS_URL" -ForegroundColor Cyan

# Step 8: n8n setup
Write-Host ""
Write-Host "⚙️  Step 8: n8n Automation" -ForegroundColor Yellow
Write-Host "   Option A: Railway → New Service → n8n" -ForegroundColor Cyan
Write-Host "   Option B: n8n.cloud (managed)" -ForegroundColor Cyan
Write-Host "   Upload workflows from ./n8n/workflows/" -ForegroundColor Cyan

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT CHECKLIST" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "☐ Push to GitHub main" -ForegroundColor Cyan
Write-Host "☐ Vercel: Import from GitHub & deploy frontend" -ForegroundColor Cyan
Write-Host "☐ Railway: Connect GitHub & deploy backend" -ForegroundColor Cyan
Write-Host "☐ Railway: Add PostgreSQL service" -ForegroundColor Cyan
Write-Host "☐ Railway: Add Redis service" -ForegroundColor Cyan
Write-Host "☐ Railway: Add all environment variables" -ForegroundColor Cyan
Write-Host "☐ Run: npx prisma migrate deploy" -ForegroundColor Cyan
Write-Host "☐ Verify: Backend health check (/health)" -ForegroundColor Cyan
Write-Host "☐ Verify: Frontend loads" -ForegroundColor Cyan
Write-Host "☐ Setup: n8n workflows (email-intake, approvals, follow-ups)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 URLs After Deployment:" -ForegroundColor Yellow
Write-Host "   Frontend: https://mindreply.vercel.app" -ForegroundColor Cyan
Write-Host "   Backend:  https://mindreply-backend.up.railway.app" -ForegroundColor Cyan
Write-Host "   API:      https://mindreply-backend.up.railway.app/api" -ForegroundColor Cyan
Write-Host ""
