---
name: kiwi-setup-ci-automation
description: >
  Wires QA jobs into the project's CI so automated tests run on push, PR,
  schedule, or release and results reach Kiwi TCMS via kiwi-tcms-pipe. Use when
  the user asks what their CI does, wants a QA job on a repository event, or
  wants KIWI_URL, KIWI_USERNAME, KIWI_PASSWORD, and KIWI_PROJECT secrets set up for reporting.
---

# Set Up CI for Automated Tests + Kiwi

Make the suite run itself in CI, stably, with a visible result: each job is a
Kiwi run with statuses and errors.

Reporting setup: `kiwi-setup-e2e-reporting`. Send step:
[pipe-cli.md](../kiwi-setup-e2e-reporting/references/pipe-cli.md).
Do not invent flags — the flag table there is the source of truth
(`kiwi-tcms-pipe --help` prints nothing, do not rely on it).

## Preconditions

- Tests run locally and are green.
- `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT` will live in the CI secret store.
- Reporting is wired (`kiwi-setup-e2e-reporting`).

## Workflow

1. Read the existing CI. Identify the system and current test jobs.
   New work must fit in, not duplicate.
2. Triggers.
   - push / merge → regression.
   - PR → impact set (`kiwi-setup-change-aware-testing`).
   - schedule (nightly) → full suite + flake watch.
   - release tag → run on the release candidate.
3. Job shape. Install deps → (build the app) → run tests → publish
   artifacts (JUnit, screenshots, traces) → `kiwi-tcms-pipe` (skip the pipe
   step if the native reporter already wrote the run). `kiwi-tcms-pipe` is a
   Node CLI — a Python/pytest job needs a Node setup step too, even if the
   rest of the job is pure Python.
   **One reporter config = one plan.** If the repo has more than one Kiwi
   plan, do not point a single test invocation + single `KIWI_PLAN` /
   `--plan` at all spec files — that attaches every plan's cases to one run.
   Split by plan: either separate test-runner projects/directories per plan,
   or separate CI jobs/steps, each with its own `--plan` (or `KIWI_PLAN`) and
   its own matching spec set.
4. Stability. Shard the suite. Retry only marked flakes, with a cap.
   Job timeout. Cache deps. Isolate data (`kiwi-data-seeder`).
5. Kiwi. `build` = tag or commit. Check `kiwi_run_status`. Notify chat:
   run link + pass-rate.
6. Failures. Alert. Triage with `kiwi-run-triage`. Recurring flakes →
   `kiwi-debug-failed-flaky-autotests`.
7. Update `automation-inventory.yml` (`kiwi-scan-automation-project`): set
   `ci.provider` and `ci.test_jobs` to what you just wired, drop any `gaps`
   entry it closes (e.g. "no CI job yet"). Skip only if that file doesn't exist.
8. Deliver CI config on a branch. Do not push to the default branch.

## Rules

- Touch only CI config. Take test/pipe commands from the owning skill.
- **`KIWI_PASSWORD` lives only in the CI secret store.** Never in files or logs.
- Do not drop results silently. On the pipe job use `--strict` so unmatched tests or failed ops fail the step.
- Retries are not a flake fix — a temporary cap with tracking.
- Nightly full run is the stability source of truth (`kiwi-sprint-report`).

## Related

`kiwi-setup-e2e-reporting` (reporter/pipe), `kiwi-setup-change-aware-testing`
(PR impact), `kiwi-run-triage` (failed jobs).
