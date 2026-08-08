---
name: task-management
description: Validate, discover, and route YAML-based task trackers — check task schema and dependencies, locate tasks.yaml, and route tasks to agent tiers by complexity. Use when validating tasks, understanding the task schema, checking dependencies, or preparing tasks for execution. Applies to any project with structured task files. Does not enrich tasks or invent work — see the task-enrichment skill for adding acceptance criteria and context.
argument-hint: [tasks-file-or-project-path]
---

# Task Management

Core skill for YAML-based task management: schema reference, validation, project discovery, and agent-tier routing.

## Working boundary

- Validate, discover, route, and resolve dependencies for existing tasks.
- Do not invent tasks, brainstorm work, or rewrite a task's intent.
- Do not add acceptance criteria, complexity, or execution context — that is the
  `task-enrichment` skill's job.
- Never maintain task status in two places; the tracker file is authoritative.

## Project discovery

Find `tasks.yaml` in the current project:

```bash
# From the scripts directory
./scripts/validate-tasks.sh --find
```

Search logic (from project root upward):
1. `./tasks/tasks.yaml`
2. `./tasks.yaml`
3. `../tasks/tasks.yaml`
4. Continue until found or root reached

## Task schema

Read `references/schema.yaml` for the full schema definition.

### Required fields

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
| `guardrails` | array | What the agent MUST NOT do |
| `validationCommands` | array | Shell commands to verify completion |
| `requiredContext` | array | Files/information needed for execution |
| `executionSteps` | array | Step-by-step instructions (for user-involved tasks) |

## Validation

Run the validation script:

```bash
# Validate tasks.yaml
./scripts/validate-tasks.sh ./tasks.yaml

# Validate and auto-fix missing optional fields
./scripts/validate-tasks.sh ./tasks.yaml --fix

# Output JSON for agent consumption
./scripts/validate-tasks.sh ./tasks.yaml --json
```

### Auto-fix behavior (`--fix`)

Adds empty arrays/defaults for missing optional fields:
- `acceptanceCriteria: []`
- `complexity: 5` (default)
- `executionMode: autonomous`
- `guardrails: []`
- `validationCommands: []`
- `requiredContext: []`

Does NOT modify existing fields.

## Agent tier routing

Route tasks to appropriate model based on complexity:

| Complexity | Characteristics | Recommended Model |
|------------|-----------------|-------------------|
| 1-2 | Single-field edit, no deps, reversible | Haiku, GPT-4o-mini |
| 3-4 | Multi-field in one doc, known pattern | Sonnet, GPT-4o |
| 5-6 | Cross-doc changes, relationship understanding | Sonnet, GPT-4o |
| 7-8 | Requires judgment, business rules, legal context | Opus, o1 |
| 9-10 | Legal/regulatory, irreversible, external verification | Human-led |

### Complexity factors

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

## Usage examples

### Validate before execution

```bash
./scripts/validate-tasks.sh ./tasks.yaml
# Output: ✓ Schema valid, 3 tasks missing acceptanceCriteria
```

### Find tasks.yaml from any directory

```bash
./scripts/validate-tasks.sh --find
# Output: /path/to/project/tasks/tasks.yaml
```

### Get complexity for routing

```bash
./scripts/validate-tasks.sh ./tasks.yaml --json | jq '.tasks[] | {id, complexity, executionMode}'
```
