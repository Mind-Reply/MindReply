# Deployment Alias Status

Last checked: 2026-06-09

## Current Evidence

- Latest Vercel production deployment reported by Vercel connector:
  - `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6`
  - commit `8a448fcde687c4c53f42d73f8556d6876a124661`
  - message `feat: add priority market footer strip`
  - state `READY`
  - deployment URL `https://mindreply-9kt5b50z4-angellllkr-engs-projects.vercel.app`
- Direct deployment URL currently returns `401 Unauthorized` from public HTTP check.
- `https://www.mind-reply.com/` still serves previous asset deployment id `dpl_FK9VqUruBXUoZgWyY3M546U5zmk1`.
- `https://www.mind-reply.com/api/geo-locale` returns `200`, so the production app is reachable, but the homepage/static assets have not moved to the newest deployment yet.

## Interpretation

The latest code is on GitHub and Vercel has a READY deployment, but the public custom domain is still effectively stale. Treat this as a deployment alias/protection state, not a source-code failure.

## Owner/Deploy Lead Action

1. In Vercel project `mindreply`, confirm deployment `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6` is assigned to production aliases.
2. Confirm `www.mind-reply.com` and `mind-reply.com` point to the canonical project, not a duplicate/stale project.
3. Disable deployment protection for the production deployment if it blocks public access.
4. Re-check:
   - homepage HTML asset URLs include `dpl_Fy9VkjbmwEwrtXxfuSi1TyRw4xC6`;
   - footer contains `Auto language and priority markets`;
   - metadata contains `target-market-priority`;
   - robots/sitemap no longer expose stale `/agents` or `/pack` entries.

## Public Claim Boundary

Do not tell visitors deployment is complete until the public domain serves the newest deployment id and the stale-route smoke check passes.
