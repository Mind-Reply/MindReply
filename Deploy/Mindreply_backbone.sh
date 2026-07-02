#!/usr/bin/env bash
set -e

echo "=== MindReply Production Backbone — Full System Bring-Up ==="

###############################################
# 0. DIRECTORY SETUP
###############################################
mkdir -p api-core web infra n8n workflows scripts private admin

###############################################
# 1. DOCKER COMPOSE (CORE ENGINE)
###############################################
cat > infra/docker-compose.yml << 'EOF'
version: "3.9"
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: mindreply
      POSTGRES_PASSWORD: change_me
      POSTGRES_DB: mindreply
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    restart: unless-stopped

  api-core:
    image: node:20
    working_dir: /app
    command: sh -c "npm install && npm run start"
    volumes:
      - ../api-core:/app
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgres://mindreply:change_me@postgres:5432/mindreply
      REDIS_URL: redis://redis:6379
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      EXECUTIONS_MODE: queue
      QUEUE_BULL_REDIS_HOST: redis
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: mindreply
      DB_POSTGRESDB_USER: mindreply
      DB_POSTGRESDB_PASSWORD: change_me
      N8N_ENCRYPTION_KEY: change_this_to_a_long_random_value
      GENERIC_TIMEZONE: Europe/Sofia
    depends_on:
      - postgres
      - redis

  n8n-worker:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: unless-stopped
    command: worker --concurrency=5
    environment:
      EXECUTIONS_MODE: queue
      QUEUE_BULL_REDIS_HOST: redis
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: mindreply
      DB_POSTGRESDB_USER: mindreply
      DB_POSTGRESDB_PASSWORD: change_me
      N8N_ENCRYPTION_KEY: change_this_to_a_long_random_value
      GENERIC_TIMEZONE: Europe/Sofia
    depends_on:
      - postgres
      - redis

  web:
    image: node:20
    working_dir: /app
    command: sh -c "npm install && npm run start"
    volumes:
      - ../web:/app
    environment:
      NODE_ENV: production
      PORT: 3000
      API_BASE_URL: http://api-core:4000
    ports:
      - "3000:3000"
    depends_on:
      - api-core

volumes:
  postgres_data:
EOF

###############################################
# 2. API CORE (PRIVATE ADMIN ENGINE)
###############################################
cat > api-core/index.js << 'EOF'
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// PUBLIC HEALTH
app.get('/health', (req, res) =>
  res.json({ status: 'live', service: 'MindReply Core', time: new Date().toISOString() })
);

// STRIPE CHECKOUT
app.post('/api/payments/stripe/create-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: 'price_XXX', quantity: 1 }],
    success_url: 'https://your-site.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://your-site.com/cancel'
  });
  res.json({ url: session.url });
});

// STRIPE WEBHOOK
app.post('/webhooks/stripe', (req, res) => {
  res.json({ received: true });
});

// PRIVATE ADMIN
app.get('/admin/metrics', (req, res) => res.json({ ok: true }));
app.post('/admin/rollback', (req, res) => res.json({ status: 'rollback_triggered' }));

app.listen(PORT, () => console.log(`MindReply API Core live on ${PORT}`));
EOF

###############################################
# 3. WEB FRONTEND (PUBLIC)
###############################################
cat > web/server.js << 'EOF'
const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/agent', (req, res) => res.sendFile(__dirname + '/public/agent.html'));
app.get('/pack', (req, res) => res.sendFile(__dirname + '/public/pack.html'));
app.get('/privacy', (req, res) => res.sendFile(__dirname + '/public/privacy.html'));

app.listen(3000, () => console.log("MindReply Web live on 3000"));
EOF

###############################################
# 4. HEALTH + ROLLBACK SCRIPTS
###############################################
mkdir -p scripts

cat > scripts/health.sh << 'EOF'
#!/usr/bin/env bash
set -e
URL="${1:-http://localhost:4000/health}"
RESP=$(curl -s "$URL" || echo "fail")
echo "Health response: $RESP"
if [[ "$RESP" != *"live"* ]]; then
  echo "Unhealthy → triggering rollback"
  ./scripts/rollback.sh
fi
EOF

cat > scripts/rollback.sh << 'EOF'
#!/usr/bin/env bash
set -e
echo "Rolling back to previous stable release..."
# rollback logic placeholder
EOF

chmod +x scripts/health.sh scripts/rollback.sh

###############################################
# 5. GITHUB ACTIONS (CI/CD)
###############################################
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: MindReply Deploy
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Build API
        working-directory: api-core
        run: npm ci

      - name: Build Web
        working-directory: web
        run: npm ci

      - name: Health Check
        run: ./scripts/health.sh

      - name: Deploy
        run: echo "Deploying MindReply backbone..."
EOF

###############################################
# 6. START SYSTEM
###############################################
echo "Starting MindReply backbone..."
docker compose -f infra/docker-compose.yml up -d

echo "=== MindReply Backbone Ready ==="
