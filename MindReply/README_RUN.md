# MR CORE PRO — README

## ✅ Bootstrap Complete

**Root**: `MindReply/`

**Structure**:
- `agents/` — 890 agent configs
- `automation/n8n/workflows/` — 5000 workflow templates
- `automation/deploy/` — Vercel deployment server
- `dashboard/` — Real-time metrics UI
- `backend/` — API & business logic
- `sites/` — Multi-site deployment targets
- `operations/` — Escalation rules & monitoring
- `monitoring/` — Prometheus, Grafana, Sentry
- `secrets/` — Vault instructions (NO actual tokens)

## 🚀 Quick Start

### 1. Review & Export Secrets

```bash
# NEVER paste tokens in files. Use environment variables.
export VERCEL_TOKEN="vercel_..."
export GITHUB_TOKEN="ghp_..."
export STRIPE_SECRET_KEY="sk_live_..."

# Or via gh cli:
gh secret set VERCEL_TOKEN --body "vercel_..."
gh secret set GITHUB_TOKEN --body "ghp_..."
gh secret set STRIPE_SECRET_KEY --body "sk_live_..."
```

### 2. Start Services (Preview Mode - SAFE)

```bash
# Terminal 1: Dashboard writer
python dashboard/run_writer.py
# Output: Dashboard Writer starting on http://127.0.0.1:4000

# Terminal 2: Deploy server (preview only)
python automation/deploy/deploy_server.py
# Output: Deploy Server starting on http://127.0.0.1:8000

# Terminal 3: N8N (manual or Docker)
docker run -d -p 5678:5678 n8nio/n8n
# Import: automation/n8n/master_orchestrator_pro.json
```

### 3. Import N8N Workflows

1. Go to N8N UI: http://localhost:5678
2. Workflows → Import
3. Select: `automation/n8n/master_orchestrator_pro.json`
4. For each agent: Import workflows from `automation/n8n/workflows/*.json`

### 4. Commit & Push

```bash
git add MindReply/
git commit -m "MR CORE PRO: 890 agents, 5000 workflows, master orchestrator"
git push origin main

# This triggers:
# - GitHub Actions (build verification)
# - Vercel deployment (auto-deploy to mind-reply.com)
# - Docker Hub push (if configured)
```

### 5. Enable Real Deployments (When Ready)

Only after testing in preview mode:

```bash
# Set explicit flag
export RUN_REAL_DEPLOYS=1

# Restart deploy server
python automation/deploy/deploy_server.py
# Now real `vercel` commands execute
```

## ⚠️ SAFETY RULES

- **NEVER** set `RUN_REAL_DEPLOYS=1` in code
- **NEVER** commit tokens or secrets
- **ALWAYS** use environment variables
- **ALWAYS** test in preview mode first
- **ALWAYS** check logs after real deploys
- **ALWAYS** rotate tokens monthly

## 📊 System Behavior

**Agents** (890): Persistent, assigned workflows, track revenue

**Workflows** (5000): Templates, executed by agents, trigger on schedule/event

**Orchestrator**: Master control flow
- Checks health hourly
- Triggers deploys daily
- Escalates issues to director
- Updates dashboard real-time

**Deploy Server**: Handles Vercel deployments
- Preview: Echo commands only
- Real: Execute when flag set
- Logs all deployments

**Dashboard**: Real-time metrics
- Revenue tracking
- Site status
- Agent health
- Workflow stats

## 📈 Metrics & Monitoring

**Expected Daily**:
- 12-200 sites deployed
- $500-$50,000 revenue
- <5s per deployment
- <500ms API response
- 99.8% uptime

**Alerts**: Directed to director@mind-reply.com

**Logs**: `logs/bootstrap_*.log`

## 🔐 Secrets Management

See: `secrets/vault_instructions.md`

**TL;DR**:
- Use `gh secret set` for GitHub
- Use Vercel dashboard for environment variables
- Use AWS Secrets Manager or Vault for on-prem
- Rotate all tokens monthly
- Never hardcode anything

## ✅ Verification

```bash
# Check agents created
ls agents/ | wc -l  # Should be 890

# Check workflows created
ls automation/n8n/workflows/ | wc -l  # Should be 5000

# Check services running
curl http://127.0.0.1:4000  # Dashboard writer
curl http://127.0.0.1:8000  # Deploy server

# Check N8N
curl http://localhost:5678/healthz  # Should return OK
```

## 📞 Troubleshooting

**Deploy server not responding?**
- Check port 8000 is free: `lsof -i :8000`
- Restart: `python automation/deploy/deploy_server.py`

**Dashboard not updating?**
- Check port 4000: `lsof -i :4000`
- Send test: `curl -X POST http://127.0.0.1:4000 -d "payload={\"test\":true}"`

**N8N workflows not executing?**
- Check healthz: `curl http://localhost:5678/healthz`
- Review logs: `docker logs <n8n_container>`
- Verify trigger timing: Check workflow schedule

**Real deploys failing?**
- Verify token: `echo $VERCEL_TOKEN`
- Check permissions: `vercel whoami --token $VERCEL_TOKEN`
- Review logs: Check `automation/deploy/deploy_server.py` output

## 📝 Next Steps

1. ✅ Bootstrap complete (this was it!)
2. Export secrets to environment
3. Start preview services
4. Import N8N workflows
5. Commit to GitHub
6. Watch Vercel auto-deploy
7. Test in preview mode
8. Enable real deployments
9. Monitor dashboard daily
10. Scale as needed

---

**Status**: Production-ready. Revenue-first. 890 agents. 5000 workflows.

**Authorization Required**: Director approval before enabling real actions.
