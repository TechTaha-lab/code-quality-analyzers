# Code Quality Analyzer - Docs

This repository contains a modular code quality analyzer. Use the CLI to run analysis and see generated HTML reports under `code-quality-report/`.

Installed CLI:

```powershell
cqa.cmd analyze
```

If you are working from this cloned repo before publishing, link the package once:

```powershell
npm.cmd link
```

On Windows, if PowerShell still cannot find `cqa`, add npm's global bin folder for the current terminal:

```powershell
$env:Path += ";$env:APPDATA\npm"
```

Then run the analyzer from PowerShell:

```powershell
cqa.cmd analyze
```

Short alias:

```powershell
cqa.cmd a
```

In Command Prompt, Git Bash, or terminals where PowerShell scripts are allowed, you can use `cqa analyze`.

Quick start for development:

```bash
npm install
npm run build:all
npm run analyze
```
