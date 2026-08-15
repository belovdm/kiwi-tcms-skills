---
name: kiwi-error-reporting
description: >
  Log and analyze errors from kiwi-tcms-mcp tools and skill execution.
  Capture input data, error causes, results, and fixes to ./kiwi-reports/.
  Use when MCP tools fail (auth, timeout, 404, PermissionDenied, encoding errors, missing fields)
  or when skills encounter difficulties, inaccuracies, or require corrections.
---

# Error Reporting for Kiwi MCP and Skills

Capture errors systematically to improve reliability and track recurring issues.

## Report Directory

All reports are saved to `./kiwi-reports/` with timestamps and categories:

```
./kiwi-reports/
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

## MCP Error Report Format

```markdown
# MCP Error Report: <tool-name>

**Timestamp:** YYYY-MM-DD HH:MM:SS  
**Tool:** kiwi_<method>  
**Error Type:** AuthFailed | Timeout | NotFound | PermissionDenied | Other

## Input Data
- Parameters passed: { ... }
- Environment context: KIWI_URL, KIWI_PROJECT (redact credentials)
- Session state: fresh session | after previous error

## Error Details
- HTTP status: 401 | 403 | 404 | 500 | timeout
- Error message: (exact text from tool)
- Stack trace snippet: (if available)

## Root Cause
- [ ] Bad credentials (KIWI_USERNAME/KIWI_PASSWORD)
- [ ] Wrong KIWI_URL (not base URL)
- [ ] Entity name/id does not exist
- [ ] Server slow/unavailable
- [ ] User lacks permissions in Kiwi
- [ ] Other: ____________

## Resolution
- Action taken: (e.g., "checked credentials", "used kiwi_list_priorities to get valid name")
- Result: success | failed | escalated
- How fixed: (specific fix applied)

## Follow-up
- Recurring issue: yes | no
- Related reports: (link if same root cause)
- Prevention: (what to check before next call)
```

## Skill Error Report Format

```markdown
# Skill Error Report: <skill-name>

**Timestamp:** YYYY-MM-DD HH:MM:SS  
**Skill:** <skill-name>  
**Issue Type:** Difficulty | Inaccuracy | Correction | MissingData | Conflict

## Context
- Trigger: (what user request activated the skill)
- Input provided: (files, IDs, parameters)
- Expected outcome: (what should have happened)

## Issue Details
- What went wrong: (specific difficulty or error)
- Error messages: (if any)
- Where it occurred: (which step in the skill workflow)

## Root Cause
- [ ] Skill instructions unclear
- [ ] Missing reference data
- [ ] Tool limitation (MCP or other)
- [ ] Conflicting requirements
- [ ] Edge case not covered
- [ ] Other: ____________

## Resolution
- Correction made: (what was adjusted)
- Workaround used: (if applicable)
- Manual intervention: (what human had to do)

## Skill Improvement Needed
- Instructions to update: (which section of SKILL.md)
- New constraint to add: (what rule would prevent this)
- Reference to add: (missing documentation)

## Follow-up
- Recurring issue: yes | no
- Similar past reports: (link if pattern exists)
- Priority: low | medium | high
```

## Quick Logging Commands

Create an MCP error report:
```bash
mkdir -p ./kiwi-reports/mcp-errors
cat > ./kiwi-reports/mcp-errors/$(date +%Y-%m-%d_%H-%M-%S)_kiwi_<tool>.md << 'EOF'
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
mkdir -p ./kiwi-reports/skill-errors
cat > ./kiwi-reports/skill-errors/$(date +%Y-%m-%d_%H-%M-%S)_<skill>.md << 'EOF'
# Skill Error Report: <skill>

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Skill:** <skill>
**Issue Type:** ____________

## Context
...
EOF
```

## Review Process

1. **Daily review**: Check new reports for patterns
2. **Weekly summary**: Aggregate recurring issues
3. **Monthly cleanup**: Archive old reports, update skills/MCP docs

## Integration with Existing Skills

- `kiwi-mcp-usage`: Call this skill when kiwi_* tools fail
- `kiwi-debug-failed-flaky-autotests`: Log here if debugging hits obstacles
- All skills: Log corrections or inaccuracies discovered during execution

## Rules

- **Always log on first occurrence** of an error type
- **Redact credentials** — never store passwords or tokens
- **Link related reports** when same root cause appears multiple times
- **Update skill instructions** when patterns emerge (don't just log, fix)
- **Max 3 attempts** to resolve before logging as escalated
