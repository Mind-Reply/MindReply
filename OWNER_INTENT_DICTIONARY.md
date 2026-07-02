# OWNER INTENT DICTIONARY

Purpose: translate the owner's direct, raw, urgent wording into precise, safe, executable production-agent language — without weakening intent, urgency, or ambition.

Operating principle for every entry:

**Owner raw intent → safe execution translation → agent task → approval requirement → evidence required.**

Rules applied to all mappings:
- Preserve owner intent. Never dilute it into vague corporate language.
- Remove ambiguity. Every translation is directly executable by Devin, GitHub, n8n, Vercel, or the Owner Cockpit.
- Never convert a request into fake, spammy, deceptive, or platform-breaking actions.
- If wording could be interpreted unsafely, map it to the closest legitimate production action.
- Every executed task must produce verifiable evidence (URLs, logs, screenshots, commit hashes, dashboards).

---

## Mappings

### 1. "viral"

| Stage | Translation |
|---|---|
| Owner raw intent | "Make this viral" — maximize organic reach and shareability, fast. |
| Safe execution translation | Optimize content for maximum organic distribution: strong hooks, platform-native formats, SEO/social metadata, share triggers, and distribution across all owned channels. No fake engagement, bought bots, or engagement manipulation. |
| Agent task | Produce high-shareability content variants; add OG/Twitter cards, structured data; schedule cross-channel distribution via n8n; instrument analytics to measure reach. |
| Approval requirement | Owner approves content + channel list before publishing. |
| Evidence required | Published URLs, analytics dashboard (impressions/shares/CTR), n8n execution logs. |

### 2. "stealth"

| Stage | Translation |
|---|---|
| Owner raw intent | "Do it stealth" — don't announce publicly, keep competitors and public unaware. |
| Safe execution translation | Private/unlisted deployment: no public announcements, noindex where appropriate, private repos, access-gated preview environments. NOT: hiding identity from platforms, evading platform detection, or impersonation. |
| Agent task | Deploy to password-protected/preview Vercel environment; set robots noindex; keep repo private; restrict cockpit visibility to owner. |
| Approval requirement | Owner confirms what stays private and when (if ever) it goes public. |
| Evidence required | Preview URL + access proof, robots/headers check, repo visibility screenshot. |

### 3. "human-like"

| Stage | Translation |
|---|---|
| Owner raw intent | "Make it human-like" — output must read natural, not robotic or template-y. |
| Safe execution translation | Natural-tone copywriting: varied sentence rhythm, brand voice, conversational phrasing. NOT: impersonating a real person, fake authorship, or evading AI-content disclosure rules where platforms require it. |
| Agent task | Apply brand voice guide; rewrite templated copy into natural tone; A/B test variants; comply with each platform's disclosure policies. |
| Approval requirement | Owner approves the voice/tone samples once; subsequent copy auto-applies the approved voice. |
| Evidence required | Before/after copy samples, published examples, A/B results. |

### 4. "fully automatic"

| Stage | Translation |
|---|---|
| Owner raw intent | "Run it fully automatic" — no manual babysitting, system runs itself. |
| Safe execution translation | End-to-end automated pipeline with monitoring, retries, and alerting — plus mandatory human approval gates at irreversible or externally-visible steps (publishing, payments, outreach). |
| Agent task | Build n8n workflows with error handling + retries; add health checks and alerting; queue externally-visible actions into the Owner Cockpit approval queue. |
| Approval requirement | One-time approval of the pipeline design; per-item approval only at defined gates. |
| Evidence required | n8n workflow export + execution logs, uptime/alert dashboard, approval-queue audit trail. |

### 5. "revenue today"

| Stage | Translation |
|---|---|
| Owner raw intent | "I want revenue today" — shortest path to real, collectable money now. |
| Safe execution translation | Activate the fastest legitimate monetization path already built: live Stripe checkout, published pricing, working payment webhooks, launch announcement to existing audience. NOT: fake scarcity, deceptive claims, or charging before the product works. |
| Agent task | Verify Stripe live mode + webhooks; confirm checkout end-to-end with a real test; publish pricing page; trigger launch sequence to owned channels. |
| Approval requirement | Owner approves pricing and launch message before send. |
| Evidence required | Stripe dashboard (live mode, webhook 200s), successful checkout receipt, live pricing URL, send logs. |

### 6. "20-30 sites/day"

| Stage | Translation |
|---|---|
| Owner raw intent | "Ship 20–30 sites per day" — high-volume automated site production. |
| Safe execution translation | Templated site-generation pipeline producing 20–30 unique, quality-checked deployments/day on Vercel — each with original content, distinct value, and passing quality gates. NOT: doorway pages, duplicate/thin content, or SEO spam networks. |
| Agent task | Build generator (template + unique data/content per site); enforce QA gate (lint, build, content-uniqueness check, Lighthouse threshold); auto-deploy via Vercel API; log every deployment to the cockpit. |
| Approval requirement | Owner approves the template and QA thresholds; daily batch report reviewed in cockpit. |
| Evidence required | Daily deployment list with live URLs, QA gate results per site, Vercel deployment logs. |

### 7. "private backend"

| Stage | Translation |
|---|---|
| Owner raw intent | "Keep the backend private" — internals invisible and locked down. |
| Safe execution translation | Backend hardened and non-public: auth on all endpoints, secrets in env vaults, private networking where possible, no exposed admin routes, no secrets in the repo. |
| Agent task | Audit routes for auth; move secrets to platform env vars; restrict CORS; disable public API docs; add rate limiting; verify nothing sensitive in git history. |
| Approval requirement | Owner approves the access model (who/what can reach the backend). |
| Evidence required | Security audit checklist, failed-unauthenticated-request proof, secrets-scan report. |

### 8. "social profiles"

| Stage | Translation |
|---|---|
| Owner raw intent | "Set up social profiles" — brand presence across platforms. |
| Safe execution translation | Official brand accounts created/configured per platform ToS, with consistent branding, bios, links, and connected posting automation via official APIs. NOT: fake personas, sockpuppets, or mass account creation. |
| Agent task | Prepare profile kit (avatars, banners, bios, links); document setup steps per platform; connect approved accounts to n8n via official APIs for scheduled posting. |
| Approval requirement | Owner creates/owns the accounts and approves the profile kit; owner grants API access. |
| Evidence required | Live profile URLs, connected-integration screenshots, first scheduled post logs. |

### 9. "ads"

| Stage | Translation |
|---|---|
| Owner raw intent | "Run ads" — paid acquisition, now. |
| Safe execution translation | Compliant paid campaigns on official ad platforms: truthful claims, policy-compliant creatives, tracked conversions, capped budgets. NOT: misleading claims, cloaking, or policy-violating creatives. |
| Agent task | Draft campaign structure (audiences, creatives, copy, budget caps); set up conversion tracking; prepare launch checklist per platform policy. |
| Approval requirement | Owner approves budget, creatives, and targeting before any spend. |
| Evidence required | Ad platform dashboard (spend, CTR, conversions), creative approvals, tracking verification. |

### 10. "owner cockpit"

| Stage | Translation |
|---|---|
| Owner raw intent | "Everything through my cockpit" — single control surface, owner sees and approves everything. |
| Safe execution translation | Owner Cockpit is the single pane of glass: all agent actions logged, all approval gates surfaced there, real-time status of Devin/GitHub/n8n/Vercel pipelines. |
| Agent task | Route approval requests and evidence artifacts into the cockpit; integrate status feeds (deployments, workflows, revenue); maintain audit log. |
| Approval requirement | Structural changes to the cockpit itself require owner approval. |
| Evidence required | Cockpit URL, audit log entries, screenshot of approval queue in action. |

### 11. "no traditional AI"

| Stage | Translation |
|---|---|
| Owner raw intent | "No traditional AI" — no generic, obviously-AI, low-quality generated output; no dependence on generic chatbot flows. |
| Safe execution translation | Output must meet human-quality editorial standards: brand voice, factual accuracy, no filler, no generic AI phrasing. Deterministic pipelines and curated templates preferred over raw generative output; all generated content passes a quality gate before shipping. |
| Agent task | Implement quality gate (voice check, factuality check, banned-phrase list); prefer structured/templated generation with curated data; flag anything below threshold for human review. |
| Approval requirement | Owner approves the quality-gate criteria. |
| Evidence required | Quality-gate reports per artifact, rejected-item log, published samples. |

### 12. "copywriting everything"

| Stage | Translation |
|---|---|
| Owner raw intent | "Copywrite everything" — every user-facing word is deliberate, persuasive, on-brand. |
| Safe execution translation | Full copy audit + rewrite of all surfaces (site, emails, ads, cockpit, error states) to the approved brand voice, with truthful claims only. |
| Agent task | Inventory all copy surfaces; rewrite to voice guide; verify claims are accurate; ship via PRs per surface. |
| Approval requirement | Owner approves the voice guide and headline-level copy; body copy ships on gate pass. |
| Evidence required | Copy inventory doc, PR links, before/after screenshots. |

### 13. "evidence-first production"

| Stage | Translation |
|---|---|
| Owner raw intent | "Evidence-first" — nothing counts as done without proof. |
| Safe execution translation | Every task closes only with verifiable artifacts: live URLs, logs, screenshots, dashboards, commit hashes. "Done" claims without evidence are rejected. |
| Agent task | Attach evidence to every completed task in the cockpit/PR; maintain the Global Evidence Registry; auto-reject completion reports lacking artifacts. |
| Approval requirement | None for evidence collection itself; evidence standards changes require owner approval. |
| Evidence required | The evidence itself, indexed in GLOBAL_EVIDENCE_REGISTRY.md / cockpit. |

### 14. "secure this chat"

| Stage | Translation |
|---|---|
| Owner raw intent | "Secure this chat" — don't lose this context; make it durable. |
| Safe execution translation | Persist owner context, operating rules, and session state into private repo files. No secret values stored in the repo. NOT: encrypting or hiding the conversation from the platform. |
| Agent task | Save/update owner context docs and session checkpoints in the private repo so continuity survives resets. |
| Approval requirement | None for saving context; owner approves changes to operating rules. |
| Evidence required | Committed file paths + commit hashes. |

### 15. "make it premium"

| Stage | Translation |
|---|---|
| Owner raw intent | "Make it premium" — nothing generic, everything intentional. |
| Safe execution translation | Dark, sharp, non-generic visual identity: clean typography, purposeful whitespace, no stock-photo energy, no commodity SaaS aesthetics. NOT: over-engineering or adding expensive features. |
| Agent task | Apply the premium design system across surfaces; audit for generic patterns and replace them. |
| Approval requirement | Owner approves the visual direction once. |
| Evidence required | Before/after screenshots, live URLs. |

### 16. "ship it"

| Stage | Translation |
|---|---|
| Owner raw intent | "Ship it" — get it live, now. |
| Safe execution translation | Open PR → passing build → smoke test → preview deploy → production only after validation. NOT: pushing to production without checks. |
| Agent task | Create PR, verify CI, deploy to Vercel preview, run smoke test, queue production deploy for approval if customer-facing. |
| Approval requirement | Owner approval for customer-facing production deploys. |
| Evidence required | PR link, CI results, preview URL, smoke-test output. |

### 17. "connect everything"

| Stage | Translation |
|---|---|
| Owner raw intent | "Connect everything" — one unified ops engine across all tools. |
| Safe execution translation | Map GitHub, Vercel, n8n, Stripe, and other integrations into one ops engine with least-privilege access; each connector has a defined scope and documented purpose. NOT: granting all tools full access to everything. |
| Agent task | Configure integrations with minimal scopes; document each connector; surface connection status in the Owner Cockpit. |
| Approval requirement | Owner approves each new integration and its scope. |
| Evidence required | Integration status in cockpit, scope documentation, connection test logs. |

---

## Extending this dictionary

New owner phrases are added using the same five-stage template. If a phrase has no safe legitimate mapping (e.g. it can only mean deception, spam, or platform abuse), the translator must return it to the owner with the closest legitimate alternative — never silently execute, never silently drop.

See OWNER_COMMAND_TRANSLATOR.md for how these mappings are applied at runtime.
