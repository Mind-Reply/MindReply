#!/usr/bin/env pwsh
# Fix and redeploy admin dashboard

Write-Host "🔧 Fixing admin dashboard deployment..." -ForegroundColor Yellow

# Reinstall dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps --force

# Build
Write-Host "🔨 Building..." -ForegroundColor Green
npm run build

# Deploy
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Green
$vercelToken = $env:VERCEL_TOKEN
if ($vercelToken) {
  vercel --prod --token $vercelToken
  Write-Host "✅ Deployment triggered" -ForegroundColor Green
} else {
  Write-Host "❌ VERCEL_TOKEN not set" -ForegroundColor Red
  Write-Host "Set it: `$env:VERCEL_TOKEN = 'your-token'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Your admin dashboard: https://mindreply.vercel.app/admin" -ForegroundColor Cyan
Write-Host "⏱️  Check Vercel dashboard for deployment status" -ForegroundColor Yellow
