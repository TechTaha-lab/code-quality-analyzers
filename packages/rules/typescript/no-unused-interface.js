module.exports = {
  id: 'no-unused-interface',
  category: 'typescript',
  severity: 'warning',
  run(context) {
    // naive heuristic: flag interfaces that include 'I' prefix but not used elsewhere (demo rule)
    const findings = [];
    try {
      const { code, filePath } = context;
      const matches = code.match(/interface\s+(I[A-Z][A-Za-z0-9_]*)/g) || [];
      for (const m of matches) {
        const name = m.split(/\s+/)[1];
        if (name && !code.includes(name + ' ')) {
          findings.push({ file: filePath, message: `Interface ${name} might be unused` });
        }
      }
    } catch (e) {}
    return findings;
  }
};
