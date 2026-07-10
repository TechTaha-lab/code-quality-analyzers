const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');
const { parse: babelParse } = require('@babel/parser');

export type Language = 'typescript' | 'javascript';

export interface ParseResult {
  filePath: string;
  code: string;
  language: Language;
  ast: any;
}

function detectLanguage(filePath: string): Language {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.ts' || ext === '.tsx') return 'typescript';
  return 'javascript';
}

export async function parseFile(filePath: string): Promise<ParseResult | null> {
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
  } catch (err) {
    return null;
  }
}
