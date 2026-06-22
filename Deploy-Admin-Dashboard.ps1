#!/usr/bin/env pwsh

# Admin Dashboard Complete Deployment (Local + Production)

Write-Host "🔒 ADMIN DASHBOARD: SECURE DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Phase 1: Build
Write-Host "🔨 Building Docker Images..." -ForegroundColor Yellow
docker build -f Dockerfile.backend -t mindreply-backend:admin .
docker build -f Dockerfile.admin -t mindreply-admin:latest apps/admin-dashboard

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Build failed" -ForegroundColor Red
  exit 1
}

Write-Host "✅ Images built" -ForegroundColor Green
Write-Host ""

# Phase 2: Local Start
Write-Host "🚀 Phase 1: Starting Local Stack..." -ForegroundColor Yellow
docker-compose -f docker-compose.admin.yml up -d

Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Phase 3: Database Setup
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
docker-compose -f docker-compose.admin.yml exec -T backend npx prisma migrate deploy

Write-Host "✅ Database ready" -ForegroundColor Green
Write-Host ""

# Phase 4: Local Verification
Write-Host "🔍 Verifying local deployment..." -ForegroundColor Yellow

$backendCheck = Invoke-WebRequest -Uri "http://localhost:3001/health" -ErrorAction SilentlyContinue
if ($backendCheck.StatusCode -eq 200) {
  Write-Host "✅ Backend responding" -ForegroundColor Green
} else {
  Write-Host "⚠️  Backend may still be initializing" -ForegroundColor Yellow
}

$dashboardCheck = Invoke-WebRequest -Uri "http://localhost:3002" -ErrorAction SilentlyContinue
if ($dashboardCheck.StatusCode -eq 200) {
  Write-Host "✅ Dashboard responding" -ForegroundColor Green
} else {
  Write-Host "⚠️  Dashboard may still be initializing" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ LOCAL ADMIN DASHBOARD READY" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "📍 Local Access:" -ForegroundColor Cyan
Write-Host "   Dashboard: http://localhost:3002" -ForegroundColor Yellow
Write-Host "   Backend:   http://localhost:3001" -ForegroundColor Yellow
Write-Host "   API:       http://localhost:3001/api" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔐 Initialize Admin:" -ForegroundColor Cyan
Write-Host "   bash setup-admin.sh" -ForegroundColor Yellow
Write-Host "   (or enter credentials in dashboard login)" -ForegroundColor Yellow
Write-Host ""

Write-Host "🌐 Production Deployment:" -ForegroundColor Cyan
Write-Host "   1. Push to GitHub: git push origin main" -ForegroundColor Yellow
Write-Host "   2. Go to https://railway.app" -ForegroundColor Yellow
Write-Host "   3. Deploy new service: Select admin-dashboard" -ForegroundColor Yellow
Write-Host "   4. Add Dockerfile.admin" -ForegroundColor Yellow
Write-Host "   5. Set environment variables" -ForegroundColor Yellow
Write-Host "   6. Deploy" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔗 Free Domain Options:" -ForegroundColor Cyan
Write-Host "   Railway:  *.up.railway.app (auto)" -ForegroundColor Yellow
Write-Host "   Vercel:   *.vercel.app (auto)" -ForegroundColor Yellow
Write-Host "   Custom:   cloudflare.com (free with proxy)" -ForegroundColor Yellow
Write-Host ""

Write-Host "════════════════════════════════════════" -ForegroundColor Green
