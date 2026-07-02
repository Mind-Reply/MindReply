#!/bin/bash
# Complete setup and deployment script
# Run this once to set up GitHub + Vercel

set -e

echo "🔧 MindReply Deployment Setup"
echo "================================"

# 1. Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found. Install Node.js first."
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo "❌ git not found. Install Git first."
  exit 1
fi

# 2. GitHub credentials
echo ""
echo "🔐 GitHub Setup"
read -p "Enter GitHub username: " GH_USER
read -p "Enter GitHub token (create at https://github.com/settings/tokens): " GH_TOKEN

# 3. Vercel setup
echo ""
echo "🚀 Vercel Setup"
read -p "Enter Vercel token (create at https://vercel.com/account/tokens): " VERCEL_TOKEN

# 4. Initialize git
echo ""
echo "📤 Initializing Git..."
git init
git config user.email "deployment@mindreply.com"
git config user.name "MindReply Automation"
git remote add origin "https://$GH_USER:$GH_TOKEN@github.com/Mind-Reply/MindReply.git" || git remote set-url origin "https://$GH_USER:$GH_TOKEN@github.com/Mind-Reply/MindReply.git"

# 5. Add and commit
echo "📝 Committing changes..."
git add -A
git commit -m "feat: Complete containerization, CI/CD, and Vercel deployment setup" || true

# 6. Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main -f

# 7. Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
npm install -g vercel
vercel --prod --token $VERCEL_TOKEN

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your app is live at:"
echo "  https://mindreply.vercel.app"
echo ""
echo "📊 Dashboard:"
echo "  https://vercel.com/dashboard"
echo ""
echo "🔐 GitHub:"
echo "  https://github.com/Mind-Reply/MindReply"
