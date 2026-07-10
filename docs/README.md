# Code Quality Analyzer - Docs

This repository contains a modular code quality analyzer for JavaScript, TypeScript, and React projects. The CLI scans source files, runs built-in rules, computes a quality score, and generates an HTML dashboard under `code-quality-report/`.

## Installed CLI

```powershell
cqa.cmd analyze
```

Short alias:

```powershell
cqa.cmd a
```

The report entry point is:

```text
code-quality-report/index.html
```

Because the report loads `report.json` with `fetch`, view it through a local static server instead of opening the file directly.

## Local Development

If you are working from this cloned repo before publishing, link the package once:

```powershell
npm.cmd link
```

On Windows, if PowerShell cannot find `cqa`, add npm's global bin folder for the current terminal:

```powershell
$env:Path += ";$env:APPDATA\npm"
```

Run the analyzer from PowerShell:

```powershell
cqa.cmd analyze . --output .\code-quality-report
```

In Command Prompt, Git Bash, or terminals where PowerShell scripts are allowed, you can use:

```bash
cqa analyze
```

## Build And Verify

```powershell
npm.cmd install
npm.cmd run build
node packages\cli\src\index.js analyze . --output .\code-quality-report --no-open
```
