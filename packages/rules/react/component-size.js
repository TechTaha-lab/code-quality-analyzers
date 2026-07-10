module.exports = {
  id: 'component-size',
  category: 'react',
  severity: 'warning',
  run({ filePath, code }) {
    if (!/\.[jt]sx$/.test(filePath)) return [];
    const lines = code.split(/\r?\n/).length;
    if (lines <= 300) return [];
    return [{ file: filePath, line: 1, column: 1, message: `Large component detected (${lines} lines). Split component into smaller units.` }];
  },
};
