#!/bin/bash
# Manual push to GitHub and Vercel deployment

set -e

REPO_URL="https://github.com/Mind-Reply/MindReply.git"
BRANCH="main"

echo "📤 Pushing to GitHub..."

# Initialize git if needed
if [ ! -d ".git" ]; then
  git init
  git remote add origin $REPO_URL
fi

# Add all files
git add -A

# Commit
git commit -m "feat: Docker containerization, CI/CD automation, Kubernetes manifests, Vercel deployment [automated]" || true

# Push to main
git push -u origin $BRANCH -f

echo "✅ Pushed to GitHub main"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
  npm install -g vercel
fi

# Deploy
vercel --prod --token $VERCEL_TOKEN

echo "✅ Deployed to Vercel!"
echo "🌐 Live at: https://mindreply.vercel.app"
