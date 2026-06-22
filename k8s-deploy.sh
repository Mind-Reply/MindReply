#!/bin/bash
# Deploy MindReply to Kubernetes cluster
# Usage: ./k8s-deploy.sh [dev|staging|prod]

set -e

ENVIRONMENT=${1:-dev}
CLUSTER_NAME="mindreply-$ENVIRONMENT"
NAMESPACE="mindreply"

echo "🚀 Deploying MindReply to Kubernetes ($ENVIRONMENT)..."

# Create namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets
echo "🔐 Creating secrets..."
kubectl create secret docker-registry docker-secret \
  --docker-server=docker.io \
  --docker-username=$DOCKER_USERNAME \
  --docker-password=$DOCKER_PASSWORD \
  --namespace=$NAMESPACE \
  --dry-run=client -o yaml | kubectl apply -f -

# Apply manifests
echo "📋 Applying Kubernetes manifests..."
kubectl apply -f k8s/mindreply-deployment.yaml

# Wait for rollout
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/mindreply-backend -n $NAMESPACE --timeout=5m
kubectl rollout status deployment/mindreply-frontend -n $NAMESPACE --timeout=5m

# Port forward for testing
echo "🔗 Port forwarding available:"
echo "  Frontend: kubectl port-forward -n $NAMESPACE svc/mindreply-frontend 3000:3000"
echo "  Backend: kubectl port-forward -n $NAMESPACE svc/mindreply-backend 3001:3001"

# Get service endpoints
echo "📍 Service endpoints:"
kubectl get svc -n $NAMESPACE

echo "✅ Kubernetes deployment complete!"
