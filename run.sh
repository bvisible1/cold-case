#!/usr/bin/env bash
# Cold Case — bulletproof local run.
# Loads the key from .env, kills ANY stale instance, builds, and runs the jar
# directly so the key is guaranteed to reach the server process.
# Usage:  ./run.sh           (port 8081)
#         ./run.sh 8082

cd "$(dirname "$0")"

# 1. Load .env into the environment.
set -a
[ -f .env ] && source .env
set +a
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  ANTHROPIC_API_KEY is missing/empty in .env. Add it and re-run."
  exit 1
fi

PORT="${1:-8081}"

# 2. Kill anything stale: whatever holds the port, plus any lingering Cold Case JVMs.
echo "Stopping any old instances…"
lsof -ti :"$PORT" 2>/dev/null | xargs kill -9 2>/dev/null
pkill -f 'coldcase-.*\.jar' 2>/dev/null
pkill -f 'spring-boot:run'  2>/dev/null
sleep 1

# 3. Build the jar (picks up your latest edits).
echo "Building…"
mvn -q -DskipTests package || { echo "❌ Build failed."; exit 1; }

# 4. Run the jar directly — the key is inherited straight from this shell.
echo "Key loaded (${#ANTHROPIC_API_KEY} chars). Starting → http://localhost:$PORT"
exec java -jar target/coldcase-1.0.0.jar --server.port="$PORT"
