---
name: kiwi-accessibility-testing
description: >
  Tests UI for accessibility (a11y) compliance — WCAG 2.1/2.2, Section 508,
  EN 301 549. Links issues to Kiwi cases, suggests fixes. Triggers:
  accessibility test, a11y audit, WCAG compliance, screen reader, keyboard
  navigation, color contrast, ARIA.
---

# Accessibility (a11y) Testing

Ensure the product is usable by people with disabilities. Test against WCAG 2.1/2.2 (A, AA, AAA), Section 508, EN 301 549. Link findings to Kiwi cases.

## Prerequisites

- Target environment: staging or production-like (never test a11y on localhost-only).
- Tools available: axe-core, Pa11y, WAVE, Lighthouse, or screen readers (NVDA, VoiceOver, JAWS).
- `kiwi_ping` → `ok` if linking to Kiwi cases.
- Scope defined: pages, components, or user flows.

## WCAG Principles (POUR)

| Principle | What it means | Key criteria |
| --- | --- | --- |
| Perceivable | Content can be perceived | Alt text, captions, color contrast ≥ 4.5:1 |
| Operable | UI can be operated | Keyboard nav, no keyboard traps, enough time |
| Understandable | Info and operation clear | Readable, predictable, input assistance |
| Robust | Works with assistive tech | Valid HTML, ARIA used correctly |

## Levels

| Level | Meaning | Typical requirement |
| --- | --- | --- |
| A | Minimum accessibility | Basic barriers removed |
| AA | Standard (most laws require this) | Contrast 4.5:1, keyboard accessible |
| AAA | Enhanced | Contrast 7:1, sign language, etc. |

**Target:** Usually AA for commercial products.

## Workflow

### 1. Scan Automated

Run axe-core or similar on each page/component in scope:

```bash
npx @axe-core/cli https://staging.example.com/checkout --include="#main"
```

Or integrate into Playwright:

```ts
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('checkout page should not have a11y violations', async ({ page }) => {
  await page.goto('/checkout');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
  
  // Or log warnings without failing
  if (accessibilityScanResults.violations.length > 0) {
    console.table(accessibilityScanResults.violations);
  }
});
```

### 2. Manual Checks

Automated tools catch ~30–50% of issues. Manual testing required for:

| Check | How |
| --- | --- |
| Keyboard navigation | Tab through all interactive elements, no mouse |
| Screen reader | NVDA (Win), VoiceOver (Mac), JAWS — listen to announcements |
| Focus order | Logical sequence, focus visible |
| Color contrast | Use picker tool, verify 4.5:1 (AA) or 7:1 (AAA) |
| Alt text | Meaningful descriptions, not «image», not filename |
| Form labels | Every input has associated `<label>` or `aria-label` |
| Error messages | Clear, linked to field (`aria-describedby`), suggestions |
| Dynamic content | ARIA live regions announce changes |

### 3. Document Findings

For each issue:

| Field | Example |
| --- | --- |
| ID | A11Y-001 |
| WCAG criterion | 1.4.3 Contrast (Minimum) (AA) |
| Location | `/checkout`, button «Pay» |
| Impact | Critical / Serious / Moderate / Minor |
| Description | White text (#FFFFFF) on light gray (#D3D3D3), ratio 1.8:1 |
| Fix | Change background to #767676 (ratio 4.54:1) |
| Code snippet | `<button class="pay-btn">Pay</button>` |

### 4. Link to Kiwi

Create or update Kiwi cases for accessibility:

- `kiwi_search_cases(query: "accessibility OR a11y OR WCAG")`
- If no case exists → `kiwi_create_case` with template:

```markdown
# A11Y Audit — Checkout Page

## Scope
- URL: /checkout
- WCAG Level: AA
- Tools: axe-core, NVDA, manual keyboard test

## Criteria
- [ ] All images have alt text
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Form labels present
- [ ] Error messages announced
```

- Tag cases with `level:a11y`, `wcag:A`, `wcag:AA`, `wcag:AAA` as applicable.
- For violations: `kiwi_case_add_comment` with issue details + `kiwi_execution_add_link` to defect tracker.

### 5. Report

Summary in `.kiwi-cache/a11y/{page}-{date}.md`:

```markdown
## Accessibility Audit — Checkout

**Date:** 2025-01-15  
**WCAG Level:** AA  
**Tool:** axe-core 4.8, NVDA 2024.1, manual testing

### Summary

| Severity | Count |
| --- | --- |
| Critical | 2 |
| Serious | 5 |
| Moderate | 12 |
| Minor | 8 |

### Critical Issues

1. **A11Y-001** — Color contrast 1.8:1 on «Pay» button (WCAG 1.4.3 AA)
   - Fix: darken background to #767676
   
2. **A11Y-002** — Form field «Card number» has no label (WCAG 1.3.1 A)
   - Fix: add `<label for="card-num">Card number</label>`

### Kiwi Cases

- C601 (Checkout a11y): FAILED — 2 critical, 5 serious
- C602 (Payment form a11y): BLOCKED — missing labels
```

## Rules

- **Do not rely solely on automated tools** — they miss >50% of issues.
- Test with at least one screen reader (NVDA free on Windows, VoiceOver built-in on Mac).
- Keyboard-only navigation must work (no mouse dependency).
- Color is not the only visual means (links underlined, not just colored).
- Dynamic content (modals, errors, loading) must be announced via ARIA live regions.
- Link every a11y scenario to a Kiwi case for traceability.

## Next

- `kiwi-improve-test-cases` — refine a11y acceptance criteria in existing cases.
- `kiwi-setup-ci-automation` — run axe-core in CI on every PR.
- `kiwi-write-test-cases` — create manual a11y checklists for exploratory testing.

## Quick Reference: Common Violations

| Violation | WCAG | Fix |
| --- | --- | --- |
| Low contrast | 1.4.3 (AA) | Adjust colors to ≥ 4.5:1 |
| Missing alt | 1.1.1 (A) | Add descriptive `alt="..."` |
| No form label | 1.3.1 (A) | Add `<label>` or `aria-label` |
| Keyboard trap | 2.1.2 (A) | Ensure Tab exits component |
| Focus not visible | 2.4.7 (AA) | Add `:focus { outline: ... }` |
| Empty link | 2.4.4 (A) | Add link text or `aria-label` |
| ARIA misuse | 4.1.2 (A) | Remove invalid ARIA, use semantic HTML |
| No skip link | 2.4.1 (A) | Add «Skip to main content» link |
