---
name: kiwi-pr-requirements-analyzer
description: >
  Use when the user needs to understand WHAT a PR is supposed to do from title,
  description, comments, and the linked ticket — scope check ticket vs PR, AC
  from intent. Not for reading the code diff (kiwi-pr-diff-analyzer), not for
  reviewing a standalone spec before coding (kiwi-requirement-reviewer), not
  for feature-risk brainstorming (kiwi-qa-thinking).
---

# PR Requirements Analyzer

Read what people wrote about the PR — title, body, comments, ticket. Extract the promised behavior. Check it against Kiwi cases.

**Not this skill:** git diff / what the code does → `kiwi-pr-diff-analyzer`. Spec before code → `kiwi-requirement-reviewer`. Feature risk → `kiwi-qa-thinking`.

Filled output: [filled-example.md](references/filled-example.md).

| Skill | Input | Focus |
| --- | --- | --- |
| `kiwi-pr-diff-analyzer` | git diff | what the code does |
| `kiwi-pr-requirements-analyzer` | title, body, comments, ticket | what the PR is supposed to do |

## 1 — Context

Priority:

1. PR number or URL in the prompt.
2. Open PR for the current branch: `gh pr view --json number,title,baseRefName,headRefName,url,body,comments,labels`.
3. Only a ticket key — read the ticket, then look for a PR that references it.

## 2 — Written sources

- Title, description, comments, labels, images in the body.
- Linked tickets (Jira / Linear / GitHub). Parse the body and branch name.
- **Do not invent ticket text.**

No ticket access → flag the gap and continue with the PR body.

## 3 — Promises

From title / body / ticket:

- New behavior.
- Changed behavior.
- Fixed defects.

Decompose each promise (`kiwi-qa-thinking`): happy path, boundaries, negative, states. Phrase as "When … and …, then …". Observable, not "internally implemented".

## 4 — Scope and Kiwi

Three lists:

- In scope — ticket requirement present in the PR description (or, lightly, in the file list).
- Out of scope — ticket requirement with no matching PR change. Most valuable output.
- Extra — PR change not in the ticket. Ask; do not silently accept.

Then `kiwi_search_cases(query: <behavior>)`. A fix with no regression case is always a gap.

Empty body and a useless branch name: `git log {base}..HEAD --pretty=format:"%s%n%b"` and flag that the summary is inferred.

Non-source-only PR (docs / chore / CI / deps): no AC, no `kiwi-pr-diff-analyzer`. One-sentence Changes + file list + "no source behavior change".

## 5 — Output

Save a `.md` only when the user asked. Slug + PR number, e.g. `round-discount-to-cents-pr-220.md`.

```md
## PR Requirements Summary

**PR:** {title}
**Branch:** {head} → {base}
**Type:** feature | bugfix | refactor | deps
**Linked tickets:** …

**Source of truth:**
- PR description: {present | missing — inferred from commits/branch}
- Ticket: {found | not found}
- Most reliable source: {PR description | ticket | commits}

**Change overview:** {1–2 sentences of intent, not implementation}

**Affected areas:**
- …

**Top-level files (up to 5):**
- `path` — source | config | test | docs

**Scope check:**
- ✅ In scope: {ticket AC → where the PR claims it}
- ⚠️ Out of scope: {ticket AC with no PR change}
- ➕ Extra (not in ticket): {PR change not in the ticket}

**Kiwi coverage:**
- Covered: {behavior → case ids}
- Gap: {promise with no case}

**Ambiguities, edge cases, open questions:**
- …

**Acceptance criteria:**
- {action} → {expected result}
```

Omit empty sections. AC is testable and user-facing. Proposed new cases go through `kiwi-write-test-cases` and pick up the PR/sprint tag.

## Rules

- A defect fix without a regression case is a **gap**.
- "In the diff, not in the PR" is a question to the author.
- Do not invent requirements or generic edge cases.
