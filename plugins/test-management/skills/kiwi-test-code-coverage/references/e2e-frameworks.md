# E2E framework markers

How to find automated tests and attach Kiwi case ids. Prefer the project's existing convention.

| Framework | Test files | Case marker |
| --- | --- | --- |
| Playwright | `*.spec.ts`, `playwright.config.*` | title `[C412]` or `{ tag: ["@C412"] }` |
| Jest | `*.test.ts`, `jest.config.*` | title `[C412]` |
| Mocha | `test/**`, `.mocharc*` | title `[C412]` |
| Cypress | `cypress/e2e/**` | title `[C412]` |
| Vitest | `*.spec.ts`, `vitest.config.*` | title `[C412]` |
| pytest | `test_*.py`, `pytest.ini` | title / node id `C412` → JUnit pipe |
| JUnit / TestNG | `*Test.java` | test name `C412` → JUnit pipe |

Non-JS/TS stacks report through `kiwi-tcms-pipe` and JUnit XML — see [pipe-cli.md](../../kiwi-setup-e2e-reporting/references/pipe-cli.md).
