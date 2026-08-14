# Requirement Review — Examples

A small, deliberately imperfect draft — a typical review input — turned into a report. The review works with the source as-is and does not rewrite it.

## Example 1: BRD Draft

### Input (BRD draft excerpt)

```
Search — business requirements (draft)

1. Search must be fast and return relevant results.
2. Users can search by keyword and filter by date, and results must be exportable.
3. The system must handle a large number of users.
4. Search results are stored for reporting.
```

### Result

```markdown
## Requirement Review

### Readiness

**Decision:** ❌ Not ready

**Summary:** None of the four requirements is testable as written. R1 has no measurable threshold, R2 combines three behaviors, and the set has no error paths or acceptance criteria.

### Key findings

| Requirement | Problem type | Finding | Question / recommendation |
| --- | --- | --- | --- |
| R1 | Testability | "Fast" has no measurable threshold | What is the maximum allowed response time, and at what data volume? (e.g. 1 s / <50 chars vs 3 s / full catalog) |
| R2 | Atomicity | Three behaviors combined (search, filter, export) | Split into separate requirements: keyword search, date filter, export? |
| R3 | Clarity | "Large number of users" is undefined | What concurrent-user target must search support? (e.g. 100 vs 1 000) |
| R4 | Completeness | Retention scope and duration undefined | What is stored, for how long, and who may view it? (query+hits / 30 days / analysts only) |

### Ambiguities and open questions

* R1: What is the maximum allowed response time, and at what data volume?
* R2: Should this be three separate requirements (keyword search, date filter, export)?
* R3: What concurrent-user target must search support?
* R4: What is stored, for how long, and who may view it?

### Gaps and issues

* R1: No measurable threshold for "fast"
* R2: Compound requirement — three behaviors cannot pass/fail independently
* R3: "Large number of users" has no target
* R4: Retention scope and duration undefined
* No error or empty-state behavior in any requirement

### Existing Kiwi coverage

* none matching "search"

### Acceptance criteria

Acceptance criteria not found. Proposed:

- Response time: search returns results within 1 second for queries shorter than 50 characters
- Relevance: top results match an expected set for known queries
- Empty state: zero results show "No results found"
- Error state: special characters and empty queries are handled

### Risks and impact

* Implementation risk: medium — ambiguous performance targets cause rework
* Testing risk: high — no measurable AC blocks case design
* Business impact: low — core function is named but not verifiable

### Test-design estimate

Blocked until thresholds exist.

### Recommendation

Resolve the open questions before approval. Add measurable acceptance criteria to each requirement. Split compound R2 into atomic requirements.
```

## Example 2: User Stories

### Input (user stories)

```
As a user, I want to search products by name so I can find what I need.
As a user, I want to filter search results by category so I can narrow the list.
As a user, I want to export search results to PDF so I can share them.
```

### Result

```markdown
## Requirement Review

### Readiness

**Decision:** ⚠️ Needs clarification

**Summary:** Stories are well structured and meet most criteria. Export scope and empty-state behavior need a small clarification before approval.

### Key findings

| Requirement | Problem type | Finding | Question / recommendation |
| --- | --- | --- | --- |
| US1 | Completeness | 1. Empty-state behavior undefined | 1. What should the user see when search returns no results? (message vs. suggestions) |
| US2 | Completeness | 1. Error behavior undefined | 1. How are invalid filter values handled? (ignore vs. validation error) |
| US3 | Clarity | 1. Export scope and format not fully defined | 1. Does export include the current page or the full result set? (page vs. all) |

### Ambiguities and open questions

* Export: which format(s) — PDF only? Which content — current page or the full result set?
* Empty search results: what should the user see?
* Invalid input (special characters, empty query): how is it handled?

### Gaps and issues

* No error or empty-state behavior in any story
* Export: scope (page vs. all results) and format undefined

### Existing Kiwi coverage

* TC-88 "Shopper can search products by name" — reusable
* none for category filter or PDF export

### Acceptance criteria

Formal acceptance criteria are missing. Proposed:

- Search returns results within 500 ms for queries shorter than 50 characters
- Filter narrows the result set to the matching category only
- Export produces a valid PDF of the full result set (or confirm: page vs. all)

### Risks and impact

* Implementation risk: low — stories are independent and estimable
* Testing risk: medium — export-scope ambiguity can cause rework
* Business impact: low — core search value is clear

### Test-design estimate

~8 cases (unit 3 / integration 2 / e2e 2 / manual 1)

### Recommendation

Clarify export scope and add empty-state acceptance criteria. Otherwise ready for sprint planning.
```

## Example 3: Feature ticket with existing Kiwi cases

### Input (ticket excerpt)

```
Return an item by scanning a QR code. The shopper gets the money back.
```

### Result (excerpt)

```markdown
## Requirement Review

### Readiness

**Decision:** ❌ Not ready

**Summary:** Happy path is named. Partial return, expiry, offline scan, and refund precision are missing, and existing Kiwi coverage conflicts.

### Key findings

| Requirement | Problem type | Finding | Question / recommendation |
| --- | --- | --- | --- |
| R1 | Completeness | 1. Partial return undescribed 2. Expired return window undefined | 1. Is a partial return supported? If yes, how is bonus recalculated? (full line only vs. qty) 2. What happens after the return window? (reject vs. manager override) |
| R1 | Testability | Refund amount precision not set | Round up / down / banker's? To the cent? |

### Existing Kiwi coverage

* TC-301 "Refund is full amount only" — will go stale if partial return is in scope (regression)

### Test-design estimate

~10 cases (unit 4 / integration 3 / e2e 2 / manual 1)

### Recommendation

Resolve partial return, expiry, offline scan, and precision before design. Replace or update TC-301 if behavior changes.
```
