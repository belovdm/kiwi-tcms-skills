# Duplicate Detection Guide

Scoring and classification for `kiwi-detect-duplicate-test-cases`.
Identity is the numeric Kiwi id (`TC-<id>`). Search with `kiwi_search_cases`.

## Normalize

Lowercase → strip `TC-\d+`, "Test:", "Check", "Verify" → collapse whitespace → drop stop words.

## Detection levels

| Level | Type | Description | Example |
| --- | --- | --- | --- |
| 1 | Exact | Titles match after normalize | "Pay by card" in two plans |
| 2 | Semantic | Same intent, similar steps | "Shopper can sign in" vs "User authenticates" |
| 3 | Overlap / subset | One case is contained in another | Cart (3 steps) inside checkout (8 steps) |
| 4 | Redundant variation | Same logic, different data | Login as john@ vs jane@ |

## Scoring

Compare pairs: title → steps → expected → setup → tags.

| Score | Category |
| --- | --- |
| 100% | Exact duplicate |
| 80–99% | Semantic duplicate |
| 50–79% | Overlap |
| <50% | Different tests |

Step overlap ≥ 60% raises confidence on a near-title pair.

## Actions

| Action | When |
| --- | --- |
| Merge | Same intent — keep one canonical case |
| Deactivate | Redundant Kiwi case — `DISABLED` + comment pointing at `TC-<id>` |
| Keep | Different purpose (environment, data, `level:*`) |

**Never delete a Kiwi case.** Cache drafts may be removed after approval.
Cases with executions: comment the pointer to the keeper; do not silently `DISABLED`.

## Report template

```markdown
# Duplicate analysis

**Scanned:** {N} cases
**Duplicates:** {X} cases in {Y} groups

## Summary
- Exact: {N} groups | Semantic: {N} | Overlap: {N} | Variations: {N}

## Group {N}: {Type} — {title}

**Cases:**
- `TC-<id>` / `{file}` — "{title}" ({status}, executions: {n})
- `TC-<id>` / `{file}` — "{title}" ({status}, executions: {n})

**Similarity:** {X}%
**Keep:** TC-<id>
**Recommendation:** keep / merge / deactivate
```
