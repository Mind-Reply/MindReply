# MindReply Branch Consolidation Report

Generated: 2026-06-09

## Goal

Keep only two long-lived branches:

- `main`: canonical production branch for `MindReply` / `mindreply`.
- `mind-reply`: storage/reference branch for old source material, recovered files, and non-public archive work.

All `codex/*` branches should be treated as temporary implementation branches. They should be deleted only after the production work they contain is either merged into `main` or intentionally archived into `mind-reply`.

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
2. Remove or disconnect the duplicate Vercel status context that points at the `mindreply`/`mr-64b2efc9` project and consumes the Free build quota.
3. Re-run the canonical `mind-reply` Vercel check after quota is available or after the duplicate project is disabled.
4. Merge PR #12 into `main` when the active code branch is clean.
5. Attach `mind-reply.com` and `www.mind-reply.com` to the canonical `mind-reply` Vercel project.
6. After production is verified, delete the temporary `codex/*` branches listed above.
7. Keep `mind-reply` as storage only; never set it as a deployment branch.

## Do Not Do

- Do not force-push `main` from an old branch.
- Do not merge deletion-heavy experiment branches directly into `main`.
- Do not deploy from `mind-reply`.
- Do not delete `codex/executive-nervous-system-main-sync` until PR #12 is merged or its contents are otherwise preserved.
- Do not publish tokens, provider secrets, internal prompts, or private strategy documents in public code or docs.

## Provider-Side Blockers

The remaining blocker is not useful-code discovery. The blocker is Vercel/GitHub provider configuration:

- Duplicate Vercel status contexts are attached to the repo.
- The duplicate project has hit the Free daily deployment limit.
- The canonical custom domains are not yet attached to the correct project.

Once those are fixed, the active production branch can be merged and the temporary branches can be removed safely.
