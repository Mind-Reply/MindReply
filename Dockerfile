# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig.json ./apps/backend/

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN cd apps/backend && if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY apps/backend/src ./apps/backend/src

RUN cd apps/backend && npm run build

# Runtime stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

COPY apps/backend/package.json ./apps/backend/

EXPOSE 3001

WORKDIR /app/apps/backend

ENV NODE_ENV=production

CMD ["npm", "run", "start"]