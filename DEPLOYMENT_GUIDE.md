# MindReply Deployment Guide

## Quick Start

### Prerequisites
- GitHub repository: https://github.com/Mind-Reply/MindReply
- Vercel account: https://vercel.com
- Railway account: https://railway.app
- Git installed locally

---

## **Option 1: Vercel (Frontend) + Railway (Backend) [RECOMMENDED]**

### **Step 1: GitHub Preparation**

```bash
cd C:\Users\Angel\Desktop\MindReply

# Push latest code
git add .
git commit -m "Deploy: production infrastructure"
git push origin main
```

### **Step 2: Deploy Frontend to Vercel**

1. Go to https://vercel.com/new
2. Click "Import GitHub Repository"
3. Select: `Mind-Reply/MindReply`
4. Framework: **Next.js** (auto-detected)
5. Build Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Environment Variables (add from `.env.vercel`):
   ```
   NEXT_PUBLIC_API_URL=https://mindreply-backend.up.railway.app
   ```
7. Click **Deploy**

**Result:** Frontend live at `https://mindreply.vercel.app`

---

### **Step 3: Deploy Backend to Railway**

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select: `Mind-Reply/MindReply`
4. Railway will detect `Dockerfile.backend`
5. Add Service: **PostgreSQL 15**
6. Add Service: **Redis 7**
7. Configure Backend Service:
   - Dockerfile: `./Dockerfile.backend`
   - Port: `3001`
8. Add Environment Variables:
   ```
   DATABASE_URL=<from Postgres service>
   REDIS_URL=<from Redis service>
   JWT_SECRET=<generate: openssl rand -base64 32>
   OPENAI_API_KEY=<your key>
   ANTHROPIC_API_KEY=<your key>
   GMAIL_CLIENT_ID=<your id>
   GMAIL_CLIENT_SECRET=<your secret>
   STRIPE_SECRET_KEY=<your key>
   SENTRY_DSN=<optional>
   ```
9. Click **Deploy**

**Result:** Backend live at `https://mindreply-backend.up.railway.app`

---

### **Step 4: Setup Database**

```bash
# SSH into Railway backend or run locally with production DATABASE_URL
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

### **Step 5: Setup n8n Automation**

Option A (Simple): Use n8n Cloud
1. Go to https://n8n.cloud
2. Import workflows from `./n8n/workflows/`
3. Configure webhooks to point to backend

Option B (Full Control): Deploy n8n on Railway
1. Railway → New Service → Docker
2. Image: `n8nio/n8n:latest`
3. Environment:
   ```
   N8N_HOST=n8n.railway.app
   N8N_ENCRYPTION_KEY=<generate>
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=<postgres service>
   ```

---

### **Step 6: Verify Deployments**

```bash
# Frontend
curl https://mindreply.vercel.app

# Backend health
curl https://mindreply-backend.up.railway.app/health

# API status
curl https://mindreply-backend.up.railway.app/api
```

---

## **Option 2: Fly.io (Backend)**

```bash
npm install -g flyctl

flyctl auth login

flyctl launch --dockerfile Dockerfile.backend --name mindreply-backend

# Add secrets
flyctl secrets set \
  DATABASE_URL="your_url" \
  JWT_SECRET="your_secret" \
  OPENAI_API_KEY="your_key"

flyctl deploy
```

---

## **Option 3: All on Railway (Monolith)**

1. Railway → New Project
2. Add Services:
   - **Frontend** (Dockerfile.frontend, port 5000)
   - **Backend** (Dockerfile.backend, port 3001)
   - **PostgreSQL 15**
   - **Redis 7**
   - **n8n** (official image)
3. Wire services together with environment variables
4. Deploy

---

## **Troubleshooting**

### Backend won't start
```bash
# Check logs
railway logs

# Verify environment variables
railway env

# Run migrations
npx prisma migrate deploy
```

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` points to running backend
- Check CORS in backend (`apps/backend/src/index.ts`)

### Database connection failed
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/db`
- Check Postgres service is running
- Test connection: `psql $DATABASE_URL`

---

## **Final Checklist**

- [ ] GitHub repo pushed to main
- [ ] Vercel frontend deployed
- [ ] Railway backend deployed
- [ ] PostgreSQL service running
- [ ] Redis service running
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] n8n workflows imported
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend loads and connects to API

---

## **Production URLs**

After deployment:
- **Frontend:** https://mindreply.vercel.app
- **Backend:** https://mindreply-backend.up.railway.app
- **API:** https://mindreply-backend.up.railway.app/api
- **Health:** https://mindreply-backend.up.railway.app/health

---

**Status:** ✅ Ready for deployment

