# MindReply Defensive Security And Growth Operating Pack

Audience: internal operators only.

Purpose: keep deployment, domain, public trust, revenue visibility, and MRagent quality moving without exposing internal strategy on the public site.

## Hard Rule

All security work is defensive only: protect accounts, scan code, rotate secrets, monitor logs, reduce attack surface, and document incident response. No unauthorized access, credential misuse, exploit attempts, scraping behind access controls, or third-party disruption.

## Security Team: 8 Lanes

1. Secret Hygiene Lead
   - Check repo, workflows, docs, and public copy for leaked tokens or private keys.
   - Output: rotation list, affected file, current exposure status, owner action.

2. Deployment Guard Lead
   - Confirm `vercel.json` branch gates, manual deploy workflow, and required secrets.
   - Output: deploy readiness line and blocking provider actions.

3. Domain And Hosting Lead
   - Verify canonical Vercel project, custom domains, redirects, and duplicate provider projects.
   - Output: keep/remove project map and domain status.

4. CI Integrity Lead
   - Watch GitHub Actions failures and classify by verifier, dependency, build, or provider.
   - Output: failing job, exact file/step, proposed patch.

5. Public Surface Lead
   - Inspect public pages for internal language, unsafe claims, or trust-breaking copy.
   - Output: remove/keep/change list.

6. Dependency Lead
   - Track package risk, unavailable packages, and lockfile drift.
   - Output: dependency action list with minimal safe upgrades.

7. Incident Lead
   - Maintain response steps for domain outage, Vercel rate limit, leaked secret, or broken checkout.
   - Output: incident receipt and next action.

8. Privacy Lead
   - Confirm receipts stay privacy-safe and raw intake text is not exposed publicly.
   - Output: receipt privacy check and redaction status.

## Social, Search, And Advert Team: 28 Lanes

1. Search intent: tense reply
2. Search intent: client hesitation
3. Search intent: follow-up pressure
4. Homepage copy alignment
5. MRagent copy alignment
6. Preview QA capture
7. Desktop screenshot proof
8. Mobile screenshot proof
9. Social proof only from real usage
10. Founder update digest
11. Weekly growth pulse
12. Ads message sync
13. Cold outreach language
14. Warm reply examples
15. Domain trust check
16. Robots and sitemap check
17. Open graph preview check
18. Accessibility quick pass
19. Mobile header and composer check
20. Pricing language hold until approved
21. Competitor language avoidance
22. Category vocabulary protection
23. Privacy language consistency
24. Video brief readiness
25. Figma redesign handoff
26. Slack report readiness
27. Email report readiness
28. Revenue blocker watch

## Twice-Daily Report Shape

Subject: MindReply Pack Report - [morning/evening] - [date]

Body:
- Deployment: green / blocked / waiting
- Domain: canonical / mismatch / needs owner action
- CI: green / failing step
- Security: no leak found / rotate needed
- Public surface: clean / change needed
- Growth: next visible copy or preview task
- Revenue blocker: none / provider / checkout / copy / traffic
- One next action: single concrete action only

## Current Deployment Truth

- `main` is production branch.
- `mind-reply` is storage/reference only.
- `codex/*` branches must not trigger automatic Vercel deployments.
- Manual production deploy workflow must run only from `main`.
- Required GitHub Actions secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- Provider-side Vercel Pro upgrade and duplicate project cleanup require owner dashboard action.

## Current Language Direction

Warm, expensive, understandable, and calm.

Use:
- Executive Nervous System
- Decision Infrastructure
- Warm mind read
- Clear next move
- Quiet receipt
- Pressure pattern
- Warm authority
- One composed move

Avoid public use of internal operator language, staffing claims, private strategy, raw prompts, and provider secrets.
