# 🚀 MindReply: ONE-COMMAND DEPLOYMENT

## **AUTOMATED FULL DEPLOYMENT (Everything in One Command)**

### **What This Does:**
✅ Pushes code to GitHub main  
✅ Deploys frontend to Vercel  
✅ Deploys backend to Railway  
✅ Runs database migrations  
✅ Sets up all environment variables  
✅ Verifies services are healthy  

---

## **QUICKSTART (3 Options)**

### **Option 1: PowerShell (Windows) [RECOMMENDED FOR YOU]**

```powershell
cd C:\Users\Angel\Desktop\MindReply

# Set environment variables (or leave empty to be prompted)
$env:DATABASE_URL = "postgresql://user:password@host:5432/db"
$env:REDIS_URL = "redis://host:6379"
$env:JWT_SECRET = "your-32-character-secret-key-here"
$env:OPENAI_API_KEY = "sk_your_key"
$env:ANTHROPIC_API_KEY = "your_key"
$env:GMAIL_CLIENT_ID = "your_id"
$env:GMAIL_CLIENT_SECRET = "your_secret"
$env:STRIPE_SECRET_KEY = "sk_live_xxx"
$env:VERCEL_TOKEN = "your_vercel_token"
$env:RAILWAY_TOKEN = "your_railway_token"

# Run deployment
.\Deploy-MindReply-ALL.ps1
```

### **Option 2: Bash (Mac/Linux)**

```bash
cd /path/to/MindReply

# Set environment variables
export DATABASE_URL="postgresql://user:password@host:5432/db"
export REDIS_URL="redis://host:6379"
export JWT_SECRET="your-32-character-secret-key-here"
export OPENAI_API_KEY="sk_your_key"
export ANTHROPIC_API_KEY="your_key"
export GMAIL_CLIENT_ID="your_id"
export GMAIL_CLIENT_SECRET="your_secret"
export STRIPE_SECRET_KEY="sk_live_xxx"
export VERCEL_TOKEN="your_vercel_token"
export RAILWAY_TOKEN="your_railway_token"

# Run deployment
bash deploy-mindreply-all.sh
```

### **Option 3: Manual (No Script)**

See **DEPLOYMENT_GUIDE.md** in project root.

---

## **BEFORE RUNNING (Required Setup)**

### **1. Get Your Tokens**

**GitHub Token:**
- https://github.com/settings/tokens
- Create new token with `repo` and `workflow` permissions
- Copy: `ghp_xxxxxxxxxxxxxxxx`

**Vercel Token:**
- https://vercel.com/account/tokens
- Create new token
- Copy: `xxxx_xxxxxxxxxxxxxxxx`

**Railway Token:**
- https://railway.app/dashboard/user/tokens
- Create new token
- Copy: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### **2. Create Infrastructure (Railway Dashboard)**

Before running script, manually create:
- **PostgreSQL 15** service → copy connection string to `DATABASE_URL`
- **Redis 7** service → copy URL to `REDIS_URL`

Or let Railway auto-create them during deployment.

### **3. Prepare Secrets**

Create `.env.local` with all secrets:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-32-char-secret
OPENAI_API_KEY=sk_your_key
ANTHROPIC_API_KEY=your_key
GMAIL_CLIENT_ID=your_id
GMAIL_CLIENT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_live_xxx
VERCEL_TOKEN=your_token
RAILWAY_TOKEN=your_token
```

---

## **PHASE BREAKDOWN**

### **Phase 1: Validation**
Checks all required files exist (Dockerfile, package.json, etc.)

### **Phase 2: Environment**
Validates all secrets are set (prompts if missing)

### **Phase 3: Git**
- Stages changes
- Commits with message
- Pushes to GitHub main

### **Phase 4: Vercel (Frontend)**
- Installs Vercel CLI
- Links to project
- Sets `NEXT_PUBLIC_API_URL`
- Deploys to production

### **Phase 5: Railway (Backend)**
- Installs Railway CLI
- Authenticates
- Sets 8 environment variables
- Deploys Docker backend

### **Phase 6: Database**
- Installs npm dependencies
- Generates Prisma client
- Runs migrations (`prisma migrate deploy`)

### **Phase 7: Verification**
- Waits 30 seconds for services
- Checks backend `/health` endpoint
- Checks frontend loads

### **Phase 8: Summary**
- Shows live URLs
- Lists next steps
- Links to dashboards

---

## **EXPECTED OUTPUT**

```
════════════════════════════════════════════════════
  🚀 MindReply: AUTOMATED DEPLOYMENT
════════════════════════════════════════════════════

📋 PHASE 1: Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ package.json
✅ apps/backend/package.json
✅ Dockerfile.backend
...
✅ All files present

📤 PHASE 3: Git Operations
✅ Pushed to GitHub

🎨 PHASE 4: Vercel Frontend Deployment
✅ Vercel deployment initiated

🔧 PHASE 5: Railway Backend Deployment
✅ Railway deployment initiated

🗄️  PHASE 6: Database Setup
✅ Migrations complete

📍 Service URLs:
   Frontend:  https://mindreply.vercel.app
   Backend:   https://mindreply-backend.up.railway.app
   API:       https://mindreply-backend.up.railway.app/api
   Health:    https://mindreply-backend.up.railway.app/health

✅ DEPLOYMENT COMPLETE
════════════════════════════════════════════════════
```

---

## **TROUBLESHOOTING**

### **Git Push Fails**
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
git push origin main --force-with-lease
```

### **Vercel Deployment Fails**
- Verify token has correct permissions
- Check `.env.vercel` exists
- Manually deploy: https://vercel.com/new

### **Railway Deployment Fails**
- Verify token is valid
- Check database service running
- Manually deploy: https://railway.app

### **Migrations Fail**
```
export DATABASE_URL="your_connection_string"
npx prisma migrate deploy --skip-validate
```

### **Backend Won't Start**
```
# SSH into Railway service
railway shell backend

# Check logs
npm start

# Test connection
curl http://localhost:3001/health
```

---

## **LIVE AFTER DEPLOYMENT**

Once complete, your MindReply stack is live:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://mindreply.vercel.app | ✅ Live |
| **Backend API** | https://mindreply-backend.up.railway.app/api | ✅ Live |
| **Health Check** | https://mindreply-backend.up.railway.app/health | ✅ Live |
| **Dashboard** | https://mindreply.vercel.app/dashboard | ✅ Live |

---

## **WHAT'S DEPLOYED**

**Frontend (Next.js on Vercel):**
- Dashboard at `/dashboard`
- API integration at `/api`
- Analytics, billing, approvals UIs
- Authentication with JWT

**Backend (Node.js on Railway):**
- Express server on port 3001
- 6 REST API route groups
- PostgreSQL database
- Redis cache
- JWT authentication
- Rate limiting
- Sentry error tracking

**Automation (n8n):**
- Email intake workflow
- Approval notifications
- Follow-up scheduler
- Webhook integrations

**Database (PostgreSQL on Railway):**
- 14 tables (Users, Messages, Approvals, etc.)
- 30+ indexes
- Foreign key constraints
- Audit logging

**Cache (Redis on Railway):**
- Session storage
- Job queue (Bull)
- Rate limit counters

---

## **NEXT STEPS AFTER DEPLOYMENT**

1. **Import n8n workflows:**
   - Go to n8n dashboard
   - Import from `./n8n/workflows/`
   - Configure webhook triggers

2. **Test API endpoints:**
   ```bash
   curl https://mindreply-backend.up.railway.app/api
   curl https://mindreply-backend.up.railway.app/health
   ```

3. **Monitor logs:**
   - Vercel: https://vercel.com/dashboard
   - Railway: https://railway.app
   - Sentry: https://sentry.io

4. **Configure webhooks:**
   - Gmail → n8n → Backend
   - Stripe → Backend

5. **Test workflows:**
   - Send test email
   - Verify approval queue
   - Check follow-ups trigger

---

## **SUPPORT**

See **DEPLOYMENT_GUIDE.md** for detailed manual instructions.

**Status:** ✅ Production Ready

