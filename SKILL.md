# Logbook — Chat-to-PDF Documentation Generator

Generate professional, structured PDF documentation from AI-assisted chat conversations. This skill converts the entire session — user requests, code changes, bug fixes, commands, and decisions — into a clear document that developers, managers, QA testers, and future maintainers can understand.

## When to Use

- A build, feature, or fix has been completed and needs documentation
- A client or stakeholder needs a readable summary of what was done
- A developer handoff requires context preservation
- A PR or release needs a structured changelog and traceability matrix
- An audit trail is needed for compliance, billing, or knowledge capture

## Required Behavior

Analyze the full conversation before writing the documentation.

Extract the project name from the conversation context and include it as `projectName` in the session data. The project name should reflect what the conversation was about — e.g. "Shopping Cart Checkout Fix", "User Auth Refactor" — not a generic placeholder.

Do not guess or invent changes. If something is not visible in the chat, say "Not available in the provided conversation."

If code edits, commands, terminal output, screenshots, error messages, file paths, or tool usage exist in the chat, include them in the documentation.

If a feature was requested but not completed, mark it as pending.

**Before saving, ask:** "Where would you like me to save the PDF documentation? Please provide the folder path, project location, or file name."

If only a folder path is given, use the filename `project-change-documentation.pdf`. Do not create the PDF until the user provides a location.

## Output Structure

Build the PDF with these sections in order:

### 1. Executive Summary
Plain-language overview of what was done, what was completed, major changes, issues fixed, and pending items.

### 2. User Request Summary
Table of every user request, follow-up, and clarification with status.

| Request No. | User Request | Status | Notes |
|---|---|---|---|
| 1 | Request description | Completed/Pending | Details |

### 3. Requirements Identified
Separate into functional requirements (features/behaviors), technical requirements (implementation-level needs), and non-functional requirements (performance, responsiveness, maintainability).

### 4. Project Navigation and Investigation
Explain which folders were inspected, which files were opened, which search terms were used, and how the relevant code was located.

### 5. Files and Areas Changed

| File / Area | Type of Change | Reason | Status |
|---|---|---|---|
| path/to/file | Updated/Added/Removed | Why it changed | Completed/Pending |

### 6. Technical Steps Performed
Ordered list of every implementation step. For each step include: what was done, why it was done, files involved, and the result.

### 7. Issues Found and Fixes Applied
For every issue fixed, document:

- **Problem:** What was broken or missing
- **Cause:** Why the issue happened
- **Investigation:** How the issue was found
- **Fix Applied:** Exactly what was changed
- **Files Changed:** List of affected files
- **Verification:** How the fix was tested
- **Result:** Final outcome

### 8. Requirement-to-Implementation Mapping

| Requirement | Implementation | Files / Areas | Status |
|---|---|---|---|

### 9. Code and Logic Changes Summary
New functions added, existing functions modified, removed code, refactored code, API changes, UI state changes, database changes, configuration changes.

### 10. Testing and Validation

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|

### 11. Commands, Tools, and Technical Operations Used

| Operation | Purpose | Result |
|---|---|---|

### 12. Before and After Summary

| Area | Before | After |
|---|---|---|

### 13. Major Decisions Made

| Decision | Reason | Impact |
|---|---|---|

### 14. Pending Items and Recommendations
Anything not completed, risks, suggested improvements, tests still needed.

### 15. Final Change Log

| Change No. | Change Description | Category | Status |
|---|---|---|---|

### 16. Final Summary
Overall work completed, key improvements, issues fixed, final project status, and PDF save location.

## Documentation Style Rules

- Clear, professional, detailed, easy to read
- Written in simple technical English
- Organized with headings and tables
- Suitable for developers AND non-technical stakeholders
- Honest about missing information
- Specific about files, changes, and technical steps

**Never use vague phrases** like "Some changes were made" or "The code was updated."
**Always explain** exactly what changed and why.

Good: "The submit handler in the login component was updated to check whether the email and password fields contain values before calling the authentication API."
Bad: "Login was fixed."

## PDF Generation Script

When generating the PDF, use `scripts/generate-docs.js`:

1. Build a complete HTML document with all 16 sections and a cover page
2. Use Playwright to render the HTML to PDF (A4 format)
3. Save to the user-specified path
4. Confirm the saved location

The output must include:
- Cover page with project title and date
- Table of contents
- Page breaks between major sections
- Consistent typography and professional styling
- Syntax-safe code blocks and well-formatted tables

## Quality Checklist

- [ ] All user requests captured
- [ ] All requirements documented
- [ ] Every file change has a reason
- [ ] Every bug fix has cause, investigation, and verification
- [ ] Pending items clearly marked
- [ ] Changelog complete
- [ ] PDF saved to confirmed location
- [ ] User received confirmation with file path
