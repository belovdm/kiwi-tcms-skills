---
name: kiwi-run-tests-with-reporter
description: >
  Runs automated tests so results land in a Kiwi TCMS TestRun, then verifies
  the sync with kiwi_run_status. Use when the user asks to run a suite into
  Kiwi, execute tests with the reporter or pipe, or confirm that a run received
  the framework results. Hands off failures to kiwi-run-triage.
---

# Run Tests Into a Kiwi TCMS Run

Execute the suite so every result lands in Kiwi: run, executions, statuses,
errors. Do not re-wire reporting here — that is `kiwi-setup-e2e-reporting`.

Native config:
[reporters-config.md](../kiwi-setup-e2e-reporting/references/reporters-config.md).
Pipe flags:
[pipe-cli.md](../kiwi-setup-e2e-reporting/references/pipe-cli.md).
Do not invent flags — `kiwi-tcms-pipe --help`.

## Preconditions

- `kiwi_ping` → `ok`. Env: `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT`.
- Tests are tagged (`C<id>` / `KIWI:<id>`). Spot-check a few.
- Reporting is already wired.

## Workflow

1. Pick the run.
   - Active run → `kiwi_list_runs(only_active: true)`.
   - None → `plan` + `build`; the reporter/pipe finds or creates the run.
2. Run the suite with the wired reporter or pipe. Same env vars.
   Sync errors stay in the log. Test statuses come from the framework.
3. Verify.
   - `kiwi_run_status(run_id)` counts must match the framework summary.
   - `kiwi_list_executions(run, status: "FAILED")` — failures have error comments.
   - Unmatched tests appear in the reporter/pipe log. `--dry-run` first; then
     tag or `--create-missing`.
4. Triage with `kiwi-run-triage`.

## Rules

- **A run without `kiwi_run_status` is unfinished.** Kiwi counts must match
  the framework.
- Do not create missing cases until unmatched tests are reviewed.
- `build` is a tag / version / commit — not `dev` on a release.
- Re-running the same `build` **updates that run**. It does not create a second
  run.

## Related

`kiwi-setup-e2e-reporting` (install/wire), `kiwi-run-triage` (classify failures).
