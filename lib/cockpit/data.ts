export type Status = 'live' | 'preview' | 'blocked' | 'draft' | 'approved' | 'needs-review';

export interface CockpitItem {
  label: string;
  detail: string;
  status: Status;
}

export interface CockpitSection {
  slug: string;
  title: string;
  tagline: string;
  items: CockpitItem[];
}

export const brands: CockpitItem[] = [
  { label: 'MindReply', detail: 'Think clearly. Decide fast. Move forward.', status: 'preview' },
  { label: 'Website Completion Package', detail: 'Fixed-price completion for unfinished sites.', status: 'draft' },
  { label: 'Agency Follow-Up Rescue', detail: 'Lead follow-up workflows for agencies.', status: 'draft' },
  { label: 'Owner Cockpit', detail: 'Private operating layer for owners.', status: 'preview' },
  { label: 'Connector Engine', detail: 'Data connector health and ads reporting.', status: 'draft' },
];

export const revenuePaths: CockpitItem[] = [
  { label: 'Website Completion Package', detail: 'Fixed-price completion, audit, fast turnaround.', status: 'draft' },
  { label: 'Owner Cockpit setup', detail: 'Setup fee + monthly management.', status: 'draft' },
  { label: 'Agency Follow-Up Rescue', detail: 'Follow-up workflow + templates, monthly.', status: 'draft' },
  { label: 'Landing Page Conversion Rehab', detail: 'Audit + rewrite + deploy.', status: 'draft' },
  { label: 'Private Automation Ops', detail: 'n8n/Zapier/Python automations with approval gates.', status: 'draft' },
];

export const blockers: CockpitItem[] = [
  { label: 'Gamma reference doc', detail: 'gamma.app link returns 403 challenge; concept recreated from positioning.', status: 'blocked' },
  { label: 'Vercel production deploy', detail: 'Vercel CI checks limited by account rate limits.', status: 'blocked' },
  { label: 'Custom domain DNS', detail: 'BLOCKED — DNS ACCESS REQUIRED for mind-reply.com subdomains.', status: 'blocked' },
  { label: 'Owner-only auth', detail: 'Placeholder only. Real auth provider not yet wired to cockpit routes.', status: 'needs-review' },
];

export const evidence: CockpitItem[] = [
  { label: 'PR #66', detail: 'OWNER_INTENT_DICTIONARY.md and OWNER_COMMAND_TRANSLATOR.md merged.', status: 'live' },
  { label: 'PR #60', detail: 'Security vulnerability fixes merged.', status: 'live' },
  { label: 'PR #68', detail: 'Secure Owner Context and Agent Operating Contract merged.', status: 'live' },
  { label: 'LIVE_CHECK_REPORT.md', detail: 'Smoke test record for cockpit routes.', status: 'preview' },
];

export const sections: CockpitSection[] = [
  {
    slug: 'repos',
    title: 'Repos',
    tagline: 'Repository inventory and safety status.',
    items: [
      { label: 'Mind-Reply/MindReply', detail: 'Primary production repo. Next.js 15 + TypeScript.', status: 'live' },
      { label: 'Nested legacy copies', detail: 'MindReply/ and MindReply-main/ nested folders need cleanup review.', status: 'needs-review' },
    ],
  },
  { slug: 'brands', title: 'Brand Engine', tagline: 'Production brands and their launch state.', items: brands },
  {
    slug: 'sites',
    title: 'Sites',
    tagline: 'Site factory output. A site counts only with a working URL, HTTPS, CTA, and evidence.',
    items: [
      { label: 'MindReply Studio', detail: 'Campaign production studio (repo root app).', status: 'preview' },
      { label: 'Owner Cockpit', detail: 'This surface. Preview pending deployment.', status: 'preview' },
    ],
  },
  {
    slug: 'deployments',
    title: 'Deployments',
    tagline: 'Deployment status with evidence. No fake live claims.',
    items: [
      { label: 'Vercel preview', detail: 'Preview deploy pending on PR. See LIVE_CHECK_REPORT.md.', status: 'preview' },
      { label: 'Production', detail: 'NOT LIVE. Requires owner approval and green smoke test.', status: 'blocked' },
    ],
  },
  {
    slug: 'live-checks',
    title: 'Live Checks',
    tagline: 'Smoke tests: URL works, HTTPS works, CTA works, no secrets exposed.',
    items: [
      { label: 'Cockpit routes', detail: '/login, /cockpit, /cockpit/chat and all section routes render.', status: 'preview' },
      { label: 'PWA manifest', detail: '/manifest.webmanifest served by Next metadata route.', status: 'preview' },
    ],
  },
  { slug: 'blockers', title: 'Blockers', tagline: 'Exact blockers with the missing access named.', items: blockers },
  { slug: 'evidence', title: 'Evidence Registry', tagline: 'No evidence, no credit. PRs, URLs, logs, approvals.', items: evidence },
  {
    slug: 'agents',
    title: 'Agent Actions',
    tagline: 'Latest agent branches, PRs, commits, and workflow runs.',
    items: [
      { label: 'agent/owner-cockpit-pwa', detail: 'Owner Cockpit PWA — private production control surface.', status: 'preview' },
      { label: 'AGENT_ACTION_LOG.md', detail: 'Full action history lives in the repo log.', status: 'live' },
    ],
  },
  {
    slug: 'workflows',
    title: 'Workflows',
    tagline: 'n8n / Zapier / Python ops. Nothing sends without owner approval.',
    items: [
      { label: 'Daily live check', detail: 'Trigger: schedule. Output: LIVE_CHECK_REPORT.md. Approval: NO.', status: 'draft' },
      { label: 'Approved message send', detail: 'Trigger: owner approval. APPROVAL REQUIRED.', status: 'draft' },
      { label: 'Blocker escalation', detail: 'Trigger: new blocker. Output: owner notification.', status: 'draft' },
      { label: 'Repo status monitor', detail: 'Trigger: schedule. Output: repo health summary.', status: 'draft' },
    ],
  },
  {
    slug: 'social-ads',
    title: 'Social / Ads Readiness',
    tagline: 'Ads cannot run until a live URL, tracking, privacy page, and owner approval exist.',
    items: [
      { label: 'MindReply launch posts', detail: '7-day content plan drafted. Owner approval required.', status: 'draft' },
      { label: 'Ad angles', detail: '3 angles per brand in SOCIAL_AND_ADS_READINESS.md.', status: 'draft' },
      { label: 'Paid campaigns', detail: 'Blocked until live URL + tracking + privacy page exist.', status: 'blocked' },
    ],
  },
  {
    slug: 'legal',
    title: 'Legal / IP',
    tagline: 'No claimed registration, certification, or compliance without evidence.',
    items: [
      { label: 'Copyright footer', detail: '© 2026 MindReply. All rights reserved.', status: 'live' },
      { label: 'License', detail: 'Repo LICENSE present. Ownership handoff in IP_AND_LEGAL_HANDOFF.md.', status: 'needs-review' },
      { label: 'Privacy / terms', detail: 'LEGAL REVIEW REQUIRED before public launch.', status: 'needs-review' },
    ],
  },
  {
    slug: 'memory',
    title: 'Memory',
    tagline: 'Private memory with consent. No consent = no memory.',
    items: [
      { label: 'Owner memory', detail: 'Saved only after explicit consent prompt.', status: 'draft' },
      { label: 'Sensitive memory', detail: 'Vault references only. Values never stored in plain text.', status: 'draft' },
    ],
  },
  {
    slug: 'settings',
    title: 'Settings',
    tagline: 'Cockpit configuration and access control.',
    items: [
      { label: 'Owner auth', detail: 'TODO: wire real owner-only auth. Placeholder login active.', status: 'needs-review' },
      { label: 'Theme', detail: 'Dark premium theme. Mobile-first.', status: 'live' },
    ],
  },
];

export interface CommandResult {
  command: string;
  keywords: string[];
  response: string[];
  files?: string[];
  suggestions?: string[];
  approvalRequired?: boolean;
}

export const chatCommands: CommandResult[] = [
  {
    command: 'what is live',
    keywords: ['live', 'online', 'deployed', 'production', 'up'],
    response: ['Verified live: 0.', 'Preview: Owner Cockpit, MindReply Studio.', 'No live claim without a verified URL.'],
    files: ['LIVE_URLS.md', 'LIVE_CHECK_REPORT.md'],
    suggestions: ['run live check', 'what is blocked', 'show all urls'],
  },
  {
    command: 'what is blocked',
    keywords: ['blocked', 'blocker', 'stuck', 'problem', 'issue'],
    response: blockers.map((b) => `${b.label}: ${b.detail}`),
    files: ['BLOCKERS.md', 'ACCESS_REQUEST.md'],
    suggestions: ['show legal blockers', 'show today target'],
  },
  {
    command: 'show all brands',
    keywords: ['brand', 'brands'],
    response: brands.map((b) => `${b.label} [${b.status}] — ${b.detail}`),
    files: ['SOCIAL_AND_ADS_READINESS.md'],
    suggestions: ['show revenue paths', 'draft social post'],
  },
  {
    command: 'show all urls',
    keywords: ['url', 'urls', 'link', 'links', 'domain'],
    response: ['Live: none verified.', 'Preview: pending Vercel PR deployment.'],
    files: ['LIVE_URLS.md'],
    suggestions: ['what is live', 'run live check'],
  },
  {
    command: 'show today target',
    keywords: ['today', 'target', 'goal', 'now', 'next'],
    response: ['1. Ship Owner Cockpit PWA preview.', '2. Record smoke test.', '3. Clear one blocker.'],
    files: ['TODAY_TARGETS.md', 'LIVE_CHECK_REPORT.md'],
    suggestions: ['what is blocked', 'prepare next PR'],
  },
  {
    command: 'show revenue paths',
    keywords: ['revenue', 'money', 'income', 'paths', 'sell', 'price'],
    response: revenuePaths.map((r) => `${r.label} — ${r.detail}`),
    suggestions: ['show all brands', 'show today target'],
  },
  {
    command: 'show unsafe repos',
    keywords: ['unsafe', 'security', 'secret', 'repo', 'repos', 'risk'],
    response: ['Mind-Reply/MindReply: nested legacy copies (MindReply/, MindReply-main/) need cleanup review.', 'No hardcoded secrets detected in cockpit code.'],
    files: ['SECURITY.md', 'GO_NO_GO_TABLE.md'],
    suggestions: ['prepare next PR', 'show agent actions'],
  },
  {
    command: 'show agent actions',
    keywords: ['agent', 'actions', 'log', 'history', 'commit', 'branch'],
    response: ['Latest branch: agent/owner-cockpit-pwa.', 'Latest PR: Owner Cockpit PWA — private production control surface.'],
    files: ['AGENT_ACTION_LOG.md'],
    suggestions: ['show evidence', 'prepare next PR'],
  },
  {
    command: 'show evidence',
    keywords: ['evidence', 'proof', 'registry', 'receipts'],
    response: evidence.map((e) => `${e.label} — ${e.detail}`),
    files: ['GLOBAL_EVIDENCE_REGISTRY.md'],
    suggestions: ['show agent actions', 'what is live'],
  },
  {
    command: 'show legal blockers',
    keywords: ['legal', 'ip', 'copyright', 'privacy', 'terms', 'trademark', 'license'],
    response: ['Privacy/terms: LEGAL REVIEW REQUIRED.', 'Trademark: not claimed, no evidence.'],
    files: ['IP_AND_LEGAL_HANDOFF.md'],
    suggestions: ['what is blocked', 'show today target'],
  },
  {
    command: 'draft social post',
    keywords: ['social', 'post', 'draft', 'linkedin', 'twitter', 'ads', 'content'],
    response: ['Drafts live in SOCIAL_AND_ADS_READINESS.md.', 'Nothing publishes without owner approval.'],
    files: ['SOCIAL_AND_ADS_READINESS.md'],
    suggestions: ['show all brands', 'show legal blockers'],
    approvalRequired: true,
  },
  {
    command: 'prepare next PR',
    keywords: ['pr', 'pull', 'prepare', 'ship', 'push', 'cleanup'],
    response: ['Next PR candidate: repo cleanup (nested legacy copies, stale deploy docs).', 'Opening a PR requires owner approval.'],
    files: ['REPO_INVENTORY.md', 'GO_NO_GO_TABLE.md'],
    suggestions: ['show unsafe repos', 'show agent actions'],
    approvalRequired: true,
  },
  {
    command: 'run live check',
    keywords: ['check', 'smoke', 'test', 'verify', 'run'],
    response: ['Live check is a gated action in this MVP.', 'Latest manual record below.'],
    files: ['LIVE_CHECK_REPORT.md'],
    suggestions: ['what is live', 'show evidence'],
    approvalRequired: true,
  },
];

export function matchCommand(input: string): { match?: CommandResult; nearMatches: CommandResult[] } {
  const normalized = input.trim().toLowerCase();
  const exact = chatCommands.find((c) => c.command.toLowerCase() === normalized);
  if (exact) return { match: exact, nearMatches: [] };

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const scored = chatCommands
    .map((c) => {
      const haystack = [c.command, ...c.keywords];
      const score = tokens.reduce(
        (total, token) => total + (haystack.some((h) => h.includes(token) || token.includes(h)) ? 1 : 0),
        0,
      );
      return { c, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0 && scored[0].score >= 2) return { match: scored[0].c, nearMatches: [] };
  return { match: undefined, nearMatches: scored.slice(0, 3).map((entry) => entry.c) };
}
