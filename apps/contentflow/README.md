# ContentFlow - AI-Assisted Content Brief & Strategy Generator

A human-supervised service that generates professional content briefs in minutes instead of hours.

## Features

- **AI Brief Generation**: GPT-4 creates structured content briefs from simple intake
- **SEO Integration**: Automatic keyword research, meta optimization, internal linking strategy
- **Distribution Strategy**: Multi-channel distribution plan tailored to content type
- **Content Calendar**: 4-week rolling calendar with posting schedule
- **Human Review Layer**: Strategist approves/customizes every brief before delivery
- **PDF Export**: Professional branded PDFs ready to share with clients
- **Dashboard**: Track briefs, versions, performance metrics
- **Team Collaboration**: Assign reviewers, add notes, version history
- **White-Label Ready**: Agencies can rebrand and resell

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Node.js + Express (shared infrastructure with AgencyComm)
- **Database**: PostgreSQL + Prisma
- **Storage**: AWS S3 for PDFs
- **AI**: OpenAI GPT-4
- **PDF Generation**: puppeteer or pdfkit
- **Billing**: Stripe

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (shared with AgencyComm)
- Redis (shared cache)
- AWS S3 bucket
- OpenAI API key
- Stripe account

### Setup

```bash
# Install dependencies (from mono-repo root)
npm install

# Run database migrations
npx prisma migrate dev

# Start backend
cd apps/backend && npm run dev

# Start frontend (new tab)
cd apps/frontend && npm run dev
```

### Access

- Frontend: http://localhost:3000/contentflow
- API: http://localhost:3001/api/briefs

## Project Structure

```
contentflow/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── briefService.ts       # Brief generation logic
│   │   │   │   ├── seoService.ts         # SEO keyword research
│   │   │   │   ├── distributionService.ts # Distribution planning
│   │   │   │   └── pdfService.ts         # PDF generation
│   │   │   ├── routes/
│   │   │   │   └── briefs.ts             # Brief CRUD + generation
│   │   │   └── jobs/
│   │   │       ├── briefGenerationJob.ts # Background brief creation
│   │   │       └── pdfGenerationJob.ts   # Async PDF creation
│   │   └── prisma/
│   │       └── migrations/               # Schema updates
│   │
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   └── contentflow/
│       │   │       ├── dashboard/        # Brief list
│       │   │       ├── create/           # Brief builder
│       │   │       ├── review/           # Human review interface
│       │   │       └── view/             # Brief detail view
│       │   ├── components/
│       │   │   ├── BriefBuilder.tsx      # Intake form
│       │   │   ├── ReviewQueue.tsx       # Pending reviews
│       │   │   ├── BriefPreview.tsx      # Brief preview
│       │   │   └── PDFExport.tsx         # Export/download
│       │   └── lib/
│       │       └── contentflow-api.ts    # API client
│       └── public/
│           └── templates/                 # PDF templates
│
└── docs/
    ├── BRIEF-FRAMEWORK.md                # Proprietary brief structure
    ├── PROMPTS.md                        # AI prompt engineering
    └── MONETIZATION.md                   # Pricing & billing
```

## Data Model

```prisma
model BriefProject {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  title        String
  topic        String
  targetAudience String
  contentType  String   // blog, video, social, whitepaper, etc.
  goals        String[]
  keywords     String[]
  status       String   @default("draft") // draft, review, approved, delivered
  
  // Generated content
  brief        BriefContent?
  seoStrategy  SEOStrategy?
  distribution DistributionPlan?
  calendar     ContentCalendar?
  
  // Review & delivery
  reviewedBy   String?
  reviewer     User?    @relation("reviewer", fields: [reviewedBy], references: [id])
  reviewedAt   DateTime?
  deliveredAt  DateTime?
  pdfUrl       String?
  
  // Metrics
  views        Int      @default(0)
  downloads    Int      @default(0)
  shares       Int      @default(0)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime?

  @@index([userId])
  @@index([status])
}

model BriefContent {
  id              String  @id @default(cuid())
  projectId       String  @unique
  project         BriefProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  angle           String  // Unique angle/perspective
  keyMessages     String[]
  targetPain      String
  solutionOffered String
  callToAction    String
  estimatedLength Int     // Words for blog, mins for video
  tone            String  // Formal, casual, technical, etc.
  structureNotes  String
  
  createdAt       DateTime @default(now())
}

model SEOStrategy {
  id                String  @id @default(cuid())
  projectId         String  @unique
  project           BriefProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  primaryKeyword    String
  secondaryKeywords String[]
  metaTitle         String
  metaDescription   String
  focusTopics       String[]
  internalLinks     String[] // Suggested internal linking
  externalLinks     String[] // Authoritative sources to cite
  relatedQueries    String[] // People also ask
  
  createdAt         DateTime @default(now())
}

model DistributionPlan {
  id              String  @id @default(cuid())
  projectId       String  @unique
  project         BriefProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  channels        Channel[]
  crossPromotion  String[] // How to repurpose content
  timing          String   // Best time to post
  frequency       String   // Publishing cadence
  metrics         String[] // KPIs to track
  
  createdAt       DateTime @default(now())
}

model Channel {
  id                String @id @default(cuid())
  distributionId    String
  distribution      DistributionPlan @relation(fields: [distributionId], references: [id], onDelete: Cascade)
  
  name              String // LinkedIn, Twitter, Instagram, etc.
  postingTime       String
  format            String // Adapted format for channel
  estimatedReach    Int
  callToAction      String
}

model ContentCalendar {
  id          String  @id @default(cuid())
  projectId   String  @unique
  project     BriefProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  entries     CalendarEntry[]
  createdAt   DateTime @default(now())
}

model CalendarEntry {
  id          String  @id @default(cuid())
  calendarId  String
  calendar    ContentCalendar @relation(fields: [calendarId], references: [id], onDelete: Cascade)
  
  date        DateTime
  contentType String  // What piece of content
  channel     String  // Where to post
  notes       String?
}

model BriefTemplate {
  id      String @id @default(cuid())
  name    String
  content Json   // Template for brief structure
  public  Boolean @default(false)
  
  createdAt DateTime @default(now())
}
```

## Human Approval Workflow

```
User Intake (Create Brief)
    ↓
[AI Generation]
├─ Brief content (angle, key messages, tone)
├─ SEO strategy (keywords, meta, internal links)
├─ Distribution plan (channels, timing, cross-promotion)
└─ Content calendar (4-week schedule)
    ↓
BriefProject status → "review"
    ↓
[HUMAN REVIEW LAYER] ← **CRITICAL CHECKPOINT**
├─ Strategist sees pending briefs in queue
├─ Reviews AI-generated content
├─ Can edit: angle, messages, keywords, distribution
├─ Options:
│  ├─ ✅ APPROVE (ready for delivery)
│  ├─ 🔧 EDIT & APPROVE
│  ├─ ⚠️ REQUEST CHANGES (send back to user)
│  └─ ❌ REJECT (not publishable)
    ↓
[If APPROVED]
├─ Generate PDF
├─ Upload to S3
├─ Send to user via email
├─ Update dashboard
├─ Track metrics (views, downloads, shares)
    ↓
✅ BRIEF DELIVERED
```

## Escalation Rules

Auto-escalate to review if:
- Confidence score < 0.75 (AI uncertain)
- Multiple custom keywords (complex topic)
- Niche/technical industry
- International audience (language considerations)
- High-value project (premium tier)

## API Endpoints

```
POST   /api/briefs              # Create brief (intake)
GET    /api/briefs              # List user's briefs
GET    /api/briefs/:id          # Get brief details
PATCH  /api/briefs/:id          # Update brief
DELETE /api/briefs/:id          # Archive brief

POST   /api/briefs/:id/generate # Trigger AI generation
GET    /api/briefs/:id/preview  # Preview before approval

POST   /api/review/queue        # Get pending reviews (admin)
POST   /api/review/:id/approve  # Approve brief
POST   /api/review/:id/reject   # Reject with feedback
POST   /api/review/:id/edit     # Edit & approve

GET    /api/briefs/:id/pdf      # Download PDF
POST   /api/briefs/:id/share    # Get shareable link + analytics

GET    /api/analytics           # User's brief analytics
```

## Monetization

| Tier | Price | Briefs/mo | Features |
|------|-------|-----------|----------|
| Free | $0 | 1 | Basic brief, no SEO |
| Pro | $29 | 10 | Full brief, SEO, distribution, templates |
| Agency | $199 | Unlimited | White-label, API, team users, priority review |
| Enterprise | Custom | Unlimited | Dedicated strategist, SLA, integrations |

**Billing:**
- Monthly subscription
- Usage overage: $2.90 per extra brief (Pro tier)
- Annual discount: 20%
- Free trial: 14 days, includes 1 free brief

## Differentiation

1. **Proprietary Brief Framework**: "ContentFlow Brief" structure is unique
2. **Human-Verified Quality**: Every brief reviewed by strategist
3. **SEO Intelligence**: Integrated keyword research, not just structure
4. **Distribution Strategy**: Complete go-to-market plan, not just brief
5. **Viral Referrals**: Share brief results → drives word-of-mouth growth
6. **White-Label**: Agencies rebrand and resell for recurring revenue

## Success Metrics

- Briefs created per month
- Average review time
- User satisfaction (brief quality rating)
- Adoption rate per tier
- Churn rate
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Viral coefficient (referrals)

## Roadmap

**Phase 1: MVP**
- [ ] Brief generation engine
- [ ] Human review queue
- [ ] PDF export
- [ ] Basic analytics
- [ ] Stripe billing

**Phase 2: Growth**
- [ ] White-label version
- [ ] API for agencies
- [ ] Team collaboration
- [ ] Template library
- [ ] Slack integration

**Phase 3: Scale**
- [ ] AI fine-tuning (better industry-specific briefs)
- [ ] Integration with content platforms (HubSpot, Marketo)
- [ ] Competitive intelligence
- [ ] Content performance predictions
- [ ] Multi-language support

## Contributing

Internal team only (Phase 1). Contact owner for access.

## License

Proprietary - Mind-Reply 2026
