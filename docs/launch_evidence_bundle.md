# MindReply Launch Evidence Bundle

This is an owner/reporting artifact, not public marketing copy. It records the minimum evidence needed before calling a launch or revenue surface ready.

## Current Live URL

- Production domain: `https://www.mind-reply.com`
- Current verified production deployment: `dpl_BohRakPiHHtXdahTb1JPy3pTxn4q`
- Current GitHub `main` target: source must be checked from `origin/main` before every report.
- Status rule: production is current when the required live routes return `200`, the live revenue verifier passes, and the canonical Vercel project owns the production aliases. `/api/version` is healthy but may not expose a commit SHA for CLI deployments.

## Health Proof

Required before launch-ready status:

- `/api/version` returns `status: ok`.
- `/` returns `200`.
- `/pricing` returns `200`.
- `/website-completion-package` returns `200`.
- `/products` returns `200`.
- `/response-overload` returns `200`.
- The live package page contains `Website Completion Package`, `GBP 600`, `Assisted-close assets`, and `Objection handling`.
- The live footer does not expose `{AUTO BG}` or personal owner inboxes.

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

Current status: canonical Vercel production deployment is live and the previously blocked revenue routes return `200`, but the live revenue verifier is not green because the live homepage has not yet picked up the source-side `Try MindReply Free` CTA.

Source status: `main` includes the `/api/version` build metadata fallback. The next successful manual prebuilt deployment should expose non-null commit, branch, environment, URL, and project production URL through `/api/version`.

Latest deploy attempt: one canonical CLI deploy was attempted after preflight passed, but Vercel returned `api-deployments-free-per-day`. Do not attempt another deploy until the daily quota resets.

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
