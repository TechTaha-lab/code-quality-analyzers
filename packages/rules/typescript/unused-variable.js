const ts = require('typescript');

function position(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: pos.line + 1, column: pos.character + 1 };
}

module.exports = {
  id: 'unused-variable',
  category: 'typescript',
  severity: 'warning',
  run({ filePath, ast, code }) {
    if (!ast || !/\.[cm]?tsx?$/.test(filePath)) return [];
    const findings = [];
    const withoutDeclarations = code.replace(/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*/g, '');

    function visit(node) {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        if (!name.startsWith('_')) {
          const usage = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
          if ((withoutDeclarations.match(usage) || []).length === 0) {
            findings.push({
              file: filePath,
              ...position(ast, node.name),
              message: `Unused variable detected: ${name}`,
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(ast);
    return findings;
  },
};
