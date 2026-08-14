# Native reporter config

Package: `@kiwi-tcms-ai/kiwi-tcms-reporter` (`file:` path until published).
JS/TS only for native adapters. Other stacks → [pipe-cli.md](./pipe-cli.md).

## Env

`KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, and (for `plan`+`build`) `KIWI_PROJECT`.
See the package README. Do not paste the password into chat.

## Playwright

```ts
// playwright.config.ts
export default {
  reporter: [
    ["list"],
    ["@kiwi-tcms-ai/kiwi-tcms-reporter/playwright", {
      plan: 12,
      build: process.env.CI_COMMIT_TAG ?? "dev",
      // run: 87,
      // matchBy: "tag",
      // createMissing: true,
    }],
  ],
};
```

## Jest

```js
// jest.config.js
module.exports = {
  reporters: [
    "default",
    ["@kiwi-tcms-ai/kiwi-tcms-reporter/jest", { plan: 12, build: "dev" }],
  ],
};
```

## Mocha

```bash
mocha --reporter @kiwi-tcms-ai/kiwi-tcms-reporter/mocha \
      --reporter-options plan=12,build=dev
```

## Options

| Option | Meaning |
| --- | --- |
| `run` | Existing TestRun id |
| `plan` + `build` | Find the active run for that plan+build, or create it |
| `runSummary` | Title when auto-creating the run |
| `matchBy` | `auto` (default) \| `tag` \| `title` |
| `createMissing` | Create a TestCase for unmatched tests |
| `commentFailures` | Comment the error text (default true) |
| `dryRun` | Match only |
| `limitErrorLength` | Truncate failure comments (default 2000) |

Mocha/CLI pass numbers as strings (`plan=12`); the reporter coerces them.

## Markers

Put the Kiwi case id in the title, Playwright `tag`, or JUnit classname:

```js
test("Shopper can pay by card [C412]", async () => { /* … */ });
// Playwright
test("Shopper can pay by card", { tag: ["@C412"] }, async () => { /* … */ });
```

Accepted: `C412`, `TC-412`, `KIWI:412`, `[C412]`.

## Status mapping

| Framework | Kiwi |
| --- | --- |
| passed | PASSED |
| failed / timedOut / interrupted | FAILED |
| skipped / pending / todo | BLOCKED |

Sync errors are logged. They do not fail the test process.
