#!/bin/bash

echo "🚀 Deploy to Vercel (Admin v2 on /admin route)"
echo "=============================================="
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "feat: admin dashboard v2 on /admin route with secure chat interface" -m "- Admin UI integrated into frontend app" -m "- JWT authentication" -m "- All connectors accessible" -m "- Real-time chat with AI models" || true
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Git push failed"
  exit 1
fi

echo "✅ Pushed to GitHub"
echo ""

# Vercel deployment instructions
echo "🎯 Vercel Deployment:"
echo "   1. Go to https://vercel.com/dashboard"
echo "   2. Select MindReply project"
echo "   3. Redeploy: Click 'Redeploy'"
echo ""
echo "   OR"
echo ""
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""

echo "📍 Live at:"
echo "   https://mindreply.vercel.app/admin"
echo ""

echo "✅ Ready!"
