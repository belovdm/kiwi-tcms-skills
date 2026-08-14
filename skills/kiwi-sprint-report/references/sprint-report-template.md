# QA Sprint Report — Template

Fill from live Kiwi TCMS data. Omit a section when the data is missing. Never invent a number.

Every figure must name its source: plan id, run id, or `kiwi_search_cases` filter.

## General

* **Project / Product:** [KIWI_PROJECT / Product name]
* **Sprint / Plan:** [name] (plan #[id])
* **Runs:** #[id], #[id]
* **Period:** [YYYY-MM-DD – YYYY-MM-DD]
* **QA lead:** [name]

## 1. Scorecard

| Metric | Value | Source |
| :--- | :---: | :--- |
| Cases in plan | [N] | `kiwi_search_cases(plan)` `total` |
| Executed | [N] ([XX%]) | sum of non-IDLE from `kiwi_run_status` |
| Not executed | [N] | IDLE / unrun cases in the plan |
| Pass-rate | [XX%] | PASSED ÷ executed; show per-run trend |
| Defects | [N] (open [N], blocking [N]) | execution links / `Bug.filter` |
| Automation | [XX%] | `kiwi_search_cases(automated: true)` ÷ total |

> Pass-rate without untested cases is misleading. Always show both.

## 2. Execution by plan / run

| Plan / area | Run | Total | Passed | Failed | Blocked | Idle | Exec % | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| [Plan name — #id] | [Run title — #id] | [N] | [N] | [N] | [N] | [N] | [XX%] | ✅ / 🟡 / 🔴 |
| **TOTAL** | | **[N]** | **[N]** | **[N]** | **[N]** | **[N]** | **[XX%]** | **Pass-rate [XX%]** |

Status key:

* ✅ Completed — executed, no open blockers.
* 🟡 In progress — execution mid-flight, or pass-rate ≥ 51% with leftover IDLE.
* 🔴 Blocked — pass-rate < 50% or an open blocking defect.

Several runs of the same plan → show the trend (run 1 → run 2), not only the last point.

## 3. What failed and why

Group by triage class (`kiwi-run-triage`): product / test / environment / flaky.

| Class | Count | Cases / executions | Action |
| :--- | :---: | :--- | :--- |
| Product defect | [N] | TC-… (exec #…) | bug link, keep FAILED |
| Test defect | [N] | TC-… | BLOCKED, tag `test-issue` |
| Environment | [N] | TC-… | BLOCKED, re-run after the stand is up |
| Flaky | [N] | TC-… | comment, watch history |

## 4. Blocking issues

* [open critical/blocker] — [one line] — exec #[id] — [bug URL]
* *— none —*

## 5. Defects this sprint

| Bug | Summary | Priority | Execution / case |
| :--- | :--- | :---: | :--- |
| [JIRA-001] | [short title] | 🔴 Critical | exec #[id] / TC-[id] |
| *— none —* | | | |

Source: `kiwi_execution_get_links` on failed executions, or `kiwi_rpc` `Bug.filter`. Do not invent tickets.

## 6. Risks and untested

* Areas with no run this sprint (plan / component / tag).
* Cases left IDLE and why (no env, no data, blocked).
* Automation gaps on money / auth / data paths.

## 7. Release call

One of: **release** / **release with caveats** / **hold**.

Caveats name the open blocker and the untested area. Not a restatement of the scorecard.

**Sprint summary:** 1–5 sentences from the figures above.
