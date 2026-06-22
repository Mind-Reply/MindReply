#!/bin/bash

# MindReply: Complete Backend + Frontend Deploy to Production

echo "🚀 COMPLETE MINDREPLY DEPLOYMENT"
echo "================================="

# 1. Clean & Push to GitHub
echo "📤 Pushing to GitHub..."
cd /c/Users/Angel/Desktop/MindReply
git add .
git commit -m "🚀 release: complete backend v2 + admin dashboard + all connectors integrated + production ready" || true
git push origin main

# 2. Force redeploy Vercel
echo "🎨 Redeploying Vercel..."
vercel --prod --yes

# 3. Check Railway backend
echo "🔧 Backend status..."
curl -s https://mindreply-backend.up.railway.app/health | jq .

echo ""
echo "✅ DEPLOYED"
echo ""
echo "📍 URLs:"
echo "   Frontend: https://mindreply.vercel.app"
echo "   Admin:    https://mindreply.vercel.app/admin"
echo "   Backend:  https://mindreply-backend.up.railway.app"
echo ""
