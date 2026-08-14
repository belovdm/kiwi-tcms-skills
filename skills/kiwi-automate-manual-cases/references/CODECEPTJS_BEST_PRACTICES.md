# CodeceptJS best practices

Use this file only if `kiwi-scan-automation-project` found CodeceptJS.
Prefer the project's existing pages and helpers.

## Layers

- Pages: locators and elementary UI actions. No business logic.
- Actor / custom steps: multi-step flows (login, API+UI).
- Helpers: browser, API, DB, files.
- Specs: one scenario, asserts, flow.

New pages go under `src/pages/` ([project-layout.md](../../kiwi-scan-automation-project/references/project-layout.md)). Register them in `codecept.conf.*` `include` and `steps.d.ts`.

## Locators

Priority: visible text / role → id → `data-testid` → CSS.

Reuse an existing locator before adding a new one.

```js
I.click("Submit");
I.fillField("Email", "user@test.com");
I.click({ testId: "submit-form-btn" });
```

## Data and setup

- `Before`: API setup and auth. `After`: API cleanup, not UI.
- Shared constants over magic strings.
- Marker in the scenario title: `C412`, `TC-412`, `KIWI:412`, `[C412]`.

## Avoid

- `I.wait(n)` hard sleeps.
- Locators inlined in the spec when a page object already exists.
- Secrets in source.
- Shared mutable state between scenarios.
