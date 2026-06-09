# MindReply Branch Consolidation Report

Generated: 2026-06-09

## Goal

Keep only two long-lived Git branches:

- `main`: canonical production branch for `MindReply` / `mindreply`.
- `mind-reply`: storage/reference branch for old source material, recovered files, and non-public archive work.

All `codex/*` branches should be treated as temporary implementation branches. They should be deleted only after the production work they contain is either merged into `main` or intentionally archived into `mind-reply`.

## Vercel Project Map

Angel confirmed the production Vercel project ID:

- Keep: `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3` / `team_0plIJmQLgZC1wVv9zI2eVf3B`.
- Production domains on that project: `www.mind-reply.com`, `mind-reply.com`, and `mind-reply.vercel.app`.
- Disable or disconnect duplicate: `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.

Important name collision: the Git branch `mind-reply` is storage only, while the Vercel project named `mind-reply` is the duplicate project. Do not deploy from the storage branch, and do not keep the duplicate Vercel project connected to GitHub once `mindreply` remains canonical.

## Current Branch Disposition

| Branch | Keep | Role | Action |
| --- | --- | --- | --- |
| `main` | Yes | Production source of truth | Keep. Merge PR #12 here once provider-side checks are clean. |
| `mind-reply` | Yes | Storage/reference branch | Keep as archive branch. Do not deploy from this branch. |
| `codex/executive-nervous-system-main-sync` | Temporary | Active production migration PR | Merge into `main` after Vercel/GitHub status gates are clean, then delete. |
| `codex/executive-nervous-system-build` | No long-term | Earlier build branch | Covered by the active migration branch; archive reference only if needed, then delete. |
| `codex/mragent-decision-chat` | No long-term | Earlier MRagent/decision chat branch | Covered by the active migration branch; archive reference only if needed, then delete. |
| `codex/mindreply-moa-controller` | No long-term | Earlier MOA/controller branch | Keep ideas only as internal notes; do not merge directly to production. |
| `codex/executive-nervous-system` | No | Deletion-heavy experiment | Do not merge directly; delete after active migration lands. |
| `codex/executive-nervous-system-rebrand` | No | Deletion-heavy rebrand experiment | Do not merge directly; delete after active migration lands. |
| `codex/mindreply-moa-main` | No | Minimal/deletion-heavy experiment | Do not merge directly; delete after active migration lands. |
| `codex/mindreply-moa-production-minimal` | No | Behind `main`, no unique production work observed | Delete after confirmation. |

## Safe Cleanup Sequence

1. Keep PR #12 as the active production migration path.
2. Keep Vercel project `mindreply` / `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3` as the only production deployment project.
3. Disable Git deployments or disconnect GitHub integration on duplicate Vercel project `mind-reply` / `prj_nETWN2SapvnbSWVXK4O5upJHF6bb`.
4. Remove duplicate GitHub required status contexts if branch protection still expects both Vercel projects.
5. Wait for the Free daily deployment quota reset, or upgrade intentionally from the Vercel account if immediate deploys are required.
6. Sync/rebase PR #12 with current `main`, then merge into `main` when checks are clean.
7. Let one production deployment run on `mindreply`, then verify `https://www.mind-reply.com/`, `/agent`, and `/api/health`.
8. After production is verified, delete the temporary `codex/*` branches listed above.
9. Keep `mind-reply` as storage only; never set it as a deployment branch.

## Do Not Do

- Do not force-push `main` from an old branch.
- Do not merge deletion-heavy experiment branches directly into `main`.
- Do not deploy from `mind-reply`.
- Do not delete `codex/executive-nervous-system-main-sync` until PR #12 is merged or its contents are otherwise preserved.
- Do not publish tokens, provider secrets, internal prompts, or private strategy documents in public code or docs.
- Do not delete the duplicate Vercel project until custom domains, environment variables, and deployment ownership have been compared and the owner explicitly approves deletion.

## Provider-Side Blockers

The remaining blocker is not useful-code discovery. The blocker is Vercel/GitHub provider configuration:

- Two Vercel projects are connected to the same repo, so pushes can create duplicate deployment attempts.
- `mindreply` is the domain-owning production project and must be kept.
- `mind-reply` is the duplicate/lookalike Vercel project and should be disconnected or disabled.
- Main-branch pushes can still hit the Free daily deployment limit until the duplicate project is disconnected and quota resets.

Once those are fixed, the active production branch can be merged and the temporary branches can be removed safely.
