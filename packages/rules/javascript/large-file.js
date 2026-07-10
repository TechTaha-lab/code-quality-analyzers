module.exports = {
  id: 'large-file',
  category: 'performance',
  severity: 'info',
  run(context) {
    const findings = [];
    try {
      const { code, filePath } = context;
      const lines = code.split(/\r?\n/).length;
      if (lines > 500) {
        findings.push({ file: filePath, message: `Large file (${lines} lines) — consider splitting into smaller modules` });
      }
    } catch (e) {}
    return findings;
  }
};
