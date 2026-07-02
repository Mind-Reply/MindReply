# Repository Inventory

## Project Structure

```
MindReply/
├── app/                    # Next.js App Router (root-level pages)
│   ├── api/               # API routes (analytics, admin auth/chat, director)
│   ├── admin/             # Admin page (simple chat UI)
│   └── revenue/           # Revenue dashboard page
├── apps/
│   ├── backend/           # Express.js backend service
│   │   └── src/
│   │       ├── middleware/    # Auth middleware
│   │       ├── routes/        # API route handlers
│   │       ├── services/      # Business logic services
│   │       ├── utils/         # Logger, helpers
│   │       └── websocket/     # WebSocket handlers
│   ├── frontend/          # Next.js frontend app
│   │   └── src/app/
│   │       ├── admin/         # Full admin dashboard
│   │       ├── contentflow/   # Content brief management
│   │       ├── dashboard/     # Billing dashboard
│   │       └── pricing/       # Pricing page
│   ├── admin-dashboard/   # Standalone admin dashboard app
│   └── web/               # Marketing/landing page
├── backend/
│   └── api/               # Additional API endpoints (chat, revenue-dashboard)
├── frontend/              # Legacy frontend
├── ops/
│   ├── monitor/           # Health scoring
│   └── recovery/          # Auto-recovery scripts
├── scripts/               # Deployment and monitoring scripts
└── docs/                  # Documentation
```

## Services

| Service | Path | Runtime | Port | Description |
|---------|------|---------|------|-------------|
| Main App | `/` | Next.js 15 | 3000 | Root application with App Router |
| Backend API | `apps/backend/` | Express.js | 4000 | Core API: auth, briefs, billing, analytics |
| Frontend | `apps/frontend/` | Next.js | 3001 | Primary user-facing frontend |
| Admin Dashboard | `apps/admin-dashboard/` | Next.js | 3002 | Admin management UI |
| Backend API (legacy) | `backend/` | Express.js | — | MCP chat proxy, revenue dashboard |

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.0.0 | Frontend framework |
| react | ^18.3.0 | UI library |
| express | — | Backend HTTP framework |
| prisma | — | Database ORM (backend) |
| drizzle-orm | ^0.38.4 | Database ORM (root app) |
| stripe | ^17.0.0 | Payment processing |
| @sentry/nextjs | ^8.0.0 | Error tracking |
| winston | — | Structured logging (backend) |
| jsonwebtoken | — | JWT auth (backend) |
| axios | — | HTTP client (frontend) |

## Databases

| Database | Provider | Usage |
|----------|----------|-------|
| PostgreSQL | Neon (`@neondatabase/serverless`) | Primary data store |
| PostgreSQL | Via Prisma | Backend service data |

## External Integrations

| Service | Purpose | Config Key |
|---------|---------|------------|
| Anthropic Claude | AI chat responses | `ANTHROPIC_API_KEY` |
| Stripe | Payments & billing | `STRIPE_SECRET_KEY` |
| Google Analytics | Event tracking | `GA_MEASUREMENT_ID`, `GA_API_SECRET` |
| Slack | Notifications & monitoring | `SLACK_WEBHOOK` |
| Sentry | Error monitoring | `SENTRY_DSN` |
| Vercel | Hosting & deployment | Automatic |
| Gmail | Email connector | Via backend service |

## Build & Deploy

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Lint (Next.js) |
| `npm run type-check` | TypeScript check |
| `npm run ci` | Type-check + build |

## Node.js Requirement

- Engine: Node.js ≥22
