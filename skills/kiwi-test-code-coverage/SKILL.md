---
name: kiwi-test-code-coverage
description: >
  Maps source files → automated tests → Kiwi cases into coverage.tests.yml
  and selects an impact set from a git diff. Triggers: coverage map,
  which tests does this file have, traceability matrix, impact run,
  change-aware regression, coverage.tests.yml.
---

# Code → tests → cases

Build a committed map so a PR runs only what it touches, and so uncovered files are visible.

YAML grammar: [coverage-file-format.md](./references/coverage-file-format.md).
Where markers live: [e2e-frameworks.md](./references/e2e-frameworks.md).
Do not paste the schema here.

## Workflow

1. Inventory. Prefer `kiwi-scan-automation-project`. Walk test files; note which sources they import or call (static analysis).
2. Tests → cases. Match `C<id>` / `TC-<id>` / `KIWI:<id>` / `[C<id>]` via `kiwi_search_cases`. Unmatched tests go in the report.
3. Write `coverage.tests.yml` at the repo root ([project-layout.md](../kiwi-scan-automation-project/references/project-layout.md)). **`tests: []` is a hole — keep the key.**
4. Validate. **Never Python.** Never invent a parser (the script loads YAML
   through `js-yaml`). File argument works on Windows PowerShell (no stdin
   pipe required):

```bash
node <path-to-this-skill>/scripts/check-coverage.mjs coverage.tests.yml
```

Legacy (POSIX / JSON on stdin) still works:

```bash
npx js-yaml coverage.tests.yml | node <path-to-this-skill>/scripts/check-coverage.mjs
```

5. Impact. `git diff --name-only <base>...HEAD` → keys → test files / case markers. Run that set. Send results with `@kiwi-tcms-ai/kiwi-tcms-reporter` (`build` = commit). Flags live in [reporters-config.md](../kiwi-setup-e2e-reporting/references/reporters-config.md).
6. Gaps. Prioritize empty `tests: []` by domain. Propose cases (`kiwi-write-test-cases`) and autotests (`kiwi-automate-manual-cases`).

## Rules

- The map is a repo artifact. Refresh when the tree changes.
- Static imports are an estimate. Mark `estimate: true` when unsure.
- Shared utils → widen the impact set.
- Case coverage ≠ line coverage. Show both layers.
- Keys and ids come from this project. Do not copy paths from the docs.
