const fg = require('fast-glob');
const path = require('path');

export type Severity = 'info' | 'warning' | 'error' | 'critical';

export interface Finding {
  id: string;
  message: string;
  file: string;
  line?: number;
  column?: number;
  severity?: Severity;
  category?: string;
}

export interface RuleModule {
  id: string;
  category?: string;
  severity?: Severity;
  run: (context: { filePath: string; code: string; ast: any }) => Promise<Finding[] | Finding[]> | Finding[];
}

export async function loadRulesFromPackages(rootDir: string) {
  const pattern = path.join(rootDir, 'packages', 'rules', '**', '*.js').replace(/\\/g, '/');
  const files = await fg(pattern, { absolute: true, dot: false });
  const rules: RuleModule[] = [];
  for (const f of files) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(f);
      const rule = mod && (mod.default || mod);
      if (rule && typeof rule.run === 'function') rules.push(rule as RuleModule);
    } catch (err) {
      // ignore load errors
    }
  }
  return rules;
}

export async function runRules(rootDir: string, parsedFiles: Array<{ filePath: string; code: string; ast: any }>) {
  const rules = await loadRulesFromPackages(rootDir);
  const findings: Finding[] = [];

  for (const file of parsedFiles) {
    for (const rule of rules) {
      try {
        const res = await Promise.resolve(rule.run({ filePath: file.filePath, code: file.code, ast: file.ast }));
        if (Array.isArray(res)) {
          for (const f of res) {
            findings.push({ severity: f.severity || rule.severity || 'warning', category: rule.category || 'general', id: rule.id, file: f.file || file.filePath, line: f.line, column: f.column, message: f.message });
          }
        }
      } catch (err) {
        // continue on rule error
      }
    }
  }

  return findings;
}
