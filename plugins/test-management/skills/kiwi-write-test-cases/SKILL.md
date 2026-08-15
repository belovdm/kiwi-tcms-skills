---
name: kiwi-write-test-cases
description: >
  Generates test cases and checklists from a feature, ticket, or spec and
  creates them in Kiwi TCMS via kiwi_create_case. Use when the user asks to
  write tests, make a testing checklist, generate scenarios from requirements,
  or load new cases into a Kiwi plan. Do not use for exploratory charters
  (kiwi-explore-plan), for improving existing cases (kiwi-improve-test-cases),
  or for the full lifecycle (kiwi-testing-workflow).
---

# Test Case and Checklist Generator

Turns a requirement into Kiwi cases: gates → checklist → cases → `kiwi_create_case`.

References:

- [Writing rules](./references/writing-rule.md)
- [Interview gates](./references/interview-gates.md)
- [External sources](./references/external-sources.md) (issue tracker / wiki via MCP)
- [Kiwi case format](../kiwi-sync-test-cases/references/kiwi-case-format.md)
- [Project layout](../kiwi-scan-automation-project/references/project-layout.md)
- [Requirement readiness criteria](../kiwi-requirement-reviewer/SKILL.md#criteria) (used by the readiness gate)
- MCP setup: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md)

## Prerequisites

- `kiwi_ping` → `ok`. `KIWI_PROJECT` is set.
- A requirement source: pasted text, a ticket/wiki reference to fetch (see
  [external-sources.md](./references/external-sources.md)), spec, or feature
  description.
- Target plan known, or will be created with `kiwi_create_plan`.

## Rules

- **Always generate a checklist before test cases**, even if the user asked for cases.
- **Do not skip gates.** Confirm after sources, readiness, scope, role (unless smoke), and checklist.
- **❌ Not ready blocks the checklist** until the blocking questions are answered or the user explicitly chooses to proceed with partial coverage.
- **Do not create cases without a confirmed plan and a reviewed case list.**
- Do not modify the user's source code.
- No `TC-<id>` on first write — identity is in [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md#identity).
- Priorities and categories come from `kiwi_list_priorities` / `kiwi_list_categories`. Never invent names.
- Search before create: `kiwi_search_cases(query: <summary>)`. On a hit, offer to attach — do not clone.
- Paths: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md). Requirements → `docs/requirements/{topic}.md`. Local cases → `docs/cases/{slug}.md`.
- **Case content is Russian** — summary, steps, expected results, and the
  section headings (`Подготовка` / `Шаги` / `Ожидаемый результат`). See
  [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md).
- When the source requirement is a file under `docs/requirements/`, put its
  path in the case's **Requirement** field (Kiwi's `requirement`).

## Workflow

1. Context → confirm sources ([template](./references/interview-gates.md))
2. Readiness gate → ✅/⚠️/❌, resolve or override
3. Coverage scope → confirm
4. Role — skip on smoke, apply default
5. Checklist → self-review → confirm → persist (checked items become cases)
6. Detailed cases
7. Create in Kiwi
8. Summary

### 1. Context

Understand the feature, main journeys, and risk areas.

Sources: the prompt, issue tracker, requirements, mockups, existing Kiwi cases, source code.
A ticket number or wiki page named as the source → fetch it, don't ask the
user to paste it, if a matching MCP server is connected:
[external-sources.md](./references/external-sources.md).

Prefer `kiwi_search_cases` / `kiwi_list_plans` for overlap. If existing cases cover the feature, say so and offer to extend them.

### 2. Readiness gate

Apply the same [readiness criteria](../kiwi-requirement-reviewer/SKILL.md#criteria) as `kiwi-requirement-reviewer` (atomicity, clarity, completeness, consistency, testability) to the gathered source — not a full review, a pass/fail check.

- **✅ Ready** — continue.
- **⚠️ Needs clarification** — ask the specific gaps as blocking-optional questions (1–2 answer options each, same style as `kiwi-requirement-reviewer`), then continue either way.
- **❌ Not ready** — contradictions, no clear actor/behavior, or missing acceptance criteria. Ask the blocking questions. Do not proceed to Scope until they're answered, or the user explicitly picks "✏️ Continue anyway — coverage will be partial".

Skip this gate only when the source already carries a ✅/⚠️ verdict from a prior `kiwi-requirement-reviewer` run in the same session.

### 3. Scope

Estimate counts from this feature. Do not use generic ranges. Templates: [interview-gates.md](./references/interview-gates.md).

### 4. Role

Skip on smoke. Otherwise show the role table and recommend one. Roles live in [interview-gates.md](./references/interview-gates.md).

### 5. Checklist

Hierarchical checklist sized to the chosen scope.

**Self-review before showing it** — fix inline, don't re-run the pass:
- No vague leaves ("проверить работу", "прочее") — each leaf is one testable behavior.
- Every risk area / journey from step 1 is covered by at least one leaf.

Confirm with the user before writing cases.

**Persist after confirmation** — write the confirmed checklist into
`docs/requirements/{topic}.md` as a `## Чеклист покрытия` section (create the
file if the topic has none yet). This is the artifact cases trace back to via
their **Requirement** field — see [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).

If the user originally asked only for a checklist, stop here unless they ask for cases.

### 6. Cases

Write one file per case under `docs/cases/` in [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md).
Follow [writing-rule.md](./references/writing-rule.md).

Show a review table: #, summary, priority, category. Let the user drop / merge / add.

If the requirement is thin, state that coverage is partial and list uncovered areas.

### 7. Create in Kiwi

- No plan → `kiwi_list_plans(query)` then `kiwi_create_plan(name, type, text)` if missing.
  `text` is the plan document (Kiwi's "Документ плана тестирования"): one or
  two sentences on scope — what the plan covers and what it doesn't, e.g.
  "Manual coverage for {feature}: {verb, verb, verb}."
- `kiwi_list_categories` / `kiwi_list_priorities` — use only names that exist.
- Priority hint against the instance list: critical path → P1/Critical, alternatives → P2, negatives → P2–P3, cosmetics → P4+.
- Tags: feature domain + type (`regression`, `smoke`), comma-separated.
- For each reviewed case: `kiwi_search_cases(query: summary)` then
  `kiwi_create_case(summary, plan, category, priority, text, tags)` — `text`
  is the whole `## Подготовка` / `## Шаги` / `## Ожидаемый результат` block
  from the local file, verbatim (Kiwi stores it as one Markdown field, no
  section params).
- Requirement file known → include `requirement: "docs/requirements/{topic}.md"` in the same `kiwi_create_case` call — a full URL if the repo has a known public remote (see [kiwi-case-format.md](../kiwi-sync-test-cases/references/kiwi-case-format.md#linking-to-a-public-repo)).
- Write `TC-<id>` into the local heading after create.

### 8. Summary

Created N cases, plan `<name>` (#id), links `<KIWI_URL>/plan/<id>/`, skipped duplicates.
