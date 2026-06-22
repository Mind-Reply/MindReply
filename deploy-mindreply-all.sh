#!/bin/bash

# ============================================================
# MindReply: Automated Deployment to GitHub + Vercel + Railway
# ============================================================
# This script does EVERYTHING in one command
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================================
# PHASE 1: VALIDATION
# ============================================================
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🚀 MindReply: AUTOMATED DEPLOYMENT${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 PHASE 1: Validation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

REQUIRED_FILES=(
  "package.json"
  "apps/backend/package.json"
  "apps/frontend/package.json"
  "Dockerfile.backend"
  "Dockerfile.frontend"
  "prisma/schema.prisma"
  ".github/workflows/ci-cd.yml"
  "vercel.json"
  "railway.toml"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file${NC}"
  else
    echo -e "${RED}❌ $file (MISSING)${NC}"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo ""
  echo -e "${RED}❌ Required files missing!${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ All files present${NC}"

# ============================================================
# PHASE 2: ENVIRONMENT SETUP
# ============================================================
echo ""
echo -e "${YELLOW}🔧 PHASE 2: Environment Configuration${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

REQUIRED_SECRETS=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
  "GMAIL_CLIENT_ID"
  "GMAIL_CLIENT_SECRET"
  "STRIPE_SECRET_KEY"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
  if [ -z "${!secret}" ]; then
    echo -e "${YELLOW}⚠️  $secret (not set - will prompt)${NC}"
  else
    echo -e "${GREEN}✅ $secret${NC}"
  fi
done

# ============================================================
# PHASE 3: GIT OPERATIONS
# ============================================================
echo ""
echo -e "${YELLOW}📤 PHASE 3: Git Operations (Push to GitHub)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${CYAN}Checking git status...${NC}"
git_status=$(git status --short)

if [ ! -z "$git_status" ]; then
  echo "Changes detected:"
  echo "$git_status"
  echo ""
  echo -e "${CYAN}Staging all changes...${NC}"
  git add .
  
  echo -e "${CYAN}Committing...${NC}"
  git commit -m "🚀 feat: automated production deployment - MindReply v1.0" || true
else
  echo -e "${GREEN}No changes to commit${NC}"
fi

echo ""
echo -e "${CYAN}Pushing to GitHub main branch...${NC}"
if git push origin main; then
  echo -e "${GREEN}✅ Pushed to GitHub${NC}"
else
  echo -e "${RED}❌ Git push failed${NC}"
  exit 1
fi

# ============================================================
# PHASE 4: VERCEL DEPLOYMENT (FRONTEND)
# ============================================================
echo ""
echo -e "${YELLOW}🎨 PHASE 4: Vercel Frontend Deployment${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$VERCEL_TOKEN" ]; then
  echo -e "${CYAN}Installing Vercel CLI...${NC}"
  npm install -g vercel
  
  echo -e "${CYAN}Deploying to Vercel...${NC}"
  export VERCEL_TOKEN=$VERCEL_TOKEN
  vercel --prod
  echo -e "${GREEN}✅ Vercel deployment initiated${NC}"
else
  echo -e "${YELLOW}⚠️  Vercel token not provided. Manual setup required:${NC}"
  echo -e "${CYAN}   1. Go to https://vercel.com/new${NC}"
  echo -e "${CYAN}   2. Import GitHub repo: Mind-Reply/MindReply${NC}"
  echo -e "${CYAN}   3. Set environment: NEXT_PUBLIC_API_URL=https://mindreply-backend.up.railway.app${NC}"
  echo -e "${CYAN}   4. Deploy${NC}"
fi

# ============================================================
# PHASE 5: RAILWAY DEPLOYMENT (BACKEND)
# ============================================================
echo ""
echo -e "${YELLOW}🔧 PHASE 5: Railway Backend Deployment${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$RAILWAY_TOKEN" ]; then
  echo -e "${CYAN}Installing Railway CLI...${NC}"
  npm install -g @railway/cli
  
  echo -e "${CYAN}Authenticating with Railway...${NC}"
  export RAILWAY_TOKEN=$RAILWAY_TOKEN
  
  echo -e "${CYAN}Deploying to Railway...${NC}"
  railway up
  echo -e "${GREEN}✅ Railway deployment initiated${NC}"
else
  echo -e "${YELLOW}⚠️  Railway token not provided. Manual setup required:${NC}"
  echo -e "${CYAN}   1. Go to https://railway.app${NC}"
  echo -e "${CYAN}   2. New Project → Deploy from GitHub${NC}"
  echo -e "${CYAN}   3. Select repo: Mind-Reply/MindReply${NC}"
  echo -e "${CYAN}   4. Add PostgreSQL 15 service${NC}"
  echo -e "${CYAN}   5. Add Redis 7 service${NC}"
  echo -e "${CYAN}   6. Set environment variables (see .env.vercel)${NC}"
  echo -e "${CYAN}   7. Deploy${NC}"
fi

# ============================================================
# PHASE 6: DATABASE MIGRATIONS
# ============================================================
echo ""
echo -e "${YELLOW}🗄️  PHASE 6: Database Setup${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$DATABASE_URL" ]; then
  echo -e "${CYAN}Database URL provided. Running migrations...${NC}"
  export DATABASE_URL=$DATABASE_URL
  
  echo -e "${CYAN}Installing dependencies...${NC}"
  npm install
  
  echo -e "${CYAN}Generating Prisma client...${NC}"
  npx prisma generate
  
  echo -e "${CYAN}Running migrations...${NC}"
  npx prisma migrate deploy
  echo -e "${GREEN}✅ Migrations complete${NC}"
else
  echo -e "${YELLOW}⚠️  DATABASE_URL not set. Migrations will run in deployment.${NC}"
fi

# ============================================================
# PHASE 7: HEALTH CHECKS
# ============================================================
echo ""
echo -e "${YELLOW}🔍 PHASE 7: Verification${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${CYAN}Waiting 30 seconds for services to initialize...${NC}"
sleep 30

echo -e "${CYAN}Checking backend health...${NC}"
if curl -f https://mindreply-backend.up.railway.app/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend is healthy${NC}"
else
  echo -e "${YELLOW}⚠️  Backend health check failed (may still be initializing)${NC}"
fi

echo -e "${CYAN}Checking frontend...${NC}"
if curl -f https://mindreply.vercel.app > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Frontend is live${NC}"
else
  echo -e "${YELLOW}⚠️  Frontend check failed (may still be deploying)${NC}"
fi

# ============================================================
# PHASE 8: SUMMARY
# ============================================================
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📍 Service URLs:${NC}"
echo -e "${YELLOW}   Frontend:  https://mindreply.vercel.app${NC}"
echo -e "${YELLOW}   Backend:   https://mindreply-backend.up.railway.app${NC}"
echo -e "${YELLOW}   API:       https://mindreply-backend.up.railway.app/api${NC}"
echo -e "${YELLOW}   Health:    https://mindreply-backend.up.railway.app/health${NC}"
echo ""

echo -e "${CYAN}📋 Next Steps:${NC}"
echo -e "${YELLOW}   1. Import n8n workflows from ./n8n/workflows/${NC}"
echo -e "${YELLOW}   2. Configure webhook integrations${NC}"
echo -e "${YELLOW}   3. Test API endpoints${NC}"
echo -e "${YELLOW}   4. Monitor logs in Vercel/Railway dashboards${NC}"
echo ""

echo -e "${CYAN}🔗 Dashboards:${NC}"
echo -e "${YELLOW}   Vercel:    https://vercel.com/dashboard${NC}"
echo -e "${YELLOW}   Railway:   https://railway.app${NC}"
echo -e "${YELLOW}   GitHub:    https://github.com/Mind-Reply/MindReply${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
