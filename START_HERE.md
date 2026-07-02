# MindReply — Start Here

## Repository

- **Repo**: `Mind-Reply/MindReply`
- **Stack**: Next.js 15, Express.js, TypeScript, Prisma, PostgreSQL (Neon)
- **Hosting**: Vercel (frontend), backend TBD
- **Classification**: Production web app with private owner control plane

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in required values (see below)

# Run development server
npm run dev
```

## Required Environment Variables

These must be set before the app will function. See `.env.example` for the full list.

| Variable | Purpose | How to generate |
|----------|---------|-----------------|
| `ADMIN_PASSWORD` | Admin dashboard login | Choose a strong password (32+ chars) |
| `ADMIN_TOKEN_SECRET` | Signs admin auth tokens | `openssl rand -hex 32` |
| `JWT_SECRET` | Backend JWT signing | `openssl rand -hex 64` |
| `DATABASE_URL` | PostgreSQL connection | From your database provider |
| `FRONTEND_URL` | CORS origin restriction | Your production URL |

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checker |
| `npm start` | Start production server |

## Key Docs

| Document | Purpose |
|----------|---------|
| `DEPLOYMENT_RUNBOOK.md` | Step-by-step deployment procedure |
| `GO_LIVE_CHECKLIST.md` | Pre-launch checklist |
| `GO_NO_GO_TABLE.md` | Current go/no-go status per area |
| `SECURITY_ROTATION.md` | Credential rotation checklist |
| `POST_LAUNCH_MONITORING.md` | Post-launch monitoring setup |
| `BLOCKERS.md` | Current blockers |
| `ACCESS_REQUEST.md` | Missing access requests |

## Current Status

**NO-GO for production** until:
1. Required secrets are set (`ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`, `JWT_SECRET`)
2. All credentials rotated (`.env` was previously committed — see `SECURITY_ROTATION.md`)
3. Smoke tests pass
4. Monitoring configured

See `GO_NO_GO_TABLE.md` for the full status breakdown.
