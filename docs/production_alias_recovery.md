# MindReply Production Alias Recovery

This file records the emergency production recovery contract for the public MindReply domains.

## Current Priority

The public aliases must serve the verified Git-backed deployment before any new design, SEO, translation, or automation expansion work is promoted.

Verified good deployment:

- Deployment id: `dpl_CUCBFk9NdQ4eTYkqf7fm5kREgTeQ`
- Deployment URL: `https://mindreply-8qfejky4p-angellllkr-engs-projects.vercel.app`
- Git ref: `main`
- Commit: `269a6aa7cd74c594dd0fa5f0b53cf84bf5aed427`

## Required Public Proof

Production is not considered recovered until all checks pass on `https://www.mind-reply.com`:

- `/contact` returns `info@mind-reply.com` and no `gmail.com`
- `/api/version` returns status `ok`
- `/api/health` returns status `ok`
- homepage includes `Reclaim 2+ hours daily within 24 hours`
- homepage or contact flow includes `Website Completion Package`
- homepage or contact flow includes `GBP 600`
- `/api/package-request` rejects invalid input with HTTP `400`

## Operating Rule

Frontend polish, mobile presentation, language selection, SEO expansion, and automation lanes remain queued until the privacy/deploy surface is green. This avoids hiding a live public defect behind new work.
