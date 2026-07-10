# Code Quality Analyzer - Docs

This repository contains a modular code quality analyzer for JavaScript, TypeScript, and React projects. The CLI scans source files, runs built-in rules, computes a quality score, and generates an HTML dashboard under `code-quality-report/`.

## Installed CLI

```powershell
cqa analyze
```

Short alias:

```powershell
cqa a
```

The report entry point is:

```text
code-quality-report/index.html
```

Because the report loads `report.json` with `fetch`, view it through a local static server instead of opening the file directly.

## Build And Verify

```powershell
npm install
npm run build
node packages\cli\src\index.js analyze . --output .\code-quality-report --no-open
```
