---
name: kiwi-allure-adapter
description: >
  Parses existing Allure results (allure-results/*.json) into kiwi-tcms-pipe
  JSON and writes them into a Kiwi TCMS TestRun. Use when automation already
  emits Allure and the user wants those statuses, errors, and attachments in
  Kiwi without rewriting the suite.
---

# Allure Results → Kiwi TCMS

Parse `allure-results` into the pipe JSON shape and send them with
`kiwi-tcms-pipe --format json`. **There is no Allure adapter package.**

Field mapping: [allure-mapping.md](./references/allure-mapping.md).
Pipe flags: [pipe-cli.md](../kiwi-setup-e2e-reporting/references/pipe-cli.md).
Do not invent flags — `kiwi-tcms-pipe --help`.

## Preconditions

- `allure-results/*-result.json` exist.
- `kiwi_ping` → `ok`. A `run` id, or `plan` + `build`.
- Cases are tagged in Allure (`tag: C<id>` / `KIWI:<id>`), `testCaseId`, or
  the name equals the case summary.

## Workflow

1. Parse each `*-result.json`.
2. Match to cases: explicit tag → exact title → partial. Unmatched go in the
   report (tag them, or `--create-missing` after a `--dry-run`).
3. Write JSON in the pipe shape (`title`, `status`, `durationMs`, `error`,
   `tags`).
4. Send: `kiwi-tcms-pipe --format json --run <id>` (or `--plan` + `--build`).
5. Attachments (optional). Screenshots/traces →
   `kiwi_execution_add_attachment(execution_id, filename, b64content)`.
6. Verify. `kiwi_run_status(run)` matches the Allure summary.

## Rules

- Allure `broken` and `failed` both become FAILED. Put the type in the comment.
- Collapse Allure steps into one summary comment.
- Prefer an explicit Allure label. Title match is fragile.
- Re-import of the same build updates executions. It does not duplicate them.

## Related

`kiwi-setup-e2e-reporting` (pipe setup), `kiwi-run-tests-with-reporter` (verify
a live run), `kiwi-run-triage` (classify failures).
