#!/bin/bash

echo "🚀 ADMIN DASHBOARD: Full Deployment"
echo "===================================="
echo ""

# Check requirements
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not installed"
  exit 1
fi

echo "✅ Docker found"
echo ""

# Build images
echo "🔨 Building Docker images..."
docker build -f Dockerfile.backend -t mindreply-backend:admin .
docker build -f Dockerfile.admin -t mindreply-admin:latest apps/admin-dashboard

echo "✅ Images built"
echo ""

# Run services
echo "🚀 Starting services..."
docker-compose -f docker-compose.admin.yml up -d

echo "⏳ Waiting for services..."
sleep 10

# Run migrations
echo "🗄️  Running migrations..."
docker-compose -f docker-compose.admin.yml exec -T backend npx prisma migrate deploy

echo ""
echo "✅ ADMIN DASHBOARD READY!"
echo ""
echo "📍 Access points:"
echo "   Dashboard: http://localhost:3002"
echo "   Backend:   http://localhost:3001"
echo "   API:       http://localhost:3001/api"
echo ""
echo "🔐 Initialize admin:"
echo "   bash setup-admin.sh"
echo ""
