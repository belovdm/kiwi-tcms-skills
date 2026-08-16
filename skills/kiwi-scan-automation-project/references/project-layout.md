# QA project layout

Canonical tree for artifacts kiwi-skills produce. Keep an existing convention if the repo already has one.

```
docs/requirements/           gathered / reviewed requirements (committed)
.kiwi-cache/cases/           session drafts of Kiwi cases (gitignored)
.kiwi-cache/seed-data/       seed-data plans, one-off seed scripts (gitignored)
.kiwi-cache/qa-strategy.md   QA maturity roadmap (gitignored)
tests/                       generated automated tests
src/pages/                   page objects (UI)
src/utils/                   helpers, API clients
src/fixtures/                fixtures and shared test data
test-data.md                 seeded record → class → cases table
coverage.tests.yml           code → tests → cases map
automation-inventory.yml     scan output
.kiwi-workflow.yml           testing-workflow state
.kiwi-explore.yml            exploratory session config
.kiwi-sources.yml            known issue-tracker/wiki project & space
```

| Artifact | Path | File name |
| --- | --- | --- |
| Requirements | `docs/requirements/` | `{topic}.md` (kebab-case) |
| Case draft | `.kiwi-cache/cases/` | `{slug}.md` with `TC-<id>` after upload |
| Seed-data plan | `.kiwi-cache/seed-data/` | `{feature}.md` (kebab-case) |
| QA strategy roadmap | `.kiwi-cache/qa-strategy.md` | fixed name |
| Autotest | `tests/` | project's existing spec suffix |
| Page object | `src/pages/` | `{Name}.page.ts` |
| Seeded-data record | repo root | `test-data.md` |
| Coverage map | repo root | `coverage.tests.yml` |
| Inventory | repo root | `automation-inventory.yml` |

- `docs/requirements/` is **committed**. It is the project's requirement
  documentation: gathered sources, review notes, and the coverage checklist.
- Test cases live in **Kiwi TCMS**. Do not commit case markdown.
- `.kiwi-cache/` (including `cases/`) is gitignored scratch. Drafts exist
  while the agent writes, reviews, and uploads; they are not a second suite.
- A requirement file may contain a `## Чеклист покрытия` section — the
  confirmed test-design checklist `kiwi-write-test-cases` persists there
  before drafting cases, so cases trace back to both the requirement and the
  checklist item they came from.
- Cross-link a case to its requirement: put the requirement's path or URL in
  the case's **Requirement** field (Kiwi's `requirement` field —
  `kiwi_create_case(requirement: "docs/requirements/{topic}.md")` /
  `kiwi_update_case(requirement: ...)`). Prefer a full URL when the repo has
  a known public remote — see [kiwi-case-format.md](../../kiwi-sync-test-cases/references/kiwi-case-format.md#linking-to-a-public-repo).
- Cross-link a case to its autotest: the case's **Automated** /
  `is_automated` flag plus the automation script path go in Kiwi's `script`
  field (`kiwi_update_case(script: "tests/{file}")`), not a separate link.
  Same full-URL preference as Requirement.
- Tag each automated test with `C<id>` / `TC-<id>` / `KIWI:<id>` / `[C<id>]` after the case exists in Kiwi.
- Page objects and helpers live under `src/`, not in `tests/`.
- `.kiwi-sources.yml` holds the project's known issue-tracker/wiki project
  or space, so a skill fetching a ticket/page by number doesn't have to ask
  every run — no credentials in it. Format and fetch flow:
  [external-sources.md](../../kiwi-write-test-cases/references/external-sources.md).
