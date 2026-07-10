const PATTERNS = [/sk-[A-Za-z0-9_-]{8,}/, /AIza[A-Za-z0-9_-]{8,}/, /\bpassword\s*=/i, /\bsecret\s*=/i, /\bapi[_-]?key\s*=/i];

module.exports = {
  id: 'secret-detector',
  category: 'security',
  severity: 'critical',
  run({ filePath, code }) {
    const findings = [];
    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      const matched = PATTERNS.find((pattern) => pattern.test(line));
      if (matched) {
        findings.push({ file: filePath, line: index + 1, column: 1, message: 'Possible secret exposed. Move credentials to a secure secret manager or environment variable.' });
      }
    });
    return findings;
  },
};
