# Logbook — Chat-to-PDF Documentation Generator

A **standalone skill** that analyzes full AI chat conversations and generates professional, structured PDF project documentation. Designed for CLI-based AI coding agents — Claude Code, GPT, Codex, Gemini CLI, Copilot CLI, and any agent that operates through conversation.

## Why This Exists

AI coding assistants generate a lot of context: user requests, code changes, bug fixes, decisions, commands, and validation steps. When a build is done, none of that context is preserved in a readable form.

This skill solves that: **one command turns an entire session into a structured PDF** that a manager, client, QA tester, or future developer can read.

## What It Produces

A PDF with 16 sections covering every aspect of the work:

| Section | What It Contains |
|---------|-----------------|
| Executive Summary | One-page overview of what was done |
| User Request Summary | Table of every request and its status |
| Requirements Identified | Functional, technical, non-functional requirements |
| Project Navigation | What files were inspected and how |
| Files Changed | Every file, change type, and reason |
| Technical Steps | Ordered implementation steps |
| Issues Fixed | Per-issue: problem, cause, investigation, fix, verification |
| Requirement Mapping | Traceability matrix |
| Code Changes Summary | New/modified/removed code, logic, API, config |
| Testing & Validation | Tests run, expected vs actual |
| Commands & Tools | Terminal commands and operations used |
| Before & After | Project state comparison |
| Major Decisions | Key choices and rationale |
| Pending Items | What's incomplete or recommended |
| Changelog | Sequential change log |
| Final Summary | Overall status and PDF location |

## Installation

Clone the repo:

```bash
git clone https://github.com/shouryavarma/logbook.git
cd logbook
npm install
```

Or just copy `SKILL.md` into any project — it's a standalone instruction file that any AI agent can read.

## Usage

### Via CLI

```bash
# Analyze a session JSON file and generate a PDF
node scripts/generate-docs.js output.pdf session-data.json

# With a custom title
node scripts/generate-docs.js output.pdf session-data.json "My Project - Change Documentation"
```

### Via AI Agent (Claude, GPT, Codex, etc.)

Activate the skill by saying:

> "Generate project documentation for this session."

The agent will analyze the conversation, build the HTML document, render it to PDF, and save it where you specify.

## Usage on Mobile Browsers & Web AI Chatbots

Logbook works in **two tiers** depending on whether the AI agent has access to a terminal:

### Full Tier (CLI-equipped agents — Claude Code, GPT Codex, Gemini CLI)

Clone the repo and use the Node.js PDF renderer as described above.

### Lite Tier (Web chatbots — Claude web, ChatGPT web, Perplexity, etc.)

Web chatbots can't run scripts or render PDFs directly. Instead:

1. **Load the skill** — Paste the raw contents of `SKILL.md` (grab it from [GitHub](https://raw.githubusercontent.com/shouryavarma/logbook/master/SKILL.md)) into the chat, or open the repo link and ask the chatbot to read it.
2. **Provide your context** — Paste your conversation history, session notes, or structured JSON (see `examples/sample-session.json` for the expected schema).
3. **The chatbot outputs structured markdown** — It will follow the 16-section format from SKILL.md and produce the full documentation as text.
4. **Convert to PDF** — Use any free online Markdown-to-PDF converter (e.g. md2pdf, markdowntopdf.com) or paste the output into Google Docs → File → Download → PDF.

> **Tip:** For best results on mobile, ask the chatbot to output the documentation in a single code block so you can copy it in one tap, then paste into a converter.

## Requirements

- Node.js 18+
- Playwright (`npx playwright install chromium` — auto-installed on first run)

## How It Helps in CLIs

| CLI Challenge | How This Skill Solves It |
|--------------|-------------------------|
| No visible output trail after a build | Generates a permanent PDF record of everything that happened |
| Hard to explain AI-assisted work to non-technical stakeholders | Produces an executive summary and plain-language sections |
| Lost debugging context after a session | Captures every issue, cause, investigation, and fix with file-level detail |
| Compliance and audit requirements | Creates a traceability matrix from requirements to implementation |
| Knowledge handoff between developers | Documents all files changed, technical steps, and decisions made |
| PR and release documentation | Generates a structured changelog and before/after summary |
| QA review without reading the codebase | Provides testing results, validation steps, and requirement mapping |

## CLI Workflow

```
1. AI agent works on a feature/fix in the terminal
2. Work is completed, verified, and ready
3. Developer activates this skill:
   "Generate project documentation for this session."
4. AI agent analyzes the full conversation
5. AI agent asks: "Where should I save the PDF?"
6. Developer provides a path
7. PDF is generated and saved
8. Developer gets a confirmation with summary
```

## Examples

See `examples/` for sample PDF outputs (coming soon).

## Tests

```bash
npm test
```

## License

MIT
