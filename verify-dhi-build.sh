#!/bin/bash
# DHI Migration Build Verification Script
# This script validates that all Docker builds complete successfully

set -e

echo "================================================"
echo "MindReply DHI Migration Build Verification"
echo "================================================"
echo ""

PROJECT_DIR="C:\Users\Angel\Desktop\MindReply"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking Docker installation...${NC}"
docker --version || { echo -e "${RED}Docker not installed${NC}"; exit 1; }
docker-compose --version || { echo -e "${RED}Docker Compose not installed${NC}"; exit 1; }
echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"
echo ""

echo -e "${YELLOW}Step 2: Validating Dockerfile syntax...${NC}"
docker build --dry-run -f "$PROJECT_DIR/Dockerfile" "$PROJECT_DIR" > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ Dockerfile syntax valid${NC}" || \
  { echo -e "${RED}✗ Dockerfile has syntax errors${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 3: Validating Dockerfile.frontend syntax...${NC}"
docker build --dry-run -f "$PROJECT_DIR/Dockerfile.frontend" "$PROJECT_DIR" > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ Dockerfile.frontend syntax valid${NC}" || \
  { echo -e "${RED}✗ Dockerfile.frontend has syntax errors${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 4: Building backend image (this may take 2-5 minutes)...${NC}"
docker build -f "$PROJECT_DIR/Dockerfile" \
  -t mindreply-backend:dhi-verify \
  --progress=plain \
  "$PROJECT_DIR" 2>&1 | tail -20 && \
  echo -e "${GREEN}✓ Backend image built successfully${NC}" || \
  { echo -e "${RED}✗ Backend build failed${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 5: Building frontend image (this may take 3-8 minutes)...${NC}"
docker build -f "$PROJECT_DIR/Dockerfile.frontend" \
  -t mindreply-frontend:dhi-verify \
  --progress=plain \
  "$PROJECT_DIR" 2>&1 | tail -20 && \
  echo -e "${GREEN}✓ Frontend image built successfully${NC}" || \
  { echo -e "${RED}✗ Frontend build failed${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 6: Verifying backend image layers...${NC}"
docker inspect mindreply-backend:dhi-verify > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ Backend image created and inspectable${NC}" || \
  { echo -e "${RED}✗ Backend image inspection failed${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 7: Verifying frontend image layers...${NC}"
docker inspect mindreply-frontend:dhi-verify > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ Frontend image created and inspectable${NC}" || \
  { echo -e "${RED}✗ Frontend image inspection failed${NC}"; exit 1; }
echo ""

echo -e "${YELLOW}Step 8: Checking base images...${NC}"
echo "Backend base image:"
docker inspect mindreply-backend:dhi-verify | grep -i "from" | head -1
echo "Frontend base image:"
docker inspect mindreply-frontend:dhi-verify | grep -i "from" | head -1
echo ""

echo -e "${YELLOW}Step 9: Pulling DHI base images (dry run)...${NC}"
echo "Checking dhi.io/node:22-alpine3.24..."
docker pull --dry-run dhi.io/node:22-alpine3.24 > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ DHI Node image available${NC}" || \
  echo -e "${YELLOW}⚠ Warning: May need credentials to pull${NC}"
echo ""

echo "Checking dhi.io/postgres:15-alpine..."
docker pull --dry-run dhi.io/postgres:15-alpine > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ DHI PostgreSQL image available${NC}" || \
  echo -e "${YELLOW}⚠ Warning: May need credentials to pull${NC}"
echo ""

echo "Checking dhi.io/redis:7..."
docker pull --dry-run dhi.io/redis:7 > /dev/null 2>&1 && \
  echo -e "${GREEN}✓ DHI Redis image available${NC}" || \
  echo -e "${YELLOW}⚠ Warning: May need credentials to pull${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}Build Verification Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Start services: docker-compose -f docker-compose.merged.yml up -d"
echo "2. Check status: docker-compose -f docker-compose.merged.yml ps"
echo "3. View logs: docker-compose -f docker-compose.merged.yml logs -f"
echo "4. Test API: curl http://localhost:3001"
echo "5. Test UI: curl http://localhost:3000"
echo ""
echo "To clean up test images:"
echo "  docker rmi mindreply-backend:dhi-verify mindreply-frontend:dhi-verify"
echo ""
