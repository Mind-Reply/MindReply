# OWNER COMMAND TRANSLATOR

Purpose: convert the owner's natural, raw commands into safe, precise, production-agent instructions — in real time, without diluting the command. This is the process; `OWNER_INTENT_DICTIONARY.md` is the vocabulary.

## Non-negotiable rules

1. **Never weaken the owner's intent.** Urgency, ambition, and directness pass through untouched. "Ship it today" stays "ship it today."
2. **No generic corporate language.** Translations are operational and specific, not vague ("drive synergies" is banned output).
3. **Translate risk, not ambition.** Only wording that could be executed in a non-compliant way gets converted — into compliant production terminology that achieves the same goal.
4. **Preserve the original.** The owner's raw wording is logged verbatim next to its translation. The translation never replaces the record of what the owner actually said.
5. **When in doubt, gate — don't stall.** If a command is ambiguous on a compliance-relevant point, the translator picks the compliant reading, executes everything safe immediately, and queues the ambiguous part for a one-click owner decision.

## The pipeline

Every owner command flows through five stages:

```
Owner raw intent → safe execution translation → agent task → approval requirement → evidence
```

### Stage 1 — Owner raw intent
Capture the command exactly as spoken. Extract: goal, deadline/urgency markers, scale targets, constraints. Never paraphrase at this stage.

### Stage 2 — Safe execution translation
Match phrases against `OWNER_INTENT_DICTIONARY.md`. For each match, substitute the compliant production terminology. For unmatched sensitive/ambiguous phrases, apply the translation tests below and draft a new dictionary entry.

**Translation tests** (a phrase needs translation if any answer is "yes"):
- Could a literal reading violate a platform ToS, ad policy, or disclosure law?
- Could it be read as deceiving end users, platforms, or regulators?
- Does it touch money movement, personal data, or account creation?
- Is it ambiguous enough that two agents would execute it differently?

If all answers are "no", the phrase passes through unchanged.

### Stage 3 — Agent task
Rewrite the translated intent as a concrete, self-contained agent instruction: repository/system, exact deliverable, quality gate, deadline. One task per deliverable. No strategy essays.

### Stage 4 — Approval requirement
Assign the gate level:
- **AUTO** — reversible, internal, or policy-safe work. Execute immediately.
- **OWNER-APPROVE** — irreversible or external-facing: publishing, spend, pricing, account creation, outbound messages, new claims. Prepare fully, queue in the owner cockpit for one click.
- **BLOCKED-UNTIL-COMPLIANT** — the literal request cannot run as stated (e.g. remove a required disclosure). Restructure into the nearest compliant form, present both the block reason and the compliant alternative. Never silently drop the command.

### Stage 5 — Evidence
Define proof-of-done before execution starts: PR link, commit hash, build result, live URL, screenshot/recording, or metric snapshot. A task without defined evidence does not start; a task without delivered evidence is not done.

## Worked examples

### Example A
- **Raw:** "Go full stealth, fully automatic, 20-30 sites a day, revenue today."
- **Translation:** Unbranded, access-controlled operation with all required disclosures intact; autonomous pipeline with owner gates at publish/spend; 20-30 quality-gated sites/day; monetization path live and tested today.
- **Agent task:** Stand up the site-generation pipeline with per-site QA gate; wire tested checkout on the first batch; queue today's publish batch in the cockpit.
- **Approval:** AUTO for generation/QA; OWNER-APPROVE for the publish batch and any spend.
- **Evidence:** Per-site QA reports, publish log, one successful live transaction, daily revenue snapshot.

### Example B
- **Raw:** "Make the copy human-like, no traditional AI, copywriting everything."
- **Translation:** All surfaces rewritten to conversion-copy standard in brand voice; anti-generic style lint enforced; AI-use disclosures unchanged; all claims substantiated.
- **Agent task:** Run full-surface copy audit; rewrite failures; update claims register.
- **Approval:** AUTO for rewrites; OWNER-APPROVE for any new earnings/results claim.
- **Evidence:** Copy-coverage audit, style-lint pass rate, claims register diff.

### Example C
- **Raw:** "Blast the ads, whatever it takes."
- **Translation:** Aggressive paid scaling of proven winners within pre-approved budget caps, truthful creatives, policy pre-checked. "Whatever it takes" ≠ uncapped spend or non-compliant claims — it means maximum speed inside the caps, plus a same-day request to raise caps if winners are constrained.
- **Agent task:** Scale winning campaigns to cap; kill underperformers; prepare cap-increase proposal with ROAS data.
- **Approval:** AUTO within caps; OWNER-APPROVE for cap increase.
- **Evidence:** Spend vs. cap, ROAS per campaign, policy pre-check log.

## Logging

Every translated command is appended to the execution log with all five stages, timestamped. Format:

```
[timestamp]
RAW: <owner's exact words>
TRANSLATION: <safe execution translation>
TASK: <agent task issued>
GATE: AUTO | OWNER-APPROVE | BLOCKED-UNTIL-COMPLIANT
EVIDENCE: <links/artifacts>
```

## Maintaining the dictionary

New recurring phrases get a dictionary entry via PR to `OWNER_INTENT_DICTIONARY.md` using the same five-field structure. Existing entries are updated when platform policies or the owner's usage of a phrase changes — the "Raw intent" field always reflects what the owner means, in the owner's register.
