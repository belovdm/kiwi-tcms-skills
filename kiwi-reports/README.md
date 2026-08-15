# Kiwi Error Reports

This directory stores error reports for:
- **MCP tool failures** (`mcp-errors/`) — when `kiwi_*` tools fail
- **Skill execution issues** (`skill-errors/`) — when skills encounter difficulties

## Directory Structure

```
kiwi-reports/
├── README.md               # This file
├── mcp-errors/             # kiwi-tcms-mcp tool failures
│   └── YYYY-MM-DD_HH-mm-ss_<tool-name>.md
└── skill-errors/           # skill execution issues
    └── YYYY-MM-DD_HH-mm-ss_<skill-name>.md
```

## When to Create Reports

### MCP Errors
Create a report in `mcp-errors/` when:
- Authentication fails (401/403)
- Connection timeouts occur
- HTTP 404 errors (bad URL, entity not found)
- PermissionDenied from server
- Unexpected response format
- Rate limiting encountered
- **Encoding errors** (UnicodeDecodeError, garbled text, mojibake)
- **Missing fields** (expected field not in response, schema mismatch)
- **Schema validation errors** (field type mismatch, required field missing)

### Skill Errors
Create a report in `skill-errors/` when:
- Skill has difficulty executing required steps
- Inaccuracies in detection or analysis
- Corrections needed after initial execution
- Missing data or unclear requirements
- Conflicts between skill instructions and actual behavior
- **Encoding issues** (file/text encoding not handled correctly)
- **Missing field in MCP response** (skill expected field that wasn't returned)
- **Schema mismatch** (field type or structure differs from expectation)

## Report Templates

See [`../skills/kiwi-error-reporting/references/templates.md`](../skills/kiwi-error-reporting/references/templates.md) for:
- MCP error template
- Skill error template
- Worked examples

## Quick Start

### Log an MCP Error

```bash
mkdir -p ./kiwi-reports/mcp-errors
cat > ./kiwi-reports/mcp-errors/$(date +%Y-%m-%d_%H-%M-%S)_kiwi_<tool>.md << 'EOFM'
# MCP Error Report: kiwi_<tool>

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Tool:** kiwi_<tool>
**Error Type:** ____________

## Input Data
- Parameters passed: { ... }
- Environment context: KIWI_URL, KIWI_PROJECT (credentials redacted)

## Error Details
- HTTP status: ___
- Error message: (exact text)

## Root Cause
- [ ] Bad credentials
- [ ] Wrong URL
- [ ] Entity not found
- [ ] Timeout
- [ ] Permission denied
- [ ] Other

## Resolution
- Action taken: ____________
- Result: success | failed | escalated

## Follow-up
- Recurring: yes | no
EOFM
```

### Log a Skill Error

```bash
mkdir -p ./kiwi-reports/skill-errors
cat > ./kiwi-reports/skill-errors/$(date +%Y-%m-%d_%H-%M-%S)_<skill>.md << 'EOFS'
# Skill Error Report: <skill>

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Skill:** <skill>
**Issue Type:** Difficulty | Inaccuracy | Correction | MissingData | Conflict

## Context
- Trigger: (what activated the skill)
- Expected outcome: ____________

## Issue Details
- What went wrong: ____________

## Root Cause
- [ ] Instructions unclear
- [ ] Missing data
- [ ] Tool limitation
- [ ] Conflict
- [ ] Edge case
- [ ] Other

## Resolution
- Correction made: ____________

## Skill Improvement Needed
- Instructions to update: ____________
- New constraint: ____________

## Follow-up
- Recurring: yes | no
- Priority: low | medium | high
EOFS
```

## Review Process

1. **Daily**: Check new reports for patterns
2. **Weekly**: Aggregate recurring issues
3. **Monthly**: Archive old reports, update skills/MCP docs

## Rules

- **Always log on first occurrence** of an error type
- **Redact credentials** — never store passwords or tokens
- **Link related reports** when same root cause appears multiple times
- **Update skill instructions** when patterns emerge (don't just log, fix)
- **Max 3 attempts** to resolve before logging as escalated

## Example Reports

- [MCP error example](./mcp-errors/2025-08-15_14-32-00_kiwi_ping-example.md)
- [Skill error example](./skill-errors/2025-08-15_15-10-00_kiwi-create-test-case-example.md)
