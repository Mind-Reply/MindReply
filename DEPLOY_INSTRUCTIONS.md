# Quick Deployment Instructions

## Prerequisites
- Node.js 18+
- Git installed
- GitHub account with repo access
- Vercel account

## Step 1: Setup Git Credentials

```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

## Step 2: Add Remote & Push to GitHub

```bash
cd C:\Users\Angel\Desktop\MindReply

# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/Mind-Reply/MindReply.git

# Add all files
git add -A

# Commit
git commit -m "feat: Docker + CI/CD + Vercel deployment"

# Push to main
git push -u origin main --force
```

## Step 3: Configure GitHub Secrets

Go to: https://github.com/Mind-Reply/MindReply/settings/secrets/actions

Add these secrets:
- `VERCEL_ORG_ID` - Your Vercel org ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `VERCEL_TOKEN` - Your Vercel token (https://vercel.com/account/tokens)
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub token
- `SLACK_WEBHOOK` - (optional) Slack notifications

## Step 4: Deploy to Vercel (Automatic)

Once you push to main, GitHub Actions will automatically:
1. Build the project
2. Run tests
3. Deploy to Vercel

Check deployment status: https://github.com/Mind-Reply/MindReply/actions

## Step 5: Verify Live Deployment

Once workflow completes:
- Frontend: https://mindreply.vercel.app
- Backend: Deployed as serverless functions

## Manual Vercel Deployment (if needed)

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Environment Variables in Vercel

Set these in Vercel dashboard (Project Settings → Environment Variables):

```
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.mindreply.com
```

## Troubleshooting

**Build fails**
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install --legacy-peer-deps`

**Deployment not triggering**
- Verify `.github/workflows/vercel-deploy.yml` exists
- Check GitHub Actions are enabled: Settings → Actions

**Need rollback**
- Vercel dashboard → Deployments → Select previous version → Promote to production

## Status

✅ Source code: GitHub (https://github.com/Mind-Reply/MindReply)
✅ Frontend: Vercel (https://mindreply.vercel.app)
✅ Backend: Docker Hub (docker pull mindreply/backend:latest)
✅ CI/CD: GitHub Actions (automated on push)
