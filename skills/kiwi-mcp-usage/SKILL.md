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

## Call order

1. `kiwi_ping` — server alive, which product (`KIWI_PROJECT` → Product).
2. Catalogs when you need names/ids: `kiwi_list_priorities`, `kiwi_list_categories`, `kiwi_list_builds`, `kiwi_list_components`.
3. Search: `kiwi_list_plans` / `kiwi_search_cases` / `kiwi_list_runs` / `kiwi_list_executions`.
4. Details: `kiwi_get_case(id)`, `kiwi_run_status(run_id)`.
5. Mutations: `kiwi_create_case` / `kiwi_create_plan` / `kiwi_create_run`, `kiwi_update_case`, `kiwi_update_execution`, `kiwi_run_add_case`.
6. Anything missing → `kiwi_rpc(method, params)`.

## Names vs ids

- By name (server resolves the id): priority (`P1`…`P5` / `Medium`), category, plan type, status (`CONFIRMED` / `PASSED` / `FAILED`), build, user login.
- By id: plan, case, run, execution, `status_id` when the name is ambiguous, `build_id`.
- Names are case-insensitive. Execution status is resolved in the run's context.

## Limits

- Every list/filter returns `{ total, shown, rows }`.
- Default page is `KIWI_DEFAULT_LIMIT` (20). Max **200** per call.
- Narrow with `plan`, `status`, `query`. Do not page through the whole product.
- Case text is long — `kiwi_get_case` only when you need steps. Lists use `kiwi_search_cases`.

## Errors

| Error | Cause | Action |
| --- | --- | --- |
| Auth failed 401/403 | bad username/password | check `KIWI_USERNAME` / `KIWI_PASSWORD` |
| HTTP 404 … `/json-rpc/` | bad `KIWI_URL` | instance base URL, no path |
| `… not found (…filter)` | name/id does not exist | take a real value from the catalog |
| Timeout | slow server or network | raise `KIWI_TIMEOUT` |
| `PermissionDenied` | user lacks rights | fix rights in Kiwi; do not bypass |

## `kiwi_rpc`

Use it when **no dedicated `kiwi_*` tool** exists. Typical leftovers:

- `Bug.filter`
- `TestExecution.get_comments`
- other Kiwi JSON-RPC methods not wrapped yet

Prefer dedicated tools when they exist: `kiwi_execution_add_link`, `kiwi_execution_get_links`, `kiwi_execution_add_attachment`, `kiwi_case_add_tag`, `kiwi_plan_remove_case`.

Format: `kiwi_rpc { method: "Bug.filter", params: [{ summary__icontains: "double charge" }] }`.
Positional params = array. Named params = object. Same as Kiwi JSON-RPC.

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
