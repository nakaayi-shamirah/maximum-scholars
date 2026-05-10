@echo off
REM Start Backend and Frontend servers for Windows
REM This script starts both servers for LOCAL DEVELOPMENT
REM For Render deployment, see RENDER_DEPLOYMENT_GUIDE.md

echo.
echo ======================================================
echo 🚀 Starting Maximum Scholars Development Environment
echo ======================================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

REM Start backend in new window
echo 📦 Starting Backend Server...
start "Backend - Maximum Scholars" cmd /k "cd backend && npm install >nul 2>&1 && npm start"
timeout /t 3 /nobreak

REM Start frontend in new window
echo 📱 Starting Frontend Server...
start "Frontend - Maximum Scholars" cmd /k "cd frontend && npm install >nul 2>&1 && npm start"

echo.
echo ======================================================
echo 🎉 Development servers starting!
echo ======================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo 📚 Resources:
echo  - Setup Guide:         SETUP_GUIDE.md
echo  - API Integration:     API_INTEGRATION_GUIDE.md
echo  - Render Deployment:   RENDER_DEPLOYMENT_GUIDE.md
echo.
echo Two new windows will open for Backend and Frontend
echo Close either window to stop that server
echo ======================================================
echo.
pause
