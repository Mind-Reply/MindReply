#!/bin/bash
# deploy.sh - One-file deploy script including build, test, and deploy all in one

set -e

IMAGE_NAME="mindreply-app"
TAG=$(date +%Y%m%d%H%M)

echo "Installing dependencies..."
npm ci

echo "Running tests..."
npm test

echo "Building project..."
npm run build

echo "Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

echo "Pushing Docker image..."
docker push $IMAGE_NAME:$TAG

echo "Deploying to production server..."
ssh prod-user@mind-reply.com << EOF
  docker pull $IMAGE_NAME:$TAG
  docker stop mindreply || true
  docker rm mindreply || true
  docker run -d --name mindreply -p 80:4000 $IMAGE_NAME:$TAG
EOF

echo "Deployment successful!"
