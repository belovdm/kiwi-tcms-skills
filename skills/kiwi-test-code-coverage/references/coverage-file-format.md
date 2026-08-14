# coverage.tests.yml

Maps source files → automated tests → Kiwi cases. Commit it.

```yaml
version: 1
coverage:
  src/pricing/discount.ts:
    tests:
      - file: tests/unit/discount.spec.ts
        cases: [C412, C413]
      - file: tests/e2e/checkout.spec.ts
        cases: [C420]
  src/cart/cart.ts:
    tests: []
gaps:
  - src/cart/cart.ts
```

- Keys are paths or globs relative to the repo root.
- `cases` use the same markers as the reporter: `C412`, `TC-412`.
- `tests: []` is a coverage hole — keep it, do not delete the key.
- Static import analysis is an estimate; mark `estimate: true` on a test entry when unsure.

## Impact run

1. `git diff --name-only <base>...HEAD`
2. Match changed files to keys (exact or glob prefix)
3. Collect test files / case markers
4. Run those tests; send results with `kiwi-tcms-reporter` (`build` = commit)

## Validate

From the project root:

```bash
npx js-yaml coverage.tests.yml | node <path-to-this-skill>/scripts/check-coverage.mjs
```

Never use python. Do not invent a YAML parser.
