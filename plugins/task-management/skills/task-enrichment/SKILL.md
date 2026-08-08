---
name: task-enrichment
description: Enriches existing tasks with acceptance criteria, complexity estimates, and the minimal context an agent needs to execute them. Use when enriching tasks, adding acceptance criteria, preparing tasks for agents, or scoping task context — triggered by phrases like "enrich tasks" or "prepare tasks for agents". Does NOT brainstorm or generate ideas; it only scopes what existing tasks need for completion.
argument-hint: [task-id-or-area]
---

# Task Enrichment

Scope the minimum required context for task completion. This skill does NOT generate ideas or brainstorm — it analyzes existing tasks and identifies what's needed to execute them.

## When to use

- User says "enrich tasks" or "prepare tasks for agents"
- Before delegating tasks to simpler agent models
- When tasks lack acceptance criteria or execution guidance
- When scoping what context an agent needs

## Process

### 1. Discover tasks

```bash
# Find tasks.yaml
TASKS_FILE=$(./scripts/validate-tasks.sh --find)

# List tasks needing enrichment
yq '.tasks[] | select(.acceptanceCriteria == null or .complexity == null) | .id + " " + .title' "$TASKS_FILE"
```

If user specifies a task ID or area, filter to those tasks.

### 2. Analyze each task

For each task to enrich:

1. **Read the task's context field** — understand WHY this task exists
2. **Read the source file** — if `source` field points to a file, read it
3. **Identify task type**:
   - **Technical coding**: Can an agent execute this autonomously?
   - **User-involved**: Does it require human decisions or verification?
4. **Determine minimal context**: What files/information are absolutely required?
5. **Propose acceptance criteria**: What "done" looks like

### 3. Generate enrichment

For each task, generate:

#### For technical tasks (autonomous or ai-draft-human-review)

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Specific, testable condition"
    verification:
      type: grep  # or curl, query, schema_check
      command: "grep -c 'pattern' file"
      expected: "output >= 1"
complexity: 3  # based on rubric
executionMode: autonomous
requiredContext:
  - "path/to/required/file.md"
  - "Sanity document: document-type document-id"
validationCommands:
  - "grep -c 'expected-pattern' target-file"
guardrails:
  - "Do not modify X"
  - "Do not touch Y until Z is confirmed"
```

#### For user-involved tasks (human-only)

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Human has confirmed X"
    verification:
      type: manual
complexity: 8
executionMode: human-only
requiredContext:
  - "Page: /url-to-check/"
  - "Article: source-file.md"
executionSteps:
  1. "Open the page in browser"
  2. "Locate section X"
  3. "Confirm: is Y true or Z?"
  4. "Reply with your answer"
```

### 4. Confirm with the user

Show the enrichment proposal for each task:

```
Task: VER-001
Title: Owner: verify 3 facts on the Код 95 page

Proposed enrichment:
- complexity: 8 (requires human judgment)
- executionMode: human-only
- acceptanceCriteria: 3 items
- executionSteps: 4 steps

Proceed? [y/n]
```

Wait for user approval before writing.

### 5. Write to tasks.yaml

After confirmation, update tasks.yaml with enriched fields:

```bash
# Using yq to update a specific task
yq -i "(.tasks[] | select(.id == \"VER-001\") | .acceptanceCriteria) = [...]" "$TASKS_FILE"
```

### 6. Validate

Run validation script to confirm enrichment is correct:

```bash
./scripts/validate-tasks.sh "$TASKS_FILE"
```

## Enrichment rules

### Acceptance criteria must be

1. **Specific**: "FAQ shows 7500 грн" not "pricing is correct"
2. **Testable**: Each criterion should have a verification method
3. **Minimal**: Only what's needed to confirm completion
4. **Traceable**: Reference specific files, sections, or document IDs

### Context must be minimal

- Include only files the agent MUST read
- Reference specific sections, not entire documents
- For Sanity: specify document type and ID, not "all service pages"
- For code: specify file paths, not "the entire codebase"

### Complexity scoring

Use the rubric from task-management skill:

| Factor | Impact |
|--------|--------|
| `owner: expert` or `owner: pm` | +3 |
| `blockedBy` non-empty | +1 per blocker |
| Pricing/legal terms in context | +2 |
| Cross-locale (uk + ru) | +1 |
| `target: new-site` (code change) | +2 |
| WARNING/CRITICAL in context | +2 |
| Purely mechanical | -2 |

### Guardrails

Always include what the agent MUST NOT do:
- Don't modify files outside scope
- Don't change related locales until primary is confirmed
- Don't touch dependencies
- Don't make irreversible changes without confirmation

## Example: enriching BLOG-002

Input task:
```yaml
- id: BLOG-002
  title: "Update live «Нові правила праці» post"
  context: |
    Staging renders the Jul-22 version; the Jul-24 file changed 273 lines.
    Refresh the UK body... Before publishing: apply DOM-001...
  source: novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md
```

Output enrichment:
```yaml
acceptanceCriteria:
  - id: AC-1
    text: "UK body matches Jul-24 source file exactly"
    verification:
      type: query
      target: sanity
      query: "diff staging-body with source-file"
      expected: "no differences"
  - id: AC-2
    text: "Line 194 uses лицензии.укр (not ліцензії.укр)"
    verification:
      type: grep
      command: "grep -c 'ліцензії.укр' novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md"
      expected: "output == 0"
  - id: AC-3
    text: "Sources updated: drop zakon.rada №340, add insat.org.ua"
    verification:
      type: grep
      command: "grep -c 'insat.org.ua' novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md"
      expected: "output >= 1"
complexity: 4
executionMode: autonomous
requiredContext:
  - "raw/articles/novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md"
  - "raw/articles/novi-pravyla-pratsi-vidpochynku-vodiiv-2026.previous-2026-07-22.md"
  - "Sanity document: blogPost with slug pravyla-pratsi-ta-vidpochynku-vodiiv-2026"
validationCommands:
  - "grep -c 'ліцензії.укр' raw/articles/novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md"
  - "grep -c 'insat.org.ua' raw/articles/novi-pravyla-pratsi-vidpochynku-vodiiv-2026.md"
guardrails:
  - "Do not modify RU version in this task"
  - "Do not change the slug (SEO field)"
  - "Do not apply DOM-001 changes (separate task)"
```
