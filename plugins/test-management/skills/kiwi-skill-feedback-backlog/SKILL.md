---
name: kiwi-skill-feedback-backlog
description: >
  Local backlog of friction from using kiwi-tcms-mcp tools and skills — not
  product or test failures. Capture input data, error causes, results, and
  fixes to ./.kiwi-reports/. Use when MCP tools fail (auth, timeout, 404,
  PermissionDenied, encoding errors, missing fields) or when skills encounter
  difficulties, inaccuracies, or require corrections. Later reviewed by the
  skill developer to fix skills and MCP.
---

# Skill and MCP Feedback Backlog

Capture friction from using skills and the MCP systematically — a backlog
for the skill developer, not a record of product/test failures.

## Report Directory

All reports are saved to `./.kiwi-reports/` with timestamps and categories:

```
./.kiwi-reports/
├── mcp-errors/           # kiwi-tcms-mcp tool failures
│   └── YYYY-MM-DD_HH-mm-ss_<tool-name>.md
└── skill-errors/         # skill execution issues
    └── YYYY-MM-DD_HH-mm-ss_<skill-name>.md
```

## When to Log

### MCP Errors (kiwi-tcms-mcp)

Log when any `kiwi_*` tool fails:

- Authentication errors (401/403)
- Connection timeouts
- HTTP 404 (bad URL, entity not found)
- PermissionDenied from server
- Unexpected response format
- Rate limiting
- **Encoding errors** (UnicodeDecodeError, garbled text, mojibake)
- **Missing fields** (expected field not in response, schema mismatch)
- **Schema validation errors** (field type mismatch, required field missing)

### Skill Errors

Log when a skill encounters:

- Difficulties executing required steps
- Inaccuracies in detection or analysis
- Corrections needed after initial execution
- Missing data or unclear requirements
- Conflicts between skill instructions and actual behavior
- **Encoding issues** (file/text encoding not handled correctly)
- **Missing field in MCP response** (skill expected field that wasn't returned)
- **Schema mismatch** (field type or structure differs from expectation)

## Report Format

Two fill-in-the-blank templates (MCP error, skill error) with the full Root
Cause checklist and worked examples: [templates.md](references/templates.md).
Copy the matching template, fill it in, save under the path above.

## Quick Logging Commands

Create an MCP error report:
```bash
mkdir -p ./.kiwi-reports/mcp-errors
cat > ./.kiwi-reports/mcp-errors/$(date +%Y-%m-%d_%H-%M-%S)_kiwi_<tool>.md << 'EOF'
# MCP Error Report: kiwi_<tool>

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Tool:** kiwi_<tool>
**Error Type:** ____________

## Input Data
...
EOF
```

Create a skill error report:
```bash
mkdir -p ./.kiwi-reports/skill-errors
cat > ./.kiwi-reports/skill-errors/$(date +%Y-%m-%d_%H-%M-%S)_<skill>.md << 'EOF'
# Skill Error Report: <skill>

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Skill:** <skill>
**Issue Type:** ____________

## Context
...
EOF
```

## Analyze and Fix

Use this when asked to review captured errors — your own session's, or a
batch someone else sent you (logs, a bug report, pasted output).

1. Log every error in the batch first, one report per error (see templates).
2. Group `.kiwi-reports/mcp-errors/*.md` and `.kiwi-reports/skill-errors/*.md`
   by **Root Cause**.
3. Any cause with 2+ reports is a pattern. Fix the source, not just this log:
   - MCP cause → edit `kiwi-mcp-usage/SKILL.md` (`## Errors` table or `## Quirks`).
   - Skill cause → edit the failing skill's own `SKILL.md`, the section named
     in that report's "Instructions to update".
4. Write the fix into the report's **Resolution** / **Skill Improvement
   Needed** fields — a report without a resolution isn't done.
5. Report back: N reports reviewed, M patterns found, which files were fixed.

**Escalated** (3 failed attempts, no fix found) still counts toward step 3 —
it is a pattern candidate, not a dead end.

## Related

Invoked from `kiwi-mcp-usage` when a `kiwi_*` tool call fails. Not for a
failing test itself (that's `kiwi-debug-failed-flaky-autotests` /
`kiwi-run-triage`) — this is the backlog of friction from *using* skills and
the MCP, not from the product under test.

## Rules

- **Always log on first occurrence** of an error type.
- **Redact credentials** — never store passwords or tokens.
- **Link related reports** when the same root cause appears multiple times.
- **Max 3 attempts** to resolve in-session before logging as escalated.
