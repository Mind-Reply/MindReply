const fs = require('fs');
const { execSync } = require('child_process');

function readState() {
  try {
    return JSON.parse(fs.readFileSync('ops/reports/state.json', 'utf8'));
  } catch {
    return { status: 'unknown' };
  }
}

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`Command failed: ${cmd}`, e.message);
    return false;
  }
}

function recover() {
  const state = readState();

  console.log('RECOVERY ENGINE START:', state);

  if (state.status === 'healthy') {
    console.log('System healthy. No recovery needed.');
    return;
  }

  console.log('Attempting recovery actions...');

  // 1. Dependency recovery
  console.log('Step 1: reinstall dependencies');
  safeExec('npm install');

  // 2. Rebuild frontend
  console.log('Step 2: rebuild frontend');
  safeExec('cd apps/frontend && npm run build');

  // 3. Rebuild backend
  console.log('Step 3: rebuild backend');
  safeExec('cd apps/backend && npm run build');

  // 4. Re-run contract checks
  console.log('Step 4: contract validation');
  safeExec('node scripts/contract-check.js');

  const updated = {
    ...state,
    lastRecovery: new Date().toISOString(),
    status: 'recovery_attempted'
  };

  fs.mkdirSync('ops/reports', { recursive: true });
  fs.writeFileSync('ops/reports/state.json', JSON.stringify(updated, null, 2));

  console.log('RECOVERY COMPLETE');
}

recover();