# MindReply Launch Evidence Bundle

This is an owner/reporting artifact, not public marketing copy. It records the minimum evidence needed before calling a launch or revenue surface ready.

## Current Live URL

- Production domain: `https://www.mind-reply.com`
- Current verified production commit: `0957a3c7233801286c27b4edea4fb934bb2833de`
- Current GitHub `main` target: source must be checked from `origin/main` before every report.
- Status rule: production is not current until `/api/version` reports the latest GitHub `main` commit.

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

Current blocker: Vercel production deployment is capped by the free daily deployment limit when CLI deploy returns `api-deployments-free-per-day`.

Do not call production green when:

- GitHub `main` is ahead of `/api/version`.
- `/products` or `/response-overload` return `404`.
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
