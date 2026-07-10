module.exports = {
  id: 'eval-usage',
  category: 'security',
  severity: 'critical',
  run(context) {
    const findings = [];
    try {
      const { code, filePath } = context;
      const lines = code.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('eval(') || lines[i].includes('Function(')) {
          findings.push({ file: filePath, line: i + 1, message: 'Use of eval()/Function() detected — security risk' });
        }
      }
    } catch (e) {}
    return findings;
  }
};
