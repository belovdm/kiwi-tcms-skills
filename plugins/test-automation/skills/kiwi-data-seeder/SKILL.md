---
name: kiwi-data-seeder
description: >
  Builds a balanced test dataset from the feature's real constraints
  (normal, edge, invalid, special), seeds it idempotently, and links
  records to Kiwi cases. Triggers: seed test data, fixtures for a feature,
  populate staging, generate dataset, prepare data for cases.
---

# Seed test data

Give tests data that exercises real behavior: typical values, boundaries, and garbage — not only "a valid user".

## Constraints

- **Never seed production.** Confirm test / dev / staging first.
- Constraints come from models, validators, and schema — not guesses.
- Invalid values must actually break a found rule.
- **Balance the dataset: at least 70% normal, at most 30% edge/invalid/special.**
- **Do not seed until the user approves the categories and the exact item count** (Step 3 gate).
- Credentials from env vars. Synthetic data only. No real PII.
- Prefer the project's factories, seed scripts, fixtures, or API.
- Save the dataset plan to `.kiwi-cache/seed-data/{feature}.md` before seeding, so the run is reviewable and repeatable.
- **Idempotent:** a second run does not create duplicates.
- Isolated: do not break other tests' rows.

## Workflow

1. Read the implementation: types, lengths, ranges, formats, uniqueness, required fields, FKs.
2. **Ask what the code can't tell you** — platform (web/mobile/API-only), base URL,
   environment kind (confirm not production), access channel (existing seed
   mechanism, REST API, DB/console), which env vars hold auth, which
   account/tenant to seed into.
3. Build value classes per field:
   - normal — representative, production-like
   - edge — min / max / ±1 / empty / one character
   - invalid — wrong type, too long, forbidden chars (negative checks)
   - special — unicode / emoji, locale, large numbers, NULL
4. Assemble a balanced set (≥70% normal). Names say the class (`user_edge_maxlen`, `order_invalid_qty`). Present it as a table (category, what it tests, share) and **stop — ask the user to confirm the categories and the exact item count** before generating or seeding anything. Save the confirmed plan to `.kiwi-cache/seed-data/{feature}.md`.
5. Seed through the existing channel. Persist only values the channel accepts. Invalid rows that the API rejects stay in fixtures, not in the DB.
6. Link to cases: `kiwi_case_add_comment` names the records; fixtures cite `C<id>`.
7. Write `test-data.md`: record → class → cases. Keep it in the repo so one command reproduces the set.

## Hand-off

- Table: record, class, how to find it, which cases use it.
- Cleanup: same channel, same marker / prefix (`qa_`).
- Next: `kiwi-write-test-cases` or `kiwi-automate-manual-cases` against this set.
