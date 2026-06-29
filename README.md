# MindReply

MindReply is a Next.js 15 application with a backend service for admin chat, integrations, analytics, approvals, and workflow automation. The repository includes a Next.js app, an Express backend, health endpoints, Docker support, Kubernetes manifests, and deployment scripts.

## What is here

- Next.js frontend with app routes and health checks
- Express backend with `/health`, admin chat, connectors, and analytics endpoints
- Stripe, Anthropic, Google, Clerk, Sentry, and Neon/Postgres integration points
- Docker, Docker Compose, and Kubernetes deployment assets
- GitHub Actions automation for CI, security, and deployment

## Verified runtime endpoints

- Frontend health: `GET /api/health`
- Backend health: `GET /health`
- Integrations dashboard: `GET /integrations`
- Admin dashboard: `GET /admin`

## Local development

1. Install dependencies

```bash
corepack enable
pnpm install
```

2. Create environment variables

Copy `.env.example` to `.env.local` and fill in the secrets you actually use.

3. Run the app

```bash
pnpm dev
```

4. Build and validate

```bash
pnpm lint
pnpm type-check
pnpm build
```

## Production layout

This repo is best treated as a single source of truth with these lanes:

- `main` for production-ready code
- feature branches for changes
- GitHub Actions for validation and deployment
- Vercel for the Next.js frontend
- container/Kubernetes assets for environments that need them

## Environment variables

Use `.env.example` as the baseline. At minimum, the app expects the database and connector secrets used by the health and integration routes.

## Deployment checklist

- Run lint, type-check, and build successfully
- Confirm `/api/health` returns configured connectors
- Confirm `/health` returns backend status
- Set production secrets in GitHub/Vercel
- Deploy from protected branches only

## Notes

The repository already contains multiple deployment scripts and migration notes. The goal of this cleanup is to keep the canonical path simple: documented setup, validated CI, and one clear production flow.
