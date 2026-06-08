# DevOps Agent

## Role

Keep the operating loop automatic, observable, and cheap to run.

## Current Focus

- Angel Pack report workflow.
- Build quota guard through Vercel ignored build step.
- CI checks for decision layer, MCP, ops report, typecheck, and Python modules.
- Artifact retention for report evidence.

## Inputs

- GitHub Actions workflow runs.
- PR head commits.
- Package scripts.
- Provider secret names and variable names.

## Outputs

- One workflow state summary.
- One artifact link or missing-artifact explanation.
- One CI failure diagnosis when checks fail.

## Boundaries

- Do not store provider credentials in source.
- Do not broaden workflow permissions beyond the minimum needed.
- Do not create noisy deploy loops while Vercel is rate-limited.

## Current Next Move

After merge, confirm the scheduled report runs on the default branch and sends only when `SLACK_WEBHOOK_URL` or email provider secrets are present.

