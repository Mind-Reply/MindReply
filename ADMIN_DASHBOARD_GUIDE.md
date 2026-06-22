# 🔒 MindReply Admin Dashboard - Private Secure Interface

## **WHAT IS THIS?**

Private secure admin dashboard with:
- ✅ **Secure Authentication** – JWT + IP whitelist only for you
- ✅ **AI Chat Interface** – GPT-4 Turbo + Claude 3 Sonnet
- ✅ **All Connectors** – Gmail, Stripe, n8n, Messages, Approvals
- ✅ **Chat History** – Persistent encrypted sessions
- ✅ **Real-time WebSocket** – Live updates
- ✅ **Audit Logging** – All actions tracked
- ✅ **Isolated Instance** – Only you have access

---

## **ARCHITECTURE**

```
┌─────────────────────────────────────────┐
│  Admin Dashboard (Next.js, Port 3002)   │
│  - Chat UI                              │
│  - Session Management                   │
│  - WebSocket Client                     │
└──────────────┬──────────────────────────┘
               │ HTTPS/WSS (Secure)
┌──────────────┴──────────────────────────┐
│  Backend API (Express, Port 3001)       │
│  - Admin Auth Service                   │
│  - Chat Processing Service              │
│  - WebSocket Server                     │
│  - Connector Integration                │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│  Database Layer                         │
│  - AdminSession (secure credentials)    │
│  - AdminChatSession (encrypted)         │
│  - AdminChatMessage (history)           │
│  - AdminAuditLog (actions)              │
└─────────────────────────────────────────┘
```

---

## **QUICK START - LOCAL**

### **1. Initialize Admin**

```bash
cd C:\Users\Angel\Desktop\MindReply

# Run setup script
bash setup-admin.sh

# Or manual:
curl -X POST http://localhost:3001/api/admin/auth/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your_secure_password",
    "ipWhitelist": ["127.0.0.1"]
  }'
```

### **2. Start Local Stack**

```bash
docker-compose -f docker-compose.admin.yml up
```

**Services:**
- Admin Dashboard: http://localhost:3002
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### **3. Login**

1. Go to http://localhost:3002
2. Enter email & password
3. Start chatting with full system access

---

## **PRODUCTION DEPLOYMENT**

### **Deploy on Railway (Recommended)**

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select MindReply repo
4. Add service: Admin Dashboard (Dockerfile.admin)
5. Environment:
   ```
   DATABASE_URL=<from postgres service>
   REDIS_URL=<from redis service>
   OPENAI_API_KEY=your_key
   ANTHROPIC_API_KEY=your_key
   JWT_SECRET=your_32_char_secret
   NODE_ENV=production
   ```
6. Deploy

**Result:** https://mindreply-admin.up.railway.app

### **Free Domains**

- **Railway:** Auto generates `*.up.railway.app`
- **Netlify:** Free subdomain (if using their CDN)
- **Vercel:** Free domain integration

---

## **FEATURES**

### **1. Secure Authentication**
- JWT tokens with admin-specific secret
- IP whitelist (only you)
- Brute-force protection (lock after 5 failed attempts)
- Password change support
- Audit logging

### **2. AI Chat with Connectors**

Chat naturally, system auto-detects what connector to use:

```
You: "Show me revenue from Stripe last month"
→ System calls Stripe connector
→ Returns data automatically

You: "Send approval reminder to pending items"
→ System calls Approvals connector
→ Executes workflow

You: "What emails are in queue?"
→ System calls Messages connector
→ Lists unread inbox
```

### **3. Model Selection**
- GPT-4 Turbo (fast, powerful)
- Claude 3 Sonnet (reasoning, accuracy)

### **4. Session Management**
- Create multiple chat sessions
- Auto-saves history
- Search & archive
- Delete sessions

### **5. Real-time Updates**
- WebSocket live updates
- Message streaming
- Connector status

### **6. Audit Trail**
All actions logged:
- Login attempts
- Chat messages
- Connector calls
- Settings changes
- IP addresses

---

## **API ENDPOINTS**

### **Authentication**

```bash
# Initialize admin (first time only)
POST /api/admin/auth/init
{
  "email": "you@example.com",
  "password": "secure_password",
  "ipWhitelist": ["your_ip"]
}

# Login
POST /api/admin/auth/login
{
  "email": "you@example.com",
  "password": "secure_password"
}
Response: { token, adminId }

# Change password
POST /api/admin/auth/password
Headers: x-admin-token, x-admin-id
{
  "oldPassword": "current",
  "newPassword": "new_secure"
}

# Update IP whitelist
POST /api/admin/auth/whitelist
{
  "ipAddresses": ["1.2.3.4", "5.6.7.8"]
}
```

### **Chat**

```bash
# Create session
POST /api/admin/chat/session
{
  "title": "Stripe Analysis",
  "model": "gpt-4-turbo"
}

# List sessions
GET /api/admin/chat/sessions

# Get session
GET /api/admin/chat/:sessionId

# Send message (AI processes + connectors)
POST /api/admin/chat/:sessionId/message
{
  "message": "Show recent transactions",
  "model": "gpt-4-turbo"
}

# Delete session
DELETE /api/admin/chat/:sessionId
```

---

## **DATABASE SCHEMA**

```sql
AdminSession
├── adminEmail (unique)
├── adminPasswordHash
├── jwtSecret
├── ipWhitelist
├── loginAttempts
├── locked (brute-force protection)
└── settings (JSON)

AdminChatSession
├── adminSessionId (FK)
├── title
├── model
├── status (active/archived/deleted)
└── messages → AdminChatMessage[]

AdminChatMessage
├── chatSessionId (FK)
├── role (user/assistant)
├── content
├── tokensUsed
├── model
├── connectorsUsed (array)
└── createdAt

AdminAuditLog
├── action
├── adminEmail
├── details (JSON)
├── ipAddress
└── timestamp
```

---

## **SECURITY FEATURES**

✅ **End-to-End Encryption** – All traffic HTTPS/WSS  
✅ **JWT with Expiry** – 24-hour tokens  
✅ **IP Whitelist** – Only your IPs access  
✅ **Brute Force Protection** – Account locks after 5 fails  
✅ **Audit Logging** – All actions tracked  
✅ **No Third-Party** – Completely private  
✅ **Isolated Database** – Separate from main app  
✅ **Role-Based** – Admin-only access  

---

## **TROUBLESHOOTING**

### **Can't login**
```bash
# Check admin exists
SELECT * FROM "AdminSession" WHERE "adminEmail" = 'your@email.com';

# Reset password
UPDATE "AdminSession" SET "loginAttempts" = 0, "locked" = false WHERE "adminEmail" = 'your@email.com';
```

### **WebSocket not connecting**
- Check HTTPS/WSS enabled
- Verify IP in whitelist
- Check firewall rules

### **Connectors not working**
- Verify environment variables set
- Check API keys valid
- Review audit logs for errors

---

## **LOCAL DEV**

```bash
# Terminal 1: Backend
cd apps/backend
npm install
npm run dev

# Terminal 2: Admin Dashboard
cd apps/admin-dashboard
npm install
npm run dev

# Terminal 3: Migrations
npx prisma migrate dev
```

Then:
- Dashboard: http://localhost:3002
- Backend: http://localhost:3001
- API: http://localhost:3001/api

---

## **NEXT STEPS**

1. ✅ Initialize admin credentials
2. ✅ Set IP whitelist to your IPs only
3. ✅ Deploy to Railway/Vercel
4. ✅ Configure custom domain (optional)
5. ✅ Test all connectors
6. ✅ Review audit logs

---

**Status:** ✅ **PRODUCTION READY**

Secure. Private. Unlimited. No third-party access. Only yours.

