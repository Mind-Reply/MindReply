import { setTimeout as sleep } from 'node:timers/promises';

function splitList(value) {
  return (value ?? '')
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function checkHealth(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    return { healthy: false, status: response.status };
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => ({}));
    return { healthy: payload?.ok !== false, status: response.status, payload };
  }

  return { healthy: true, status: response.status };
}

const hooks = splitList(process.env.DEPLOY_HOOKS);
const healthUrl = process.env.HEALTHCHECK_URL;
const settleSeconds = parsePositiveInt(process.env.DEPLOY_SETTLE_SECONDS, 60);
const attempts = parsePositiveInt(process.env.HEALTH_ATTEMPTS, 12);
const intervalSeconds = parsePositiveInt(process.env.HEALTH_INTERVAL_SECONDS, 10);

if (!hooks.length) {
  console.error('DEPLOY_HOOKS is required. Provide one or more deployment webhook URLs.');
  process.exit(1);
}

if (!healthUrl) {
  console.error('HEALTHCHECK_URL is required.');
  process.exit(1);
}

const payload = {
  repository: process.env.GITHUB_REPOSITORY ?? 'unknown',
  ref: process.env.GITHUB_REF ?? 'unknown',
  sha: process.env.GITHUB_SHA ?? 'unknown',
  reason: process.env.DEPLOY_REASON ?? 'github-actions',
  deployedAt: new Date().toISOString(),
};

for (let index = 0; index < hooks.length; index += 1) {
  const hook = hooks[index];
  const label = `${index + 1}/${hooks.length}`;
  console.log(`Triggering deployment hook ${label}`);

  try {
    const response = await fetch(hook, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`hook responded with ${response.status}`);
    }
  } catch (error) {
    console.error(`Hook ${label} failed:`, error.message);
    continue;
  }

  console.log(`Waiting ${settleSeconds}s for the platform to finish deploying...`);
  await sleep(settleSeconds * 1000);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await checkHealth(healthUrl);
      if (result.healthy) {
        console.log(`Healthy after hook ${label} on attempt ${attempt}`);
        process.exit(0);
      }
      console.log(`Attempt ${attempt} unhealthy (status ${result.status}); retrying...`);
    } catch (error) {
      console.log(`Attempt ${attempt} errored: ${error.message}`);
    }

    if (attempt < attempts) {
      await sleep(intervalSeconds * 1000);
    }
  }

  console.error(`Deployment hook ${label} did not pass health checks. Trying the next fallback.`);
}

console.error('All deployment hooks failed or failed health checks.');
process.exit(1);
