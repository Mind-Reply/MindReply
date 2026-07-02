# 1. Get the latest repo
cd /tmp
git clone https://github.com/Mind-Reply/MindReply.git
cd MindReply/Deploy

# 2. Ensure env file exists (create .env from .env.example if present)
cp .env.example .env 2>/dev/null || true
# Edit .env to set required values (DB, REDIS, STRIPE keys, DOMAIN)

# 3. Pull images, build, and start
docker-compose pull --ignore-pull-failures
docker-compose build --no-cache
docker-compose up -d

# 4. Follow logs for failing service
docker-compose logs -f --tail=200
