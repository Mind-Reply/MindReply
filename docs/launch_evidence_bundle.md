# MindReply Launch Evidence Bundle

This is an owner/reporting artifact, not public marketing copy. It records the minimum evidence needed before calling a launch or revenue surface ready.

## Current Live URL

- Production domain: `https://www.mind-reply.com`
- Current verified production source: `35c1b6129377fa0d0c5e0ba6321a452d88ca7a39`
- Current GitHub `main` target: `35c1b6129377fa0d0c5e0ba6321a452d88ca7a39`
- Status rule: production is current when the required live routes return `200`, the live revenue verifier passes, and `/api/version` reports the GitHub `main` commit SHA from the canonical production domain.

## Health Proof

Required before launch-ready status:

- `/api/version` returns `status: ok`.
- `/api/health` returns `status: ok`.
- `/` returns `200`.
- `/pricing` returns `200`.
- `/website-completion-package` returns `200`.
- `/products` returns `200`.
- `/response-overload` returns `200`.
- `/trust` returns `200`.
- `/checkout` returns `200`.
- `/api/package-request` rejects invalid input with HTTP `400`.
- The live package page contains `Website Completion Package`, `GBP 600`, `Assisted-close assets`, and `Objection handling`.
- The live footer does not expose the legacy auto-background locale marker or personal owner inboxes.

## Intake Receipt Sample

Minimum privacy-safe receipt fields:

- `actionKind: website-completion`
- `paymentPath: invoice-first unless a configured direct payment link is present`
- `rawContentRedacted: true`
- `inputHash: present; raw text absent`
- `ownerDecisionNeeded: confirm scope, route invoice or payment link, approve the next close-ready move`

Do not store raw buyer pressure text in launch evidence. Store only the hash, route status, and redacted summary.

## SEO Note

Launch pages must preserve the current demand lanes:

- Website Completion Package
- website buying-friction rescue
- response overload
- client follow-up pressure
- founder communication rescue
- assisted close
- ranked action queue
- send-ready copy
- privacy-safe receipt
- multilingual business communication support

Sitemap and robots must allow the money pages while keeping private API, MCP, agent, and legacy pack surfaces out of indexable public claims.

## Deployment Status

Current status: canonical Vercel production is green for the website completion surface. The live homepage, products page, checkout, trust page, response-overload page, and Website Completion Package page return `200`. The live revenue verifier passes.

Source status: `main` includes the `/api/version` build metadata fallback and `prebuild` metadata generation. The production `/api/version` route returns non-null commit, branch, environment, URL, project production URL, and metadata generation time.

Latest verified live source: `35c1b6129377fa0d0c5e0ba6321a452d88ca7a39`.

Provider limit note: if a manual CLI deploy returns `api-deployments-free-per-day`, stop further deploy attempts until Vercel capacity resets or the plan/capacity issue is resolved. Use live verification and source-side proof in reports instead of implying a fresh deploy happened.

Before any manual or automated production deploy, run `npm run deploy:preflight` from the deploy worktree. The preflight must prove the local `.vercel/project.json` is bound to the real `mindreply` project with project id `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`; otherwise stop before running `vercel deploy --prod`.

Do not call production green when:

- `/products` or `/response-overload` return `404`.
- `node scripts/verify-live-revenue-surface.mjs` fails `homepage-clear-free-cta`.
- `/api/version` returns `null` deployment metadata after the next successful deploy.
- The live package page lacks the current assisted-close asset pack.
- Payment URL, Resend sender/key, Slack route, or Vercel token are missing and the report does not state the exact missing item.

## Owner Report Rule

Every owner report must separate:

- source-side proof
- live production proof
- delivery proof
- blocked secrets or provider limits
- next concrete coding/product move

If live proof is stale, report `source advanced; production pending` instead of implying the website is fully deployed.
