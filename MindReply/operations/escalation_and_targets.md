# MR CORE PRO — Operations & Enforcement

**Behavior Level**: 890 agents, 5000 workflows, revenue-first

## Global Targets
- Daily min sites: 12
- Daily max sites: 200
- Min daily revenue: $500 USD
- Max daily revenue: $50,000 USD

## Escalation Rules

### CRITICAL (Stop everything)
- Secret exposure detected → Immediate shutdown + notify director
- Vercel build failures > 5% → Pause all auto-deploys
- Database connectivity lost → All transactions halted
- N8N orchestrator down > 5 min → Escalate

### HIGH (Director action required)
- Daily sites deployed < 12 → Review growth targets
- Daily revenue < $500 → Investigate conversion
- Agent health < 80% → Reassign workflows
- Workflow failure rate > 2% → Audit logic

### MEDIUM (Monitor & report)
- Build times increasing → Optimize Docker layers
- API response time > 1s → Check database load
- Memory usage > 80% → Scale vertically
- Log volume > 100GB/day → Archive old logs

### LOW (Routine maintenance)
- Weekly: Review agent assignments
- Bi-weekly: Rotate logs
- Monthly: Audit workflow templates
- Quarterly: Security scan all secrets

## Security Enforcement
- ✓ No secrets in code (use GitHub Secrets only)
- ✓ All tokens rotated monthly
- ✓ Audit logs kept for 90 days
- ✓ Deploy confirmations required
- ✓ Real actions require explicit flag

## Success Metrics
- Uptime: 99.8%+
- Build success rate: 99%+
- Deployment time: < 5 min
- Revenue collection: 100%
- Agent responsiveness: < 500ms

---

**Director**: Observe metrics daily. Approve high-priority escalations. Enable real actions explicitly.
