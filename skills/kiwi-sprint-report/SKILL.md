---
name: kiwi-sprint-report
description: >
  Sprint QA report from live Kiwi TCMS data — plans, runs, pass-rate, defects,
  coverage, risks, and a release call. Use at sprint or iteration close, or for
  a mid-sprint status. Not for triaging a single run (kiwi-run-triage).
---

# Sprint QA Report

Build the report from Kiwi facts. Do not merge tables by hand.

Template: [sprint-report-template.md](references/sprint-report-template.md).
MCP health: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).

## Resolve the sprint

Priority:

1. Plan name or id — `kiwi_list_plans(query: <sprint/release>)`.
2. Product name (`KIWI_PROJECT`) — all plans of that product.
3. Run name or id — `kiwi_list_runs(query: …)` / `kiwi_list_runs(plan: …)`.
4. Date range the user gave.
5. Nothing given — ask for the product, plan, run, or dates.

Do not call `kiwi_search_cases` with only `product` or only `automated`
(client injects `product` into TestCase.filter and this Kiwi rejects it).
Search per `plan`.

A title like "Sprint 24" is not an id. Resolve to plan/run ids first.

## Collect

1. `kiwi_list_plans` → plans in scope. Per plan: `kiwi_list_runs(plan)`.
2. Per run: `kiwi_run_status(run_id)` — pass / fail / blocked / idle, failed cases.
3. Defects: `kiwi_execution_get_links` on failed executions, or `kiwi_rpc` `Bug.filter`.
4. Volume and automation: `kiwi_search_cases(plan: …)` and `kiwi_search_cases(automated: true)`.
5. Optional cause split: reuse `kiwi-run-triage` classes (product / test / environment).

## Metrics

- Cases in plan / executed / not executed.
- Pass-rate per run, and the trend when there are several runs.
- Failed executions grouped by cause.
- Automation share (`automated` on `kiwi_search_cases`).

## Highlight

- Open blocking defects.
- Areas with a low pass-rate or no runs (risk).
- IDLE cases and why (no env, no data, blocked).

## Write

Follow [sprint-report-template.md](references/sprint-report-template.md). Hide empty sections. Save only if the user asked, as `QA_Sprint_Progress_Report_{Sprint}_{YYYY-MM-DD}.md`.

## Rules

- **Facts from Kiwi only.** Every figure names a plan/run id.
- Pass-rate without untested cases is misleading — always show IDLE / not run.
- Trend beats a single point.
- The close is a **release call**: release / release with caveats / hold.
