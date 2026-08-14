# Page Object Model

Paths: [project-layout.md](../../kiwi-scan-automation-project/references/project-layout.md) — `src/pages/`, helpers in `src/utils/`.

## Rules

- One class per page or clearly bounded component.
- One method = one action. Hide selectors and waits.
- Do not expose raw locators to the spec.
- Extract a shared component only when a second page would copy it.
- Composition over inheritance.

## Waits

- Condition-based waits (visible, enabled, URL).
- No `waitForTimeout` / `sleep`.
- Trust the framework auto-wait. Do not wrap every click in an extra check.

## Asserts

- Asserts live in the test, not in the Page Object.
- Page methods return data or void. They do not `expect`.

## Checklist

- Private locators.
- Meaningful method names.
- No asserts in the page class.
- Specs stay flow + asserts only.
