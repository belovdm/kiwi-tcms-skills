---
name: kiwi-pr-diff-analyzer
description: >
  Use when the user needs to understand WHAT CHANGED in a PR/branch from the
  git diff and which Kiwi cases/tests are impacted. Not for ticket/PR intent
  (kiwi-pr-requirements-analyzer), not for pre-dev spec review
  (kiwi-requirement-reviewer), not for feature-risk brainstorming (kiwi-qa-thinking).
---

# Pull Request Diff Analyzer

Read the git diff. Say **what the code changed**. Analysis only — never edit the branch.

**Not this skill:** ticket vs PR intent → `kiwi-pr-requirements-analyzer`. Spec before code → `kiwi-requirement-reviewer`. Feature risk → `kiwi-qa-thinking`.

Coverage map path: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).

## 1 — Diff

```bash
git branch --show-current
gh pr view {PR} --json baseRefName,title,body,comments,reviews
git diff {BASE}...HEAD --name-only
gh pr diff {PR}
```

Comments and reviews are a source too — test notes, edge cases, reproductions someone already wrote in the thread.

Uncommitted only: `git diff --name-only`.

Stop with a one-line summary (no impact list) when:

- branch is `main` / `master` / the PR base;
- no files changed;
- only docs, configs, CI, lockfiles, or `*.md` cases — source behavior did not change.

## 2 — What changed

- Changed files + kind of edit (logic / config / tests / docs).
- Group by module (payments, cart, auth, infra).
- Core (behavior) vs periphery (formatting, comments).
- PR type: feature / fix / refactor.
- PR comments/reviews mentioning edge cases, repro steps, or known gaps — fold into risks/checks below, don't restate as a separate section.

Risk per module:

- Domain (money, security, data) raises the floor.
- Public API change > internal cleanup.
- **Code changed, tests in the diff did not — flag it.**

## 3 — Kiwi impact

- `coverage.tests.yml` (`kiwi-test-code-coverage`) → affected tests directly.
- Else `kiwi_search_cases(query/component/category)` on the domain + `kiwi_list_executions` on recent runs.

Do not invent cases that are not in Kiwi or in the map.

## 4 — Output

```md
## PR diff summary

**Type:** feature | fix | refactor
**Branch:** {head} → {base}
**Changes:** {one sentence — what the code does now}
**Files:**
- …

**Areas:**
- …

**Risks:** {top 3, with why}

**Run:** {impact tests / Kiwi cases}

**Check by hand:** {unautomated paths}

**Ask the author:** {unclear diff hunks}
```

- "Changes" is one sentence.
- Omit empty sections.
- The run list must be executable (ids or test paths).

Optional next step: new behavior → `kiwi-write-test-cases`. Intent vs ticket → `kiwi-pr-requirements-analyzer`.
