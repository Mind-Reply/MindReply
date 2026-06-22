#!/bin/bash

set -e

echo "🚀 Starting MindReply Production Deployment..."

# Check required environment variables
required_vars=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "OPENAI_API_KEY"
  "GMAIL_CLIENT_ID"
  "STRIPE_SECRET_KEY"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done

echo "✅ All required environment variables configured"

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker compose -f docker-compose.production.yml pull

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose -f docker-compose.production.yml run --rm backend npx prisma migrate deploy

# Generate Prisma client
echo "📋 Generating Prisma client..."
docker compose -f docker-compose.production.yml run --rm backend npx prisma generate

# Start services
echo "🎯 Starting MindReply services..."
docker compose -f docker-compose.production.yml up -d

# Wait for health checks
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Verify health
echo "🔍 Verifying service health..."

# Check backend
if curl -f http://localhost:3001/health > /dev/null; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
  exit 1
fi

# Check frontend
if curl -f http://localhost:5000 > /dev/null; then
  echo "✅ Frontend is healthy"
else
  echo "❌ Frontend health check failed"
  exit 1
fi

# Check n8n
if curl -f http://localhost:5678/health > /dev/null; then
  echo "✅ n8n is healthy"
else
  echo "⚠️  n8n may still be initializing"
fi

echo "🎉 MindReply deployment successful!"
echo ""
echo "Dashboard: http://localhost:5000"
echo "API: http://localhost:3001"
echo "n8n: http://localhost:5678"
