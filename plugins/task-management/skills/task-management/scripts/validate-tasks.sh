#!/usr/bin/env bash
# validate-tasks.sh - Validate YAML task files
# Usage: ./validate-tasks.sh <tasks.yaml> [--fix] [--find] [--json]
#
# This script validates task schema, checks for missing fields,
# and optionally auto-fixes by adding empty defaults.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default mode
MODE="validate"
TASKS_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --fix)
      MODE="fix"
      shift
      ;;
    --find)
      MODE="find"
      shift
      ;;
    --json)
      MODE="json"
      shift
      ;;
    *)
      TASKS_FILE="$1"
      shift
      ;;
  esac
done

# Find tasks.yaml mode
if [[ "$MODE" == "find" ]]; then
  DIR="$(pwd)"
  while [[ "$DIR" != "/" ]]; do
    for candidate in "$DIR/tasks/tasks.yaml" "$DIR/tasks.yaml"; do
      if [[ -f "$candidate" ]]; then
        echo "$candidate"
        exit 0
      fi
    done
    DIR="$(dirname "$DIR")"
  done
  echo "Error: tasks.yaml not found" >&2
  exit 1
fi

# Validate file exists
if [[ -z "$TASKS_FILE" ]]; then
  echo "Usage: $0 <tasks.yaml> [--fix] [--find] [--json]" >&2
  exit 1
fi

if [[ ! -f "$TASKS_FILE" ]]; then
  echo "Error: File not found: $TASKS_FILE" >&2
  exit 1
fi

# Check for required tools
if ! command -v yq &> /dev/null; then
  echo "Error: yq is required. Install with: brew install yq" >&2
  exit 1
fi

# Count tasks
TOTAL=$(yq '.tasks | length' "$TASKS_FILE" 2>/dev/null || echo "0")
if [[ "$TOTAL" == "0" ]]; then
  echo "Error: No tasks found in $TASKS_FILE" >&2
  exit 1
fi

# Initialize counters
ERRORS=0
WARNINGS=0
FIXED=0

# JSON output - collect in temp file
JSON_TEMP=""
if [[ "$MODE" == "json" ]]; then
  JSON_TEMP=$(mktemp)
fi

# Validate each task
for i in $(seq 0 $((TOTAL - 1))); do
  TASK_ID=$(yq ".tasks[$i].id" "$TASKS_FILE" 2>/dev/null)
  TASK_TITLE=$(yq ".tasks[$i].title" "$TASKS_FILE" 2>/dev/null)
  
  # Check required fields
  for field in id title area status priority owner context source; do
    VALUE=$(yq ".tasks[$i].$field" "$TASKS_FILE" 2>/dev/null)
    if [[ "$VALUE" == "null" || -z "$VALUE" ]]; then
      if [[ "$MODE" == "json" ]]; then
        echo '  {"task":"'"$TASK_ID"'","field":"'"$field"'","type":"error","message":"Missing required field"},' >> "$JSON_TEMP"
      else
        echo -e "${RED}✗ [$TASK_ID] Missing required field: $field${NC}"
      fi
      ((ERRORS++))
    fi
  done
  
  # Check optional agent-execution fields
  for field in acceptanceCriteria complexity executionMode guardrails validationCommands requiredContext; do
    VALUE=$(yq ".tasks[$i].$field" "$TASKS_FILE" 2>/dev/null)
    if [[ "$VALUE" == "null" || -z "$VALUE" ]]; then
      if [[ "$MODE" == "fix" ]]; then
        # Auto-fix: add empty default
        case $field in
          acceptanceCriteria|guardrails|validationCommands|requiredContext)
            yq -i ".tasks[$i].$field = []" "$TASKS_FILE"
            ;;
          complexity)
            yq -i ".tasks[$i].$field = 5" "$TASKS_FILE"
            ;;
          executionMode)
            yq -i ".tasks[$i].$field = \"autonomous\"" "$TASKS_FILE"
            ;;
        esac
        ((FIXED++))
      elif [[ "$MODE" == "json" ]]; then
        echo '  {"task":"'"$TASK_ID"'","field":"'"$field"'","type":"warning","message":"Missing optional field"},' >> "$JSON_TEMP"
      else
        echo -e "${YELLOW}⚠ [$TASK_ID] Missing optional field: $field${NC}"
      fi
      ((WARNINGS++))
    fi
  done
  
  # Check blockedBy dependencies
  BLOCKED_BY=$(yq ".tasks[$i].blockedBy | length" "$TASKS_FILE" 2>/dev/null || echo "0")
  if [[ "$BLOCKED_BY" -gt 0 ]]; then
    STATUS=$(yq ".tasks[$i].status" "$TASKS_FILE" 2>/dev/null)
    if [[ "$STATUS" != "blocked" && "$STATUS" != "done" ]]; then
      for j in $(seq 0 $((BLOCKED_BY - 1))); do
        DEP_ID=$(yq ".tasks[$i].blockedBy[$j]" "$TASKS_FILE" 2>/dev/null)
        # Find dependency task
        DEP_INDEX=$(yq ".tasks | to_entries[] | select(.value.id == \"$DEP_ID\") | .key" "$TASKS_FILE" 2>/dev/null)
        if [[ -n "$DEP_INDEX" ]]; then
          DEP_STATUS=$(yq ".tasks[$DEP_INDEX].status" "$TASKS_FILE" 2>/dev/null)
          if [[ "$DEP_STATUS" != "done" ]]; then
            if [[ "$MODE" == "json" ]]; then
              echo '  {"task":"'"$TASK_ID"'","field":"blockedBy","type":"warning","message":"Dependency '"$DEP_ID"' is not done (status: '"$DEP_STATUS"')"},' >> "$JSON_TEMP"
            else
              echo -e "${YELLOW}⚠ [$TASK_ID] Dependency $DEP_ID is not done (status: $DEP_STATUS)${NC}"
            fi
            ((WARNINGS++))
          fi
        fi
      done
    fi
  fi
done

# Output summary
if [[ "$MODE" == "json" ]]; then
  # Remove trailing comma from tasks array and close JSON properly
  # Use temp file for final output
  JSON_FINAL=$(mktemp)
  echo '{"file":"'"$TASKS_FILE"'","tasks":[' > "$JSON_FINAL"
  # Remove trailing comma from collected tasks
  sed 's/,$//' "$JSON_TEMP" >> "$JSON_FINAL"
  echo '],"summary":{"total":'"$TOTAL"',"errors":'"$ERRORS"',"warnings":'"$WARNINGS"',"fixed":'"$FIXED"',"valid":'"$((ERRORS == 0))"'}}' >> "$JSON_FINAL"
  cat "$JSON_FINAL"
  rm -f "$JSON_TEMP" "$JSON_FINAL"
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [[ "$ERRORS" -eq 0 ]]; then
    echo -e "${GREEN}✓ Schema valid${NC} ($TOTAL tasks)"
  else
    echo -e "${RED}✗ Schema invalid${NC} ($ERRORS errors)"
  fi
  
  if [[ "$WARNINGS" -gt 0 ]]; then
    echo -e "${YELLOW}⚠ $WARNINGS warnings${NC} (missing optional fields)"
  fi
  
  if [[ "$FIXED" -gt 0 ]]; then
    echo -e "${GREEN}✓ Auto-fixed $FIXED fields${NC}"
  fi
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

# Exit with error code if there are errors
if [[ "$ERRORS" -gt 0 ]]; then
  exit 1
fi

exit 0
