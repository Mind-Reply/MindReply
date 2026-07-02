# OWNER COMMAND TRANSLATOR

Purpose: the runtime procedure that converts the owner's natural, raw, urgent commands into precise, safe, executable production-agent instructions for **Devin, GitHub, n8n, Vercel, and the Owner Cockpit** — preserving urgency, ambition, and directness.

Companion file: OWNER_INTENT_DICTIONARY.md (the phrase mappings this translator applies).

---

## Operating principle

Every command flows through five stages:

```
Owner raw intent
  → safe execution translation   (dictionary lookup + disambiguation)
  → agent task                   (concrete, tool-specific instruction)
  → approval requirement         (what the owner must sign off, if anything)
  → evidence required            (what proves it was done)
```

## Translation rules

1. **Preserve intent.** The translated task must accomplish what the owner actually wants, at the speed and scale they asked for. Never downgrade "today" to "this sprint" or "20–30/day" to "a few".
2. **Remove ambiguity.** Output must name the tool (Devin / GitHub / n8n / Vercel / Cockpit), the exact action, and the success condition.
3. **No weak corporate language.** Translations stay direct and imperative: "Deploy X to production and post the live URL", not "explore opportunities to align on deployment".
4. **No fake, spammy, deceptive, or platform-breaking actions.** If the raw wording could be read that way, map to the closest legitimate production action from the dictionary and proceed with that.
5. **Unmappable = escalate, never improvise.** If no legitimate mapping exists, return the command to the owner with the closest legitimate alternative. Never silently execute an unsafe reading; never silently drop the command.
6. **Every task ends in evidence.** No evidence, no "done".

## Runtime procedure

1. **Parse** the owner message; extract command phrases and urgency markers ("now", "today", "everything").
2. **Look up** each phrase in OWNER_INTENT_DICTIONARY.md. Unknown phrases: infer the closest existing mapping; if confidence is low, ask the owner one direct question while starting the unambiguous parts.
3. **Compose the agent task** per target system:
   - **Devin** → session prompt with repo, branch convention, acceptance criteria, evidence list.
   - **GitHub** → issue/PR with exact scope, linked evidence, CI must pass.
   - **n8n** → workflow name, trigger, nodes, error handling, execution-log requirement.
   - **Vercel** → project, environment (preview vs production), domain, deployment-proof requirement.
   - **Owner Cockpit** → approval-queue entry + audit-log entry for the action.
4. **Gate** on the approval requirement from the dictionary entry. Irreversible or externally visible actions (publishing, spend, outreach, production deploys of new surfaces) always queue in the cockpit first.
5. **Execute** immediately after the gate clears — no idle waiting on non-gated steps.
6. **Close with evidence**: attach URLs/logs/screenshots/hashes to the cockpit entry and, where relevant, GLOBAL_EVIDENCE_REGISTRY.md.

## Worked examples

### Example 1
**Owner:** "Go stealth, ship the new funnel fully automatic, I want revenue today."

**Translation:**
- *stealth* → deploy funnel to password-protected Vercel preview, noindex, no announcements.
- *fully automatic* → n8n workflow: lead capture → email sequence → Stripe checkout, with retries + alerting; publish/send steps gated in cockpit.
- *revenue today* → verify Stripe live mode + webhooks, run end-to-end checkout test, queue launch message to owned list for owner approval now.

**Agent tasks:** Devin session (build + deploy funnel, preview env), n8n (automation workflow), Cockpit (approval queue: launch send).
**Approval:** owner approves launch message + pricing before send.
**Evidence:** preview URL + access proof, n8n execution logs, Stripe live receipt, send logs.

### Example 2
**Owner:** "Make the landing pages viral and human-like, 20-30 sites/day, no traditional AI slop."

**Translation:**
- *viral* → shareability optimization: hooks, OG/social metadata, cross-channel distribution schedule.
- *human-like* → brand-voice copywriting pass; platform disclosure rules respected.
- *20-30 sites/day* → templated generator with per-site unique content + QA gate (build, uniqueness, Lighthouse), auto-deploy via Vercel API.
- *no traditional AI* → quality gate: banned generic phrasing, factuality check, below-threshold items flagged for review.

**Agent tasks:** Devin (generator + QA gate), Vercel (batch deploy pipeline), n8n (distribution scheduling), Cockpit (daily batch report).
**Approval:** owner approves template, voice guide, QA thresholds once; daily report reviewed in cockpit.
**Evidence:** daily deployed-URL list, per-site QA results, analytics dashboard.

### Example 3
**Owner:** "Lock down the private backend and run ads from the cockpit."

**Translation:**
- *private backend* → auth audit on all routes, secrets to env vaults, CORS restriction, rate limiting, secrets scan.
- *ads* → compliant campaign drafts with budget caps and conversion tracking; zero spend before approval.
- *owner cockpit* → both workstreams surface status + approvals in the cockpit audit log.

**Agent tasks:** Devin (backend hardening PRs), ad platform setup checklist, Cockpit (approval queue: budget/creatives/targeting).
**Approval:** owner approves access model and all ad spend.
**Evidence:** security audit checklist + failed-unauth-request proof, ad dashboard after launch, cockpit audit entries.

## Output format for every translated command

```
RAW: <owner's exact words>
TRANSLATION: <safe execution translation, per dictionary>
TASKS:
  - [tool] <imperative instruction with success condition>
APPROVAL: <what the owner must approve, or "none">
EVIDENCE: <artifacts required to close>
```
