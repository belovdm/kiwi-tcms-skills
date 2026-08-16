---
name: kiwi-sync-test-cases
description: >
  Uploads draft Markdown cases from .kiwi-cache/cases into Kiwi TCMS, or
  exports a Kiwi plan into that cache for review. Use when the user wants
  to push session drafts, pull a plan into Markdown, or update Kiwi from
  edited cache files. Not a committed repo mirror.
---

# Draft cases ↔ Kiwi TCMS

Kiwi is the source of truth for test cases. Local Markdown is a **session
draft** under `.kiwi-cache/cases/` (gitignored). Requirements stay in
`docs/requirements/`.

Format: [kiwi-case-format.md](./references/kiwi-case-format.md).
Paths: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
MCP: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).

## Prerequisites

- `KIWI_PROJECT` is set.
- Drafts live in `.kiwi-cache/cases/**/*.md` unless the user names another folder.

## Cache → Kiwi

1. Find `*.md` with a `# TC` heading (or every `*.md` in the named folder).
2. For each file:
   - Has `TC-<id>` → `kiwi_get_case(id)`. Diff summary, priority, status, and
     `text` against the draft body (compare the whole block — Kiwi doesn't
     split it). On drift → `kiwi_update_case` with changed fields;
     a `text` change always sends the full draft body, not a fragment.
     `**Requirement:**` changed → `kiwi_update_case(requirement)`. `**Script:**` changed → `kiwi_update_case(script)`.
   - No id → `kiwi_search_cases(query: <exact summary>)`.
     - One hit → link: write `TC-<id>` into the heading.
     - None → `kiwi_create_case(summary, plan, category, priority, text, tags, requirement, script)`, then write the id back.
     - Several → show the options. Do not guess.
3. Report: created / updated / linked / unchanged / errors.

## Kiwi → cache

1. `kiwi_list_plans` → pick the plan.
2. `kiwi_search_cases(plan, limit)`. If `total > shown`, narrow the filter or raise `limit` (see [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md)).
3. Write `<slug>.md` under `.kiwi-cache/cases/` in the canonical format with `TC-<id>` in the heading.
4. `case_text_version` and `notes` go in an HTML comment.
5. After review, upload or discard. Do not commit the export.

## Match and conflicts

Identity: `TC-<id>` → exact `summary` → `summary__icontains` only when a single candidate remains. Details: [kiwi-case-format.md](./references/kiwi-case-format.md#identity).

Both sides changed: **Kiwi wins** unless the user says prefer the draft.

**Never delete Kiwi cases.** A case missing from the cache appears in the report only.
`[exp]` / exploratory cases (from `kiwi-explore-fundamentals`) stay Kiwi-only
unless the user asks to export them.

**Confirm the mutation summary** before create/update (unless the user said to sync without asking).
