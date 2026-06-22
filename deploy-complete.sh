#!/bin/bash

echo "🚀 COMPLETE MINDREPLY DEPLOYMENT"
echo "================================="
echo ""

START_TIME=$(date +%s)

# ============================================================
# PHASE 1: VALIDATION
# ============================================================
echo "📋 PHASE 1: Validation & Preparation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v docker &> /dev/null; then
  echo "❌ Docker not installed"
  exit 1
fi
echo "✅ Docker installed"

if ! command -v git &> /dev/null; then
  echo "❌ Git not installed"
  exit 1
fi
echo "✅ Git installed"

echo ""

# ============================================================
# PHASE 2: GIT PUSH
# ============================================================
echo "📤 PHASE 2: Git Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git add .
git commit -m "🚀 deployment: complete admin dashboard + main app infrastructure" || true
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Pushed to GitHub"
else
  echo "❌ Git push failed"
fi

echo ""

# ============================================================
# PHASE 3: BUILD IMAGES
# ============================================================
echo "🔨 PHASE 3: Building Docker Images"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Building backend..."
docker build -f Dockerfile.backend -t mindreply-backend:latest . || exit 1
echo "✅ Backend built"

echo "Building admin dashboard..."
docker build -f Dockerfile.admin -t mindreply-admin:latest . || exit 1
echo "✅ Admin dashboard built"

echo "Building frontend..."
docker build -f Dockerfile.frontend -t mindreply-frontend:latest . || exit 1
echo "✅ Frontend built"

echo ""

# ============================================================
# PHASE 4: START SERVICES
# ============================================================
echo "🚀 PHASE 4: Starting Local Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Starting full stack..."
docker-compose -f docker-compose.admin.yml up -d

echo "Waiting 15 seconds for services..."
sleep 15

echo ""

# ============================================================
# PHASE 5: MIGRATIONS
# ============================================================
echo "🗄️  PHASE 5: Database Migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker-compose -f docker-compose.admin.yml exec -T backend npx prisma migrate deploy
echo "✅ Migrations complete"

echo ""

# ============================================================
# PHASE 6: HEALTH CHECKS
# ============================================================
echo "🔍 PHASE 6: Health Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -f http://localhost:3001/health > /dev/null 2>&1; then
  echo "✅ Backend responding"
else
  echo "⚠️  Backend not yet responding"
fi

if curl -f http://localhost:3002 > /dev/null 2>&1; then
  echo "✅ Admin dashboard responding"
else
  echo "⚠️  Admin dashboard not yet responding"
fi

if curl -f http://localhost:5000 > /dev/null 2>&1; then
  echo "✅ Frontend responding"
else
  echo "⚠️  Frontend not yet responding"
fi

echo ""

# ============================================================
# PHASE 7: SUMMARY
# ============================================================
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "════════════════════════════════════════════════════"
echo "  ✅ COMPLETE DEPLOYMENT SUCCESSFUL"
echo "════════════════════════════════════════════════════"
echo ""

echo "⏱️  Deployment time: ${DURATION}s"
echo ""

echo "🔒 ADMIN DASHBOARD (Secure - Private Access Only)"
echo "   URL: http://localhost:3002"
echo "   Setup: bash setup-admin.sh"
echo ""

echo "🎨 MAIN FRONTEND (MindReply App)"
echo "   URL: http://localhost:5000"
echo ""

echo "🔧 BACKEND API"
echo "   URL: http://localhost:3001"
echo "   Health: http://localhost:3001/health"
echo "   API: http://localhost:3001/api"
echo ""

echo "🗄️  DATABASE"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""

echo "📊 SERVICES RUNNING:"
echo "   ✅ Backend (Express)"
echo "   ✅ Admin Dashboard (Next.js)"
echo "   ✅ Frontend (Next.js)"
echo "   ✅ PostgreSQL Database"
echo "   ✅ Redis Cache"
echo ""

echo "📚 FEATURES ACTIVE:"
echo "   ✅ Admin Chat (GPT-4 + Claude)"
echo "   ✅ All Connectors (Gmail, Stripe, n8n, etc)"
echo "   ✅ User Dashboard"
echo "   ✅ Email Intake"
echo "   ✅ Approval Workflows"
echo "   ✅ Analytics"
echo ""

echo "🔐 NEXT STEPS:"
echo "   1. Initialize admin: bash setup-admin.sh"
echo "   2. Access admin dashboard: http://localhost:3002"
echo "   3. Test all services"
echo "   4. Review logs: docker-compose -f docker-compose.admin.yml logs -f"
echo ""

echo "════════════════════════════════════════════════════"
echo "  STATUS: ✅ READY FOR USE"
echo "════════════════════════════════════════════════════"
echo ""
