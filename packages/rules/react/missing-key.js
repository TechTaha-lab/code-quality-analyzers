module.exports = {
  id: 'missing-key',
  category: 'react',
  severity: 'warning',
  run({ filePath, code }) {
    if (!/\.[jt]sx$/.test(filePath)) return [];
    const findings = [];
    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\.map\s*\([^=]*=>\s*<[\w.]+(?![^>]*\bkey=)/.test(line)) {
        findings.push({ file: filePath, line: index + 1, column: line.indexOf('.map') + 1, message: 'Missing React key prop in mapped JSX element.' });
      }
    });
    return findings;
  },
};
