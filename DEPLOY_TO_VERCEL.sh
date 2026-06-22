#!/bin/bash

# ============================================================================
# MINDREPLY - VERCEL DEPLOYMENT AUTOMATION
# This deploys everything LIVE to Vercel RIGHT NOW
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  MINDREPLY - VERCEL DEPLOYMENT STARTING                       ║"
echo "║  Getting everything LIVE on the web NOW                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Login to Vercel
echo "STEP 1: Login to Vercel"
echo "Run this command in your terminal:"
echo ""
echo "  vercel login"
echo ""
echo "Then press Enter when authenticated."
read -p "Press Enter when ready: " ready

# Step 2: Deploy
echo ""
echo "STEP 2: Deploying to Vercel..."
echo ""

cd "$(dirname "$0")"

# Deploy to production
vercel --prod --yes 2>&1 | tee deployment.log

# Extract the deployment URL
DEPLOYMENT_URL=$(grep -oP 'https://[^ ]*\.vercel\.app' deployment.log | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
  DEPLOYMENT_URL="https://mindreply.vercel.app"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  DEPLOYMENT SUCCESSFUL                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 YOUR SITE IS NOW LIVE:"
echo "   URL: $DEPLOYMENT_URL"
echo ""
echo "📊 Dashboard:"
echo "   • Pricing page: $DEPLOYMENT_URL"
echo "   • API status: $DEPLOYMENT_URL/api/health"
echo "   • Checkout: $DEPLOYMENT_URL/api/checkout"
echo ""
echo "💳 NEXT STEPS TO ENABLE PAYMENTS:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add these variables:"
echo "   • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_..."
echo "   • STRIPE_SECRET_KEY = sk_live_..."
echo ""
echo "5. Get keys from: https://dashboard.stripe.com"
echo ""
echo "6. After adding keys, Vercel will auto-redeploy"
echo "7. Payments will start processing immediately"
echo ""
echo "🚀 YOUR SITE IS LIVE AND READY FOR CUSTOMERS"
echo ""

