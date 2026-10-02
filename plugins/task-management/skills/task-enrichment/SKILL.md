---
name: task-enrichment
description: Enriches existing tasks in a tasks.yaml file with acceptance criteria, complexity scores, guardrails, and the minimal context an agent needs to execute them. Use when asked to enrich tasks, add acceptance criteria, or prepare tasks.yaml entries for agent execution. Applies only to repos whose tracker is a tasks.yaml file; not for GitHub-tracked projects or generated snapshot files. Scopes what existing tasks need and does not invent work.
argument-hint: [task-id-or-area]
metadata:
  last-reviewed: "2026-10-02"
  reviewed-against: "Claude Code 2.1.285; code.claude.com/docs/en/skills"
---

# Task Enrichment

Scope the minimum required context for task completion. It does not generate ideas or brainstorm; it analyzes existing tasks and identifies what's needed to execute them.

## Stop rule: file trackers only

Before any write, check the tracker. If `project.yaml` sets `tasks.tracker` to anything other than `file` (for example `github-projects`), or the file is a generated snapshot (`tasks/snapshot.yaml`, or a header saying it is generated or not to be edited), read it but write nothing: no `--fix`, no `yq -i`. Changes belong in the tracker that owns the tasks; say so to the user.

The helper script lives in the sibling task-management skill and needs `yq` and `jq`.

## Process

### 1. Discover tasks

```bash
# Find tasks.yaml
TASKS_FILE=$(${CLAUDE_SKILL_DIR}/../task-management/scripts/validate-tasks.sh --find)

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

Wait for user approval before writing. Apply the stop rule again here: if the target is not a writable `tasks.yaml`, give the user the approved enrichment to paste into the tracker instead.

### 5. Write to tasks.yaml

After confirmation, update tasks.yaml with enriched fields:

```bash
# Using yq to update a specific task
yq -i "(.tasks[] | select(.id == \"VER-001\") | .acceptanceCriteria) = [...]" "$TASKS_FILE"
```

### 6. Validate

Run validation script to confirm enrichment is correct:

```bash
${CLAUDE_SKILL_DIR}/../task-management/scripts/validate-tasks.sh "$TASKS_FILE"
```

## Enrichment rules

### Acceptance criteria must be

1. **Specific**: "FAQ shows 7500 грн" not "pricing is correct"
2. **Testable**: Each criterion should have a verification method
3. **Minimal**: Only what's needed to confirm completion
4. **Traceable**: Reference specific files, sections, or document IDs

### Context must be minimal

- Include only files the agent must read
- Reference specific sections, not entire documents
- For Sanity: specify document type and ID, not "all service pages"
- For code: specify file paths, not "the entire codebase"

### Complexity scoring

Use the complexity factors in the task-management skill, so the two skills cannot drift apart.

### Guardrails

Always include what the agent must not do:
- Don't modify files outside scope
- Don't change related locales until primary is confirmed
- Don't touch dependencies
- Don't make irreversible changes without confirmation

## References

- [references/enrichment-guide.md](references/enrichment-guide.md): task-type identification, context scoring, and the enrichment checklist.
- [references/ac-patterns-by-area.md](references/ac-patterns-by-area.md): acceptance-criteria patterns per task area. Read the section for the task's area only.
- [seeds/enriched-example.yaml](seeds/enriched-example.yaml): fully enriched example tasks. It is a fragment (a bare list), not a validatable tasks file.
