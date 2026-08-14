---
name: kiwi-requirement-reviewer
description: >
  Use when the user asks to review a spec or ticket for testability — reviews
  requirements (BRD, user story, use case, feature ticket, spec, or prose)
  for readiness BEFORE implementation: ambiguity, gaps, contradictions,
  testability. Not for an already-open PR (kiwi-pr-requirements-analyzer),
  not for a code diff (kiwi-pr-diff-analyzer), not for brainstorming feature
  risks (kiwi-qa-thinking).
---

# QA Requirement Reviewer

Reviews requirements as given. Reports issues, gaps, risks, and open questions.

- **Work with the source as-is — do not rewrite it.**
- **Do not silently fill missing information.**
- Suggested wording must not hide a gap.
- Any format: BRD, user story, use case, ticket, spec, email, or free text.

Examples: [requirements_reviewer_examples.md](./references/requirements_reviewer_examples.md).

## Criteria

| Criterion | Means | Violation |
| --- | --- | --- |
| Atomicity | One behavior, rule, or capability | Several behaviors in one requirement |
| Clarity | One specific meaning | Vague / subjective / several readings |
| Completeness | Enough to implement and test | Missing rules, AC, I/O, errors, edges |
| Consistency | No conflict with related requirements | Contradictory behavior or terms |
| Testability | Objectively verifiable | No measurable pass/fail |

Also check: boundaries, states, roles, NFRs (load, security, a11y, locale, TZ), integrations (contracts, idempotency, retries), measurable definition of done.

## Workflow

### 1. Gather

Document, folder, or chat text.
If no path is given, look in `docs/requirements/` ([project-layout.md](../kiwi-scan-automation-project/references/project-layout.md)).

### 2. Identify

Extract distinct requirements. Use existing ids or assign `R1`, `R2`, …
Separate requirements from context, rationale, and design talk.

### 3. Review each

For each issue: requirement → issue + consequence → criterion → question with 1–2 answer options → optional better wording.

A question without options is a weak question.

### 4. Review the set

Missing scenarios, AC, actors, states, constraints, edges, error paths, contradictions.

`kiwi_search_cases` on the topic. Flag existing `TC-<id>` that the new behavior would break (regression).

Rough case count by level — `kiwi-split-testing-levels-pyramid`.

Split questions into **blocking** vs can-wait.

### 5. Report

```markdown
## Requirement Review

### Readiness

**Decision:** ✅ Ready | ⚠️ Needs clarification | ❌ Not ready

**Summary:** ... (1–3 sentences)

### Key findings

| Requirement | Problem type | Finding | Question / recommendation |
| --- | --- | --- | --- |
| R1 | Completeness | ... | ... |

Same requirement + same problem type → numbered lists in Finding and Question, matched by number.

### Ambiguities and open questions

* ...

### Gaps and issues

* ...

### Existing Kiwi coverage

* TC-<id> — conflict / stale / reusable

### Acceptance criteria (only if AC exist or are expected)

* ...

### Risks and impact

* ...

### Test-design estimate

~N cases (unit / integration / e2e / manual)

### Recommendation

...
```
