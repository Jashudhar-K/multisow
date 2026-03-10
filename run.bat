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

REM Install Python dependencies
echo [1/3] Installing Python dependencies...
py -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

REM Check if Node.js is available (optional, for npx tools)
node --version >nul 2>&1
if errorlevel 1 (
    echo [NOTE] Node.js not found - starting backend only
    echo        Install Node.js to launch the new landing page experience
    echo.
    echo [2/3] Starting backend server...
    echo.
    echo   Application: http://localhost:8001/docs
    echo   API Docs:    http://localhost:8001/docs
    echo.
    echo   Press CTRL+C to stop the server
    echo ============================================================
    echo.
    py -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
    pause
    exit /b 0
)

if not exist node_modules (
    echo [2/5] Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install Node.js dependencies
        pause
        exit /b 1
    )
)

echo [3/5] Starting backend and landing page...
echo.
echo   Landing Page: http://localhost:3001
echo   App Pages:    http://localhost:3001/designer
echo   API Docs:    http://localhost:8001/docs
echo.
echo   Browser will open automatically when ready.
echo   Press CTRL+C to stop the server.
echo ============================================================
echo.

REM Start backend and landing page servers
start /b py -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
start /b npm run dev

REM Wait for backend and landing page to be ready, then open browser
echo [4/5] Waiting for backend API...
:waitloop
timeout /t 1 /nobreak >nul
py -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')" >nul 2>&1
if errorlevel 1 goto waitloop

echo [5/5] Waiting for landing page...
:waitlanding
timeout /t 1 /nobreak >nul
py -c "import urllib.request; urllib.request.urlopen('http://localhost:3001')" >nul 2>&1
if errorlevel 1 goto waitlanding

echo Services ready! Opening landing page...
start http://localhost:3001

REM Keep window open to show server logs
echo.
echo Server is running. Close this window to stop.
cmd /k
