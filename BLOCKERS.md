# Blockers

## Owner Cockpit PWA (2026-07-02)

- Gamma reference doc NOT ACCESSIBLE: https://gamma.app/docs/MindReply-Think-Clearly-Decide-Fast-Move-Forward-63v6w1k1grblo91 returns a 403 bot challenge ("Just a moment"). Concept recreated from the positioning: "MindReply helps overloaded founders, operators, and agencies turn pressure, messages, decisions, and scattered context into clear next actions."
- Owner-only auth NOT CONFIGURED: cockpit routes (`/cockpit/*`) are protected by a placeholder only. Real auth provider must be wired before treating the cockpit as private. See ACCESS_REQUEST.md.
- Route conflict: `/dashboard` is already used by the existing analytics dashboard, so the cockpit lives at `/cockpit` with section routes beneath it (`/cockpit/chat`, `/cockpit/repos`, ...).
- Custom domain: BLOCKED — DNS ACCESS REQUIRED for mind-reply.com and subdomains.
- Vercel production deploy: account rate limits affect CI checks (per environment notes); preview URL pending.

- Verification pending for the full repo fleet.
- Production proof still needs to be collected.
- External integration review still needs confirmation.