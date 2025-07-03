#!/usr/bin/env bash
set -e

# # Absolute path of this script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# # User's current working directory
# USER_CWD="$(pwd)"

# echo "Script is located at: $SCRIPT_DIR"
# echo "User invoked this from: $USER_CWD"

exec bun run "$SCRIPT_DIR/src/main.ts" "$@"
