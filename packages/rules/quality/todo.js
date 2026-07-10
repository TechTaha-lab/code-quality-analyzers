module.exports = {
  id: 'todo',
  category: 'quality',
  severity: 'info',
  run({ filePath, code }) {
    const findings = [];
    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      const column = Math.max(line.indexOf('TODO'), line.indexOf('FIXME'));
      if (column >= 0) findings.push({ file: filePath, line: index + 1, column: column + 1, message: 'TODO/FIXME comment found.' });
    });
    return findings;
  },
};
