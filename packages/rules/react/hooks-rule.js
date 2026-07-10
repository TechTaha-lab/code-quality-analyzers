module.exports = {
  id: 'hooks-rule',
  category: 'react',
  severity: 'warning',
  run({ filePath, code }) {
    if (!/\.[jt]sx$/.test(filePath)) return [];
    const findings = [];
    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\buseEffect\s*\(/.test(line) && !/\]\s*\)/.test(line)) {
        findings.push({ file: filePath, line: index + 1, column: line.indexOf('useEffect') + 1, message: 'Missing dependency array for useEffect.' });
      }
    });
    return findings;
  },
};
