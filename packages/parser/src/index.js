"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = parseFile;
const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');
const { parse: babelParse } = require('@babel/parser');
function detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.ts' || ext === '.tsx')
        return 'typescript';
    return 'javascript';
}
async function parseFile(filePath) {
    try {
        const code = await fs.readFile(filePath, 'utf8');
        const language = detectLanguage(filePath);
        if (language === 'typescript') {
            const scriptKind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
            const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, scriptKind);
            return { filePath, code, language, ast: sourceFile };
        }
        // JavaScript via Babel
        const ast = babelParse(code, {
            sourceType: 'unambiguous',
            plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator', 'typescript'],
        });
        return { filePath, code, language, ast };
    }
    catch (err) {
        return null;
    }
}
//# sourceMappingURL=index.js.map