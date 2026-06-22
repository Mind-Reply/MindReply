#!/bin/bash
# MindReply Health & Status Monitor
# Runs every hour, reports to dashboard

set -e

LOG_FILE="logs/health_$(date +%Y%m%d_%H%M%S).log"
mkdir -p logs

echo "=== MindReply Health Check ===" >> $LOG_FILE
echo "Timestamp: $(date)" >> $LOG_FILE

# 1. Database Check
echo "Checking PostgreSQL..." >> $LOG_FILE
if docker exec mindreply_db pg_isready -U mindreply > /dev/null 2>&1; then
  DB_STATUS="ONLINE"
  echo "✓ Database ONLINE" >> $LOG_FILE
else
  DB_STATUS="OFFLINE"
  echo "✗ Database OFFLINE" >> $LOG_FILE
fi

# 2. N8N Check
echo "Checking N8N Brain..." >> $LOG_FILE
if curl -s http://localhost:5678/healthz | grep -q "ok"; then
  N8N_STATUS="ONLINE"
  N8N_FLOWS=$(curl -s http://localhost:5678/api/v1/workflows | grep -c "\"active\"" || echo "0")
  echo "✓ N8N ONLINE - $N8N_FLOWS flows" >> $LOG_FILE
else
  N8N_STATUS="OFFLINE"
  echo "✗ N8N OFFLINE" >> $LOG_FILE
fi

# 3. Frontend Check
echo "Checking Frontend..." >> $LOG_FILE
if curl -s http://localhost:80 | grep -q "<!DOCTYPE"; then
  FRONTEND_STATUS="ONLINE"
  echo "✓ Frontend ONLINE" >> $LOG_FILE
else
  FRONTEND_STATUS="OFFLINE"
  echo "✗ Frontend OFFLINE" >> $LOG_FILE
fi

# 4. API Check
echo "Checking Backend API..." >> $LOG_FILE
if curl -s http://localhost:3000/api/health | grep -q "ok"; then
  API_STATUS="ONLINE"
  echo "✓ API ONLINE" >> $LOG_FILE
else
  API_STATUS="OFFLINE"
  echo "✗ API OFFLINE" >> $LOG_FILE
fi

# 5. Stripe Check
echo "Checking Stripe Integration..." >> $LOG_FILE
if curl -s -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/account | grep -q "id"; then
  STRIPE_STATUS="CONNECTED"
  echo "✓ Stripe CONNECTED" >> $LOG_FILE
else
  STRIPE_STATUS="DISCONNECTED"
  echo "✗ Stripe DISCONNECTED" >> $LOG_FILE
fi

# 6. Site Count
SITE_COUNT=$(ls -d sites/site_* 2>/dev/null | wc -l || echo "0")
echo "Sites Online: $SITE_COUNT" >> $LOG_FILE

# 7. Revenue Today
REVENUE_TODAY=$(grep -r "charge.succeeded" logs/ 2>/dev/null | wc -l | xargs -I {} echo "{}*99/100" | bc || echo "0")
echo "Revenue Today: \$$REVENUE_TODAY" >> $LOG_FILE

# 8. Uptime Check
UPTIME=$(docker stats --no-stream --format "table {{.MemUsage}}" mindreply_db 2>/dev/null || echo "N/A")
echo "Database Memory: $UPTIME" >> $LOG_FILE

# Update Dashboard
cat > dashboard/data/structure.txt << EOF
{
  "timestamp": "$(date)",
  "database": "$DB_STATUS",
  "n8n": "$N8N_STATUS",
  "frontend": "$FRONTEND_STATUS",
  "api": "$API_STATUS",
  "stripe": "$STRIPE_STATUS",
  "sites": $SITE_COUNT,
  "revenue_today": "$REVENUE_TODAY",
  "flows": $N8N_FLOWS
}
EOF

# Escalation Logic
ESCALATIONS=0

if [[ "$DB_STATUS" != "ONLINE" ]]; then
  echo "ESCALATION: Database offline" >> $LOG_FILE
  ((ESCALATIONS++))
fi

if [[ "$N8N_STATUS" != "ONLINE" ]]; then
  echo "ESCALATION: N8N brain offline" >> $LOG_FILE
  ((ESCALATIONS++))
fi

if [[ "$STRIPE_STATUS" != "CONNECTED" ]]; then
  echo "ESCALATION: Stripe disconnected" >> $LOG_FILE
  ((ESCALATIONS++))
fi

if [ $ESCALATIONS -gt 0 ]; then
  echo "Sending escalation email..." >> $LOG_FILE
  # Mail escalations (implement mail command)
  # mail -s "MindReply Escalation Alert" director@mind-reply.com < $LOG_FILE
fi

echo "Health check complete. Log: $LOG_FILE"
echo "Escalations: $ESCALATIONS"
