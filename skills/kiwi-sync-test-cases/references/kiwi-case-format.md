# Kiwi case Markdown format

Canonical local file for a Kiwi TCMS case. Sync reads and writes this shape.
Case *content* follows the project language. Headings stay English.

```markdown
# TC-412: Shopper can pay by card with 3-D Secure

- **Priority:** P1
- **Status:** CONFIRMED
- **Category:** Functional
- **Tags:** payments, regression
- **Automated:** false

## Setup
The shopper is signed in. The cart has one in-stock item.

## Steps
1. Open checkout
   Expect: The payment form is visible
2. Choose card and enter the test card
   Expect: Card fields accept the values
3. Confirm 3-D Secure
   Expect: The bank challenge completes

## Expected
The payment is confirmed. The order status is Paid.
```

## Mapping

| Markdown | Kiwi field |
| --- | --- |
| `# TC-<id>: <summary>` | `id` + `summary` |
| `# <summary>` (no `TC-`) | new case; sync writes the id back |
| `**Priority:**` | `priority` (name from `kiwi_list_priorities`) |
| `**Status:**` | case status (`CONFIRMED`, …) |
| `**Category:**` | `category` |
| `**Tags:**` | comma-separated tags |
| `**Automated:**` | `is_automated` |
| `## Setup` | `setup` |
| `## Steps` | `actions` |
| `## Expected` | `expected` / `expected_results` |

`case_text_version` and `notes` go in an HTML comment, not in visible sections.

## Identity

- `TC-<id>` is the Kiwi numeric case id. Never invent one.
- No id → new case. After `kiwi_create_case`, write `TC-<id>` into the heading.
- Match order: `TC-<id>` → exact `summary` → `summary__icontains` only when a single candidate remains.

## Rules

- One case = one verifiable idea.
- Steps are verbs. Expected results are observable facts.
- Metadata is a bold-key bullet list only.
- Do not write `id:` / `product:` extra keys. Product is `KIWI_PROJECT`.
- Text fields are Markdown.

Default directory: `tests/manual/**/*.md`. Keep an existing project folder if it already has cases.
