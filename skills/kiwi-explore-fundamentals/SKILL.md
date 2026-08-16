---
name: kiwi-explore-fundamentals
description: >
  Run an exploratory session with a browser agent, stay inside the charter and
  timebox, and record every finding in Kiwi TCMS as a case, bug link, or
  screenshot. Use during the session itself.
---

# Exploratory Session

Run the charter. Lose no finding: everything the agent saw lands in Kiwi.

Needs `kiwi-explore-setup` (`.kiwi-explore.yml` + `plan_id`) and a charter from `kiwi-explore-plan`.

## Workflow

1. **Start.** Container case: `kiwi_create_case(summary: "[exp] Session <charter>", plan, tags: "exploratory,exp-…")`. Keep its id.
2. **Walk the charter.** Drive the browser MCP from `kiwi-explore-setup`
   (Playwright MCP `browser_navigate` / `browser_click` / `browser_snapshot`,
   or browsermcp / chrome-devtools equivalents) through the mission / personas.
   If that MCP is disconnected (browsermcp: user must click Connect), say so
   once, then fall back to `@playwright/test` / a headed or headless script
   against `app.base_url` or `live_url` inside `allowed_hosts`. At each step:
   what the oracles checked, what turned up.
3. **Record immediately**, not at the end:
   - behavior worth covering → `kiwi_create_case(summary: "[exp] …", plan, tags: exp-…)`;
   - probable bug → execution + `kiwi_execution_add_link` (tracker URL) + repro in `kiwi_update_execution`;
   - screenshot / video → `kiwi_execution_add_attachment` (base64);
   - tag every fact with the session tag so it hangs off the container case.
4. **Stay inside bounds.** Honor `allowed_hosts` and `forbidden_actions`. Timebox ends the session even if it is "still interesting".
5. **Close.** Comment on the container (`kiwi_case_add_comment`):
   - counts: cases N, bugs M, questions K;
   - what the charter confirmed / refuted;
   - new questions for the next session.
6. **After.** Bugs go to the tracker. Finding cases go to the automation backlog (`kiwi-automate-manual-cases`). Append an "Outcomes" section to the charter.

## Rules

- A finding not in Kiwi **was not found**. Write it in the moment.
- **Bug ≠ scenario:** bug = tracker link; scenario = case.
- Do not leave `guardrails`. Destructive actions need permission.
- Honor the timebox. Two short sessions beat one endless one.
