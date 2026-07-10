export default {
  output: './code-quality-report',
  open: true,
  theme: 'dark',
  ignore: ['node_modules', 'dist'],
  rules: {
    'no-console': 'warning',
    'complexity': 'error'
  }
} as const;
