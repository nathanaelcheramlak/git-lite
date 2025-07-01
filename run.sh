set -e # Exit early is any command fails

exec bun run $(dirname $0)/src/main.ts "$@"