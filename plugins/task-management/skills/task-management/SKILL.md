---
name: task-management
description: Validates and routes tasks stored in a tasks.yaml file: checks task schema and blockedBy dependencies, finds tasks.yaml, and assigns tasks to agent tiers by complexity. Use when validating tasks.yaml, checking dependencies, or routing YAML tasks by complexity. Applies only to repos whose tracker is a tasks.yaml file; not for GitHub Projects, generated snapshot files, or Claude Code's built-in task list. Does not enrich tasks; see task-enrichment.
argument-hint: [tasks-file-or-project-path]
metadata:
  last-reviewed: "2026-10-02"
  reviewed-against: "Claude Code 2.1.285; code.claude.com/docs/en/skills"
---

# Task Management

Core skill for tasks kept in a `tasks.yaml` file: schema reference, validation, project discovery, and agent-tier routing. The helper script needs `yq` and `jq`.

## Working boundary

- Validate, discover, route, and resolve dependencies for existing tasks.
- Do not invent tasks, brainstorm work, or rewrite a task's intent.
- Do not add acceptance criteria, complexity, or execution context — that is the
  `task-enrichment` skill's job.
- Never maintain task status in two places; the tracker file is authoritative.

## Stop rule: file trackers only

Before any write, check the tracker. If `project.yaml` sets `tasks.tracker` to anything other than `file` (for example `github-projects`), or the file is a generated snapshot (`tasks/snapshot.yaml`, or a header saying it is generated or not to be edited), read it but write nothing: no `--fix`, no `yq -i`. Changes belong in the tracker that owns the tasks; say so to the user.

## Project discovery

Find `tasks.yaml` in the current project:

```bash
${CLAUDE_SKILL_DIR}/scripts/validate-tasks.sh --find
```

Search logic (from project root upward):
1. `./tasks/tasks.yaml`
2. `./tasks.yaml`
3. `../tasks/tasks.yaml`
4. Continue until found or root reached

## Task schema

Read `references/schema.yaml` for the full schema definition.

### Required fields

The enum values below are the reference project's; a project may define its own in its schema. Validate against the project's values when they differ.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable unique ID with area prefix (e.g., `BLOG-001`, `SVC-001`) |
| `title` | string | Short imperative summary |
| `area` | enum | `blog`, `service-page`, `images`, `linking`, `fact-check`, `seo`, `cms`, `naming` |
| `status` | enum | `todo`, `in_progress`, `blocked`, `done` |
| `priority` | enum | `high`, `medium`, `low` |
| `owner` | enum | `editor`, `expert`, `pm`, `dev`, `seo` |
| `context` | string | WHY + source notes (free text) |
| `source` | string | Provenance file reference |

### Agent-execution fields (optional, for enrichment)

| Field | Type | Description |
|-------|------|-------------|
| `acceptanceCriteria` | array | Specific, testable conditions for completion |
| `complexity` | integer | 1-10 score for agent tier routing |
| `executionMode` | enum | `autonomous`, `ai-draft-human-review`, `human-only` |
| `guardrails` | array | What the agent must not do |
| `validationCommands` | array | Shell commands to verify completion |
| `requiredContext` | array | Files/information needed for execution |
| `executionSteps` | array | Step-by-step instructions (for user-involved tasks) |

## Validation

Run the validation script:

```bash
# Validate tasks.yaml
${CLAUDE_SKILL_DIR}/scripts/validate-tasks.sh ./tasks.yaml

# Validate and auto-fix missing optional fields
${CLAUDE_SKILL_DIR}/scripts/validate-tasks.sh ./tasks.yaml --fix

# Output JSON for agent consumption
${CLAUDE_SKILL_DIR}/scripts/validate-tasks.sh ./tasks.yaml --json
```

### Auto-fix behavior (`--fix`)

Adds empty arrays/defaults for missing optional fields:
- `acceptanceCriteria: []`
- `complexity: 5` (default)
- `executionMode: autonomous`
- `guardrails: []`
- `validationCommands: []`
- `requiredContext: []`

Existing fields are left unchanged.

## Agent tier routing

Route tasks to a tier by complexity:

| Complexity | Characteristics | Tier |
|------------|-----------------|------|
| 1-2 | Single-field edit, no deps, reversible | Small |
| 3-6 | Multi-field or cross-doc changes, known pattern | Mid |
| 7-8 | Requires judgment, business rules, legal context | Large |
| 9-10 | Legal/regulatory, irreversible, external verification | Human-led |

Map tiers to the models the project uses. As of 2026-10-02 the Claude mapping is Small = Haiku 4.5, Mid = Sonnet 5.5, Large = Opus 5.5.

### Complexity factors

Example factors from the reference project; adapt them to the project at hand.

| Factor | Impact |
|--------|--------|
| `owner: expert` or `owner: pm` | +3 |
| `blockedBy` non-empty | +1 per blocker |
| Pricing/legal terms in context | +2 |
| Cross-locale (uk + ru) | +1 |
| `target: new-site` (code change) | +2 |
| WARNING/CRITICAL in context | +2 |
| Purely mechanical (rename, deploy) | -2 |

## Dependency resolution

Tasks with `blockedBy` must wait for dependencies to complete:

```yaml
- id: BLOG-002
  blockedBy: [FC-007]  # Cannot start until FC-007 is done
```

Check dependency status:
1. Parse `blockedBy` array
2. Verify each referenced task has `status: done`
3. If any blocker is not done, task remains `blocked`
