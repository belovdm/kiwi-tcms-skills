---
name: kiwi-explore-setup
description: >
  Install and configure AI exploratory testing with .kiwi-explore.yml, a
  browser agent, and a Kiwi plan. Use once per project before the first
  session. Hands off to kiwi-explore-fundamentals after a smoke walk and a
  trial Kiwi recording.
---

# Exploratory Setup

Stand up the environment: an agent walks the app, and every finding becomes a Kiwi case, bug link, or screenshot.

Config path: [project-layout.md](../kiwi-scan-automation-project/references/project-layout.md).
MCP health: [mcp-setup.md](../kiwi-mcp-usage/references/mcp-setup.md).
Checks: [verification-ladder.md](references/verification-ladder.md).

Ask only for: app URL, which page to verify, login credentials if the host hits an auth wall. Ask each when needed.

If `.kiwi-explore.yml` already exists and a session has been recorded, stop and send the user to `kiwi-explore-fundamentals`.

## 1 — Kiwi plan

`kiwi_ping` → `ok`. `KIWI_PROJECT` set.

Choose or create a plan: `kiwi_create_plan(name: "Exploratory: <area>", type: "Exploratory")`.

Recording conventions (into the config):

- tag `exploratory` + session tag `exp-<YYYYMMDD>` on every finding;
- finding cases: `[exp]` prefix on summary;
- bugs: not a case — `kiwi_execution_add_link`;
- screenshots: `kiwi_execution_add_attachment`.

## 2 — `.kiwi-explore.yml`

```yaml
app:
  base_url: https://staging.example.com
  credentials_env: EXPLORE_LOGIN   # login/password from env, never from this file
session:
  plan_id: 44
  timebox_min: 25
  tags: [exploratory]
recording:
  create_cases: true
  screenshots: true
  prefix: "[exp]"
guardrails:
  allowed_hosts: [staging.example.com]
  forbidden_actions: [delete_account, mass_mail]
```

## 3 — Verification ladder

In order. Stop at the first failure, fix, continue. Full tree: [verification-ladder.md](references/verification-ladder.md).

1. `kiwi_ping` and a real `plan_id`.
2. `curl` `base_url`. Auth wall → credentials in env, then continue.
3. Browser-agent smoke (Playwright MCP / browser-use / Puppeteer-MCP): open, sign in, three clicks. Write nothing to Kiwi.
4. Trial `kiwi_create_case` with `[exp]` + tags. Confirm plan and tags stuck.
5. Guardrails present: `allowed_hosts`, `forbidden_actions`, default timebox 25 min.

## 4 — Handoff

How to run a session (`kiwi-explore-fundamentals`), where charters live (`kiwi-explore-plan`), how to stop the agent.

## Rules

- Credentials **only from env**. Not in the config, not in logs.
- **`allowed_hosts` is required.** The agent does not leave the stand.
- `forbidden_actions` — destructive ops only with explicit permission, on disposable data.
- Default timebox is 25 minutes.
