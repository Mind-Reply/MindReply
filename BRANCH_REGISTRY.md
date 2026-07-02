# Branch Registry — Mind-Reply/MindReply

Audited: 2026-07-02 (UTC). Source of truth for branch status, labels, and cleanup actions.

Labels:
- **PROTECTED** — never delete.
- **ACTIVE — OPEN PR** — has an open pull request; keep until PR is merged or closed.
- **MERGED — SAFE TO DELETE** — fully contained in `main` (0 commits ahead); deleting loses nothing.
- **STALE — UNMERGED** — has commits not in `main`, but far behind and inactive; needs owner decision (delete, or salvage via new PR).

## 1. Protected

| Branch | Last commit | Status |
|---|---|---|
| `main` | 2026-07-02 | Default branch. PROTECTED. |

## 2. Active — open PRs (keep)

Sorted by most recent activity.

| Branch | Last commit | Open PR |
|---|---|---|
| `agent/live-check-2026-07-02` | 2026-07-02 | #70 |
| `devin/1782999561-owner-intent-dictionary` | 2026-07-02 | #69 |
| `agent/access-request` | 2026-07-02 | #67 |
| `devin/1782998143-owner-intent-dictionary` | 2026-07-02 | #66 (duplicate of #69 — close one) |
| `dependabot/npm_and_yarn/npm_and_yarn-148ff71af0` | 2026-07-02 | #65 |
| `devin/1782991975-improve-error-handling` | 2026-07-02 | #59 |

Note: #66 and #69 are duplicate PRs adding the same owner-intent dictionary docs. Recommendation: keep #69 (newer), close #66 and delete its branch.

## 3. Merged — safe to delete (0 commits ahead of main)

Sorted by last commit date, newest first.

| Branch | Last commit | Behind main |
|---|---|---|
| `deploy/production-stack` | 2026-06-29 | 123 |
| `go-live-cleanup-final` | 2026-06-28 | 218 |
| `cleanup/hardening-phase-1` | 2026-06-27 | 315 |
| `v0/angellllkr-eng-b6b44cce` | 2026-06-26 | 329 |
| `v0/angellllkr-eng-7afd2101` | 2026-06-26 | 332 |
| `Profile-file-merge` | 2026-06-23 | 34 |

Action: `git push origin --delete <branch>` for each. No history is lost — all commits are in `main`.

## 4. Stale — unmerged, inactive (owner decision required)

All are 343 commits behind `main` and untouched since mid-June. Their "ahead" counts are mostly divergent history, not salvageable features on top of current `main`.

| Branch | Last commit | Ahead / Behind | Recommendation |
|---|---|---|---|
| `v0/angellllkr-eng-bc50cd09` | 2026-06-17 | 928 / 343 | Delete — superseded v0 export |
| `codex/ip-aware-multilingual-seo` | 2026-06-10 | 846 / 343 | Delete or salvage SEO work via fresh PR |
| `codex/mragent-short-replies` | 2026-06-10 | 778 / 343 | Delete or salvage via fresh PR |
| `codex/premium-localized-seo` | 2026-06-10 | 732 / 343 | Delete or salvage SEO work via fresh PR |
| `codex/mindreply-moa-main` | 2026-06-10 | 236 / 343 | Delete or salvage via fresh PR |
| `codespace-cautious-capybara-q7w456w55wq42x464` | 2026-06-04 | 53 / 343 | Delete — throwaway codespace branch |
| `codespace-super-computing-machine-wv7jrq4q7xjj3vq45` | 2026-06-01 | 56 / 343 | Delete — throwaway codespace branch |

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
| 2026-07-02 | Audit completed, registry created | This document |
| — | Deletion of merged branches | PENDING OWNER APPROVAL |
| — | Deletion of stale unmerged branches | PENDING OWNER APPROVAL |
