# MindReply Studio

MindReply Studio is a campaign production workspace for teams that need fast, clear launch output: a concise campaign concept, five copy angles, a launch checklist, image prompts, and generated visuals.

## What is included

- Next.js frontend with a clean campaign brief flow
- Server-side generation endpoint for structured campaign output
- Five copy angles tailored to selected channels
- Launch checklist for release prep
- Visual direction prompts and generated visuals
- Health check endpoint for release validation
- GitHub Actions validation and deployment scripts
- Stripe, Anthropic, Google, Clerk, Sentry, and Neon/Postgres integration points
- Docker, Docker Compose, and Kubernetes deployment assets

## Environment variables

Use `.env.example` as the source of truth. At minimum, set:

- `OPENAI_API_KEY`
- `OPENAI_TEXT_MODEL` (default: `gpt-5.5`)
- `OPENAI_IMAGE_MODEL` (default: `gpt-image-2`)
- existing app runtime variables for auth, database, analytics, and deployment

## Install

```bash
corepack enable
pnpm install
```

## Run

```bash
pnpm dev
```

Open the studio at:

```bash
/
```

## Validate

```bash
bash automation/scripts/validate.sh
bash automation/scripts/security.sh
```

## Deploy

The repository uses `main` as the canonical production branch. Production validation runs through GitHub Actions, and the deploy step is intentionally separated from client-side code.

## Production layout

This repo is best treated as a single source of truth with these lanes:

- `main` for production-ready code
- feature branches for changes
- GitHub Actions for validation and deployment
- Vercel for the frontend runtime
- container/Kubernetes assets for environments that need them

## Notes

The public-facing copy focuses on campaign production, launch planning, and channel-ready output. Keep the boundary simple: the client gathers inputs, and the server returns structured results.
