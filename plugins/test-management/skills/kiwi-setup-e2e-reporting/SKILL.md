---
name: kiwi-setup-e2e-reporting
description: >
  Installs and wires automated test reporting into Kiwi TCMS via
  @kiwi-tcms-ai/kiwi-tcms-reporter. Native adapters for Playwright, Jest, and
  Mocha; every other stack — including Python/pytest — uses kiwi-tcms-pipe
  (JUnit or JSON). Use when the user wants run results in Kiwi, wants to
  install the reporter or pipe, or wants to tag tests with C412, TC-412,
  KIWI:412, or [C412].
---

# Set Up Automated Test Reporting

Install `@kiwi-tcms-ai/kiwi-tcms-reporter` so each test becomes a TestExecution
in a Kiwi run (status, dates, error text). Package notes:
[kiwi-tcms-reporter npm](https://www.npmjs.com/package/@kiwi-tcms-ai/kiwi-tcms-reporter)
или репозиторий на GitHub.

## Choose the path

- **JS/TS native adapters are Playwright, Jest, and Mocha only.** Config:
  [reporters-config.md](./references/reporters-config.md).
- **Python (pytest) → `kiwi-tcms-pipe`, not `kiwitcms-pytest-plugin`.** The
  official Kiwi pytest plugin auto-creates a case per test with no
  curated-case matching and different env vars — see
  [pytest-tests.md](./references/pytest-tests.md) for why and for the
  marker/JSON workaround pytest needs.
- Any other stack, or CI that already emits JUnit/JSON → `kiwi-tcms-pipe`.
  Flags: [pipe-cli.md](./references/pipe-cli.md). Do not invent flags —
  `kiwi-tcms-pipe --help`.

## Workflow

1. Detect the runner from `package.json` and config (`playwright.config.*`,
   `jest.config.*`, `.mocharc.*`), or from `pytest.ini` / `conftest.py` /
   `pyproject.toml` (`[tool.pytest.ini_options]`) for Python, or from a
   JUnit/JSON artifact already in CI.
2. Install from a `file:` path (not on npm yet). `kiwi-tcms-pipe` is a Node
   CLI, so a Python (or any non-JS) repo still needs Node available in CI to
   run it — install into the repo's existing `package.json`, or a minimal one
   created just for this:

   ```bash
   npm install --save-dev @kiwi-tcms-ai/kiwi-tcms-reporter@file:../path/to/kiwi-tcms-reporter
   ```

3. Set env: `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT` (plan mode). Optional:
   `KIWI_TIMEOUT`, `KIWI_INSECURE`. Do not paste the password into chat.
4. Wire the native adapter or the pipe. Prefer `plan` + `build`. Use `run`
   when the TestRun already exists.
5. Tag tests with `C412`, `TC-412`, `KIWI:412`, or `[C412]` (title, Playwright
   `tag`, or JUnit classname). **pytest: put the marker in the docstring, not
   the function name** — see [pytest-tests.md](./references/pytest-tests.md)
   for why plain `test_foo_C412()` never matches.
6. **`--dry-run` before the first CI write.** Review unmatched tests. Turn on
   `createMissing` / `--create-missing` only after that.

## Rules

- Sync errors are logged. They **must not fail the test process**.
- Do not update executions in a closed run (`stop_date` set) unless the user asks.
- Print the sync summary (run, matched/updated, link) in the pipeline report.

## Related

`kiwi-run-tests-with-reporter` (run and verify), `kiwi-run-triage` (classify
failures), `kiwi-setup-ci-automation` (CI wiring).
