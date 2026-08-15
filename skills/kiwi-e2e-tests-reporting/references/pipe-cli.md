# kiwi-tcms-pipe

CLI in `@kiwi-tcms-ai/kiwi-tcms-reporter`. Reads JUnit XML or JSON and updates
TestExecutions. Use when the project is not Playwright / Jest / Mocha, or when
CI already emits JUnit.

```bash
kiwi-tcms-pipe --help
```

## Typical CI

```bash
npx playwright test --reporter=junit
npx kiwi-tcms-pipe --plan 12 --build "$CI_COMMIT_TAG" --results junit.xml
```

JSON from stdin:

```bash
cat results.json | kiwi-tcms-pipe --run 87
```

## Flags

| Flag | Meaning |
| --- | --- |
| `--run <id>` | Existing TestRun |
| `--plan <id>` | TestPlan (with `--build`: find or create the run) |
| `--build <name>` | Build name |
| `--title <text>` | Run summary when creating |
| `--results <file>` | File; omit to read stdin |
| `--format junit\|json\|auto` | Default `auto` (`<` → junit) |
| `--match-by auto\|tag\|title` | Default `auto` |
| `--create-missing` | Create unmatched cases |
| `--dry-run` | Match only |
| `--close-run` | Set TestRun.stop_date after a fully successful sync (no unmatched tests, no failed ops); skipped otherwise |
| `--strict` | Exit 1 if unmatched tests or failed ops |

Env: `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT`, `KIWI_TIMEOUT`, `KIWI_INSECURE`.

`--plan`+`--build` needs a Version to attach the Build to: the plan's own
`product_version`, or (fallback) any existing Version for `KIWI_PROJECT`. If
neither exists, create a Version in Kiwi first.

## JSON shape

```json
{
  "tests": [
    {
      "title": "Shopper can pay by card [C412]",
      "fullTitle": "payments > pay",
      "status": "passed",
      "durationMs": 1234,
      "error": null,
      "tags": ["C412"]
    }
  ]
}
```

Also accepted: `{ "results": [...] }` or a bare array.
Statuses `pass` / `fail` / `skip` / `blocked` / `pending` / `timeout` are normalized.

## GitHub Actions

```yaml
- run: npx playwright test --reporter=junit
  env:
    KIWI_URL: ${{ secrets.KIWI_URL }}
    KIWI_USERNAME: ${{ secrets.KIWI_USERNAME }}
    KIWI_PASSWORD: ${{ secrets.KIWI_PASSWORD }}
    KIWI_PROJECT: Payments
- run: npx kiwi-tcms-pipe --plan 12 --build "${{ github.ref_name }}" --results junit.xml --strict
  env:
    KIWI_URL: ${{ secrets.KIWI_URL }}
    KIWI_USERNAME: ${{ secrets.KIWI_USERNAME }}
    KIWI_PASSWORD: ${{ secrets.KIWI_PASSWORD }}
    KIWI_PROJECT: Payments
```

Always `--dry-run` once before the first CI write. Do not enable `--create-missing` until unmatched tests are reviewed.
