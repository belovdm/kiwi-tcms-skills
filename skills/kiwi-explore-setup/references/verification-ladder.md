# Exploratory setup verification ladder

Used by `kiwi-explore-setup`. Walk in order. Stop at the first failure, fix, continue.

This is the Kiwi analog of a first-session check: Kiwi plan + `.kiwi-explore.yml` + a Playwright MCP browser agent. There is no Explorbot integration in this repo — the browser is driven directly via MCP tool calls (`browser_navigate`, `browser_click`, `browser_snapshot`, …), not a CLI or a config file another tool consumes.

## A — Kiwi is reachable

`kiwi_ping` → `ok` and the configured product (`KIWI_PROJECT`).

- Fail → [mcp-setup.md](../../kiwi-mcp-usage/references/mcp-setup.md). Do not continue.
- `ok` → B.

## B — Plan for findings

Known `plan_id` in `.kiwi-explore.yml`, or create one:

```
kiwi_list_plan_types
```

If `Exploratory` is not in the result, create it first — `kiwi_create_plan_type(name: "Exploratory")`. Do not invent a type name that isn't there.

```
kiwi_create_plan(name: "Exploratory: <area>", type: "Exploratory")
```

Write the returned id into `session.plan_id`.

## C — `curl` the app host

Build the full URL from `app.base_url` + the page to verify.

```bash
curl -sS -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" <full-url>
```

- `000` — DNS / VPN / typo in `base_url`. Fix and retry C.
- `200` — go to D.
- `3xx` / `401` / `403` — do C.5 first.
- `5xx` — the application is down. Stop.

## C.5 — Follow redirects (only after 3xx / 401 / 403)

```bash
curl -sIL -o /dev/null -w "final=%{url_effective}\nhttp=%{http_code}\n" <full-url>
```

- Final path looks like login / signin / oauth / sso, or the response is `401`/`403` → credentials required. Go to E (env), then D.
- Final URL is a normal unauthenticated rewrite → D.
- Ambiguous → ask what the user sees.

## D — Browser-agent smoke

Open `base_url`, sign in if needed, three clicks. Confirm the agent is controllable.

- **Write nothing to Kiwi** during smoke.
- Stay inside `guardrails.allowed_hosts`.
- Do not perform `forbidden_actions`.

Agent missing or cannot drive the page → fix the Playwright MCP connection (or the chrome-devtools MCP server, if that's the one installed instead). Do not start a session.

## E — Credentials in env

Values named by `app.credentials_env` (and the matching password var) live in `.env` or the process environment.

- Never put secrets in `.kiwi-explore.yml`, chat, or logs.
- Prefer the user edits `.env` themselves.
- Confirm presence, not the value:

```bash
grep -q "^<CREDENTIALS_ENV>=." .env && echo "creds set" || echo "creds missing"
```

Missing → wait. Set → retry D if login is required.

## F — Trial recording

One finding, by hand:

```
kiwi_create_case(summary: "[exp] …", plan: <plan_id>, tags: "exploratory,exp-YYYYMMDD")
```

Confirm the case landed on the plan with those tags. Fail → check `plan_id` and product; do not start a real session.

## G — Guardrails

- `allowed_hosts` is non-empty and matches `base_url`.
- `forbidden_actions` lists destructive ops (delete account, mass mail, …).
- Default `session.timebox_min` is 25 if omitted.

Then hand off to `kiwi-explore-fundamentals`.
