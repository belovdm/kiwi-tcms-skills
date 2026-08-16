---
name: kiwi-detect-duplicate-test-cases
description: >
  Finds duplicate, near-duplicate, and overlapping test cases in Kiwi TCMS
  (and session drafts in .kiwi-cache/cases). Use before kiwi-sync-test-cases
  and when auditing the suite — "find duplicate cases", "these tests overlap",
  "dedupe the plan".
---

# Detect Duplicate Test Cases

Find pairs that test the same thing. Propose merge or deactivate. Never delete a Kiwi case.

Scoring, levels, and the report template: [duplicate-instructions.md](./references/duplicate-instructions.md).
Format: [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md).

## Prerequisites

- Scope: a Kiwi plan/filter. Include `.kiwi-cache/cases/` drafts if present.

## Workflow

### 1. Gather

- Kiwi: `kiwi_search_cases(plan/…)`. Fetch suspects with `kiwi_get_case`.
- Drafts: every `.kiwi-cache/cases/*.md` with a `# TC` heading, if the folder exists.
- One list: `{ref, title_norm, steps_norm, expected_norm}`. `ref` is `TC-<id>` or the draft path.

### 2. Compare

Normalize and score per [duplicate-instructions.md](./references/duplicate-instructions.md).
Exact pairs go straight to the report. Near pairs: compare steps/expected (step overlap ≥ 60% raises confidence).
Cluster (A≈B, B≈C → {A,B,C}).

### 3. Propose

For each group, pick the keeper (fuller steps, newer status, has executions).
Check history with `kiwi_get_case(id, include_executions: true)`.

Losers:

- Draft — delete the cache file.
- Kiwi — **never delete**. `kiwi_update_case(id, status: "DISABLED")` + `kiwi_case_add_comment(id, "Duplicate of TC-<id>, merged …")`.

Different priorities in a pair may be different `level:*` tags — do not merge those blindly.

### 4. Report

Use the template in [duplicate-instructions.md](./references/duplicate-instructions.md).

**Only apply after the user approves.** Exact duplicates with no execution history may share one confirmation per group; everything else is one-by-one.
