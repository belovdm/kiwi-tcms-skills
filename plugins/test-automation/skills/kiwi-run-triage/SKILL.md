---
name: kiwi-run-triage
description: >
  Triages a Kiwi TCMS TestRun: classifies FAILED and BLOCKED executions as
  product bug, test bug, environment, or flaky; updates statuses; adds comments
  and bug links. Use after a run when the user asks to review failures,
  classify causes, or produce a team summary.
---

# Triage a Kiwi TCMS TestRun

Turn a raw run into a reviewed one: every FAILED has a cause, every BLOCKED
has a note, then a team summary.

## Preconditions

- `kiwi_ping` → `ok`. Known `run_id` (or `kiwi_list_runs(only_active: true)`).
- CI logs / artifacts help fill comments.

## Workflow

1. Summary. `kiwi_run_status(run_id)` — PASSED / FAILED / BLOCKED / IDLE,
   list of failed cases.
2. Problem list. `kiwi_list_executions(run: run_id, status: "FAILED")`,
   then `status: "BLOCKED"`.
3. Each failed execution:
   - `kiwi_rpc { method: "TestExecution.get_comments", params: [execution_id] }`
     — error text from the reporter/pipe. (No dedicated tool for this yet.)
   - `kiwi_execution_get_links(execution_id)` — existing bug?
   - `kiwi_get_case(case_id)` — steps vs actual, to split product vs test.
   - Classify:

     | Class | Signs | Action |
     | --- | --- | --- |
     | Product bug | Actual result contradicts the spec | FAILED, conclusion comment, bug link |
     | Test bug | Stale locator/assertion, rotten data | BLOCKED, comment “fix the test”, tag `test-issue` |
     | Environment | Network errors, downed services | BLOCKED, comment with the signal, offer a rerun |
     | Flaky | Same test is stable in other runs | Comment “rerun”, check case history |

4. Write the decision.
   - `kiwi_update_execution(execution_id, status, comment: "<conclusion>")`.
   - Ticket → `kiwi_execution_add_link(execution_id, name: "JIRA-148", url, is_defect: true)`
     for product bugs (`is_defect: true` marks it as a defect link, not just a
     reference); omit `is_defect` for CI/report links.
5. Report. Totals (all / failed / reviewed); groups by class; top-3 risky
   areas; leftover work (rerun N, file bugs for M).

## Rules

- **Do not change PASSED** executions without a stated reason.
- Do not file duplicate bugs: `kiwi_execution_get_links` and `kiwi_case_history` first.
- Comment = class + 1–2 lines of evidence.
- Unknown cause → **BLOCKED “needs manual review”**. Do not guess FAILED.
- Bulk updates (same cause on 10+ executions) — confirm with the user first,
  then one list.

## Related

`kiwi-run-tests-with-reporter` (get results into the run),
`kiwi-debug-failed-flaky-autotests` (fix flakes / test bugs).
