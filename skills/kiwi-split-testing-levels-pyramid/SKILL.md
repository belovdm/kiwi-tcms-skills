---
name: kiwi-split-testing-levels-pyramid
description: >
  Applies the testing pyramid to a feature — assigns each scenario to the
  cheapest sufficient level (unit, integration, e2e, manual), tags Kiwi
  cases with level:*, and sets is_automated. Use for "unit, integration, or
  e2e?", "what level should this test be at?", "how should we test this
  feature?", or to apply the pyramid after kiwi-qa-thinking.
---

# Testing Pyramid for Kiwi Cases

Put each scenario on the cheapest level that still catches its failure.
Expensive e2e/manual only cover what lower levels cannot.

## Prerequisites

- A scenario list (from `kiwi-qa-thinking` or Kiwi cases).
- Stack known, or run `kiwi-scan-automation-project`.

## Levels

| Level | Lands here when | Share (guide) |
| --- | --- | --- |
| unit | Pure logic: calc, validation, formatters | ~60–70% |
| integration | Bindings: API↔DB, queues, mocked externals | ~15–25% |
| e2e | Critical end-to-end with real UI/API | ~5–10% |
| manual | UX/visual, no automatable oracle | spot |

- Scenario goes to the **lowest level with a reliable oracle**.
- Boundaries → unit. Integration errors and retries → integration. "User sees the outcome" → e2e.
- Duplicated on two levels → keep the lower one.
- Take the project's real levels/kinds when a scan found them; otherwise use this table.

Tags: `level:unit`, `level:integration`, `level:e2e`, `level:manual`.

## Workflow

1. Inventory. Local list or `kiwi_search_cases(plan)`.
2. Assign each scenario: level + one-line reason.
3. Quotas. If e2e > 15%, push something down.
4. After confirmation, mark in Kiwi:
   - `kiwi_case_add_tag(case_id, "level:<level>")`
   - automatable → `kiwi_update_case(id, automated: true)` (`is_automated`)
   - manual → leave `is_automated: false` + `kiwi_case_add_comment` why
5. Output: level table, change list, "these N e2e should drop to integration".

## Rules

- Change metadata only (tags, `is_automated`, comments). Do not rewrite steps.
- No automation at a level → the quota is theoretical; next step is `kiwi-scan-automation-project`.
