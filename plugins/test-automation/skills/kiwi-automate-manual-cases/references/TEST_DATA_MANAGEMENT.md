# Test data

Balanced datasets and seeding: `kiwi-data-seeder`. This note is how generated tests consume data.

## Placement

1. Used in one test → inline.
2. Reused → `src/fixtures/` ([project-layout.md](../../kiwi-scan-automation-project/references/project-layout.md)).
3. Large / tabular → JSON or CSV, load and iterate.
4. Env-specific (URLs, credentials) → env vars. Never hardcode secrets.

Start local. Move to a shared fixture only when reuse is obvious.

## Isolation

- Each test owns its data. No shared mutable records.
- Prefer the framework's isolation over a leftover row from another test.
- Names that say what they are: `user_edge_maxlen`, `order_invalid_qty`.
- Comment or fixture keys may cite `C412` so the case stays findable.

## Avoid

- Production PII or real user dumps.
- Data that defines the scenario instead of supporting it.
- Creating rows with no cleanup or idempotent key.
