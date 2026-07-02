# OWNER INTENT DICTIONARY

Purpose: the owner speaks naturally — fast, ambitious, direct. This dictionary converts raw owner wording into safe, precise, production-agent instructions **without weakening intent**. Urgency stays urgent. Ambition stays ambitious. Only the wording that could be misread as non-compliant is translated into compliant production terminology.

Operating principle for every entry:

**Owner raw intent → safe execution translation → agent task → approval requirement → evidence**

Legend for approval requirement:
- **AUTO** — agent may execute immediately, evidence logged after.
- **OWNER-APPROVE** — agent prepares everything, owner clicks approve before it goes live.
- **BLOCKED-UNTIL-COMPLIANT** — agent must restructure the request into a compliant form before any execution.

---

## 1. "viral"

- **Raw intent:** Maximum organic reach and shareability. Content that spreads on its own.
- **Safe execution translation:** High-shareability content engineered for platform-native distribution: strong hooks, emotional resonance, share triggers, platform-format optimization. No fake engagement, no bought bots, no engagement-bait that violates platform policy.
- **Agent task:** Produce content variants scored for hook strength and share probability; A/B test hooks; optimize posting time/format per platform.
- **Approval requirement:** AUTO for drafts and tests; OWNER-APPROVE for publishing.
- **Evidence:** Reach, share rate, and saves per variant; platform-policy check passed per post.

## 2. "stealth"

- **Raw intent:** Don't broadcast strategy to competitors; operate quietly; no noisy self-promotion of the system itself.
- **Safe execution translation:** Low-profile / unbranded operation with confidential internal strategy. NOT deception of users or platforms: all legally required disclosures (AI involvement, ad labeling, affiliate disclosure) remain in place. "Stealth" = competitive discretion, never concealment from regulators, platforms, or end users.
- **Agent task:** Keep internal roadmaps, prompts, and pipelines private; use unbranded or white-label properties where appropriate; apply required disclosures on all public output.
- **Approval requirement:** AUTO for internal confidentiality; BLOCKED-UNTIL-COMPLIANT if a request would remove a required disclosure.
- **Evidence:** Disclosure checklist per published asset; access-control log on internal strategy docs.

## 3. "human-like"

- **Raw intent:** Output must read naturally — no robotic, template-smelling copy.
- **Safe execution translation:** Natural-language quality bar: varied sentence rhythm, concrete detail, brand voice, zero boilerplate. NOT impersonating a human where disclosure is required — quality of writing, not identity deception.
- **Agent task:** Apply voice/tone guides, run naturalness scoring, reject copy that reads generated; keep AI-use disclosure wherever platform or law requires it.
- **Approval requirement:** AUTO.
- **Evidence:** Naturalness/readability score per asset; disclosure status recorded.

## 4. "fully automatic"

- **Raw intent:** The machine runs end-to-end without the owner babysitting it.
- **Safe execution translation:** Autonomous pipeline with human-in-the-loop gates at irreversible or regulated steps (publishing, spend, account creation, outbound messaging). Everything up to the gate is automated; the gate is a single owner click.
- **Agent task:** Automate generation, QA, scheduling, and reporting; queue gated actions in the owner cockpit for one-click approval.
- **Approval requirement:** AUTO up to each gate; OWNER-APPROVE at gates.
- **Evidence:** Pipeline run logs; approval-queue history; zero ungated irreversible actions.

## 5. "revenue today"

- **Raw intent:** Ship things that can make money now, not in a quarter.
- **Safe execution translation:** Prioritize shortest-path monetization: live checkout, active offers, conversion fixes — using only production-grade, tested payment flows (Stripe production keys, real webhooks, tested refunds). No untested shortcuts on payment or claims.
- **Agent task:** Rank backlog by time-to-first-dollar; ship conversion-critical fixes first; verify checkout end-to-end before promoting an offer.
- **Approval requirement:** OWNER-APPROVE for pricing/offer changes; AUTO for conversion bug fixes.
- **Evidence:** Successful live test transaction; daily revenue report; funnel conversion metrics.

## 6. "20-30 sites/day"

- **Raw intent:** High-throughput site/page production at industrial scale.
- **Safe execution translation:** Scaled production of **quality-gated** sites/landing pages: each must pass originality, usefulness, and policy checks (no thin/duplicate content, no search-engine spam patterns). Throughput target stands; the quality gate is what keeps the sites indexable and the accounts alive.
- **Agent task:** Templated-but-differentiated site generation pipeline with per-site QA gate (unique content, working links, disclosures, analytics installed).
- **Approval requirement:** AUTO for generation and QA; OWNER-APPROVE for the daily publish batch.
- **Evidence:** Per-site QA report; publish log with counts/day; index and traffic status per site.

## 7. "private backend"

- **Raw intent:** Backend, data, and internal tooling are not publicly visible or accessible.
- **Safe execution translation:** Access-controlled infrastructure: auth-gated admin routes, secrets in a secret manager (never in VCS), private repos for internal logic, least-privilege API keys.
- **Agent task:** Enforce auth on all admin/ops endpoints; keep `.env*` out of version control; rotate exposed credentials per SECURITY_ROTATION.md.
- **Approval requirement:** AUTO.
- **Evidence:** Auth check on every admin route; secret-scan pass on each commit; rotation log.

## 8. "social profiles"

- **Raw intent:** Presence on every relevant platform, posting consistently.
- **Safe execution translation:** Official brand accounts created and operated within each platform's terms of service and automation/API rules. No fake personas, no ban-evasion, no purchased accounts. Multi-brand is fine; each brand is a real, disclosed entity.
- **Agent task:** Provision brand accounts via official APIs/tools; maintain posting calendar; comply with per-platform automation limits.
- **Approval requirement:** OWNER-APPROVE for account creation and platform expansion; AUTO for scheduled posting within approved accounts.
- **Evidence:** Account registry with platform-ToS status; posting log; account-health metrics.

## 9. "ads"

- **Raw intent:** Paid acquisition, spend money to make money, scale what works.
- **Safe execution translation:** Paid campaigns with truthful claims, correct ad labeling, platform ad-policy compliance, and hard budget caps. Aggressive scaling of winners is encouraged — within pre-approved spend limits.
- **Agent task:** Draft campaigns + creatives; run policy pre-check; launch within owner-set daily/total caps; kill losers, scale winners by rule.
- **Approval requirement:** OWNER-APPROVE for budgets, new claims, and new channels; AUTO for optimization within approved caps.
- **Evidence:** Spend vs. cap report; ROAS per campaign; ad-policy pre-check results.

## 10. "owner cockpit"

- **Raw intent:** One screen where the owner sees everything and approves with one click.
- **Safe execution translation:** Single authenticated dashboard: live metrics, approval queue, kill switches, audit log. It is also the compliance surface — every gated action lands here.
- **Agent task:** Build/maintain the dashboard: revenue, pipeline status, pending approvals, alerts; one-click approve/reject with full audit trail.
- **Approval requirement:** AUTO for dashboard improvements.
- **Evidence:** Dashboard uptime; approval latency; complete audit log of gated actions.

## 11. "no traditional AI"

- **Raw intent:** Output must not look, sound, or smell like default LLM output; no generic AI slop.
- **Safe execution translation:** Anti-generic quality standard: banned-phrase lists, distinct brand voice, structured pipelines instead of one-shot prompting. NOT a directive to hide AI involvement — disclosure obligations are untouched.
- **Agent task:** Enforce style linting against generic-AI markers; use multi-stage generation with editorial passes; measure output distinctiveness.
- **Approval requirement:** AUTO.
- **Evidence:** Style-lint pass rate; banned-phrase scan results; voice-consistency score.

## 12. "copywriting everything"

- **Raw intent:** Every word across the entire operation is deliberate, persuasive copy — no filler text anywhere.
- **Safe execution translation:** Full-surface copy coverage (sites, ads, emails, product UI, error states) held to conversion-copy standards, with all claims truthful and substantiated.
- **Agent task:** Copy audit of every surface; rewrite weak copy; maintain claims register with substantiation for every performance/earnings claim.
- **Approval requirement:** AUTO for copy improvements; OWNER-APPROVE for new claims (earnings, results, guarantees).
- **Evidence:** Copy-coverage audit; claims register; conversion deltas after rewrites.

## 13. "evidence-first production"

- **Raw intent:** No claims of "done" without proof. Show receipts for everything.
- **Safe execution translation:** Every completed task ships with verifiable artifacts: PR link, commit hash, passing build, screenshot/recording, live URL, or metric snapshot. "Done" without evidence is treated as not done.
- **Agent task:** Attach evidence to every deliverable; maintain the execution log; block status "COMPLETE" unless evidence links resolve.
- **Approval requirement:** AUTO (this is the default operating mode).
- **Evidence:** The evidence itself — links, hashes, screenshots, metrics, per task.

## 14. "secure this chat"

- **Raw intent:** Nothing about this operation gets lost or exposed; continuity across sessions.
- **Safe execution translation:** Persist owner context, operating rules, and session state into private repo files. No secret values stored in files — secrets live in the secret manager only.
- **Agent task:** Maintain `OWNER_CONTEXT_LOCK.md`, `SESSION_CHECKPOINT.md`, and companions; update checkpoints at session boundaries.
- **Approval requirement:** AUTO.
- **Evidence:** Updated checkpoint files with commit hashes; secret-scan pass.

## 15. "make it premium"

- **Raw intent:** Nothing generic. Every surface feels sharp, intentional, expensive.
- **Safe execution translation:** Dark, sharp, non-generic visual identity: clean typography, purposeful whitespace, no stock-photo energy, no commodity SaaS aesthetics.
- **Agent task:** Apply the brand system to every new surface; audit existing surfaces against it; reject generic output.
- **Approval requirement:** AUTO for polish; OWNER-APPROVE for brand-system changes.
- **Evidence:** Before/after screenshots; design-audit checklist per surface.

## 16. "ship it"

- **Raw intent:** Stop discussing, get it live now.
- **Safe execution translation:** Open PR, pass build, run smoke test, deploy to preview first. Production deploy of anything customer-facing only after validation and owner approval.
- **Agent task:** Execute the deploy pipeline end-to-end up to the production gate; queue the production release in the cockpit.
- **Approval requirement:** AUTO through preview; OWNER-APPROVE for production.
- **Evidence:** PR link, passing build, preview URL, smoke-test results.

---

## Adding new entries

When the owner uses a new raw phrase not in this dictionary, the translator (see `OWNER_COMMAND_TRANSLATOR.md`) proposes a new entry using the same five-field structure and files it here via PR. The owner's original wording is always preserved verbatim in the "Raw intent" field.
