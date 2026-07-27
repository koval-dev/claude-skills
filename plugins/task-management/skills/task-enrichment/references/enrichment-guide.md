# Enrichment Guide

How to scope minimum required context for task completion.

## Core Principle

**Enrichment is analysis, not generation.** The goal is to identify what's needed to execute an existing task, not to create new ideas or content.

## Process Flow

```
Task with context
       ↓
Read context + source
       ↓
Identify task type
       ↓
Determine minimal context
       ↓
Propose acceptance criteria
       ↓
Confirm with user
       ↓
Write to tasks.yaml
```

## Task Type Identification

### Technical Tasks (Agent-Executable)

**Characteristics:**
- Clear, deterministic outcome
- Can be verified with commands
- No human judgment required
- Pattern-based execution

**Examples:**
- Update FAQ text in Sanity
- Rename a field in code
- Deploy a schema change
- Fix a broken link

**Enrichment Output:**
- `acceptanceCriteria` with verification commands
- `validationCommands` for post-execution check
- `guardrails` to prevent scope creep
- `complexity: 1-6`

### User-Involved Tasks (Human Required)

**Characteristics:**
- Requires business decisions
- Needs expert verification
- Legal/regulatory implications
- Irreversible changes

**Examples:**
- Owner confirms pricing
- Lawyer reviews legal text
- PM approves business rules
- Expert verifies facts

**Enrichment Output:**
- `executionSteps` with clear instructions
- `requiredContext` for reference materials
- `complexity: 7-10`
- `executionMode: human-only`

## Minimal Context Rules

### DO Include

1. **Source files** the agent must read
2. **Specific sections** (line numbers if possible)
3. **Document IDs** for CMS operations
4. **URLs** for verification
5. **Related task IDs** for dependencies

### DON'T Include

1. **Entire codebases** — reference specific files
2. **All documents** — specify which ones
3. **Background history** — task context should have this
4. **Related but unnecessary files** — stay minimal

## Context Scoring

Rate the context you're providing:

| Score | Meaning | Action |
|-------|---------|--------|
| 1 | Perfect — minimal and complete | Ship it |
| 2 | Good — minor extras | Consider trimming |
| 3 | Okay — some unnecessary items | Trim before shipping |
| 4 | Poor — too much context | Rewrite |
| 5 | Bad — agent will be lost | Start over |

## Enrichment Checklist

Before finalizing enrichment:

- [ ] Acceptance criteria are specific and testable
- [ ] Each criterion has a verification method
- [ ] Context files are minimal (only what's needed)
- [ ] Complexity score reflects actual difficulty
- [ ] Guardrails prevent scope creep
- [ ] For user-involved tasks: steps are clear and actionable
- [ ] For technical tasks: validation commands work

## Common Enrichment Patterns

### Pattern: CMS Content Update

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Field X shows value Y"
    verification:
      type: query
      target: sanity
      query: 'documentType[field == "value"]'
      expected: "contains 'Y'"
complexity: 3
executionMode: autonomous
requiredContext:
  - "Sanity document: type document-id"
validationCommands:
  - "npx sanity document list --type documentType"
```

### Pattern: Code Change

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Function X returns Y for input Z"
    verification:
      type: grep
      command: "grep -c 'expected-pattern' src/file.ts"
      expected: "output >= 1"
complexity: 4
executionMode: autonomous
requiredContext:
  - "src/file.ts"
  - "src/file.test.ts"
validationCommands:
  - "npm test -- --grep 'test name'"
guardrails:
  - "Do not modify other functions"
  - "Do not change exports"
```

### Pattern: Expert Verification

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Expert confirms X is accurate"
    verification:
      type: manual
complexity: 8
executionMode: human-only
requiredContext:
  - "Article: source-file.md"
  - "Reference: external-source-url"
executionSteps:
  1. "Read the article section on X"
  2. "Compare with external source"
  3. "Confirm if statement Y is accurate"
  4. "Reply with your assessment"
```

### Pattern: Multi-Step Deployment

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Schema deployed successfully"
    verification:
      type: schema_check
      command: "npx sanity schema deploy --dataset production"
      expected: "exit 0"
complexity: 5
executionMode: autonomous
requiredContext:
  - "sanity/schemas/documentType.ts"
validationCommands:
  - "npx sanity schema validate"
  - "curl -s https://api.sanity.io/v1/data/query/production?query=*[_type=='documentType'] | length"
guardrails:
  - "Do not deploy without validation"
  - "Do not modify production data"
```
