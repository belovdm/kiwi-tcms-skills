---
name: kiwi-setup-change-aware-testing
description: >
  Sets up change-aware PR testing: select only tests impacted by the diff from
  coverage.tests.yml, plus smoke, and send results to Kiwi TCMS. Use when the
  user wants faster PR feedback without a full regression, a CI job that runs
  the impact set, or coverage-map-driven test selection.
---

# Change-Aware Testing on a PR

Run only the tests the change actually touches — fast, relevant, results in
Kiwi. Full regression stays on merge / release.

Map format:
[coverage-file-format.md](../kiwi-test-code-coverage/references/coverage-file-format.md).
How to find tests:
[e2e-frameworks.md](../kiwi-test-code-coverage/references/e2e-frameworks.md).
Send results:
[pipe-cli.md](../kiwi-e2e-tests-reporting/references/pipe-cli.md).

## Preconditions

- `coverage.tests.yml` exists (`kiwi-test-code-coverage`). If not, build it first.
- `kiwi_ping` → `ok`. Reporting/pipe is wired (`kiwi-e2e-tests-reporting`).
- Access to the PR diff (`base...head`).

## Workflow

1. Keep the map fresh. `kiwi-test-code-coverage` → `coverage.tests.yml`
   (file → tests → Kiwi cases). Commit it.
2. Changed files. From the PR diff, list changed source files (not tests,
   not docs).
3. Impact set. Map files → tests. Always add:
   - tests changed in the PR itself;
   - a mandatory minimum (smoke / critical tags), even if untouched.
4. CI on PR. Compute the set. Run only that set (runner `--grep` / tags /
   file list). Send to Kiwi with `build` = PR commit.
5. Full suite separately. Merge to the main branch / release → full suite.
   Change-aware is PR feedback only.
6. Maintain the map when code or tests move (CI check or a reminder).

## Rules

- **Impact set + mandatory smoke.** Do not trust the map alone — it can go stale.
- Changes in shared modules (utils, config) → widen the set, up to a full
  regression.
- The coverage map is a repo artifact, not a local file.
- Show in the PR how many tests ran out of how many.

## Related

`kiwi-test-code-coverage` (build the map), `kiwi-setup-ci-automation` (wire the
job), `kiwi-e2e-tests-reporting` (send results).
