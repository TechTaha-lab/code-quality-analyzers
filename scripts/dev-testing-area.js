const path = require('path');
const fs = require('fs-extra');

const repoRoot = path.join(__dirname, '..');
const devRoot = path.join(repoRoot, 'dev-testing-area');
const sampleRoot = path.join(devRoot, 'sample-project');
const reportRoot = path.join(devRoot, 'report');

function loadPackage(packageName, localPath) {
  try {
    return require(packageName);
  } catch (err) {
    return require(path.join(repoRoot, localPath));
  }
}

async function writeSampleProject() {
  await fs.emptyDir(sampleRoot);
  await fs.ensureDir(path.join(sampleRoot, 'src'));
  await fs.writeJson(path.join(sampleRoot, 'package.json'), {
    name: 'cqa-dev-testing-area',
    private: true,
    type: 'commonjs',
  }, { spaces: 2 });

  await fs.writeFile(path.join(sampleRoot, 'src', 'index.ts'), [
    'const apiKey = "sk_test_dev_area_secret";',
    '',
    'function greet(name: any) {',
    '  const unused = 42;',
    '  console.log("hello", name);',
    '  return apiKey;',
    '}',
    '',
    'greet("dev");',
    '',
  ].join('\n'), 'utf8');

  await fs.writeFile(path.join(sampleRoot, 'src', 'broken.ts'), [
    'export function broken(',
  ].join('\n'), 'utf8');
}

(async () => {
  const { scan } = loadPackage('@code-quality/scanner', 'packages/scanner/src/index.js');
  const { parseFile } = loadPackage('@code-quality/parser', 'packages/parser/src/index.js');
  const { runRules } = loadPackage('@code-quality/rule-engine', 'packages/rule-engine/src/index.js');
  const { analyzeProject } = loadPackage('@code-quality/core', 'packages/core/src/index.js');

  await writeSampleProject();

  const files = await scan({ root: sampleRoot });
  const parsed = [];
  for (const file of files) {
    const result = await parseFile(file);
    if (result) parsed.push({ filePath: result.filePath, code: result.code, ast: result.ast });
  }

  const findings = await runRules(repoRoot, parsed);
  const report = await analyzeProject({ root: sampleRoot, output: reportRoot, open: false });
  const reportJson = await fs.readJson(path.join(reportRoot, 'report.json'));

  console.log('Dev testing area ready');
  console.log(`Sample: ${sampleRoot}`);
  console.log(`Report: ${path.join(reportRoot, 'index.html')}`);
  console.log(`scan() returned: ${files.length}`);
  console.log(`parseFile() parsed: ${parsed.length}`);
  console.log(`runRules() findings: ${findings.length}`);
  console.log(`analyzeProject() returned filesScanned: ${report.filesScanned}`);
  console.log(`report.json summary.filesScanned: ${reportJson.summary.filesScanned}`);
  console.log(`report.json summary.filesAnalyzed: ${reportJson.summary.filesAnalyzed}`);
})();
