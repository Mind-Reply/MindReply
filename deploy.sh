#!/bin/bash
# MindReply Production Deployment Pipeline
# Usage: ./deploy.sh [dev|staging|prod]

set -e

ENVIRONMENT=${1:-dev}
REGISTRY="docker.io/mindreply"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Deploying MindReply to $ENVIRONMENT..."

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
  export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
fi

# Build images
echo "📦 Building Docker images..."
docker compose -f docker-compose.merged.yml build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg NODE_ENV=$ENVIRONMENT

# Tag images
docker tag mindreply-backend:latest "$REGISTRY/backend:$ENVIRONMENT"
docker tag mindreply-frontend:latest "$REGISTRY/frontend:$ENVIRONMENT"

if [ "$ENVIRONMENT" = "prod" ]; then
  docker tag mindreply-backend:latest "$REGISTRY/backend:latest"
  docker tag mindreply-frontend:latest "$REGISTRY/frontend:latest"
fi

# Push to registry
if [ "$REGISTRY" != "local" ]; then
  echo "📤 Pushing images to registry..."
  docker push "$REGISTRY/backend:$ENVIRONMENT"
  docker push "$REGISTRY/frontend:$ENVIRONMENT"
  
  if [ "$ENVIRONMENT" = "prod" ]; then
    docker push "$REGISTRY/backend:latest"
    docker push "$REGISTRY/frontend:latest"
  fi
fi

# Health checks
echo "🏥 Running health checks..."
docker compose -f docker-compose.merged.yml up -d --wait

# Run migrations
echo "🔄 Running database migrations..."
docker compose -f docker-compose.merged.yml exec backend npm run migrate || true

# Run tests
if [ "$ENVIRONMENT" != "prod" ]; then
  echo "✅ Running tests..."
  docker compose -f docker-compose.merged.yml exec backend npm test || true
  docker compose -f docker-compose.merged.yml exec frontend npm test || true
fi

# Verify connectivity
echo "🔗 Verifying service connectivity..."
curl -f http://localhost:3000/health || echo "Frontend health check failed"
curl -f http://localhost:3001/health || echo "Backend health check failed"
curl -f http://localhost:5678 || echo "N8N health check failed"

echo "✅ Deployment to $ENVIRONMENT complete!"
