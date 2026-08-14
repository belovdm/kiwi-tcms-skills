# QA project layout

Canonical tree for artifacts kiwi-skills produce. Keep an existing convention if the repo already has one.

```
.kiwi-cache/requirements/    gathered / reviewed requirements (gitignored)
tests/manual/                manual Kiwi cases (`*.md`), one file per case
tests/                       generated automated tests
src/pages/                   page objects (UI)
src/utils/                   helpers, API clients
src/fixtures/                fixtures and shared test data
coverage.tests.yml           code → tests → cases map
automation-inventory.yml     scan output
.kiwi-workflow.yml           testing-workflow state
.kiwi-explore.yml            exploratory session config
```

| Artifact | Path | File name |
| --- | --- | --- |
| Requirements | `.kiwi-cache/requirements/` | `{topic}.md` (kebab-case) |
| Manual case | `tests/manual/` | `{slug}.md` with `TC-<id>` once synced |
| Autotest | `tests/` | project's existing spec suffix |
| Page object | `src/pages/` | `{Name}.page.ts` |
| Coverage map | repo root | `coverage.tests.yml` |
| Inventory | repo root | `automation-inventory.yml` |

- Add `.kiwi-cache/` to `.gitignore` if missing.
- Tag each automated test with `C<id>` / `TC-<id>` / `KIWI:<id>` / `[C<id>]` after the case exists in Kiwi.
- Page objects and helpers live under `src/`, not in `tests/`.
- Do not write produced cases to `.kiwi-cache/`.
