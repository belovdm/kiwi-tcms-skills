# Interview gates for test-case generation

Templates for `kiwi-write-test-cases`. Mark questions with ❓ and numbered options.

## After gathering sources

```
Sources I used:

- Ticket ABC-123
- Spec
- Existing Kiwi cases (plan #12)

❓ Next:

1. ➡️ Continue
2. ✏️ Adjust sources
```

## Coverage scope

Replace `<N>` with estimates from this feature. Do not use generic ranges.

```
❓ Coverage scope?

**1. 🚀 Smoke** ~<N> cases
Critical path only

**2. ⚖️ Balanced** ~<N> cases
Happy path, key negatives, common boundaries

**3. 🧨 Exhaustive** ~<N> cases
Full set: errors, boundaries, security/perf/i18n where relevant

**4. ✏️ Other**
Name a role, a count, or describe the cut
```

## Role

Skip on smoke — apply ⚙️ default.

| Role | Focus |
| --- | --- |
| **⚙️ default** | balanced |
| **🌈 optimist** | happy path |
| **🤓 nerd** | dependencies, thoroughness |
| **🔪 psycho** | boundaries |
| **🔐 pentest** | security |
| **🎨 picasso** | UI/UX |
| **⚖️ lawyer** | copy, error text |
| **🌐 polyglot** | localization |
| **📈 performance** | load / timing |

## Checklist confirmation

Show a hierarchical checklist sized to the scope. Checked leaves become cases.

```
❓ Next:

1. 👍 Keep
2. ➖ Less detail
3. ➕ More detail
4. ✏️ Change these items
```

Do not write cases until the checklist is confirmed.
