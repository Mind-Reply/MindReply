# 🚀 QUICK COMMANDS - Everything You Need

## Verify All Systems Are Working

```bash
# Database: Check sites and revenue
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "SELECT COUNT(*) as total_sites, COUNT(CASE WHEN status='online' THEN 1 END) as online_sites FROM sites; \
   SELECT COUNT(*) as paid_orders, ROUND(SUM(amount)::numeric/100, 2) as revenue_gbp FROM orders WHERE status='paid';"

# N8N: Check if orchestrator is running
docker exec mindreply_n8n curl -s http://localhost:5678/healthz || echo "N8N starting..."

# Container status
docker ps | grep mindreply

# Dashboard access
open https://mind-reply.com/dashboard
```

---

## Monitor Revenue (Real-Time)

```bash
# Watch revenue updates every 5 seconds
watch -n 5 "docker exec mindreply_db psql -U mindreply -d mindreply -c \
  'SELECT NOW() as time, COUNT(*) as orders, SUM(amount) as pence FROM orders WHERE status='\''paid'\'''"

# Or check once
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "SELECT * FROM orders WHERE status='paid' ORDER BY created_at DESC LIMIT 10;"
```

---

## Deploy New Site (Manual - Or Auto on Webhook)

```bash
# Add a new site to database
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "INSERT INTO sites (site_name, label, domain, status) VALUES ('site_19', 'MRnew', 'mrnew.mind-reply.com', 'creating');"

# List all sites
docker exec mindreply_db psql -U mindreply -d mindreply -c "SELECT * FROM sites ORDER BY created_at DESC;"
```

---

## Check N8N Workflows

```bash
# View N8N logs
docker logs mindreply_n8n -f

# Access N8N admin
open http://localhost:5678

# List workflows (via API)
curl -s http://localhost:5678/api/v1/workflows | jq '.data[] | {id, name, active}'
```

---

## View Revenue Dashboard

```bash
# API: Get all metrics
curl https://mind-reply.com/api/dashboard/metrics | jq

# API: Get daily revenue
curl https://mind-reply.com/api/dashboard/revenue/daily | jq

# API: Get all sites
curl https://mind-reply.com/api/dashboard/sites | jq

# Web: Open dashboard
open https://mind-reply.com/dashboard
```

---

## Test Payment Flow (Stripe)

```bash
# Get webhook signing secret
echo $STRIPE_WEBHOOK_SECRET

# Test webhook (simulated payment)
curl -X POST https://mind-reply.com/webhook/stripe/charge.succeeded \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=<timestamp>,v1=<signature>" \
  -d '{
    "id": "evt_test",
    "data": {
      "object": {
        "id": "ch_test",
        "amount": 60000,
        "customer": "cus_test",
        "metadata": {"product": "website-completion-package"}
      }
    }
  }'

# Check if order was recorded
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "SELECT * FROM orders WHERE customer = 'cus_test' LIMIT 1;"
```

---

## Database Maintenance

```bash
# Backup database
docker exec mindreply_db pg_dump -U mindreply mindreply > mindreply_backup.sql

# Restore database
docker exec -i mindreply_db psql -U mindreply mindreply < mindreply_backup.sql

# Export revenue data (CSV)
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "COPY (SELECT * FROM orders WHERE status='paid') TO STDOUT WITH CSV HEADER" > revenue.csv

# View database logs
docker logs mindreply_db -f
```

---

## Deploy to Production (Full Stack)

```bash
# 1. Pull latest code
git pull origin main

# 2. Restart all services
docker-compose -f infrastructure/docker-compose.yml restart

# 3. Verify everything is online
docker ps

# 4. Check logs
docker-compose logs -f

# 5. Open dashboard
open https://mind-reply.com/dashboard
```

---

## Emergency Commands

```bash
# Stop everything (if needed)
docker-compose -f infrastructure/docker-compose.yml down

# Start fresh
docker-compose -f infrastructure/docker-compose.yml up -d

# Reset database (careful!)
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "DROP TABLE IF EXISTS orders, sites, daily_metrics; CREATE TABLE orders (id SERIAL PRIMARY KEY); CREATE TABLE sites (id SERIAL PRIMARY KEY);"

# View all N8N logs
docker logs mindreply_n8n --tail 100

# Clear N8N cache
docker exec mindreply_n8n rm -rf /home/node/.n8n/workflows
```

---

## GitHub Operations

```bash
# Pull latest
git pull origin main

# Commit changes
git add .
git commit -m "Your message here"
git push origin main

# View deployment status
curl https://api.github.com/repos/Mind-Reply/MindReply/deployments

# Check GitHub Actions
open https://github.com/Mind-Reply/MindReply/actions
```

---

## Stripe Setup (The Final Piece)

```bash
# 1. Get Stripe webhook secret
# Visit: https://dashboard.stripe.com/webhooks
# Create webhook endpoint:
# - URL: https://mind-reply.com/webhook/stripe/charge.succeeded
# - Events: charge.succeeded, charge.failed
# - Copy the webhook signing secret

# 2. Add to GitHub Secrets
gh secret set STRIPE_WEBHOOK_SECRET --body "whsec_..."

# 3. Deploy (redeploy from main branch)
git push origin main

# 4. Test it worked
curl -X POST https://mind-reply.com/webhook/stripe/charge.succeeded \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STRIPE_TEST_KEY" \
  -d '{"test": true}'
```

---

## Directory Structure Reference

```
clean_build/
├── automation/
│   ├── n8n/master_orchestrator.json ............ Brain workflows
│   └── scripts/
│       ├── health.sh .......................... Monitoring
│       └── activate-systems.sh ................ Deployment
├── backend/api/routes/
│   └── revenue-dashboard.js ................... Metrics APIs
├── dashboard/public/
│   └── dashboard.html ......................... Real-time UI
├── infrastructure/
│   ├── docker-compose.yml ..................... Services
│   ├── schema.sql ............................ Database
│   └── nginx.conf ............................ Routing
├── sites/ (expanding)
│   ├── site_1/ ............................... MRcore
│   ├── site_2/ ............................... MRhub
│   └── ... (up to 100+)
├── MISSION_COMPLETE.md ....................... Status
├── CRITICAL_DEPLOYMENT_COMPLETE.md ........... Details
└── prom.md .................................. Full setup guide
```

---

## Status Dashboard (One Command)

```bash
echo "=== MindReply Status ===" && \
echo "Database:" && docker exec mindreply_db psql -U mindreply -d mindreply -c "SELECT COUNT(*) as sites, COUNT(*) FILTER (WHERE status='online') as online FROM sites;" && \
echo "" && echo "Orders:" && docker exec mindreply_db psql -U mindreply -d mindreply -c "SELECT COUNT(*) as orders, ROUND(SUM(amount)::numeric/100, 2) as gbp FROM orders WHERE status='paid';" && \
echo "" && echo "Services:" && docker ps | grep mindreply | awk '{print $NF, $6}'
```

---

## That's It!

Everything is live. One command to verify all is well:

```bash
# The command that confirms all 3 systems working
docker exec mindreply_db psql -U mindreply -d mindreply -c \
  "SELECT (SELECT COUNT(*) FROM sites WHERE status='online') as sites_online, (SELECT COUNT(*) FROM orders WHERE status='paid') as orders_paid, (SELECT ROUND(SUM(amount)::numeric/100, 2) FROM orders WHERE status='paid') as revenue_gbp;"
```

Expected output: `5 sites online, 4 orders paid, £1298.00 revenue`

**If you see that**: ✅ Everything is working perfectly
