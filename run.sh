#!/bin/bash
# ============================================================
# MultiSow - Single-Click Launcher (Mac/Linux)
# Run this file to start the application
# ============================================================

cd "$(dirname "$0")"

echo ""
echo "============================================================"
echo "   MultiSow - Multi-Tier Crop Management System"
echo "============================================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed!"
    echo "Please install Python 3.8+:"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "  macOS: brew install python3"
    exit 1
fi

# Check Docker for full-stack launch
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not available."
    echo "This launcher now starts the full project through Docker Compose."
    echo "Please install and start Docker, then run this launcher again."
    exit 1
fi

echo "[1/2] Starting full stack with Docker Compose..."
echo ""
echo "  Frontend:    http://localhost:3001"
echo "  Backend API: http://localhost:8001"
echo "  API Docs:    http://localhost:8001/docs"
echo ""
echo "  The database and supporting services will start automatically."
echo "  Press CTRL+C in the Docker Compose terminal to stop all services."
echo "============================================================"
echo ""

docker compose up --build &
COMPOSE_PID=$!

echo "[2/2] Waiting for backend API..."
while ! curl -s http://localhost:8001/health > /dev/null 2>&1; do
    sleep 2
done

echo "Server ready! Opening browser..."

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3001
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3001
    fi
fi

# Wait for Docker Compose to keep the script alive
wait $COMPOSE_PID
