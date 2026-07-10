# Rules

Rules are CommonJS modules under `packages/rules/**`. Each rule exports an object with:

```js
module.exports = {
  id: 'rule-id',
  category: 'quality',
  severity: 'warning',
  run(context) {
    return [{ file: context.filePath, line: 1, column: 1, message: 'Finding message' }];
  },
};
```

## Built-in Rules

| Rule | Category | Severity | Description |
| --- | --- | --- | --- |
| `no-explicit-any` | TypeScript | error | Flags explicit `any` annotations. |
| `unused-variable` | TypeScript | warning | Flags local variables that are declared but not referenced. |
| `unused-parameter` | TypeScript | warning | Flags function parameters that are not used in the body. |
| `missing-types` | TypeScript | warning | Flags parameters without explicit types. |
| `missing-key` | React | warning | Flags mapped JSX elements without a `key` prop. |
| `hooks-rule` | React | warning | Flags `useEffect` calls without a dependency array. |
| `component-size` | React | warning | Flags TSX/JSX components larger than 300 lines. |
| `secret-detector` | Security | critical | Flags likely API keys, passwords, and secrets. |
| `eval-usage` | Security | critical | Flags `eval()` and `Function()` usage. |
| `complexity` | Quality | warning/error | Flags high cyclomatic complexity. |
| `todo` | Quality | info | Flags `TODO` and `FIXME` comments. |
| `console-log` | Quality | warning | Flags `console.log`, `console.error`, and `console.warn`. |

## Scoring

Reports start at `100` and subtract points for findings:

| Finding | Penalty |
| --- | ---: |
| Security issue | 10 |
| Complexity issue | 5 |
| Explicit `any` | 2 |
| Unused variable, unused parameter, or console usage | 1 |
| Other error | 3 |
| Other warning | 1 |

Ratings are `Poor` below 50, `Needs improvement` from 50-69, `Good` from 70-89, and `Excellent` from 90-100.
