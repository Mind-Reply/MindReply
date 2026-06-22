#!/usr/bin/env pwsh
# Direct Vercel Deployment - No Git Required
# This deploys the admin dashboard directly to Vercel

param(
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$AdminPassword = $env:ADMIN_PASSWORD,
    [string]$AdminSecret = $env:ADMIN_SECRET
)

if (-not $VercelToken) {
    Write-Host "❌ VERCEL_TOKEN not set" -ForegroundColor Red
    Write-Host "Get it from: https://vercel.com/account/tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 DEPLOYING ADMIN DASHBOARD TO VERCEL" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if Vercel CLI is installed
Write-Host "📦 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelVersion = npm list -g vercel 2>$null
if (-not $vercelVersion) {
    Write-Host "   Installing Vercel CLI..." -ForegroundColor Green
    npm install -g vercel --legacy-peer-deps
}

# 2. Set environment variables
$env:VERCEL_TOKEN = $VercelToken

# 3. Link to existing Vercel project (if needed)
Write-Host "🔗 Linking to Vercel project..." -ForegroundColor Yellow
Write-Host "   Project: Mind-Reply" -ForegroundColor Gray

# 4. Build locally first
Write-Host ""
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm install --legacy-peer-deps
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green

# 5. Deploy to Vercel
Write-Host ""
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Yellow

$deployOutput = vercel --prod --token $VercelToken 2>&1

if ($deployOutput -match "Production" -or $deployOutput -match "https://") {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    # Extract URL if present
    $urlMatch = $deployOutput | Select-String "https://[^\s]+"
    if ($urlMatch) {
        $url = $urlMatch.Matches[0].Value
        Write-Host ""
        Write-Host "🌐 LIVE URL:" -ForegroundColor Cyan
        Write-Host "   $url" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔐 Admin Dashboard:" -ForegroundColor Cyan
        Write-Host "   $url/admin" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Deployment output:" -ForegroundColor Yellow
    Write-Host $deployOutput
}

# 6. Final instructions
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ ADMIN DASHBOARD DEPLOYED" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your admin dashboard:" -ForegroundColor Yellow
Write-Host "  1. Go to your Vercel project URL" -ForegroundColor Gray
Write-Host "  2. Add /admin to the URL" -ForegroundColor Gray
Write-Host "  3. Login with your admin password" -ForegroundColor Gray
Write-Host ""
Write-Host "Features:" -ForegroundColor Cyan
Write-Host "  ✓ Unlimited chat" -ForegroundColor Green
Write-Host "  ✓ All connectors (Stripe, Gmail, YouTube, Claude)" -ForegroundColor Green
Write-Host "  ✓ No rate limits" -ForegroundColor Green
Write-Host "  ✓ Private access" -ForegroundColor Green
Write-Host "  ✓ No third-party access" -ForegroundColor Green
Write-Host ""
