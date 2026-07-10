# Code Quality Analyzer

Code Quality Analyzer is a lightweight monorepo for scanning source trees, parsing JavaScript and TypeScript files, applying built-in rules, and generating an HTML report.

## Installation

```bash
npm install -g code-quality-analyzers
```

## Usage

```bash
cqa analyze
```

The long command still works:

```bash
code-quality-analyzer analyze . --output ./code-quality-report
```

On Windows, if PowerShell cannot find global npm commands in the current terminal, add npm's global bin folder for that session:

```powershell
$env:Path += ";$env:APPDATA\npm"
```

Then run the short command:

```powershell
cqa analyze
```

## Development

```bash
npm install
npx tsc -p tsconfig.json
npm run test
```


## License

MIT

