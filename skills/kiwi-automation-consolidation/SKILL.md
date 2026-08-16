---
name: kiwi-automation-consolidation
description: >
  Finds duplicate automated tests, merges similar specs, and parametrizes
  shared logic while keeping Kiwi C<id> / TC-<id> / KIWI:<id> links.
  Triggers: consolidate autotests, merge specs, parametrize suite, remove
  duplicate tests, dead tests. Not for Kiwi manual cases
  (kiwi-detect-duplicate-test-cases).
---

# Automation test consolidation

Shrink the automated suite without dropping a scenario or a Kiwi case link.

Behavioral similarity beats code similarity. **No edits without explicit approval.**

Manual / Kiwi case duplicates belong to `kiwi-detect-duplicate-test-cases`.

## Scope

Include: `*.test.*`, `*.spec.*`, `*_test.*`, `*.cy.*`, automated `*.feature`.

Skip: fixtures and page objects unless they *are* the duplication; generated snapshots; requirement docs; cache drafts.

## Finding types

| Type | Signal | Typical fix |
| --- | --- | --- |
| Clone | Same title + same asserts after normalizing data | Delete the copy |
| Same scenario, different data | Same steps, different email / role / locale | Parametrize |
| Same asserts, different setup | Shared `expect`, unique `before` | Extract helper; keep both if setups differ in kind |
| Subset | Test A is a prefix of test B | Keep the broader test if A adds no unique assert |
| Overlapping rule | Same business rule via different UI paths | One path per rule unless both paths are independently risky |

## Confidence

Score after normalizing case, punctuation, and parameterized values.

| Score | Meaning | Apply? |
| --- | --- | --- |
| 90–100 | Identical intent and asserts | Recommend apply |
| 80–89 | Same intent, different wording / selectors | Recommend apply |
| 60–79 | Related | Show only |
| <60 | Drop from the report | |

Do not invent a score you cannot justify. If unsure, cap at 79.

## Loop

1. Scan the automated suite. Group by type and confidence.
2. For each candidate, list covered cases (`C<id>` / `TC-<id>` / `KIWI:<id>` / `[C<id>]`). **After a merge every case still needs a test.**
3. Show the report. Wait for approval.
4. Apply only approved items. Data helpers go through `kiwi-data-seeder`.
5. Re-scan. Repeat until nothing ≥ 80 remains, or the user stops.
6. Full suite green is the only successful consolidation.

## Report

```md
## Consolidation report

Scanned: N files / M tests

| Group | Files | Type | Confidence | Cases | Recommendation |
| --- | --- | --- | --- | --- | --- |
| pay-method | a.spec.ts:12, b.spec.ts:40 | parametrize | 92 | C412, C413 | one `it.each` |
```

Per group: shared intent in one sentence, what is unique, what would be lost.

## Do not

- Merge tests that protect different invariants.
- Weaken asserts to make two tests "the same".
- Merge unit and e2e into one test.
- Touch requirement docs, cache drafts, or disable Kiwi cases.
- Drop a `C<id>` / `TC-<id>` / `KIWI:<id>` tag on merge — the reporter will lose the match ([reporters-config.md](../kiwi-setup-e2e-reporting/references/reporters-config.md)).
- Leave a case with no test. Restore it via `kiwi-automate-manual-cases`.
