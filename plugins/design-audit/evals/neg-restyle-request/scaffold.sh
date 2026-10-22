#!/usr/bin/env bash
# Copy the shared fixture pages into the eval workspace (the current directory).
set -euo pipefail
cp -R "$(dirname "$0")/../_fixture/." .
