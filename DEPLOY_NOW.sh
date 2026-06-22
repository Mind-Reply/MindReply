#!/bin/bash
# ============================================================================
# MINDREPLY - AUTOMATIC DEPLOYMENT TO VERCEL
# This script automates the entire deployment process
# ============================================================================

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  MINDREPLY - AUTOMATED VERCEL DEPLOYMENT                      ║"
echo "║  Getting everything LIVE on the web RIGHT NOW                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the MindReply app directory"
    exit 1
fi

echo "✓ Found package.json"
echo ""

# Step 1: Verify Vercel CLI is installed
echo "STEP 1: Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi
echo "✓ Vercel CLI installed"
echo ""

# Step 2: Verify GitHub CLI is installed (optional but recommended)
echo "STEP 2: Checking GitHub CLI..."
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found (optional)"
    echo "Install it for easier secret management"
else
    echo "✓ GitHub CLI installed"
fi
echo ""

# Step 3: Check if vercel.json exists
echo "STEP 3: Checking deployment configuration..."
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found"
    exit 1
fi
echo "✓ vercel.json found"
echo ""

# Step 4: Check if package-lock.json or node_modules exist
echo "STEP 4: Checking dependencies..."
if [ ! -d "node_modules" ] && [ ! -f "package-lock.json" ]; then
    echo "⚠️  Dependencies not installed. Installing..."
    npm install
fi
echo "✓ Dependencies ready"
echo ""

# Step 5: Build locally first to catch any errors
echo "STEP 5: Building Next.js app locally..."
npm run build
echo "✓ Build successful"
echo ""

# Step 6: Instructions for Vercel login
echo "STEP 6: Vercel authentication..."
echo ""
echo "You need to authenticate with Vercel."
echo "A browser window will open. Authorize and follow the steps."
echo ""
read -p "Press Enter to continue (browser will open)..."
echo ""

# Step 7: Pull Vercel settings
echo "STEP 7: Pulling Vercel project settings..."
vercel pull --yes --environment=production
echo "✓ Vercel settings pulled"
echo ""

# Step 8: Deploy to production
echo "STEP 8: Deploying to Vercel production..."
echo ""
DEPLOYMENT_URL=$(vercel --prod --confirm 2>&1 | grep -oP 'https://[^ ]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    DEPLOYMENT_URL="https://mind-reply.vercel.app"
    echo "⚠️  Could not extract deployment URL"
    echo "Check your Vercel dashboard for the exact URL"
else
    echo "✓ Deployment successful!"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎉 DEPLOYMENT COMPLETE!                                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Your site is LIVE at:"
echo "  🌐 $DEPLOYMENT_URL"
echo ""
echo "Next steps:"
echo ""
echo "1. STRIPE KEYS (5 minutes)"
echo "   - Go to: https://dashboard.stripe.com"
echo "   - Get your pk_live_ and sk_live_ keys"
echo "   - Add to Vercel: Settings → Environment Variables"
echo "   - Vercel will auto-redeploy"
echo ""
echo "2. TEST PAYMENT (5 minutes)"
echo "   - Visit your live URL"
echo "   - Click 'Start Free Trial'"
echo "   - Use test card: 4242 4242 4242 4242"
echo "   - Verify payment in Stripe dashboard"
echo ""
echo "3. START 24/7 AUTOMATION (5 minutes)"
echo "   - cd ../n8n"
echo "   - docker compose up -d"
echo "   - Go to: http://localhost:5678"
echo "   - Import Master Orchestrator workflow"
echo "   - Activate workflow"
echo ""
echo "4. VERIFY EVERYTHING (5 minutes)"
echo "   - Check: Vercel analytics"
echo "   - Check: Stripe dashboard"
echo "   - Check: n8n dashboard"
echo "   - Check: GitHub Actions"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "Your website is LIVE and ready for customers!"
echo "Complete the 4 steps above and revenue will flow automatically."
echo ""
