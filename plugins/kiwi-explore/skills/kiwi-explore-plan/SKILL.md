---
name: kiwi-explore-plan
description: >
  Write an exploratory charter — mission, personas, oracles, timebox,
  out-of-scope — so a session can run and land in Kiwi TCMS. Use before each
  session. Not for running the session (kiwi-explore-fundamentals) or first-time
  setup (kiwi-explore-setup).
---

# Exploratory Charter

A charter turns a walk into a mission: what we seek, who we pretend to be, when we stop, how we know we found it.

Needs `kiwi-explore-setup` and a known `plan_id`. Goal of the session must be clear (area, release, incident).

## Format — `charters/<exp-id>.md`

```markdown
# EXP-20260210-payments: payment off the happy path

- **Area:** payment (cart → gateway → confirm), staging only
- **Mission:** find ways to break payment with actions outside the main path
- **Personas:**
  - impatient: double-clicks, leaves the page mid-flow;
  - attacker: swaps amount/currency in requests;
  - from the past: pays again on an expired session.
- **Timebox:** 2 × 25 minutes
- **Oracles:**
  - captured amount == order amount (order currency);
  - order status and payment status agree in every view;
  - a second confirm does not charge twice.
- **Risk beacons:** races, idempotency, rounding, gateway timeouts.
- **Out of scope:** promo codes, mobile app.
- **Recording:** tag `exp-20260210-payments`, plan #44, `[exp]` prefix.
```

## Workflow

1. **Why this area** — incident, release, or a hole on the coverage map (`kiwi-test-code-coverage` / `kiwi_list_runs`).
2. **Mission** — one verb sentence ("find…", "check that…"). Bad: "poke the cart".
3. **Personas** — 2–4. Each changes behavior, not data (`kiwi-data-seeder` owns datasets).
4. **Oracles** — 3–5 observable invariants. `kiwi-run-triage` can reuse them.
5. **Bounds** — explicit out-of-scope + `guardrails` from `.kiwi-explore.yml`.
6. **Kiwi** — paste the charter as a comment on the session case (`kiwi_case_add_comment`). Findings inherit tags.
7. **After the session** — "Outcomes": confirmed / refuted, new questions; link the closing comment.

## Rules

- **One charter = one mission.** "Payment + promos + account" is three charters.
- **Timebox is required.**
- Personas do not duplicate datasets.
- Charters live in the repo. They are the project's exploratory memory.

Config path: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
