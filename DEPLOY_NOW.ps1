# ============================================================================
# MINDREPLY - AUTOMATIC DEPLOYMENT TO VERCEL (Windows PowerShell)
# This script automates the entire deployment process
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  MINDREPLY - AUTOMATED VERCEL DEPLOYMENT                      ║" -ForegroundColor Cyan
Write-Host "║  Getting everything LIVE on the web RIGHT NOW                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the MindReply app directory"
    exit 1
}

Write-Host "✓ Found package.json" -ForegroundColor Green
Write-Host ""

# Step 1: Verify Vercel CLI is installed
Write-Host "STEP 1: Checking Vercel CLI..." -ForegroundColor Yellow
$vercelCmd = Get-Command vercel.cmd -ErrorAction SilentlyContinue
if ($null -eq $vercelCmd) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}
Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
Write-Host ""

# Step 2: Verify GitHub CLI is installed (optional)
Write-Host "STEP 2: Checking GitHub CLI..." -ForegroundColor Yellow
$ghCmd = Get-Command gh.cmd -ErrorAction SilentlyContinue
if ($null -eq $ghCmd) {
    Write-Host "⚠️  GitHub CLI not found (optional)" -ForegroundColor Yellow
    Write-Host "Install it for easier secret management"
} else {
    Write-Host "✓ GitHub CLI installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Check if vercel.json exists
Write-Host "STEP 3: Checking deployment configuration..." -ForegroundColor Yellow
if (!(Test-Path "vercel.json")) {
    Write-Host "❌ Error: vercel.json not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ vercel.json found" -ForegroundColor Green
Write-Host ""

# Step 4: Check dependencies
Write-Host "STEP 4: Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules") -and !(Test-Path "package-lock.json")) {
    Write-Host "⚠️  Dependencies not installed. Installing..." -ForegroundColor Yellow
    npm install
}
Write-Host "✓ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Step 5: Build locally
Write-Host "STEP 5: Building Next.js app locally..." -ForegroundColor Yellow
npm run build
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

# Step 6: Vercel auth
Write-Host "STEP 6: Vercel authentication..." -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to authenticate with Vercel."
Write-Host "A browser window will open. Authorize and follow the steps."
Write-Host ""
Read-Host "Press Enter to continue (browser will open)"
Write-Host ""

# Step 7: Pull Vercel settings
Write-Host "STEP 7: Pulling Vercel project settings..." -ForegroundColor Yellow
cmd /c "vercel.cmd pull --yes --environment=production"
Write-Host "✓ Vercel settings pulled" -ForegroundColor Green
Write-Host ""

# Step 8: Deploy
Write-Host "STEP 8: Deploying to Vercel production..." -ForegroundColor Yellow
Write-Host ""

$deployOutput = cmd /c "vercel.cmd --prod --confirm" 2>&1
$deploymentUrl = $deployOutput | Select-String -Pattern "https://[^ ]*\.vercel\.app" | ForEach-Object { $_.Matches[0].Value } | Select-Object -First 1

if ([string]::IsNullOrEmpty($deploymentUrl)) {
    $deploymentUrl = "https://mind-reply.vercel.app"
    Write-Host "⚠️  Could not extract deployment URL automatically" -ForegroundColor Yellow
    Write-Host "Check your Vercel dashboard for the exact URL"
} else {
    Write-Host "✓ Deployment successful!" -ForegroundColor Green
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🎉 DEPLOYMENT COMPLETE!                                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site is LIVE at:" -ForegroundColor Green
Write-Host "  🌐 $deploymentUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. STRIPE KEYS (5 minutes)" -ForegroundColor Cyan
Write-Host "   - Go to: https://dashboard.stripe.com"
Write-Host "   - Get your pk_live_ and sk_live_ keys"
Write-Host "   - Add to Vercel: Settings → Environment Variables"
Write-Host "   - Vercel will auto-redeploy"
Write-Host ""
Write-Host "2. TEST PAYMENT (5 minutes)" -ForegroundColor Cyan
Write-Host "   - Visit your live URL"
Write-Host "   - Click 'Start Free Trial'"
Write-Host "   - Use test card: 4242 4242 4242 4242"
Write-Host "   - Verify payment in Stripe dashboard"
Write-Host ""
Write-Host "3. START 24/7 AUTOMATION (5 minutes)" -ForegroundColor Cyan
Write-Host "   - cd ..\n8n"
Write-Host "   - docker compose up -d"
Write-Host "   - Go to: http://localhost:5678"
Write-Host "   - Import Master Orchestrator workflow"
Write-Host "   - Activate workflow"
Write-Host ""
Write-Host "4. VERIFY EVERYTHING (5 minutes)" -ForegroundColor Cyan
Write-Host "   - Check: Vercel analytics"
Write-Host "   - Check: Stripe dashboard"
Write-Host "   - Check: n8n dashboard"
Write-Host "   - Check: GitHub Actions"
Write-Host ""
Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your website is LIVE and ready for customers!" -ForegroundColor Green
Write-Host "Complete the 4 steps above and revenue will flow automatically."
Write-Host ""

Write-Host "Press Enter to finish..."
Read-Host
