# Error Report Templates

Ready-to-use templates for logging errors. Copy and fill in the blanks.

---

## MCP Error Template

```markdown
# MCP Error Report: kiwi_<tool-name>

**Timestamp:** YYYY-MM-DD HH:MM:SS  
**Tool:** kiwi_<method>  
**Error Type:** AuthFailed | Timeout | NotFound | PermissionDenied | Other

## Input Data
- Parameters passed: 
  ```json
  { ... }
  ```
- Environment context: 
  - KIWI_URL: (base URL only, no path)
  - KIWI_PROJECT: (product name)
  - Credentials: [REDACTED]
- Session state: fresh session | after previous error | during retry

## Error Details
- HTTP status: ___
- Error message: 
  ```
  (exact text from tool response)
  ```
- Stack trace snippet: 
  ```
  (if available)
  ```

## Root Cause
- [ ] Bad credentials (KIWI_USERNAME/KIWI_PASSWORD incorrect)
- [ ] Wrong KIWI_URL (not base URL, has path appended)
- [ ] Entity name/id does not exist (need to check catalog)
- [ ] Server slow/unavailable (timeout)
- [ ] User lacks permissions in Kiwi (PermissionDenied)
- [ ] Rate limiting (too many requests)
- [ ] **Encoding mismatch** (server sends non-UTF8, client expects UTF8)
- [ ] **Schema drift** (Kiwi API changed, field removed/renamed)
- [ ] **Missing field** (field exists in docs but not in response)
- [ ] Other: ____________

## Resolution
- Action taken: 
  - [ ] Checked credentials
  - [ ] Verified KIWI_URL format
  - [ ] Used kiwi_list_* to get valid names/ids
  - [ ] Increased timeout
  - [ ] Contacted Kiwi admin for permissions
  - [ ] Other: ____________
- Result: success | failed | escalated
- How fixed: (describe specific fix applied)

## Follow-up
- Recurring issue: yes | no
- Related reports: 
  - `./kiwi-reports/mcp-errors/YYYY-MM-DD_...` (link if same root cause)
- Prevention: (what to check before next call to this tool)
```

---

## Skill Error Template

```markdown
# Skill Error Report: <skill-name>

**Timestamp:** YYYY-MM-DD HH:MM:SS  
**Skill:** <skill-name>  
**Issue Type:** Difficulty | Inaccuracy | Correction | MissingData | Conflict

## Context
- Trigger: (what user request activated the skill)
- Input provided: 
  - Files: ____________
  - IDs/parameters: ____________
  - Previous context: ____________
- Expected outcome: (what should have happened according to skill instructions)

## Issue Details
- What went wrong: 
  (describe the specific difficulty, error, or inaccuracy)
  
- Error messages: 
  ```
  (if any error was produced)
  ```
  
- Where it occurred: 
  (which step in the skill workflow — reference SKILL.md section if possible)

## Root Cause
- [ ] Skill instructions unclear or ambiguous
- [ ] Missing reference data (catalog lookups not done)
- [ ] Tool limitation (MCP tool missing or broken)
- [ ] Conflicting requirements (user asked for X, skill requires Y)
- [ ] Edge case not covered in skill documentation
- [ ] Assumption mismatch (skill assumed A, reality was B)
- [ ] **Encoding issue** (file/text encoding not handled correctly)
- [ ] **Missing field in MCP response** (skill expected field that wasn't returned)
- [ ] **Schema mismatch** (field type or structure differs from expectation)
- [ ] Other: ____________

## Resolution
- Correction made: 
  (what adjustment was made to complete the task)
  
- Workaround used: 
  (if applicable — describe temporary solution)
  
- Manual intervention: 
  (what the human user had to do to help)

## Skill Improvement Needed
- Instructions to update: 
  (which section of SKILL.md needs clarification)
  
- New constraint to add: 
  (what rule would prevent this issue in the future)
  
- Reference to add: 
  (missing documentation that would help)
  
- Example to include: 
  (would an input/output example clarify this?)

## Follow-up
- Recurring issue: yes | no
- If yes, frequency: daily | weekly | monthly
- Similar past reports: 
  - `./kiwi-reports/skill-errors/YYYY-MM-DD_...` (link if pattern exists)
- Priority: low | medium | high
- Assigned to: (who should review and update the skill)
```

### Example 3: Encoding Error on kiwi_get_test_case

```markdown
# MCP Error Report: kiwi_get_test_case

**Timestamp:** 2025-08-15 16:45:00  
**Tool:** kiwi_get_test_case  
**Error Type:** Other (EncodingError)

## Input Data
- Parameters passed: {"case_id": 12345}
- Environment context: KIWI_URL=https://kiwi.example.com, KIWI_PROJECT=MyProduct
- Session state: during retry after timeout

## Error Details
- HTTP status: 200 (but response corrupted)
- Error message: `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xc3 in position 247: invalid continuation byte`
- Stack trace snippet: 
  ```
  File "kiwi_tcms_mcp/server.py", line 142, in get_test_case
    return json.loads(response.text)
  UnicodeDecodeError: 'utf-8' codec can't decode byte...
  ```

## Root Cause
- [x] **Encoding mismatch** (server sends non-UTF8, client expects UTF8)
- Note: Test case summary contains Cyrillic characters, server sent Windows-1251 encoded text

## Resolution
- Action taken: Manually decoded response with encoding='windows-1251'
- Result: success
- How fixed: Added encoding detection before JSON parse, retried with correct encoding

## Follow-up
- Recurring issue: yes (seen 3 times this week with Cyrillic test cases)
- Related reports: `./kiwi-reports/mcp-errors/2025-08-12_10-15-00_kiwi_get_test_case.md`
- Prevention: Add encoding auto-detection to MCP client or request server-side UTF-8 enforcement
```

### Example 4: Missing Field in kiwi_create_test_run

```markdown
# MCP Error Report: kiwi_create_test_run

**Timestamp:** 2025-08-15 17:20:00  
**Tool:** kiwi_create_test_run  
**Error Type:** Other (MissingField)

## Input Data
- Parameters passed: {"plan_id": 789, "build": "v2.1", "manager": "john"}
- Environment context: KIWI_URL=https://kiwi.example.com, KIWI_PROJECT=MyProduct
- Session state: fresh session

## Error Details
- HTTP status: 400
- Error message: `{"notes": ["This field is required."]}`
- Stack trace snippet: N/A (validation error from server)

## Root Cause
- [x] **Missing field** (field exists in docs but not in response)
- Note: API docs say "notes" is optional, but server requires it for new test runs

## Resolution
- Action taken: Added empty notes field to request
- Result: success
- How fixed: Passed "notes": "" in create request

## Follow-up
- Recurring issue: no (first occurrence)
- Prevention: Update skill instructions to always include notes field, report API doc discrepancy to Kiwi team
```

---

## Quick Start Examples

### Example 1: Auth Error on kiwi_ping

```markdown
# MCP Error Report: kiwi_ping

**Timestamp:** 2025-08-15 14:32:00  
**Tool:** kiwi_ping  
**Error Type:** AuthFailed

## Input Data
- Parameters passed: {}
- Environment context: KIWI_URL=https://kiwi.example.com, KIWI_PROJECT=MyProduct
- Session state: fresh session

## Error Details
- HTTP status: 401
- Error message: `Authentication credentials were not provided.`

## Root Cause
- [x] Bad credentials (KIWI_USERNAME/KIWI_PASSWORD incorrect)

## Resolution
- Action taken: Checked .env file, found password had expired
- Result: success
- How fixed: Updated KIWI_PASSWORD in environment, re-ran kiwi_ping → ok

## Follow-up
- Recurring issue: no
- Prevention: Check credential expiry date monthly
```

### Example 2: Skill Struggles with Missing Category

```markdown
# Skill Error Report: kiwi-create-test-case

**Timestamp:** 2025-08-15 15:10:00  
**Skill:** kiwi-create-test-case  
**Issue Type:** MissingData

## Context
- Trigger: User asked to create a new test case for login feature
- Input provided: Case title, steps, expected result
- Expected outcome: Case created with correct category

## Issue Details
- What went wrong: Skill created case without specifying category, server defaulted to first alphabetically ("API") instead of correct "UI"
- Error messages: None (silent wrong behavior)
- Where it occurred: During kiwi_create_case call

## Root Cause
- [x] Missing reference data (did not call kiwi_list_categories first)

## Resolution
- Correction made: Manually updated case with correct category_id
- Workaround used: N/A
- Manual intervention: User had to identify correct category and provide id

## Skill Improvement Needed
- Instructions to update: "Creation" section — add mandatory kiwi_list_categories call
- New constraint to add: "Always pass category explicitly, never rely on default"
- Reference to add: Link to kiwi-mcp-usage quirks about category default

## Follow-up
- Recurring issue: yes
- Priority: high
```

---

## Tips for Good Reports

1. **Be specific**: "401 on kiwi_ping" is better than "auth error"
2. **Include timestamps**: Helps track patterns over time
3. **Redact sensitive data**: Never log actual passwords or tokens
4. **Link related issues**: If the same problem appears multiple times, connect the reports
5. **State what worked**: Not just what failed — document successful fixes too
6. **Prioritize actionably**: High priority = blocks work, low = minor annoyance
