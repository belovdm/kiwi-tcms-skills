---
name: kiwi-sync-test-cases
description: >
  Syncs Markdown test cases between the local project and Kiwi TCMS via
  kiwi-tcms-mcp. Use when the user wants to push local cases to Kiwi, pull
  Kiwi cases into Markdown, update cases from files, or find drift between
  the repo and TMS.
---

# Sync Test Cases with Kiwi TCMS

Two-way sync of local Markdown cases with Kiwi. Source of truth is stated before the run (default: local files).

Format: [kiwi-case-format.md](./references/kiwi-case-format.md).
Paths: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
MCP: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).

## Prerequisites

- `kiwi_ping` → `ok`.
- `KIWI_PROJECT` is set.
- Cases live in `docs/cases/**/*.md` unless the user names another folder.

## Files → Kiwi

1. Find `*.md` with a `# TC` heading (or every `*.md` in the named folder).
2. For each file:
   - Has `TC-<id>` → `kiwi_get_case(id)`. Diff summary, priority, status, and
     `text` against the local body (compare the whole block — Kiwi doesn't
     split it). On drift → `kiwi_update_case` with changed fields;
     a `text` change always sends the full local body, not a fragment.
     `**Requirement:**` changed → `kiwi_update_case(requirement)`. `**Script:**` changed → `kiwi_update_case(script)`.
   - No id → `kiwi_search_cases(query: <exact summary>)`.
     - One hit → link: write `TC-<id>` into the heading.
     - None → `kiwi_create_case(summary, plan, category, priority, text, tags, requirement, script)`, then write the id back.
     - Several → show the options. Do not guess.
3. Report: created / updated / linked / unchanged / errors.

## Kiwi → files

1. `kiwi_list_plans` → pick the plan.
2. `kiwi_search_cases(plan, limit)`. If `total > shown`, narrow the filter or raise `limit` (see [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md)).
3. Write `<slug>.md` in the canonical format with `TC-<id>` in the heading.
4. `case_text_version` and `notes` go in an HTML comment.

## Match and conflicts

Identity: `TC-<id>` → exact `summary` → `summary__icontains` only when a single candidate remains. Details: [kiwi-case-format.md](./references/kiwi-case-format.md#identity).

Both sides changed: default is to ask. User may say prefer-local or prefer-Kiwi.

**Never delete Kiwi cases.** A case missing locally appears in the report only.

**Confirm the mutation summary** before create/update (unless the user said to sync without asking).
