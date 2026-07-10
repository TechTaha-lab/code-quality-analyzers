# Writing Rules

Rules are simple CommonJS modules for now (placed under `packages/rules/*`). They export an object with an `id`, `category`, `severity`, and `run(context)` function.

Example:

```js
module.exports = {
  id: 'no-console',
  category: 'style',
  severity: 'warning',
  run(context) { return [{ file: context.filePath, line: 1, message: 'Avoid console' }]; }
}
```

Future: TypeScript-defined rule API and `defineRule()` helper.
