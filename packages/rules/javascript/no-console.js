module.exports = {
  id: 'no-console',
  category: 'style',
  severity: 'warning',
  run(context) {
    const findings = [];
    try {
      const { code, filePath } = context;
      const lines = code.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('console.log') || lines[i].includes('console.error') || lines[i].includes('console.warn')) {
          findings.push({ file: filePath, line: i + 1, column: lines[i].indexOf('console') + 1, message: 'Avoid console usage in production code' });
        }
      }
    } catch (e) {
      // ignore
    }
    return findings;
  }
};
