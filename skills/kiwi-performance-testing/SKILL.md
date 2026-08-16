---
name: kiwi-performance-testing
description: >
  Designs and executes performance tests (load, stress, spike, soak), links
  scenarios to Kiwi cases, and reports SLA/SLO violations. Triggers:
  performance test, load test, stress test, response time, throughput,
  scalability, soak test, spike test.
---

# Performance Testing

Measure system behavior under load. Link performance scenarios to Kiwi cases. Report SLA/SLO violations.

## Prerequisites

- Target system accessible (staging/perf env, **never production** without explicit approval).
- Baseline metrics or SLA/SLO defined (response time, throughput, error rate, resource usage).
- Tool selected: k6, JMeter, Gatling, Locust, or framework-native (Playwright has basic metrics).

## Test Types

| Type | Goal | Pattern |
| --- | --- | --- |
| Load | Verify under expected load | Constant RPS/users for 10–30 min |
| Stress | Find breaking point | Ramp up until failure |
| Spike | Sudden surge handling | Sharp up/down, observe recovery |
| Soak | Memory leaks, degradation | Low load for hours/days |
| Scalability | Horizontal/vertical scaling | Add/remove instances mid-test |

## Workflow

### 1. Define Scenarios

From requirements or `kiwi-qa-thinking`. Each scenario → Kiwi case or new case.

Examples:
- «Checkout completes in < 2s at 100 concurrent users»
- «Search API handles 500 RPS with < 1% errors»
- «System recovers within 30s after 10x spike»

### 2. Script

Use project's tool or suggest k6 (TypeScript/JS):

```ts
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '10m',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
    http_req_failed: ['rate<0.01'],    // < 1% errors
  },
};

export default function () {
  const res = http.get('https://staging.example.com/api/search?q=test');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains results': (r) => r.json('results.length > 0'),
  });
  sleep(1);
}
```

### 3. Execute

**Confirm environment and test type before running.** Run in isolated perf env. Monitor:
- Response times (avg, p95, p99)
- Throughput (RPS)
- Error rate
- Resource usage (CPU, memory, DB connections)

### 4. Analyze

| Metric | SLA | Actual | Status |
| --- | --- | --- | --- |
| p95 latency | < 2000ms | 1842ms | ✅ |
| Error rate | < 1% | 2.3% | ❌ |
| Throughput | > 400 RPS | 521 RPS | ✅ |

Root cause analysis for violations:
- High latency → DB queries, N+1, external calls, GC pauses
- Errors → timeouts, connection pool exhaustion, rate limits
- Low throughput → bottlenecks (single-threaded, locks, I/O)

### 5. Report to Kiwi

For each performance scenario linked to a Kiwi case:
- `kiwi_update_case(case_id, automated: true)` with `level:performance` tag
- `kiwi_case_add_comment`: test results, metrics, timestamp, build/env
- If SLA violated → `kiwi_execution_add_link` to defect tracker (JIRA, etc.)

Create execution summary in `.kiwi-cache/perf/{feature}-{date}.md`.

## Output

```markdown
## Performance Test Results — Checkout Flow

**Date:** 2025-01-15  
**Env:** staging-v2.4.1  
**Tool:** k6  
**Scenario:** 100 VUs, 10 min, checkout API

### Metrics

| Metric | SLA | Actual | Status |
| --- | --- | --- | --- |
| p95 latency | < 2000ms | 1842ms | ✅ |
| Error rate | < 1% | 2.3% | ❌ |
| Throughput | > 400 RPS | 521 RPS | ✅ |

### Issues

- Error rate exceeds SLA (2.3% vs 1%)
- Root cause: DB connection timeout at minute 7
- Recommendation: increase pool size from 20 to 50

### Kiwi Links

- C501 (checkout performance): FAILED — see JIRA-782
- C502 (search under load): PASSED
```

## Rules

- **Never run performance tests on production** without explicit written approval.
- Do not attribute failure to «network» without evidence (logs, metrics).
- One violation → investigate, do not dismiss as «noise».
- Link every performance scenario to a Kiwi case for traceability.
- Store scripts in repo (`tests/perf/`), results in `.kiwi-cache/perf/`.

## Next

- `kiwi-setup-ci-automation` — schedule perf tests in CI/CD (nightly, pre-release).
- `kiwi-run-triage` — if failures need classification.
- `kiwi-improve-test-cases` — refine performance acceptance criteria.
