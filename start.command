#!/usr/bin/env bash
# ==============================================================================
# Aplx Web — macOS launcher
# Double-click this file in Finder to start Aplx in your default browser.
# (If macOS blocks it: right-click -> Open, or run once with: bash start.command)
# ==============================================================================
set -u

cd "$(dirname "$0")"

echo ""
echo " ============================================"
echo "   Aplx Web - starting up..."
echo " ============================================"
echo ""

# ---- Check for Node.js ----
if ! command -v node >/dev/null 2>&1; then
    echo " [X] Node.js is not installed."
    echo ""
    echo "     Please install Node.js 18 or newer:"
    echo "       brew install node   (or https://nodejs.org)"
    echo ""
    read -r -p "Press Enter to close..."
    exit 1
fi
echo " [OK] Node.js found: $(node --version)"

# ---- Install dependencies on first run ----
if [ ! -d node_modules ]; then
    echo " [*] First run - installing dependencies (this can take a minute)..."
    echo ""
    if ! npm install; then
        echo ""
        echo " [X] npm install failed. Check your internet connection and try again."
        read -r -p "Press Enter to close..."
        exit 1
    fi
    echo ""
    echo " [OK] Dependencies installed."
else
    echo " [OK] Dependencies already installed."
fi

# ---- Free port 3000 if a stale server is holding it ----
STALE_PIDS=""
if command -v lsof >/dev/null 2>&1; then
    STALE_PIDS=$(lsof -ti tcp:3000 2>/dev/null || true)
fi
if [ -n "$STALE_PIDS" ]; then
    echo " [*] Port 3000 was in use - stopping the old server..."
    echo "$STALE_PIDS" | xargs kill -9 2>/dev/null
    sleep 1
fi

# ---- Start server ----
echo " [OK] Starting server..."
npm run dev > aplx-server.log 2>&1 &
SERVER_PID=$!

# Make sure the server dies when this window closes
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM

# ---- Wait for the server to answer ----
CODE="000"
ATTEMPT=0
while [ "$ATTEMPT" -lt 30 ]; do
    if command -v curl >/dev/null 2>&1; then
        CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 http://localhost:3000 2>/dev/null || true)
    else
        CODE="200"  # no curl available: assume it is up after the first wait
    fi
    [ "$CODE" = "200" ] && break
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ "$CODE" != "200" ]; then
    echo " [X] Server did not start in time. See aplx-server.log for details."
    read -r -p "Press Enter to close..."
    exit 1
fi

echo " [OK] Server is live at http://localhost:3000"

# ---- Open in the default browser ----
open "http://localhost:3000"

echo ""
echo " ============================================"
echo "   Aplx Web is running."
echo "   Keep this window open."
echo "   Press Ctrl+C to stop the server."
echo " ============================================"
echo ""

wait "$SERVER_PID"
