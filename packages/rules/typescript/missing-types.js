const ts = require('typescript');

function position(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: pos.line + 1, column: pos.character + 1 };
}

module.exports = {
  id: 'missing-types',
  category: 'typescript',
  severity: 'warning',
  run({ filePath, ast }) {
    if (!ast || !/\.[cm]?tsx?$/.test(filePath)) return [];
    const findings = [];

    function visit(node) {
      const isFn = ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node);
      if (isFn) {
        for (const param of node.parameters || []) {
          if (!param.type && ts.isIdentifier(param.name)) {
            findings.push({
              file: filePath,
              ...position(ast, param.name),
              message: `Missing parameter type: ${param.name.text}`,
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
