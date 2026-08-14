---
name: kiwi-automate-manual-cases
description: >
  Turns CONFIRMED non-automated Kiwi TCMS cases into Playwright, Jest, or Mocha
  tests tagged C<id> / TC-<id> / KIWI:<id> / [C<id>], then sets
  kiwi_update_case(automated: true). Triggers: automate cases, generate e2e
  from Kiwi, convert manual cases, mark is_automated, write Playwright/Jest/Mocha
  from a plan.
---

# Automate Kiwi manual cases

Take CONFIRMED manual cases and emit runnable autotests without breaking the case ↔ test link.

Manual case shape: [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md).
Where files go: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).

## Select

- `kiwi_ping` → `ok`. Plan or filter is known.
- `kiwi_search_cases(plan, status: "CONFIRMED", automated: false)`.
- Prefer P1/P2, stable setup, an observable oracle.
- Skip one-off checks, visual-only judgment, cases with no oracle.
- Thin or empty steps → `kiwi-improve-test-cases` first.
- Unknown stack → `kiwi-scan-automation-project`.

## Write

- `kiwi_get_case(id)` → `text` (one Markdown block with `## Подготовка` /
  `## Шаги` / `## Ожидаемый результат`, or the project's existing headings).
  Read the sections directly — the tool no longer splits them out.
- Подготовка/Setup → `beforeEach`, fixtures, or `kiwi-data-seeder`.
- Шаги/Steps → actions. Ожидаемый результат/Expected → asserts.
- **One case → one test** (or one `describe` with data variants). Do not glue independent checks.
- Follow the project's framework. Playwright / Jest / Mocha first.
  - Playwright: [PLAYWRIGHT_BEST_PRACTICES.md](./references/PLAYWRIGHT_BEST_PRACTICES.md)
  - POM: [POM_BEST_PRACTICES.md](./references/POM_BEST_PRACTICES.md)
  - Data: [TEST_DATA_MANAGEMENT.md](./references/TEST_DATA_MANAGEMENT.md)
  - CodeceptJS only if the scan found it: [CODECEPTJS_BEST_PRACTICES.md](./references/CODECEPTJS_BEST_PRACTICES.md)
- **Every test title or Playwright `tag` carries the case id:** `C412`, `TC-412`, `KIWI:412`, `[C412]`. That is what `@kiwi-tcms-ai/kiwi-tcms-reporter` matches — see [reporters-config.md](../kiwi-e2e-tests-reporting/references/reporters-config.md).
- Explicit waits. Idempotent data. Selectors: `data-testid` / role, then text. Not a DOM path.
- Do not change the case meaning. Gaps → `kiwi_case_add_comment`, not a silent rewrite.

## Verify

- Run only the new test, not the suite.
- Repair locators → timing → assertions → flow. **Max 3 attempts.** Then `kiwi-debug-failed-flaky-autotests`.
- Stable = 1–2 green runs, no `sleep`.

## Close the loop

- `kiwi_update_case(id, automated: true)`.
- Optional tag `level:e2e` / `level:integration` (`kiwi-split-testing-levels-pyramid`).
- Optional `kiwi_case_add_comment(id, "Automated: <path>")`.
- Confirm the reporter/pipe will see the new test (`kiwi-e2e-tests-reporting`).
- Summary: [FINAL_SUMMARY_TEMPLATE.md](./references/FINAL_SUMMARY_TEMPLATE.md).
