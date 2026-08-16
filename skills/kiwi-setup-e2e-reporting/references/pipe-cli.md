# kiwi-tcms-pipe

CLI in `@kiwi-tcms-ai/kiwi-tcms-reporter`. Reads JUnit XML or JSON and updates
TestExecutions. Use when the project is not Playwright / Jest / Mocha, or when
CI already emits JUnit.

`kiwi-tcms-pipe --help` exits 0 with **empty stdout** — do not rely on it for
flags, use the table below. `npx kiwi-tcms-pipe` also fails ("not on PATH")
unless the package's bin is linked; run it via the local install instead:

```bash
node node_modules/@kiwi-tcms-ai/kiwi-tcms-reporter/dist/pipe.js --plan 12 --build "$CI_COMMIT_TAG" --results junit.xml
```

## Typical CI

```bash
npx playwright test --reporter=junit
npx kiwi-tcms-pipe --plan 12 --build "$CI_COMMIT_TAG" --results junit.xml
```

Python/pytest — see [pytest-tests.md](./pytest-tests.md) for why the marker
must live in the docstring, not the test function name:

```bash
pytest   # conftest.py writes kiwi-results.json (Option A in pytest-tests.md)
npx kiwi-tcms-pipe --plan 12 --build "$CI_COMMIT_TAG" --results kiwi-results.json --format json
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
