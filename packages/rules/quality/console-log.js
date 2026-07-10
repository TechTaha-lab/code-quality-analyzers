module.exports = {
  id: 'console-log',
  category: 'quality',
  severity: 'warning',
  run({ filePath, code }) {
    const findings = [];
    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      const column = line.search(/\bconsole\.(log|error|warn)\s*\(/);
      if (column >= 0) findings.push({ file: filePath, line: index + 1, column: column + 1, message: 'Console statement detected. Use structured logging or remove it before release.' });
    });
    return findings;
  },
};
