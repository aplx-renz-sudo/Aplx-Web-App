#!/usr/bin/env bash
# Aplx Web launcher — double-click (macOS/Linux) or run: ./start.sh
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
    echo "       - macOS:  brew install node   (or https://nodejs.org)"
    echo "       - Linux:  your package manager, or https://nodejs.org"
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
elif command -v fuser >/dev/null 2>&1; then
    STALE_PIDS=$(fuser 3000/tcp 2>/dev/null || true)
fi
if [ -z "$STALE_PIDS" ] && command -v pkill >/dev/null 2>&1; then
    pkill -f 'vite --host 0.0.0.0 --port 3000' 2>/dev/null && STALE_PIDS="killed"
fi
if [ -n "$STALE_PIDS" ]; then
    echo " [*] Port 3000 was in use - stopping the old server..."
    [ "$STALE_PIDS" != "killed" ] && echo "$STALE_PIDS" | xargs kill -9 2>/dev/null
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
    elif command -v wget >/dev/null 2>&1; then
        if wget -q -O /dev/null --timeout=2 http://localhost:3000 2>/dev/null; then CODE="200"; else CODE="000"; fi
    else
        CODE="200"  # no curl/wget available: assume it is up after the first wait
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
if command -v open >/dev/null 2>&1; then
    open "http://localhost:3000"                                    # macOS
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000" >/dev/null 2>&1 || true        # Linux
else
    echo " [i] Open http://localhost:3000 in your browser."
fi

echo ""
echo " ============================================"
echo "   Aplx Web is running."
echo "   Keep this window open."
echo "   Press Ctrl+C to stop the server."
echo " ============================================"
echo ""

wait "$SERVER_PID"
