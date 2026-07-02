# Backend deployment to Vercel Serverless Functions

# Deploy backend as serverless functions
# Create this structure for Vercel to recognize API routes

This is a Next.js app with serverless API routes in `app/api/`.

## Deployment

1. Connect your GitHub repo to Vercel: https://vercel.com/new
2. Import the MindReply repository
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main

## Environment Variables (set in Vercel dashboard)

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
NODE_ENV=production
```

## Serverless Backend

Backend Express app is containerized and deployed to Docker Hub.
Frontend Next.js is deployed to Vercel.
Databases and services are on cloud providers.
