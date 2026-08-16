---
name: kiwi-scan-automation-project
description: >
  Scans a repo for languages, test frameworks, existing autotests, Kiwi
  markers, reporting, and CI, then writes automation-inventory.yml.
  Triggers: scan the project, what tests exist, identify frameworks,
  test matrix, inventory before automation, pyramid, or coverage.
---

# Scan automation project

Answer what tests exist, what they run on, and how results leave the repo. Write that down as YAML.

Layout of produced artifacts: [project-layout.md](./references/project-layout.md).

**Do not run tests.** Static scan only. Counts are estimates (`estimate: true`).

## Collect

- Languages / toolchain from manifests: `package.json`, `pyproject.toml`, `pom.xml`, `build.gradle`, `go.mod`, `composer.json`.
- Frameworks from configs: `playwright.config.*`, `jest.config.*`, `.mocharc*`, `vitest`, `cypress.config.*`, `pytest.ini`, `conftest.py`, `pyproject.toml` (`[tool.pytest.ini_options]`), JUnit / TestNG.
- Test files by convention (`*.spec.ts`, `test_*.py`, `*Test.java`): file count, estimated tests, unit / e2e / integration split.
- Kiwi markers in titles / tags: `C<id>`, `TC-<id>`, `KIWI:<id>`, `[C<id>]`. Count linked vs unlinked.
- Requirements: `docs/requirements/**/*.md` if present (see [project-layout.md](./references/project-layout.md)).
- Reporting: native reporter, `kiwi-tcms-pipe` in CI, JUnit artifacts. Other-TMS leftovers → `gaps`, do not delete them.
- CI: `.github/workflows`, `.gitlab-ci.yml`, `Jenkinsfile` — jobs, schedule, artifacts.
- Optional TMS: `kiwi_list_plans` (or any list) succeeds — record plan/case counts. Manual cases live in Kiwi, not in the repo.

## Write `automation-inventory.yml`

Repo root. Refresh on large stack changes — a CI job added by
`kiwi-setup-ci-automation` counts: set `ci.provider` and `ci.test_jobs`, and
drop any `gaps` entry it just closed (e.g. "no CI job yet"). Do not leave the
inventory claiming a gap that a just-finished skill already fixed.

```yaml
version: 1
project: shop-frontend
languages: { typescript: "5.7", node: ">=20" }
frameworks:
  - { name: playwright, config: playwright.config.ts, tests_files: 18, tests_estimate: 214 }
  - { name: jest, config: jest.config.js, tests_files: 42, tests_estimate: 630 }
kiwi_links: { with_id: 96, without_id: 118 }
kiwi: { plans: 4, cases: 120 }   # omit if TMS was not reached
reporting: none        # none | junit | kiwi-pipe | custom
ci: { provider: github-actions, test_jobs: [unit, e2e] }
gaps:
  - "118 tests without a Kiwi case link"
  - "e2e results do not reach TMS"
```

## Next

`kiwi-setup-e2e-reporting`, `kiwi-test-code-coverage`, `kiwi-split-testing-levels-pyramid`, `kiwi-qa-lead-strategy-advisor`.
