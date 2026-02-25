#!/usr/bin/env bash
# Starts the full rewards app stack: PostgreSQL + FastAPI backend + Vite frontend
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

export PATH="/usr/local/opt/postgresql@16/bin:$PATH"

# ── PostgreSQL ──────────────────────────────────────────────────────────────
echo "→ Starting PostgreSQL..."
brew services start postgresql@16 >/dev/null 2>&1 || true
sleep 2
createdb rewards_db 2>/dev/null && echo "  Created database 'rewards_db'." || echo "  Database 'rewards_db' already exists."

# ── Python venv + deps ──────────────────────────────────────────────────────
echo "→ Setting up Python environment..."
if [ ! -d "$BACKEND_DIR/.venv" ]; then
  python3 -m venv "$BACKEND_DIR/.venv"
  "$BACKEND_DIR/.venv/bin/pip" install -q -r "$BACKEND_DIR/requirements.txt"
fi

# ── Seed database ────────────────────────────────────────────────────────────
echo "→ Seeding rewards..."
(cd "$BACKEND_DIR" && .venv/bin/python3 -m app.seed)

# ── npm install ──────────────────────────────────────────────────────────────
echo "→ Installing frontend dependencies..."
(cd "$FRONTEND_DIR" && npm install --silent)

# ── Launch servers ───────────────────────────────────────────────────────────
echo ""
echo "✓ Backend  → http://localhost:8000"
echo "✓ Frontend → http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

(cd "$BACKEND_DIR" && .venv/bin/uvicorn app.main:app --reload --port 8000) &
BACKEND_PID=$!

(cd "$FRONTEND_DIR" && npm run dev -- --port 5173) &
FRONTEND_PID=$!

cleanup() {
  echo ""
  echo "Stopping servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM
wait
