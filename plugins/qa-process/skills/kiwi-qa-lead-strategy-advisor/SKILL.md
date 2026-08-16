---
name: kiwi-qa-lead-strategy-advisor
description: >
  Use when the user wants to set up QA from scratch, decide where to start,
  improve the process, or assess maturity — a QA strategy and maturity
  roadmap (L1–L5) from an interview plus live Kiwi TCMS metrics. Do not use
  for a concrete task (write cases, analyze this PR, fix this test, sync
  Kiwi) — those go to kiwi-testing-workflow or the skill that owns the verb.
---

# QA Strategy Advisor

Diagnose from facts: what the repo contains, and what Kiwi TCMS actually shows. Advise **what to do, why, and in what order**. Expand a step only when the user asks.

Inventory paths: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
MCP health: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).
Roadmap layout: [output-format.md](references/output-format.md).

## 1 — Discover

0. **Batch / no-interview trigger** — the user says run all skills, batch
   audit, or otherwise makes clear this must finish without a pause: skip
   straight to §2 Live Kiwi metrics, build the roadmap from `kiwi-scan-automation-project`
   + Kiwi facts alone, and label every section that would have come from the
   interview **"unconfirmed — no interview run"**. Do not fabricate answers
   to the interview topics below. Say in the output what a real interview
   would refine (pain, ownership, goal).
1. Scan the repo with `kiwi-scan-automation-project`.
2. Interview in rounds. Do not dump the whole list at once.
   - Use `AskUserQuestion` when the agent has it. 3–5 questions per round, then wait.
   - No tool → at most 3 plain-text questions and stop the turn.
   - 3–4 rounds. Adapt to prior answers. Skip what the scan already answered.
3. Topics across rounds:
   - Pain — releases, incidents, deadlines, trust in tests.
   - Who writes cases; who runs manual; who fixes automation.
   - What counts as "tested" for a release.
   - Where run results live; which metrics they watch.
   - Product and risk — users, highest-risk areas, release cadence.
   - Team and roles.
   - CI/CD and automation pain (ask only if the scan could not see it).
   - Goal — biggest pain, what success looks like.
4. Show a short bullet summary. Confirm:

> Did I get the picture right?
>
> - ✅ **Yes — build the roadmap** (recommended)
> - ✏️ **Let's adjust** — I will say what to fix
> - ❌ **No — revisit the questions**

Append context to `.kiwi-cache/qa-strategy.md`.

## 2 — Live Kiwi metrics

- `kiwi_list_plans` — count, active vs abandoned.
- `kiwi_search_cases(product: …)` — volume, status mix, `automated`, priorities.
- `kiwi_list_runs(only_active: true)` + `kiwi_run_status` on the last 5–10 runs — pass-rate, `BLOCKED`, hanging `IDLE`.
- Freshness — dates of last runs; cases untouched > 6 months.

Build a fact table: volumes, pass-rate, automation %, linkage, run regularity.

## 3 — Maturity (L1–L5)

| Level | Signs |
| --- | --- |
| **L1 chaotic** | cases in heads, ad-hoc runs, nothing in the TMS |
| **L2 described** | living case base, runs created, but manual and irregular |
| **L3 measured** | autotests linked to cases, pipe writes results |
| **L4 managed** | impact runs, triage in the release cycle, metrics on a dashboard |
| **L5 improving** | incidents become cases; metrics drive decisions |

Score design, automation, execution, analytics separately. Overall = the most common level + the gaps.

## 4 — Roadmap

Rank by **impact first, then effort**. Pain × cheapness.

Format: `initiative → skill → effect → effort`. Read [output-format.md](references/output-format.md) and follow it strictly. Max 5 items.

Typical first moves:

1. Run results in Kiwi → `kiwi-setup-e2e-reporting` (first if the pipe is missing).
2. Test ↔ case links → `kiwi-test-code-coverage`.
3. Clean the base → `kiwi-detect-duplicate-test-cases` + `kiwi-improve-test-cases`.
4. Cover risky features → `kiwi-qa-thinking` + `kiwi-write-test-cases`.
5. Recurring audit → `kiwi-testing-workflow` on a schedule.

Print the full roadmap as the last message of the turn. Do not call `AskUserQuestion` in that turn. End with the 💬 line from the output format.

Save the roadmap to `.kiwi-cache/qa-strategy.md`.

## 5 — Delegate

On `execute N` / `expand N` / `save`, act. On a vague "ok", offer a menu.

Each initiative goes to `kiwi-testing-workflow` with a goal and start step. Status stays in `.kiwi-workflow.yml`.

## Rules

- Every claim cites a **metric or Kiwi id** from steps 1–2.
- No more than 5 initiatives per quarter.
- Goal is controllability, not "automate everything".
- The advisor artifact is `.kiwi-cache/qa-strategy.md`.
