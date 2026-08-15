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
