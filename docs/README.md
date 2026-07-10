# Code Quality Analyzer - Docs

This repository contains a modular code quality analyzer. Use the CLI to run analysis and see generated HTML reports under `code-quality-report/`.

Installed CLI:

```bash
cqa analyze
```

On Windows, if `cqa analyze` does not work because PowerShell cannot find `cqa`, run this first:

```powershell
$env:Path += ";$env:APPDATA\npm"
```

Then run:

```powershell
cqa analyze
```

Short alias:

```bash
cqa a
```

Quick start for development:

```bash
npm install
npm run build:all
npm run analyze
```
