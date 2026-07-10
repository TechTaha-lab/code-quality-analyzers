# Code Quality Analyzer

Code Quality Analyzer is a modular static analysis toolkit for JavaScript, TypeScript, and React projects. It scans source trees, runs built-in quality/security/type rules, computes a quality score, and generates a browser-based HTML report.

## Installation

```bash
npm install -g code-quality-analyzers
```

For local development from this cloned repo, link the package once:

```powershell
npm link
```

## Usage

```powershell
cqa analyze . --output .\code-quality-report
```

The long command also works:

```bash
code-quality-analyzer analyze . --output ./code-quality-report
```

Generate without opening a browser:

```powershell
cqa analyze . --output .\code-quality-report --no-open
```

The generated dashboard lives at `code-quality-report/index.html` and reads `code-quality-report/report.json`.

## Rules

Built-in rules cover:

- TypeScript: explicit `any`, unused variables, unused parameters, missing parameter types
- React: missing mapped keys, missing `useEffect` dependency arrays, oversized components
- Security: exposed secrets, `eval()` and `Function()`
- Quality: complexity, TODO/FIXME comments, console usage

See [docs/RULES.md](docs/RULES.md) for the complete rule and scoring reference.

## Development

```powershell
npm install
npm run build
npm run test
```

## License

MIT
