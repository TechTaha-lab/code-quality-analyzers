const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const { scan } = require('@code-quality/scanner');
const { parseFile } = require('@code-quality/parser');
const { runRules } = require('@code-quality/rule-engine');

export interface AnalyzeOptions {
  root?: string;
  output?: string;
  open?: boolean;
  ignore?: string[];
}

function computeMetrics(code: string) {
  const lines = code.split(/\r?\n/);
  const total = lines.length;
  const blank = lines.filter((l) => l.trim() === '').length;
  const comment = lines.filter((l) => l.trim().startsWith('//') || l.trim().startsWith('/*') || l.trim().startsWith('*')).length;
  return { lines: total, blankLines: blank, commentLines: comment, commentRatio: total === 0 ? 0 : +(comment / total).toFixed(3) };
}

export async function analyzeProject(opts: AnalyzeOptions = {}) {
  const root = opts.root || '.';
  const output = opts.output || './code-quality-report';
  const shouldOpen = opts.open !== false;

  console.log('Scanning files...');
  const files = await scan({ root, ignore: opts.ignore });
  console.log(`Found ${files.length} files`);

  const results: any[] = [];
  console.log('Parsing files...');
  for (const file of files) {
    const parsed = await parseFile(file);
    if (!parsed) continue;
    const metrics = computeMetrics(parsed.code);
    results.push({ file: file, language: parsed.language, metrics });
  }
  console.log(`Parsed ${results.length} files`);

  const reportDir = path.resolve(output);
  await fs.ensureDir(reportDir);

  // Run rules
  const parsedForRules = results.map((r) => ({ filePath: r.file, code: fs.readFileSync(r.file, 'utf8'), ast: null }));
  const findings = await runRules(process.cwd(), parsedForRules);

  const data = {
    summary: {
      filesScanned: results.length,
      timeMs: 0,
      generatedAt: new Date().toISOString(),
      findings: findings.length,
    },
    files: results,
    findings,
  };

  await fs.writeJson(path.join(reportDir, 'report.json'), data, { spaces: 2 });

  // Copy static reporter from packages/reporter/html/static if available
  const staticDir = path.join(process.cwd(), 'packages', 'reporter', 'html', 'static');
  try {
    const exists = await fs.pathExists(staticDir);
    if (exists) {
      // copy assets to reportDir/assets
      await fs.copy(path.join(staticDir, 'assets'), path.join(reportDir, 'assets'));
      // copy index.html to report root
      await fs.copyFile(path.join(staticDir, 'index.html'), path.join(reportDir, 'index.html'));
    } else {
      // fallback minimal HTML
      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Code Quality Report</title></head><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`;
      await fs.writeFile(path.join(reportDir, 'index.html'), html, 'utf8');
    }
  } catch (err) {
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Code Quality Report</title></head><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`;
    await fs.writeFile(path.join(reportDir, 'index.html'), html, 'utf8');
  }

  console.log('✔ Scan completed');
  console.log('Report generated');
  console.log();
  console.log(path.join(reportDir, 'index.html'));
  if (shouldOpen) {
    console.log();
    console.log('Opening browser...');
    await open(path.join(reportDir, 'index.html'));
  }

  return { success: true, reportDir };
}
