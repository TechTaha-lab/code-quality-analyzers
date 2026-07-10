"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = scan;
const fg = require('fast-glob');
const path = require('path');
const DEFAULT_IGNORE = [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.next',
    '.git',
    'out'
];
async function scan(opts = {}) {
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
    return entries.map((p) => path.resolve(p));
}
//# sourceMappingURL=index.js.map