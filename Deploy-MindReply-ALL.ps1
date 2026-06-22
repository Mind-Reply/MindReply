#!/usr/bin/env pwsh

# ============================================================
# MindReply: Automated Deployment to GitHub + Vercel + Railway
# ============================================================
# This script does EVERYTHING in one command
# ============================================================

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$RailwayToken = $env:RAILWAY_TOKEN,
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [string]$RedisUrl = $env:REDIS_URL,
    [string]$JwtSecret = $env:JWT_SECRET,
    [string]$OpenaiKey = $env:OPENAI_API_KEY,
    [string]$AnthropicKey = $env:ANTHROPIC_API_KEY,
    [string]$GmailClientId = $env:GMAIL_CLIENT_ID,
    [string]$GmailClientSecret = $env:GMAIL_CLIENT_SECRET,
    [string]$StripeKey = $env:STRIPE_SECRET_KEY
)

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 MindReply: AUTOMATED DEPLOYMENT" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# PHASE 1: VALIDATION
# ============================================================
Write-Host "📋 PHASE 1: Validation" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$requiredFiles = @(
    "package.json",
    "apps/backend/package.json",
    "apps/frontend/package.json",
    "Dockerfile.backend",
    "Dockerfile.frontend",
    "prisma/schema.prisma",
    ".github/workflows/ci-cd.yml",
    "vercel.json",
    "railway.toml"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (MISSING)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Required files missing!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All files present" -ForegroundColor Green

# ============================================================
# PHASE 2: ENVIRONMENT SETUP
# ============================================================
Write-Host ""
Write-Host "🔧 PHASE 2: Environment Configuration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$requiredSecrets = @(
    "DATABASE_URL",
    "REDIS_URL",
    "JWT_SECRET",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    "STRIPE_SECRET_KEY"
)

$missingSecrets = @()
foreach ($secret in $requiredSecrets) {
    $value = Get-Variable -Name $secret -ValueOnly -ErrorAction SilentlyContinue
    if ($value) {
        Write-Host "✅ $secret" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $secret (will prompt or use environment)" -ForegroundColor Yellow
        $missingSecrets += $secret
    }
}

# Prompt for missing secrets
if ($missingSecrets.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing secrets. Enter values (or press Enter to skip):" -ForegroundColor Yellow
    foreach ($secret in $missingSecrets) {
        $prompt = Read-Host "Enter $secret (or press Enter to skip)"
        if ($prompt) {
            Set-Variable -Name $secret -Value $prompt
        }
    }
}

# ============================================================
# PHASE 3: GIT OPERATIONS
# ============================================================
Write-Host ""
Write-Host "📤 PHASE 3: Git Operations (Push to GitHub)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "Checking git status..." -ForegroundColor Cyan
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "Changes detected:"
    Write-Host $gitStatus
    Write-Host ""
    Write-Host "Staging all changes..." -ForegroundColor Cyan
    git add .
    
    Write-Host "Committing..." -ForegroundColor Cyan
    git commit -m "🚀 feat: automated production deployment - MindReply v1.0" -ErrorAction SilentlyContinue
} else {
    Write-Host "No changes to commit" -ForegroundColor Green
}

Write-Host ""
Write-Host "Pushing to GitHub main branch..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ Git push failed" -ForegroundColor Red
    exit 1
}

# ============================================================
# PHASE 4: VERCEL DEPLOYMENT (FRONTEND)
# ============================================================
Write-Host ""
Write-Host "🎨 PHASE 4: Vercel Frontend Deployment" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($VercelToken) {
    Write-Host "Vercel token detected. Installing CLI..." -ForegroundColor Cyan
    npm install -g vercel
    
    Write-Host "Linking to Vercel project..." -ForegroundColor Cyan
    $env:VERCEL_TOKEN = $VercelToken
    vercel link --confirm
    
    Write-Host "Setting environment variables..." -ForegroundColor Cyan
    $backendUrl = "https://mindreply-backend.up.railway.app"
    vercel env add NEXT_PUBLIC_API_URL $backendUrl production
    
    Write-Host "Deploying to production..." -ForegroundColor Cyan
    vercel --prod
    Write-Host "✅ Vercel deployment initiated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vercel token not provided. Manual setup required:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://vercel.com/new" -ForegroundColor Cyan
    Write-Host "   2. Import GitHub repo: Mind-Reply/MindReply" -ForegroundColor Cyan
    Write-Host "   3. Set environment: NEXT_PUBLIC_API_URL=https://mindreply-backend.up.railway.app" -ForegroundColor Cyan
    Write-Host "   4. Deploy" -ForegroundColor Cyan
}

# ============================================================
# PHASE 5: RAILWAY DEPLOYMENT (BACKEND)
# ============================================================
Write-Host ""
Write-Host "🔧 PHASE 5: Railway Backend Deployment" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($RailwayToken) {
    Write-Host "Railway token detected. Installing CLI..." -ForegroundColor Cyan
    npm install -g @railway/cli
    
    Write-Host "Authenticating with Railway..." -ForegroundColor Cyan
    $env:RAILWAY_TOKEN = $RailwayToken
    
    Write-Host "Creating/linking Railway project..." -ForegroundColor Cyan
    railway link
    
    Write-Host "Adding environment variables to Railway..." -ForegroundColor Cyan
    railway variables set `
        DATABASE_URL=$DatabaseUrl `
        REDIS_URL=$RedisUrl `
        JWT_SECRET=$JwtSecret `
        OPENAI_API_KEY=$OpenaiKey `
        ANTHROPIC_API_KEY=$AnthropicKey `
        GMAIL_CLIENT_ID=$GmailClientId `
        GMAIL_CLIENT_SECRET=$GmailClientSecret `
        STRIPE_SECRET_KEY=$StripeKey `
        NODE_ENV=production
    
    Write-Host "Deploying to Railway..." -ForegroundColor Cyan
    railway up
    Write-Host "✅ Railway deployment initiated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Railway token not provided. Manual setup required:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://railway.app" -ForegroundColor Cyan
    Write-Host "   2. New Project → Deploy from GitHub" -ForegroundColor Cyan
    Write-Host "   3. Select repo: Mind-Reply/MindReply" -ForegroundColor Cyan
    Write-Host "   4. Add PostgreSQL 15 service" -ForegroundColor Cyan
    Write-Host "   5. Add Redis 7 service" -ForegroundColor Cyan
    Write-Host "   6. Set environment variables (see .env.vercel)" -ForegroundColor Cyan
    Write-Host "   7. Deploy" -ForegroundColor Cyan
}

# ============================================================
# PHASE 6: DATABASE MIGRATIONS
# ============================================================
Write-Host ""
Write-Host "🗄️  PHASE 6: Database Setup" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($DatabaseUrl) {
    Write-Host "Database URL provided. Running migrations..." -ForegroundColor Cyan
    $env:DATABASE_URL = $DatabaseUrl
    
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    
    Write-Host "Generating Prisma client..." -ForegroundColor Cyan
    npx prisma generate
    
    Write-Host "Running migrations..." -ForegroundColor Cyan
    npx prisma migrate deploy
    Write-Host "✅ Migrations complete" -ForegroundColor Green
} else {
    Write-Host "⚠️  DATABASE_URL not set. Migrations will run in deployment." -ForegroundColor Yellow
}

# ============================================================
# PHASE 7: HEALTH CHECKS
# ============================================================
Write-Host ""
Write-Host "🔍 PHASE 7: Verification" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "Waiting 30 seconds for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host "Checking backend health..." -ForegroundColor Cyan
try {
    $backendHealth = Invoke-WebRequest -Uri "https://mindreply-backend.up.railway.app/health" -ErrorAction SilentlyContinue
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend health check failed (may still be initializing)" -ForegroundColor Yellow
}

Write-Host "Checking frontend..." -ForegroundColor Cyan
try {
    $frontendHealth = Invoke-WebRequest -Uri "https://mindreply.vercel.app" -ErrorAction SilentlyContinue
    if ($frontendHealth.StatusCode -eq 200) {
        Write-Host "✅ Frontend is live" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend check failed (may still be deploying)" -ForegroundColor Yellow
}

# ============================================================
# PHASE 8: SUMMARY
# ============================================================
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  https://mindreply.vercel.app" -ForegroundColor Yellow
Write-Host "   Backend:   https://mindreply-backend.up.railway.app" -ForegroundColor Yellow
Write-Host "   API:       https://mindreply-backend.up.railway.app/api" -ForegroundColor Yellow
Write-Host "   Health:    https://mindreply-backend.up.railway.app/health" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Import n8n workflows from ./n8n/workflows/" -ForegroundColor Yellow
Write-Host "   2. Configure webhook integrations" -ForegroundColor Yellow
Write-Host "   3. Test API endpoints" -ForegroundColor Yellow
Write-Host "   4. Monitor logs in Vercel/Railway dashboards" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔗 Dashboards:" -ForegroundColor Cyan
Write-Host "   Vercel:    https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "   Railway:   https://railway.app" -ForegroundColor Yellow
Write-Host "   GitHub:    https://github.com/Mind-Reply/MindReply" -ForegroundColor Yellow
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Green
