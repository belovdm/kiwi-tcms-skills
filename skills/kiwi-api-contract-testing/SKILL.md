---
name: kiwi-api-contract-testing
description: >
  Validates API contracts (OpenAPI/Swagger, GraphQL schema, gRPC proto) —
  schema compliance, breaking changes, consumer-driven contracts. Links
  violations to Kiwi cases. Triggers: contract test, API contract, OpenAPI,
  Swagger, breaking change, consumer-driven contract, Pact.
---

# API Contract Testing

Ensure APIs adhere to their contracts and detect breaking changes before they reach consumers. Link contract tests to Kiwi cases.

## Prerequisites

- API specification: OpenAPI/Swagger YAML/JSON, GraphQL schema, gRPC `.proto` files.
- Access to API (staging/dev environment).
- Tool selected: Schemathesis, Dredd, Pact, Spring Cloud Contract, or custom.
- `kiwi_ping` → `ok` if linking to Kiwi cases.

## Contract Types

| Type | Description | Tools |
| --- | --- | --- |
| Schema (Provider-side) | Validate API against OpenAPI/GraphQL schema | Schemathesis, Dredd, Swagger Validator |
| Consumer-driven (CDC) | Consumers define expectations, providers verify | Pact, Spring Cloud Contract |
| Integration | End-to-end API flows with real data | Playwright API, RestAssured, Supertest |

## Workflow

### 1. Discover Contract

Locate API spec in repo or remote:

- OpenAPI: `/docs/openapi.yaml`, `/swagger.json`, `/api-spec/`
- GraphQL: `schema.graphql`, introspection query
- gRPC: `.proto` files in `protos/` or registry

If no spec exists → flag as gap, recommend creating one first.

### 2. Validate Schema Compliance

Run automated checks against the spec:

**Schemathesis (OpenAPI):**

```bash
pip install schemathesis
schemathesis run https://staging.example.com/api/openapi.yaml \
  --checks all \
  --hypothesis-max-examples 50 \
  --report ./contract-report.html
```

**Dredd (OpenAPI):**

```bash
npm install -g dredd
dredd api-spec/openapi.yaml https://staging.example.com/api \
  --format html --output ./dredd-report.html
```

**Custom validation (TypeScript + Zod):**

```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1),
  created_at: z.string().datetime(),
});

// Test
const response = await fetch('/api/users/123');
const data = await response.json();
UserSchema.parse(data); // Throws if contract violated
```

### 3. Check for Breaking Changes

Compare new spec against baseline:

```bash
npx @openapi-diff/cli old-openapi.yaml new-openapi.yaml --report breaking-changes.md
```

**Breaking changes:**

| Change | Impact | Example |
| --- | --- | --- |
| Remove endpoint | Critical | `DELETE /users/{id}` removed |
| Remove required field | Critical | `email` no longer in response |
| Change type | Critical | `id: string` → `id: number` |
| Tighten validation | High | `name: max 50` → `max 20` |
| Add required field | High | New `phone` field required |
| Deprecate endpoint | Medium | `X-Deprecation: true` header added |

**Non-breaking:**

- Add optional field
- Add new endpoint
- Relax validation (max 20 → max 50)
- Add enum values

### 4. Consumer-Driven Contracts (CDC)

If using Pact or similar:

**Consumer side (defines expectation):**

```ts
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
  consumer: 'WebApp',
  provider: 'UserService',
});

provider
  .given('user exists')
  .uponReceiving('a request for user by ID')
  .withRequest({
    method: 'GET',
    path: '/api/users/123',
  })
  .willRespondWith({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      id: 123,
      email: 'test@example.com',
      name: 'John Doe',
    },
  });
```

**Provider side (verifies against pact file):**

```bash
PACT_URL=./pacts/WebApp-UserService.json \
  npm run pact:verify
```

### 5. Link to Kiwi

For each contract test scenario:

- `kiwi_search_cases(query: "API contract OR OpenAPI OR schema")`
- Create case if missing:

```markdown
# API Contract — User Service

## Endpoint
`GET /api/users/{id}`

## Contract Source
`api-spec/openapi.yaml` v2.4.1

## Checks
- [ ] Response matches schema (all fields present, correct types)
- [ ] Status codes: 200, 404, 401, 500
- [ ] Headers: Content-Type, X-RateLimit-Limit
- [ ] Error format consistent
- [ ] No breaking changes from v2.4.0
```

- Tag with `level:contract`, `api:<service-name>`, `contract:openapi` / `contract:pact`
- On violation: `kiwi_case_add_comment` with details + `kiwi_execution_add_link` to defect

### 6. Report

Summary in `.kiwi-cache/contract/{service}-{date}.md`:

```markdown
## Contract Test Results — UserService

**Date:** 2025-01-15  
**Spec:** openapi.yaml v2.4.1  
**Tool:** Schemathesis 3.0  

### Summary

| Check | Passed | Failed | Skipped |
| --- | --- | --- | --- |
| Schema compliance | 142 | 3 | 0 |
| Breaking changes | 8 | 1 | 0 |
| CDC (Pact) | 24 | 0 | 0 |

### Failures

1. **SCHEMA-001** — `GET /users/{id}`: extra field `internal_id` not in spec
   - Severity: Medium
   - Fix: remove field or add to spec
   
2. **SCHEMA-002** — `POST /users`: `email` validation too strict (rejects valid RFC 5322)
   - Severity: High
   - Fix: relax regex pattern

3. **BREAKING-001** — Removed `legacy_name` field from response
   - Severity: Critical
   - Consumers affected: WebApp, MobileApp
   - Fix: restore field with deprecation notice

### Kiwi Cases

- C701 (User API contract): FAILED — 3 schema violations
- C702 (Breaking changes check): FAILED — 1 breaking change detected
```

## Rules

- **Never skip contract tests in CI** — they prevent breaking changes.
- Schema is the source of truth — implementation must match, not the other way around.
- Breaking changes require:
  - Communication to consumers
  - Deprecation period (if possible)
  - Version bump (v1 → v2)
- For CDC: pact files committed to repo, verified on every PR.
- Link every contract test to a Kiwi case for traceability.

## Next

- `kiwi-setup-ci-automation` — run contract tests on every PR and before deploy.
- `kiwi-pr-diff-analyzer` — detect breaking changes in PR diff.
- `kiwi-write-test-cases` — create manual API exploration cases beyond contract.

## Quick Reference: Common Violations

| Violation | Type | Fix |
| --- | --- | --- |
| Extra field in response | Schema | Remove or document in spec |
| Missing required field | Schema | Implement or mark optional in spec |
| Wrong type (`string` vs `number`) | Schema | Align implementation with spec |
| Status code mismatch | Schema | Return documented status codes |
| Removed endpoint | Breaking | Restore or version API |
| Stricter validation | Breaking | Relax or version API |
| Changed auth scheme | Breaking | Support both during migration |
