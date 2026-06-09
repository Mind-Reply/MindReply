# Domain And Hosting Backup Runbook

This runbook keeps MindReply recoverable without copying secrets into the repository.

## Current Public Targets

- Production site: `https://www.mind-reply.com`
- Vercel project id: `prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3`
- Latest known Vercel project name: `mindreply`
- ChatGPT App endpoint: `/mcp`
- MRagent surface: `/agent`
- Personal Pack surface: `/pack`

## Backup Principles

- Keep source of truth in GitHub `Mind-Reply/MindReply`.
- Keep deployment provider configuration in Vercel, not in committed secrets.
- Keep real credentials in GitHub/Vercel secrets only.
- Keep public DNS ownership and registrar access outside the repo, with owner-held recovery codes.
- Keep a written rollback target after each READY production deploy.

## Provider Inventory To Export Manually

Export or screenshot these from the provider consoles after every major release:

- Vercel project settings, build command, install command, framework, and environment list.
- Vercel domains and DNS verification records.
- Vercel deployment protection settings and trusted access methods.
- GitHub Actions secrets names, not values.
- GitHub Actions variables names and non-secret values.
- Domain registrar DNS zone records.
- Email sender domain records for Resend or the active mail provider.
- Slack app/webhook configuration name, not webhook URL.

## Recovery Procedure

1. Confirm the latest green GitHub commit on `main`.
2. Confirm the latest READY Vercel deployment and note its URL.
3. If production breaks, use Vercel rollback to the latest READY deployment.
4. If DNS breaks, restore registrar records from the last exported zone copy.
5. If secrets are suspected compromised, rotate them in providers first, then update GitHub/Vercel secrets.
6. Run `/api/health`, `/agent`, `/pack`, and `/mcp` checks after recovery.
7. Send a Personal Pack report to email/Slack after the recovery check.

## Do Not Commit

- API keys
- Slack webhook URLs
- Vercel tokens
- Resend keys
- Domain registrar credentials
- OpenAI keys
- Bypass tokens
- Recovery codes

## Known Protected Preview

Vercel Authentication may protect preview paths. Use generated temporary share links for review. Do not paste bypass tokens into committed files.
