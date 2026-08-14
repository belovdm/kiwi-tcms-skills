# PR Requirements Summary — Example

Filled example of the artifact produced by `kiwi-pr-requirements-analyzer`.

## PR Requirements Summary

**PR:** Round discount to cents
**Branch:** feature/PAY-220-discount-rounding → main
**Type:** bugfix
**Linked tickets:** PAY-220

**Source of truth:**
- PR description: present (states rounding rule, cart-total invariant, and the −1 cent receipt fix)
- Ticket: found (PAY-220)
- Most reliable source: PR description + ticket (they agree)

**Change overview:** Discounts now round to the currency minor unit (cents). The cart total must equal the sum of line items. Fixes the −1 cent mismatch on the receipt.

**Affected areas:**
- Pricing / discount calculation.
- Cart total and receipt amounts.
- Checkout confirmation display.

**Top-level files (up to 5):**
- `pricing/discount.ts` — source
- `pricing/rules.ts` — source
- `cart/totals.ts` — source
- `receipt/format.ts` — source
- `pricing/discount.spec.ts` — test

**Scope check:**
- ✅ In scope: PAY-220 AC1 (round discount to cents) — described and present in `pricing/discount.ts`
- ✅ In scope: PAY-220 AC2 (cart total equals sum of lines) — existing Kiwi cases TC-188, TC-191
- ⚠️ Out of scope: PAY-220 AC3 (regression for the −1 cent receipt) — no case in Kiwi, no test in the PR
- ➕ Extra (not in ticket): German i18n strings for the receipt (`i18n/de.json`)

**Kiwi coverage:**
- Covered: cart-total invariant — TC-188, TC-191 (plan #31 Payments)
- Gap: rounding boundaries 0.004 / 0.005 — no case
- Gap: PAY-220 receipt −1 cent — no regression case (a fix without a case will return)

**Ambiguities, edge cases, open questions:**
- Rounding mode (half-up vs banker's) is not named in the ticket.
- Negative discount / surcharge — not specified.
- Large totals (overflow / float) — no performance or precision budget.
- Multi-currency carts — ticket assumes one currency.

**Acceptance criteria:**
- Cart with a 10.004 discount in USD → discount stored and shown as 10.00
- Cart with a 10.005 discount in USD → discount stored and shown as 10.01
- Cart with several discounted lines → receipt total equals the sum of rounded lines
- Receipt that previously showed −1 cent → amounts match the cart *(NOT IMPLEMENTED — see Scope check)*
- Non-admin opens checkout → rounding still applied; no new permission
- Empty cart → no discount line, total 0.00
