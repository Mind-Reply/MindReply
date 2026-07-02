# Live Check Report

**Date:** 2026-07-02 14:31 UTC

## Summary

| URL | Status | HTTP Code | Evidence |
|-----|--------|-----------|----------|
| https://project24053.websitepublisher.ai/ | LIVE | 200 | Homepage renders; title "MindReply — Autonomous CI Control Plane"; HTTPS valid; no secrets in source |
| https://mindreply.vercel.app | NOT LIVE | 404 | `DEPLOYMENT_NOT_FOUND` — Vercel project has no active deployment |

## Detailed Checks

### https://project24053.websitepublisher.ai/

- **HTTPS:** Valid (HSTS enabled, `max-age=31536000; includeSubDomains`)
- **Homepage (/):** HTTP 200 — renders MindReply marketing page with hero, features grid, CTA
- **/login:** HTTP 404 — route does not exist on this host
- **/admin:** HTTP 200 — returns content (same marketing CMS, not an authenticated admin panel)
- **/dashboard:** HTTP 404 — route does not exist
- **/api/health:** HTTP 404 — no API backend on this host
- **PWA manifest:** `/manifest.json` returns HTTP 200 but belongs to the hosting platform (WebSumo), not MindReply
- **Secrets in source:** None found (searched for sk_live, sk_test, pk_live, pk_test, STRIPE, API_KEY, SECRET, password, token, CLERK)
- **Note:** This is a static marketing/landing page hosted on a third-party website builder (websitepublisher.ai). It is NOT the Next.js application from the repository.

### https://mindreply.vercel.app

- **HTTPS:** Valid TLS handshake completes, but response is 404
- **Homepage (/):** HTTP 404 — `DEPLOYMENT_NOT_FOUND`
- **All routes:** Not accessible — no deployment exists
- **Note:** The Vercel project referenced in CI workflows (`live-deploy.yml`, `preview.yml`) does not have an active deployment. This suggests either the Vercel project was deleted, the domain was unclaimed, or deployments have never succeeded.

## Conclusion

The Next.js application (Campaign Studio) is **not deployed to production**. Only a static marketing landing page is live at the websitepublisher.ai URL. The Vercel deployment target is non-functional.
