---
name: kiwi-mcp-usage
description: >
  Use when calling kiwi_* tools, connecting kiwi-tcms-mcp, or when kiwi tools
  fail (handshake, 401, 404, timeout, PermissionDenied, not found, names vs ids).
---

# kiwi-tcms-mcp Handbook

Prefer names the server can resolve. Catalogs and ids are **per instance** —
do not reuse values from this skill, another project, or memory. Use
`kiwi_rpc` only when no dedicated tool exists.

Install, env, agent config, health-check: [mcp-setup.md](references/mcp-setup.md).

## Entity model

Product → TestPlan (has a PlanType) → TestCase (case status, category,
priority, `is_automated`) → TestRun (one plan, one Build) → TestExecution
(one case inside one run; execution status).

A TestCase's status and a TestExecution's status are two different fields on
two different entities — never set one where the other is meant.

## How to call

Start with the tool that does the job. **Do not open with `kiwi_ping`.**

1. Search / list: `kiwi_list_plans` / `kiwi_search_cases` / `kiwi_list_runs` /
   `kiwi_list_executions`.
2. Details: `kiwi_get_case(id)`, `kiwi_run_status(run_id)`.
3. Catalogs **when writing a name you have not listed this session**:
   `kiwi_list_priorities`, `kiwi_list_categories`, `kiwi_list_plan_types`,
   `kiwi_list_builds`, `kiwi_list_components`, `kiwi_list_case_statuses`,
   `kiwi_list_execution_statuses`.
4. Mutations: `kiwi_create_case` / `kiwi_create_plan` / `kiwi_create_run`,
   `kiwi_update_case`, `kiwi_update_execution`, `kiwi_run_add_case`.
5. Anything missing → `kiwi_rpc(method, params)`.

`kiwi_ping` is diagnostics only (setup, handshake, 401/404/timeout, "is Kiwi
up?"). A successful list or mutation already proves the server is up.

## Names vs ids

- **By name** (server resolves): priority, category, plan type, build, user
  login, case status, execution status. Pass a value that exists **here**.
- Case status → `kiwi_update_case(status)`. Execution status →
  `kiwi_update_execution(status)`. Do not pass one catalog to the other.
- **By id**: plan, case, run, execution. Use `status_id` / `build_id` only
  when the name is ambiguous.
- Names are case-insensitive. Execution status is resolved in the run's context.
- If the user or this session already has an id or name, use it. On
  `not found`, list that catalog / entity and pick a real row. Do not invent
  ids. Do not fall back to stock labels from another instance (`P1`…`P5`,
  `Medium`, `Functional`, `CONFIRMED`, `PASSED`, …).

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
| `… not found (…filter)` | name/id does not exist here | list the catalog / entity; take a real value |
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
  server silently defaults to the product's first category. Pass one from
  `kiwi_list_categories` whenever the category matters.
- `kiwi_create_plan`'s `type` defaults to `Functional`; the client also tries
  `Function`. Either name may be missing. List `kiwi_list_plan_types` and
  pass one that exists, or `kiwi_create_plan_type` first.
- Build is scoped via `version__product`, TestCase via `category__product`
  or `plan`. Do not send `product` to `Build.filter` / `TestCase.filter`.
- `kiwi_create_case` schema mentions default priority `Medium`. That value
  may not exist. List `kiwi_list_priorities` and pass one that does.
- `kiwi_create_plan`'s `text` is the plan document (Kiwi UI: "Документ плана
  тестирования") — scope, environment, entry/exit criteria. Set it at create
  time; `kiwi_update_plan(id, text)` also works after the fact.
- `kiwi_create_run` requires `build` (name or id). The client looks the name
  up on the product, but Kiwi then accepts only builds whose Version equals
  the plan's `product_version`. `kiwi_create_plan` defaults to the first
  version on the product; a build on another version is rejected
  (`Select a valid choice`). Create the build on that same version, or pass
  a build id that already belongs to it. `manager` defaults to the
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

- Confirm bulk work (e.g. add 50 cases to a run) with a summary first.
- A read/filter error may be retried. A mutation error — learn what already landed first.

## Example

> Mark the failing checkout execution as failed and link the bug the user named.

1. `kiwi_list_executions` (run / case / status) → take `execution_id` from rows.
2. Pass a failed-status **name from this instance** to
   `kiwi_update_execution(execution_id, status, comment)`. List
   `kiwi_list_execution_statuses` only if you do not already have one.
3. `kiwi_execution_add_link(execution_id, name, url, is_defect: true)` with
   the tracker id/url the user gave.
4. On 401/403 check credentials. On `not found` re-list; do not reuse an id
   from another session or this skill.
