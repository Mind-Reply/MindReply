const fs = require('fs');

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function generateReport() {
  const state = {
    timestamp: new Date().toISOString(),
    issues: []
  };

  const pkg = read('package.json');
  const frontend = read('apps/frontend/package.json');
  const backend = read('apps/backend/package.json');

  if (!pkg.includes('next')) state.issues.push('root-missing-next');
  if (!frontend.includes('next')) state.issues.push('frontend-missing-next');
  if (!backend.includes('express')) state.issues.push('backend-missing-express');

  const fixes = state.issues.map(i => ({
    type: i,
    action: 'auto-fix-suggested'
  }));

  const output = {
    ...state,
    fixes
  };

  fs.mkdirSync('ops/reports', { recursive: true });
  fs.writeFileSync('ops/reports/pr-repair.json', JSON.stringify(output, null, 2));

  console.log('PR REPAIR REPORT GENERATED');
}

generateReport();