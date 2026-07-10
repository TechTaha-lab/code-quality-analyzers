# Code Quality Analyzer

Code Quality Analyzer is a lightweight monorepo for scanning source trees, parsing JavaScript and TypeScript files, applying built-in rules, and generating an HTML report.

## Installation

```bash
npm install -g code-quality-analyzers
```

## Usage

```bash
code-quality-analyzer analyze . --output ./code-quality-report
```

## Development

```bash
npm install
npx tsc -p tsconfig.json
npm run test
```

## Publishing

The package is configured for public npm publication. Before publishing, ensure npm authentication is available and run:

```bash
npm publish --access public
```

## License

MIT

