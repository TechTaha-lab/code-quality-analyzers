const path = require('path');
const fs = require('fs');

const reportPath = path.join(__dirname, '..', 'packages', 'examples', 'sample-project', 'code-quality-report', 'index.html');

if (!fs.existsSync(reportPath)) {
  console.error('Report not found at', reportPath);
  process.exit(2);
}

console.log('Report exists:', reportPath);
process.exit(0);
