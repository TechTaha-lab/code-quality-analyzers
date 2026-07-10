module.exports = {
  id: 'complexity',
  category: 'quality',
  severity: 'warning',
  run({ filePath, code }) {
    const matches = code.match(/\b(if|for|while|case|catch)\b|\?\s*|&&|\|\|/g) || [];
    const complexity = matches.length + 1;
    if (complexity <= 10) return [];
    return [{
      file: filePath,
      line: 1,
      column: 1,
      severity: complexity > 20 ? 'error' : 'warning',
      message: `Cyclomatic complexity is ${complexity}. Reduce branching or split this module.`,
    }];
  },
};
