# Test writing rules

If the user provided example cases, follow their style first, then these rules.
Format: [kiwi-case-format.md](../../kiwi-sync-test-cases/references/kiwi-case-format.md).

## Cases

- One case = one verifiable idea. Split "and then" titles.
- Why goes in the description / setup. What goes in the steps.
- Black-box: act through the UI or a public API unless the user said otherwise.
- Prefer the UI when both are available.

## Title

Behavior from the user's point of view: `<role> <action> <object> <qualifier>`.

Avoid:

- Fillers: "Check that…", "Verify that…", "Test for…"
- Embedded ids: `TC-001: Login` on first generation (sync adds `TC-<id>`)
- Vague: "Successful login", "Login works"

## Setup

- State needed before step 1, as bullets.
- Skip if it only repeats the suite / plan context.
- Do not add "the service is running" unless the case is about that.

## Steps

Numbered list under `## Steps`. Each step is an action; `Expect:` lines are observed facts.

```markdown
## Steps
1. Open the sign-in page
   Expect: The sign-in form is visible
2. Enter a valid email and password
   Expect: The fields accept the values
3. Click **Sign in**
   Expect: The shopper is redirected to the dashboard
```

- One simple sentence per step. No "and"/"or" of distinct actions.
- Concrete values on first generation. `${placeholder}` only when a value is reused.
- Prefer URL paths over full URLs (`/auth/login`).
- Assertions belong in `Expect:`, not in the action.
- Split compound expects onto separate `Expect:` lines.

**bold** — UI the tester clicks (buttons, fields, tabs).
*italic* — page / screen names.

## Expected

A single observable outcome. If there are two independent checks, they are two cases.

## Data

- Exact values, not "some product" / "any user".
- Boundary values when the case is about a boundary.
