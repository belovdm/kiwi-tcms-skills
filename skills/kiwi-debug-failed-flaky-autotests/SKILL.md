---
name: kiwi-debug-failed-flaky-autotests
description: >
  Diagnoses failing or flaky autotests from a Kiwi TCMS run, classifies
  test vs product vs environment, and fixes only the test side. Triggers:
  test failed, flaky, pass locally fail in CI, green the run, debug
  Playwright/Jest/Mocha.
---

# Debug failed and flaky autotests

Return a test to green only after the cause is classified. **Do not paper over a product defect.**

Fixes and snippets: [DEBUGGING_QUICK_REFERENCE.md](./references/DEBUGGING_QUICK_REFERENCE.md).

## Facts

- `kiwi_ping` → `ok`. Run or failing test is known.
- `kiwi_run_status(run_id)` and `kiwi_list_executions(run, status: "FAILED")`.
- Error text: `kiwi_rpc { method: "TestExecution.get_comments", params: [execution_id] }`.
- Expected behavior: `kiwi_get_case(case_id)`.
- History: `TestExecution.filter` on the case across recent runs (`kiwi_rpc`).
- Traces, screenshots, DOM — from the framework, not from Kiwi.

## Classify

Same classes as `kiwi-run-triage`:

| Class | Signal | Action |
| --- | --- | --- |
| Flake | Intermittent, same spot, retry often passes | Remove the race |
| Test defect | Deterministic: stale locator, wait, or data | Fix the test |
| Product defect | Actual behavior contradicts the case | Do not change the test |
| Environment | Network, missing service, infra timeout | Infra / retry; do not "fix" asserts |

## Fix

- Flake → explicit waits, isolated data (`kiwi-data-seeder`), idempotent setup. Not a longer sleep. Retry is temporary and called out.
- Test defect → locator / wait / data to match current UI. Priority: locators → timing → assertions → flow.
- Product defect → keep FAILED, file a bug, `TestExecution.add_link`. Leave the assert.
- Environment → BLOCKED + comment. Do not weaken the test.
- **Never skip or disable a test to green the run.**
- If the test would now check something else → `kiwi-improve-test-cases` / `kiwi_update_case`, not a silent swap.
- Repeated flake in one spot can be a product race. Report it.

## Confirm

- Re-run the single test 5–10 times (or across several runs). **A flake is gone only after a green streak.**
- Max 3 distinct fix attempts, then stop and report.
- Update the Kiwi execution: comment with cause + fix; product bugs get a link.
