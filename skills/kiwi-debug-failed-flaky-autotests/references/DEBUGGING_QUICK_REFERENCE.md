# Debugging quick reference

Fix in priority order: locators → timing → assertions → flow.

Classify first (test / product / env) in the skill. This file is the test-side repair list.

## Locators

| Problem | Avoid | Prefer |
| --- | --- | --- |
| Deep nesting | `.parent .child .grandchild` | `[data-testid="target"]` |
| By index | `button:nth-child(2)` | `getByRole("button", { name: "Submit" })` |
| Partial text | `button:contains("Save")` | `getByText("Save", { exact: true })` |
| Dynamic classes | `.btn-primary-123` | `[data-testid="save-btn"]` |

Element state:

- Not found → wait before acting.
- Not visible → scroll into view.
- Not clickable → wait enabled; check overlays.
- Stale → re-fetch.
- Multiple matches → filter or `.first()`.

## Timing

No hard pauses (`sleep(5000)`, `wait(2)`, `waitForTimeout`).

```ts
await page.getByTestId("loader").waitFor({ state: "hidden" });
await page.waitForURL("/dashboard/**");
await page.waitForResponse((r) => r.status() === 200);
await expect(page.getByTestId("result")).toHaveText("Success");
```

Works locally, fails in CI → CI is slower; add an explicit wait, not a blind timeout bump.

CodeceptJS (only if the project uses it):

```js
I.waitForNavigationVisible();
I.waitForResponse((response) => response.status() === 200);
```

## Assertions

- Exact match too strict → `toContainText` / regex / `trim()`.
- Wrong expected value → read `kiwi_get_case`, not a guess.
- Several nodes → `.first()` or a tighter locator.

```ts
await expect(page.locator(".title")).toContainText("Hello");
```

If the product is wrong, leave the assert. That is not an assertion "fix".

## Flow

- Missing setup → login, navigation, data (`kiwi-data-seeder`).
- Fails on the second run → cleanup / idempotent keys.
- Order-dependent → `beforeEach` fresh state.
- Shared state → isolate per worker.

## Commands

Playwright:

```bash
npx playwright test path/to/test.spec.ts
npx playwright show-trace trace.zip
```

Jest / Mocha: the project's existing single-file script. Do not invent flags.

CodeceptJS (only if present):

```bash
npx codeceptjs run path/to/test.js --steps
```

## Attempts

1. Fix from the first diagnosis.
2. Re-diagnose with the new failure.
3. One alternative approach.

Then stop. Write what was tried.
