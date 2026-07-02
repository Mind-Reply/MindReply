const fs = require('fs');

function safeRead(p) {
  try { return fs.readFileSync(p,'utf8'); } catch { return ''; }
}

function score() {
  const logs = safeRead('ops/reports/state.json');

  let parsed = {};
  try { parsed = JSON.parse(logs || '{}'); } catch (err) { console.warn('Failed to parse state.json:', err.message); }

  let score = 100;
  const signals = [];

  if (parsed.status === 'degraded') {
    score -= 40;
    signals.push('system-degraded');
  }

  if (!parsed.frontend || !parsed.backend) {
    score -= 30;
    signals.push('service-missing');
  }

  if (!parsed.docker) {
    score -= 20;
    signals.push('docker-drift');
  }

  if (!parsed.contracts) {
    score -= 10;
    signals.push('contract-gap');
  }

  const result = {
    timestamp: new Date().toISOString(),
    score: Math.max(score, 0),
    signals
  };

  fs.mkdirSync('ops/reports', { recursive: true });
  fs.writeFileSync('ops/reports/health-score.json', JSON.stringify(result,null,2));

  console.log('HEALTH SCORE:', result);
}

score();