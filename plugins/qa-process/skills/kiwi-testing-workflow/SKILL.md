---
name: kiwi-testing-workflow
description: >
  Orchestrate the full test-case lifecycle — scan → design → refine → dedupe →
  coverage → sync → report → triage — and persist state in .kiwi-workflow.yml.
  Use when the user wants the full cycle for a feature or plan. Do not use for a
  single specialist verb, or for QA maturity / where to start
  (kiwi-qa-lead-strategy-advisor).
---

# Testing Workflow

Run a feature or plan through the pipeline. Call specialist skills. Do not redo their work.

State file and artifact paths: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
MCP health: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).

## Pipeline

```
scan → design → refine → dedupe → coverage → sync → report → triage
```

| Step | Skill | Result |
| --- | --- | --- |
| scan | `kiwi-scan-automation-project` | inventory (`automation-inventory.yml`) |
| design | `kiwi-qa-thinking` → `kiwi-write-test-cases` | plan + cases in Kiwi |
| refine | `kiwi-improve-test-cases` | weaker cases cleaned up |
| dedupe | `kiwi-detect-duplicate-test-cases` | duplicates disabled before sync |
| coverage | `kiwi-test-code-coverage` | `coverage.tests.yml` code ↔ tests ↔ cases |
| sync | `kiwi-sync-test-cases` | local markdown ↔ Kiwi |
| report | `kiwi-run-tests-with-reporter` / `kiwi-setup-e2e-reporting` | results in a run |
| triage | `kiwi-run-triage` | failures classified |

Skip scan when the inventory is fresh. Skip any step whose input is missing (`skipped: coverage — no source access`).

`design` can stop early: `kiwi-write-test-cases`'s readiness gate blocks on ❌ Not ready until resolved or explicitly overridden — record that as the current step's state, don't route around it.

## Also routes to (outside the pipeline)

Requests that name one concrete task go straight to that skill, not through the pipeline state machine:

| Request | Skill |
| --- | --- |
| Analyze a PR/branch diff, "what changed" | `kiwi-pr-diff-analyzer` |
| Check PR scope vs its ticket/description | `kiwi-pr-requirements-analyzer` |
| Review a spec/ticket for testability before coding | `kiwi-requirement-reviewer` |
| "Unit, integration or e2e?", assign scenarios to levels | `kiwi-split-testing-levels-pyramid` |
| Turn CONFIRMED manual cases into automated tests | `kiwi-automate-manual-cases` |
| Merge/dedupe/parametrize existing autotests | `kiwi-automation-consolidation` |
| Test failed, flaky, passes locally but fails in CI | `kiwi-debug-failed-flaky-autotests` |
| Seed test data / fixtures for a feature | `kiwi-data-seeder` |
| Wire QA jobs into CI (push / PR / schedule) | `kiwi-setup-ci-automation` |
| Run only tests impacted by a diff, in CI | `kiwi-setup-change-aware-testing` |
| Set up / plan / run an exploratory testing session | `kiwi-explore-setup` → `kiwi-explore-plan` → `kiwi-explore-fundamentals` |
| Import existing Allure results into Kiwi | `kiwi-allure-adapter` |
| Sprint / iteration QA status report | `kiwi-sprint-report` |

## State

`.kiwi-workflow.yml` (create on first run):

```yaml
goal: promo-codes
current_step: design
done: []
skipped: {}
artifacts: {}
```

- `artifacts` holds plan/run ids and file paths.
- A stopped cycle resumes from `current_step`, including in a new session.

## Workflow

1. Set the goal and the start step. Not always from scan — "triage this run" starts at triage. Write `goal`, `current_step`, `done`, `artifacts`.
2. Run each step through its specialist skill. Update `done` and `artifacts` after each.
3. **Ask before mutations** (create / update / sync) and show a short summary.
4. Mark skips with a reason.
5. Finish with a report: what ran, artifacts (plan/run ids, links), what remains.

## Rules

- State lives in **`.kiwi-workflow.yml`**. That is how an interrupted cycle continues.
- Do not call a skill when its input is absent.
- Each step ends with a checkable result (id, file, report).
- This skill **routes**. It does not replace specialists.
- A single concrete verb → that skill directly.
- Strategy / maturity / "where do we start" → `kiwi-qa-lead-strategy-advisor`.
