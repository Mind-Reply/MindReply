const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const workflowId = process.env.ROLLBACK_WORKFLOW_ID ?? 'deploy-production.yml';
const ref = process.env.ROLLBACK_REF ?? 'main';
const releaseSha = process.env.ROLLBACK_RELEASE_SHA ?? 'production-stable';
const reason = process.env.ROLLBACK_REASON ?? 'auto-rollback from production monitor failure';

if (!token) {
  console.error('GITHUB_TOKEN is required to dispatch rollback.');
  process.exit(1);
}

if (!repository) {
  console.error('GITHUB_REPOSITORY is required.');
  process.exit(1);
}

const [owner, repo] = repository.split('/');
const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;

const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ref,
    inputs: {
      release_sha: releaseSha,
      reason,
    },
  }),
});

if (!response.ok) {
  const body = await response.text().catch(() => '');
  console.error(`Failed to dispatch rollback: ${response.status} ${body}`);
  process.exit(1);
}

console.log(`Rollback dispatch sent to ${workflowId} on ${ref}`);
