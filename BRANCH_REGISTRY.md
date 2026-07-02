# Branch Registry — Mind-Reply/MindReply

Audited: 2026-07-02 (UTC). Source of truth for branch status, labels, and cleanup actions.

Labels:
- **PROTECTED** — never delete.
- **ACTIVE — OPEN PR** — has an open pull request; keep until PR is merged or closed.
- **MERGED — SAFE TO DELETE** — fully contained in `main` (0 commits ahead); deleting loses nothing.
- **STALE — UNMERGED** — has commits not in `main`, but far behind and inactive; needs owner decision (delete, or salvage via new PR).

## 1. Current state (after cleanup, 2026-07-02)

| Branch | Label | Notes |
|---|---|---|
| `main` | PROTECTED | Default branch |
| `agent/owner-cockpit-pwa` | ACTIVE — OPEN PR | #72 Owner Cockpit PWA |

All other branches have been deleted (see execution log).

## 2. Deleted — merged into main (owner-approved 2026-07-02)

No history was lost — all commits are in `main`.

| Branch | Last commit |
|---|---|
| `deploy/production-stack` | 2026-06-29 |
| `go-live-cleanup-final` | 2026-06-28 |
| `cleanup/hardening-phase-1` | 2026-06-27 |
| `v0/angellllkr-eng-b6b44cce` | 2026-06-26 |
| `v0/angellllkr-eng-7afd2101` | 2026-06-26 |
| `Profile-file-merge` | 2026-06-23 |

## 3. Deleted — stale unmerged (owner-approved 2026-07-02)

Divergent history from mid-June, 343 commits behind `main` at deletion time.

| Branch | Last commit |
|---|---|
| `v0/angellllkr-eng-bc50cd09` | 2026-06-17 |
| `codex/ip-aware-multilingual-seo` | 2026-06-10 |
| `codex/mragent-short-replies` | 2026-06-10 |
| `codex/premium-localized-seo` | 2026-06-10 |
| `codex/mindreply-moa-main` | 2026-06-10 |
| `codespace-cautious-capybara-q7w456w55wq42x464` | 2026-06-04 |
| `codespace-super-computing-machine-wv7jrq4q7xjj3vq45` | 2026-06-01 |

## 4. Deleted — PR branches merged or closed on 2026-07-02

| Branch | PR | Outcome |
|---|---|---|
| `agent/live-check-2026-07-02` | #70 | Merged |
| `agent/access-request` | #67 | Merged |
| `devin/1782998143-owner-intent-dictionary` | #66 | Merged |
| `devin/1782999561-owner-intent-dictionary` | #69 | Closed (duplicate of #66) |
| `dependabot/npm_and_yarn/npm_and_yarn-148ff71af0` | #65 | Merged |
| `devin/1782991975-improve-error-handling` | #59 | Merged |
| `devin/1783003451-branch-registry` | #71 | Merged (this registry) |

## 5. Branch naming convention (going forward)

Renaming existing remote branches is not done in-place on GitHub for branches with open PRs (a rename closes/retargets nothing automatically for forks, and force-recreating breaks PR history). Instead, the convention applies to all **new** branches:

- `agent/<topic>` — agent-driven production work
- `devin/<timestamp>-<topic>` — Devin sessions (auto-generated)
- `fix/<topic>` — bug fixes
- `feat/<topic>` — features
- `docs/<topic>` — documentation only
- `deploy/<topic>` — deployment/infra
- `cleanup/<topic>` — hygiene/refactors
- `dependabot/*` — automated dependency updates (managed by Dependabot)

Disallowed going forward: bare descriptive names (`Profile-file-merge`), codespace auto-names, `v0/*` exports pushed directly to this repo.

## 6. Execution log

| Date | Action | Result |
|---|---|---|
| 2026-07-02 | Audit completed, registry created | PR #71 (merged) |
| 2026-07-02 | Deleted 6 merged branches | Done — owner approved |
| 2026-07-02 | Deleted 7 stale unmerged branches | Done — owner approved |
| 2026-07-02 | Deleted leftover closed-PR branch `devin/1782999561-owner-intent-dictionary` | Done |
