const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

if (!process.env.NPM_TOKEN) {
  console.error('NPM_TOKEN is not set. Aborting publish.');
  process.exit(1);
}

const pkgsDir = path.join(__dirname, '..', 'packages');
const pkgs = fs.readdirSync(pkgsDir).filter((d) => fs.existsSync(path.join(pkgsDir, d, 'package.json')));

for (const p of pkgs) {
  const pkgPath = path.join(pkgsDir, p);
  const pkg = require(path.join(pkgPath, 'package.json'));
  if (pkg.private) {
    console.log(`Skipping private package ${pkg.name}`);
    continue;
  }
  console.log(`Publishing ${pkg.name} from ${pkgPath}`);
  execSync('npm publish --access public', { cwd: pkgPath, stdio: 'inherit' });
}
