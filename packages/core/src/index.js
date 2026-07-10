"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeProject = analyzeProject;
const path = require('path');
const fs = require('fs-extra');
let open;
try {
    open = require('open');
}
catch (err) {
    open = null;
}
const { scan } = require('@code-quality/scanner');
const { parseFile } = require('@code-quality/parser');
const { runRules } = require('@code-quality/rule-engine');
function computeMetrics(code) {
    const lines = code.split(/\r?\n/);
    const total = lines.length;
    const blank = lines.filter((l) => l.trim() === '').length;
    const comment = lines.filter((l) => l.trim().startsWith('//') || l.trim().startsWith('/*') || l.trim().startsWith('*')).length;
    return { lines: total, blankLines: blank, commentLines: comment, commentRatio: total === 0 ? 0 : +(comment / total).toFixed(3) };
}
function scoreFinding(finding) {
    const id = finding.id || '';
    const category = finding.category || '';
    if (category === 'security' || finding.severity === 'critical')
        return 10;
    if (id === 'no-explicit-any')
        return 2;
    if (id === 'complexity')
        return 5;
    if (id === 'unused-variable' || id === 'unused-parameter' || id === 'console-log' || id === 'no-console')
        return 1;
    if (finding.severity === 'error')
        return 3;
    if (finding.severity === 'warning')
        return 1;
    return 0;
}
function ratingForScore(score) {
    if (score < 50)
        return 'Poor';
    if (score < 70)
        return 'Needs improvement';
    if (score < 90)
        return 'Good';
    return 'Excellent';
}
function packageRoot() {
    return path.resolve(__dirname, '..', '..', '..');
}
async function findStaticReporterDir() {
    const candidates = [
        path.join(process.cwd(), 'packages', 'reporter', 'html', 'static'),
        path.join(packageRoot(), 'packages', 'reporter', 'html', 'static'),
    ];
    for (const candidate of candidates) {
        if (await fs.pathExists(path.join(candidate, 'index.html')))
            return candidate;
    }
    return null;
}
async function analyzeProject(opts = {}) {
    const startedAt = Date.now();
    const root = opts.root || '.';
    const output = opts.output || './code-quality-report';
    const shouldOpen = opts.open !== false;
    console.log('Scanning files...');
    const files = await scan({ root, ignore: opts.ignore });
    console.log(`Found ${files.length} files`);
    const results = [];
    const parsedForRules = [];
    console.log('Parsing files...');
    for (const file of files) {
        const parsed = await parseFile(file);
        if (!parsed)
            continue;
        const metrics = computeMetrics(parsed.code);
        results.push({ file: file, language: parsed.language, metrics });
        parsedForRules.push({ filePath: parsed.filePath, code: parsed.code, ast: parsed.ast });
    }
    console.log(`Parsed ${results.length} files`);
    console.log('Running rules...');
    const findings = await runRules(packageRoot(), parsedForRules);
    console.log(`Found ${findings.length} findings`);
    const errors = findings.filter((f) => f.severity === 'error' || f.severity === 'critical').length;
    const warnings = findings.filter((f) => f.severity === 'warning').length;
    const infos = findings.filter((f) => f.severity === 'info').length;
    const score = Math.max(0, 100 - findings.reduce((total, finding) => total + scoreFinding(finding), 0));
    const reportDir = path.resolve(output);
    await fs.ensureDir(reportDir);
    const data = {
        summary: {
            filesScanned: files.length,
            filesAnalyzed: results.length,
            timeMs: Date.now() - startedAt,
            generatedAt: new Date().toISOString(),
            findings: findings.length,
            errors,
            warnings,
            infos,
            score,
            rating: ratingForScore(score),
        },
        files: results,
        findings,
    };
    await fs.writeJson(path.join(reportDir, 'report.json'), data, { spaces: 2 });
    // Copy the bundled HTML reporter. The packageRoot candidate is required when
    // the CLI is installed globally and process.cwd() is the analyzed project.
    const staticDir = await findStaticReporterDir();
    try {
        if (staticDir) {
            // copy assets to reportDir/assets
            await fs.copy(path.join(staticDir, 'assets'), path.join(reportDir, 'assets'));
            // copy index.html to report root
            await fs.copyFile(path.join(staticDir, 'index.html'), path.join(reportDir, 'index.html'));
        }
        else {
            // fallback minimal HTML
            const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Code Quality Report</title></head><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`;
            await fs.writeFile(path.join(reportDir, 'index.html'), html, 'utf8');
        }
    }
    catch (err) {
        const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Code Quality Report</title></head><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`;
        await fs.writeFile(path.join(reportDir, 'index.html'), html, 'utf8');
    }
    console.log();
    console.log('Analysis complete');
    console.log(`Report: ${path.join(reportDir, 'index.html')}`);
    if (shouldOpen) {
        console.log();
        if (open && typeof open === 'function') {
            console.log('Opening browser...');
            try {
                await open(path.join(reportDir, 'index.html'));
            }
            catch (err) {
                console.warn('Could not open browser automatically. Report was generated successfully.');
            }
        }
        else {
            console.log('Open the generated report at:');
            console.log(path.join(reportDir, 'index.html'));
        }
    }
    return { success: true, reportDir, findings: findings.length, filesScanned: files.length, filesAnalyzed: results.length };
}
//# sourceMappingURL=index.js.map