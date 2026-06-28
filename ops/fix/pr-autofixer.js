const fs = require('fs');

function read(p){try{return fs.readFileSync(p,'utf8')}catch{return ''}}

function run(){
  const issues = [];

  const pkg = read('package.json');
  const fe = read('apps/frontend/package.json');
  const be = read('apps/backend/package.json');

  if (!pkg.includes('next')) issues.push('root-missing-next');
  if (!fe.includes('next')) issues.push('frontend-missing-next');
  if (!be.includes('express')) issues.push('backend-missing-express');

  const report = {
    timestamp: new Date().toISOString(),
    issues,
    fixes: issues.map(i => ({ issue: i, action: 'suggest-fix' }))
  };

  fs.mkdirSync('ops/reports',{recursive:true});
  fs.writeFileSync('ops/reports/autofix-report.json', JSON.stringify(report,null,2));

  console.log('AUTO FIX REPORT GENERATED');
}

run();