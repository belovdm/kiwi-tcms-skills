---
name: kiwi-qa-thinking
description: >
  Reviews a FEATURE as QA before cases exist: edge cases, negatives, abuse,
  states, races, and non-obvious paths, checked against coverage already in
  Kiwi TCMS. Use when asked what could go wrong, what is missing, or to
  brainstorm feature risks. Not for reviewing a requirements document
  (kiwi-requirement-reviewer), not for PR ticket vs description
  (kiwi-pr-requirements-analyzer), not for extracting AC from a code diff
  (kiwi-pr-diff-analyzer).
---

# QA Thinking

Run a feature through risk lenses. Works before cases exist and against cases already in Kiwi.

## Lenses

Walk each lens. Record scenarios.

1. Value boundaries — empty, 0, 1, max, max+1, negative, rounding, too long, special chars, unicode/emoji.
2. Negatives — wrong type, foreign permissions, missing entity, downed external service, expired token/session.
3. States and transitions — draft/active/archive, cancel mid-flow, resubmit, two users in parallel, timeout.
4. Races and idempotency — double-click, retry, two requests at once, "pay twice".
5. Abuse — swapped id/amount/currency, skipped validation, bulk operations.
6. Data and precision — currency and cents, time zone, locale, large numbers, overflow.
7. Non-obvious — delete then recreate, cache, run twice / in background / offline.

## Workflow

1. Split the feature into entities, actions, integrations, roles.
2. Run every lens. An empty lens is a result — mark "N/A" plus why.
3. Check coverage: `kiwi_search_cases(query: <feature keyword>)`. Existing hits are covered; the rest are gaps.
4. Rank: probability × criticality (money / data / security rank higher).
5. Table: scenario / lens / risk / covered in Kiwi? / proposal.

New gaps → [kiwi-write-test-cases](../kiwi-write-test-cases/SKILL.md).
Weak existing cases → `kiwi-improve-test-cases`.
Requirement defects → `kiwi-requirement-reviewer`.

## Rules

- Each line is a verifiable scenario.
- Do not clone cases already in Kiwi.
- Finding is not fixing.
