@echo off
REM ============================================================
REM MultiSow - Single-Click Launcher
REM Double-click this file to start the application
REM ============================================================

cd /d "%~dp0"
echo.
echo ============================================================
echo    MultiSow - Multi-Tier Crop Management System
echo ============================================================
echo.

REM Check Python
py --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.8+ from https://www.python.org/
    echo.
    pause
    exit /b 1
)

REM Check Node.js (used for diagnostics and optional local fallback)
node --version >nul 2>&1
if errorlevel 1 (
    echo [NOTE] Node.js not found - Docker full-stack mode will still work, but local fallback is unavailable
)

REM Check Docker for full-stack launch
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not running.
    echo This launcher now starts the full project through Docker Compose.
    echo Please install and start Docker Desktop, then run this launcher again.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting full stack with Docker Compose...
echo.
echo   Frontend:    http://localhost:3001
echo   Backend API: http://localhost:8001
echo   API Docs:    http://localhost:8001/docs
echo.
echo   The database and supporting services will start automatically.
echo   Press CTRL+C in the Docker Compose window to stop all services.
echo ============================================================
echo.

start "MultiSow Full Stack" cmd /k docker compose up --build

echo [2/2] Waiting for backend API...
:waitloop
timeout /t 2 /nobreak >nul
py -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')" >nul 2>&1
if errorlevel 1 goto waitloop

echo Services ready! Opening application...
start http://localhost:3001

echo.
echo Full stack is running. Close the Docker Compose window to stop.
cmd /k
