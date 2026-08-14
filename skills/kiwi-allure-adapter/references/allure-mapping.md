# Allure → pipe JSON

There is no Allure product or adapter package. Parse
`allure-results/*-result.json` and emit the pipe JSON. Schema:
[pipe-cli.md](../../kiwi-e2e-tests-reporting/references/pipe-cli.md).

## Fields

| Allure | Pipe |
| --- | --- |
| `name` | `title` |
| `fullName` | `fullTitle` |
| `status` | `status` (see below) |
| `stop - start` | `durationMs` |
| `statusDetails.message` + `trace` | `error` |
| labels `tag` / `testCaseId` | `tags` |

Skip `*-container.json` and `*-attachment.*`. Only `*-result.json` is a test.

## Status

| Allure | Kiwi | Comment |
| --- | --- | --- |
| passed | PASSED | |
| failed | FAILED | type: failed (assertion) |
| broken | FAILED | type: broken (infra / test) |
| skipped | BLOCKED | |

`broken` ≠ `failed`. Both write FAILED. The comment must say which type.

Collapse `steps[]` into one short comment. Do not copy every step.

## Case id

Prefer a label:

```json
{ "name": "tag", "value": "C412" }
```

Also accepted: `TC-412`, `KIWI:412`, `[C412]`, or
`{ "name": "testCaseId", "value": "412" }`.

Fall back to exact, then partial, title vs case summary.

## Send

```bash
kiwi-tcms-pipe --format json --run <id> --results allure-mapped.json
```

Or `--plan` + `--build`. `--dry-run` first. Flags: `kiwi-tcms-pipe --help`.

## Attachments

Allure `attachments[].source` is a file next to the result JSON. After the
pipe writes the execution:

```
kiwi_execution_add_attachment(execution_id, filename, b64content)
```

`b64content` is the file bytes as base64. Use for screenshots, traces, logs.
