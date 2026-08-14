# Playwright best practices

Prefer the project's existing structure over a new pattern.

## Structure

- Reuse Page Objects, modules, and fixtures if they exist.
- Otherwise click and assert in the spec. Do not invent a POM for one test.
- `test.step()` only when it helps the trace.
- New specs: [project-layout.md](../../kiwi-scan-automation-project/references/project-layout.md) — `tests/`, support under `src/`.

## Locators

Priority: role → label → visible text → `data-testid` → CSS.

Stay consistent. If the repo already uses `data-testid`, keep using it.

```ts
await page.getByRole("button", { name: "Submit" }).click();
await page.getByLabel("Email").fill("user@test.com");
```

## Fixtures and API

- Reuse built-in `page` / `context` / `request` and existing custom fixtures.
- Setup and teardown through the API when possible. Assert through the UI.
- New fixtures only when a second test would copy the setup.

## Markers

Tag the Kiwi case. Do not invent a second tagging scheme.

```ts
test("Shopper can pay by card [C412]", async ({ page }) => { /* … */ });
test("Shopper can pay by card", { tag: ["@C412"] }, async ({ page }) => { /* … */ });
```

Accepted: `C412`, `TC-412`, `KIWI:412`, `[C412]`.
Reporter: [reporters-config.md](../../kiwi-e2e-tests-reporting/references/reporters-config.md).

## Avoid

- Hard `sleep` / `waitForTimeout`.
- Shared mutable state between tests.
- Secrets in source. Use env vars.
- Weak asserts that only check the page loaded.
