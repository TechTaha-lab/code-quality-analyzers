const fg = require('fast-glob');
const path = require('path');

export interface ScanOptions {
  root?: string;
  ignore?: string[];
  extensions?: string[];
}

const DEFAULT_IGNORE = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.git',
  'out'
];

export async function scan(opts: ScanOptions = {}) {
  const root = opts.root || '.';
  const extensions = opts.extensions || ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'];
  const ignore = Array.from(new Set([...(opts.ignore || []), ...DEFAULT_IGNORE]));

  const patterns = extensions.map((ext) => `**/*.${ext}`);

  const entries = await fg(patterns, {
    cwd: root,
    absolute: true,
    dot: false,
    ignore,
  });

  return entries.map((p: string) => path.resolve(p));
}
