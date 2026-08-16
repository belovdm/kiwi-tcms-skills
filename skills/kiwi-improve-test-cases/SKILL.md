---
name: kiwi-improve-test-cases
description: >
  Use when cases are vague, bloated, or un-runnable, or before a sync/audit —
  "clean up these cases", "improve test cases", "score case quality".
  Analyzes and improves existing test cases in Kiwi TCMS (and session drafts
  in .kiwi-cache/cases) for clarity, single-idea expected results, and
  executability.
---

# Improve Test Cases

Raise existing cases to "any tester gets the same result" without rewriting intent.

Format: [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md).

## Prerequisites

- Source: Kiwi (plan, filter, ids). Include `.kiwi-cache/cases/` drafts if present this session.

## Score /10

One point each:

1. One result — expected result is a single verifiable idea.
2. Action verbs — steps start with an action; no "check" inside steps.
3. Concrete data — exact values, not "some product".
4. Complete setup — environment and data before step 1 are reproducible.
5. Observable result — a fact visible without opening the DB (or called out).
6. No implementation — not tied to selectors or code.
7. Current terms — field and status names match the product.
8. Reasonable size — 3–10 steps; longer → split.
9. Metadata — priority, category, tags are present and true.
10. Independence — does not require another case's result.

## Workflow

1. Select. Kiwi — `kiwi_search_cases` then `kiwi_get_case(id)`. Drafts — walk `.kiwi-cache/cases/` if it has files.
2. Score each case. Table: case / score / defects.
3. Rewrite score < 7:
   - split multi-checks into separate cases;
   - move "make sure that…" from steps into Expected;
   - replace "some/any" with concrete values;
   - fill setup; update stale names.
4. Apply.
   - Kiwi — `kiwi_update_case` with changed fields; a body edit sends the
     full `text` (summary/priority/etc. can go alone, `text` cannot be
     patched section-by-section). Disputed edits → `kiwi_case_add_comment(id, "Proposal: …")`.
   - Draft still in cache — edit the file in the canonical format, then upload.
5. Report. Average score before/after, top-3 systemic defects, changed `TC-<id>` list.

## Rules

- **Change form, not meaning.**
- **Score ≥ 8 — leave alone.**
- Same-shape mass edits — one confirmed pass.
