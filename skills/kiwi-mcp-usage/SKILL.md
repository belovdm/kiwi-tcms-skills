---
name: kiwi-mcp-usage
description: >
  Operate kiwi-tcms-mcp — call order, names vs ids, limits, errors, and kiwi_rpc.
  Use when calling kiwi_* tools, connecting the MCP, or when kiwi tools fail
  (handshake, 401, 404, timeout, PermissionDenied).
---

# kiwi-tcms-mcp Handbook

Call kiwi_* tools in a stable order. Prefer names the server can resolve. Use `kiwi_rpc` only when no dedicated tool exists.

Install, env, agent config, health-check: [mcp-setup.md](references/mcp-setup.md).

## Entity model

Product → TestPlan (has a PlanType, e.g. Functional/Acceptance/Regression) →
TestCase (status CONFIRMED/PROPOSED, category, priority, `is_automated`) →
TestRun (scoped to one plan, has a Build) → TestExecution (one case run inside
one run; status IDLE/RUNNING/PASSED/FAILED/BLOCKED/ERROR). A TestCase's own
status (CONFIRMED/PROPOSED) and a TestExecution's status (PASSED/FAILED/…)
are two different fields on two different entities — never set one where the
other is meant.

## Call order

1. `kiwi_ping` — server alive, which product (`KIWI_PROJECT` → Product).
2. Catalogs when you need names/ids: `kiwi_list_priorities`, `kiwi_list_categories`, `kiwi_list_builds`, `kiwi_list_components`.
3. Search: `kiwi_list_plans` / `kiwi_search_cases` / `kiwi_list_runs` / `kiwi_list_executions`.
4. Details: `kiwi_get_case(id)`, `kiwi_run_status(run_id)`.
5. Mutations: `kiwi_create_case` / `kiwi_create_plan` / `kiwi_create_run`, `kiwi_update_case`, `kiwi_update_execution`, `kiwi_run_add_case`.
6. Anything missing → `kiwi_rpc(method, params)`.

## Names vs ids

- By name (server resolves the id): priority (`P1`…`P5` / `Medium`), category, plan type, build, user login.
- By name, but two different fields: case status (`CONFIRMED` / `PROPOSED`) via `kiwi_update_case(status)`, execution status (`PASSED` / `FAILED` / `BLOCKED` / …) via `kiwi_update_execution(status)`. Do not pass one to the other's `status`.
- By id: plan, case, run, execution, `status_id` when the name is ambiguous, `build_id`.
- Names are case-insensitive. Execution status is resolved in the run's context.

## Limits

- Most list/filter tools return `{ total, shown, rows }`. Exceptions that
  return a **bare array**: `kiwi_list_priorities`, `kiwi_run_get_cases`,
  `kiwi_plan_tree`, `kiwi_case_list_attachments` / `kiwi_plan_list_attachments`
  / `kiwi_run_list_attachments`. Check `Array.isArray(result)` before
  reading `.rows`.
- Default page is `KIWI_DEFAULT_LIMIT` (20). Max **200** per call.
- Narrow with `plan`, `status`, `query`. Do not page through the whole product.
- Case text is long — `kiwi_get_case` only when you need steps. Lists use `kiwi_search_cases`.

## Errors

| Error | Cause | Action |
| --- | --- | --- |
| Auth failed 401/403 | bad username/password | check `KIWI_USERNAME` / `KIWI_PASSWORD` |
| HTTP 404 … `/json-rpc/` | bad `KIWI_URL` | instance base URL, no path |
| `… not found (…filter)` | name/id does not exist | take a real value from the catalog |
| `Cannot resolve keyword 'product'` on `Build.filter` / `TestCase.filter` | old client injected `product`; those models have no such field | upgrade kiwi-tcms-client (uses `version__product` / `category__product`); or `kiwi_rpc` with those lookups |
| `Select a valid choice` on `kiwi_create_run` `build` | build exists on another **Version** than the plan's `product_version` | `kiwi_list_builds` + plan's version; create/use a build on that version |
| Timeout | slow server or network | raise `KIWI_TIMEOUT` |
| `PermissionDenied` | user lacks rights | fix rights in Kiwi; do not bypass |

Unclear or recurring failure (encoding, missing field, schema mismatch) — log
it with `kiwi-skill-feedback-backlog` instead of guessing.

## `kiwi_rpc`

Use it when **no dedicated `kiwi_*` tool** exists. Typical leftovers:

- `Bug.filter`
- `TestExecution.get_comments`
- other Kiwi JSON-RPC methods not wrapped yet

Prefer dedicated tools when they exist: `kiwi_execution_add_link`, `kiwi_execution_get_links`, `kiwi_execution_add_attachment`, `kiwi_case_add_tag`, `kiwi_plan_remove_case`.

Format: `kiwi_rpc { method: "Bug.filter", params: [{ summary__icontains: "double charge" }] }`.
Positional params = array. Named params = object. Same as Kiwi JSON-RPC.

## Quirks

- `automated` on `kiwi_search_cases`/`kiwi_create_case`/`kiwi_update_case` is
  the case's `is_automated` flag, not a plan/run property.
- `category` is required by Kiwi when creating a case — if you omit it, the
  server silently defaults to the product's first category. Pass one
  explicitly whenever the category matters.
- `kiwi_create_plan`'s `type` defaults to `Functional`. The client also
  tries stock **`Function`** if `Functional` is missing. Custom types (e.g.
  `Exploratory`) still need `kiwi_create_plan_type` first.
- Build is scoped via `version__product`, TestCase via `category__product`
  or `plan`. Do not send `product` to `Build.filter` / `TestCase.filter`.
- `kiwi_create_case` schema text says default priority `Medium`. This
  instance's catalog is `P1`…`P5` only — pass an explicit `P*`.
- `kiwi_create_plan`'s `text` is the plan document (Kiwi UI: "Документ плана
  тестирования") — scope, environment, entry/exit criteria. Set it at create
  time; `kiwi_update_plan(id, text)` also works after the fact.
- `kiwi_create_run` requires `build` (name or id). The client looks the name
  up on the product, but Kiwi then accepts only builds whose Version equals
  the plan's `product_version`. `kiwi_create_plan` defaults to the first
  version (often `unspecified`); a build created with `version: 1.0` is
  rejected (`Select a valid choice`). Create the build on that same version,
  or pass a build id that already belongs to it. `manager` defaults to the
  logged-in user (`User.filter` without a query) when omitted.
- `kiwi_search_cases(query)` matches **summary only**, not `text`. A miss
  on a body word is not “no case exists”.
- `kiwi_case_add_tag` / `kiwi_plan_add_tag` / `kiwi_*_add_attachment` /
  `kiwi_case_remove_tag` often return JSON `null` on success. Confirm with
  `kiwi_*_list_attachments`, `kiwi_search_cases(tag)`, or
  `kiwi_rpc Tag.filter`. `kiwi_run_add_tag` returns the tag object.
- `kiwi_plan_tree` `url` may be `https://localhost/plan/<id>` (Django site
  host), not `KIWI_URL`. Use `{KIWI_URL}/plan/{id}/` in reports.

## Rules

- **Ping first** on a new session or after errors.
- Resolve the exact id via filter before any mutation. Do not guess from memory.
- Confirm bulk work (e.g. add 50 cases to a run) with a summary first.
- A read/filter error may be retried. A mutation error — learn what already landed first.

## Example

> Mark execution 3021 failed and link JIRA-148.

1. `kiwi_update_execution(execution_id: 3021, status: "FAILED", comment: "Gateway timeout on step 3")` — status by name.
2. `kiwi_execution_add_link(execution_id: 3021, name: "JIRA-148", url: "https://jira.example.com/browse/JIRA-148", is_defect: true)`.
3. On 401/403 check `KIWI_USERNAME` / `KIWI_PASSWORD`. On "not found" take the id from `kiwi_list_executions`.
