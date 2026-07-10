"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRulesFromPackages = loadRulesFromPackages;
exports.runRules = runRules;
const fg = require('fast-glob');
const path = require('path');
async function loadRulesFromPackages(rootDir) {
    const pattern = path.join(rootDir, 'packages', 'rules', '**', '*.js').replace(/\\/g, '/');
    const files = await fg(pattern, { absolute: true, dot: false });
    const rules = [];
    for (const f of files) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(f);
            const rule = mod && (mod.default || mod);
            if (rule && typeof rule.run === 'function')
                rules.push(rule);
        }
        catch (err) {
            // ignore load errors
        }
    }
    return rules;
}
async function runRules(rootDir, parsedFiles) {
    const rules = await loadRulesFromPackages(rootDir);
    const findings = [];
    for (const file of parsedFiles) {
        for (const rule of rules) {
            try {
                const res = await Promise.resolve(rule.run({ filePath: file.filePath, code: file.code, ast: file.ast }));
                if (Array.isArray(res)) {
                    for (const f of res) {
                        findings.push({ severity: f.severity || rule.severity || 'warning', category: rule.category || 'general', id: rule.id, file: f.file || file.filePath, line: f.line, column: f.column, message: f.message });
                    }
                }
            }
            catch (err) {
                // continue on rule error
            }
        }
    }
    return findings;
}
//# sourceMappingURL=index.js.map