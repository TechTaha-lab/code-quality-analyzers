const ts = require('typescript');

function position(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: pos.line + 1, column: pos.character + 1 };
}

module.exports = {
  id: 'unused-parameter',
  category: 'typescript',
  severity: 'warning',
  run({ filePath, ast }) {
    if (!ast || !/\.[cm]?tsx?$/.test(filePath)) return [];
    const findings = [];

    function inspectFunction(node) {
      if (!node.body) return;
      const bodyText = node.body.getText(ast);
      for (const param of node.parameters || []) {
        if (!ts.isIdentifier(param.name)) continue;
        const name = param.name.text;
        if (name.startsWith('_')) continue;
        const usage = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        if ((bodyText.match(usage) || []).length === 0) {
          findings.push({
            file: filePath,
            ...position(ast, param.name),
            message: `Unused parameter: ${name}`,
          });
        }
      }
    }

    function visit(node) {
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
        inspectFunction(node);
      }
      ts.forEachChild(node, visit);
    }

    visit(ast);
    return findings;
  },
};
