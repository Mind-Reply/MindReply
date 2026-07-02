const fs = require('fs');
const path = require('path');

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function getHealth() {
  const state = {
    timestamp: new Date().toISOString(),
    frontend: false,
    backend: false,
    docker: false,
    contracts: false,
    status: 'unknown'
  };

  if (fs.existsSync('apps/frontend')) state.frontend = true;
  if (fs.existsSync('apps/backend')) state.backend = true;

  const dockerfile = safeRead('Dockerfile');
  const backendDocker = safeRead('Dockerfile.backend');
  const frontendDocker = safeRead('Dockerfile.frontend');

  state.docker = !!(dockerfile && backendDocker && frontendDocker);
  state.contracts = fs.existsSync('scripts/contract-check.js');

  if (state.frontend && state.backend && state.docker && state.contracts) {
    state.status = 'healthy';
  } else {
    state.status = 'degraded';
  }

  const outDir = 'ops/reports';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'state.json'),
    JSON.stringify(state, null, 2)
  );

  console.log('OPS STATE:', state);
}

getHealth();
