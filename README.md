# Code Quality Analyzer

Code Quality Analyzer is a lightweight monorepo for scanning source trees, parsing JavaScript and TypeScript files, applying built-in rules, and generating an HTML report.

## Installation

```bash
npm install -g code-quality-analyzers
```

For local development from this cloned repo, link the package once:

```powershell
npm.cmd link
```

## Usage

```powershell
cqa.cmd analyze
```

The long command still works:

```bash
code-quality-analyzer analyze . --output ./code-quality-report
```

On Windows, if PowerShell cannot find `cqa`, add npm's global bin folder for the current terminal:

```powershell
$env:Path += ";$env:APPDATA\npm"
```

Then run:

```powershell
cqa.cmd analyze
```

In Command Prompt, Git Bash, or terminals where PowerShell scripts are allowed, you can use `cqa analyze`.

## Development

```bash
npm install
npx tsc -p tsconfig.json
npm run test
```


## License

MIT

