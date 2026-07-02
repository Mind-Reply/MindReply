#!/usr/bin/env pwsh
# Windows PowerShell deployment script

param(
    [string]$GitHubToken = "",
    [string]$VercelToken = ""
)

Write-Host "🚀 MindReply GitHub + Vercel Deployment" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# 1. Git setup
Write-Host "`n📤 Setting up Git..." -ForegroundColor Yellow
git config user.email "deployment@mindreply.com"
git config user.name "MindReply Automation"

# 2. Initialize repo if needed
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
    git remote add origin "https://github.com/Mind-Reply/MindReply.git"
}

# 3. Add all files
Write-Host "📝 Adding files..." -ForegroundColor Green
git add -A

# 4. Commit
Write-Host "💾 Committing..." -ForegroundColor Green
git commit -m "feat: Docker + Kubernetes + CI/CD + Vercel deployment [automated]" -ErrorAction SilentlyContinue

# 5. Push to GitHub
Write-Host "📤 Pushing to GitHub main..." -ForegroundColor Green
git push -u origin main -f

Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
Write-Host "🔗 Repository: https://github.com/Mind-Reply/MindReply" -ForegroundColor Cyan

# 6. Deploy to Vercel
if ($VercelToken) {
    Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Yellow
    
    # Install Vercel CLI
    if (!(npm list -g vercel 2>$null)) {
        Write-Host "Installing Vercel CLI..." -ForegroundColor Green
        npm install -g vercel
    }
    
    # Deploy
    $env:VERCEL_TOKEN = $VercelToken
    vercel --prod
    
    Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
    Write-Host "🌐 Live at: https://mindreply.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Vercel token not provided. Manual deployment:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://vercel.com/new" -ForegroundColor Gray
    Write-Host "2. Import GitHub repo: Mind-Reply/MindReply" -ForegroundColor Gray
    Write-Host "3. Configure environment variables" -ForegroundColor Gray
    Write-Host "4. Deploy!" -ForegroundColor Gray
}

Write-Host "`n📊 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check GitHub Actions: https://github.com/Mind-Reply/MindReply/actions" -ForegroundColor Gray
Write-Host "2. View live app: https://mindreply.vercel.app" -ForegroundColor Gray
Write-Host "3. Configure secrets: https://github.com/Mind-Reply/MindReply/settings/secrets/actions" -ForegroundColor Gray
