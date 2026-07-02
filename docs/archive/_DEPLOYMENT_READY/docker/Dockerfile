# Build stage
FROM dhi.io/node:22-alpine3.24-dev AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig.json ./apps/backend/

RUN npm install
RUN cd apps/backend && npm install

COPY apps/backend/src ./apps/backend/src

RUN cd apps/backend && npm run build

# Runtime stage
FROM dhi.io/node:22-alpine3.24

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

COPY apps/backend/package.json ./apps/backend/

EXPOSE 3001

WORKDIR /app/apps/backend

CMD ["npm", "run", "start"]
