const ts = require('typescript');

function position(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: pos.line + 1, column: pos.character + 1 };
}

module.exports = {
  id: 'no-explicit-any',
  category: 'typescript',
  severity: 'error',
  run({ filePath, ast }) {
    if (!ast || !/\.[cm]?tsx?$/.test(filePath)) return [];
    const findings = [];

    function visit(node) {
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        findings.push({
          file: filePath,
          ...position(ast, node),
          message: 'Explicit any detected. Replace any with an interface, a generic, or unknown.',
        });
      }
      ts.forEachChild(node, visit);
    }

    visit(ast);
    return findings;
  },
};
