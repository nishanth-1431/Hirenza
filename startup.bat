@echo off
title Hirenza Startup Script
echo ========================================================
echo                 Hirenza Startup Script
echo ========================================================
echo.

echo [1] Checking MySQL Service...
sc query MySQL80 | find "RUNNING" >nul
if "%ERRORLEVEL%"=="1" (
    echo Attempting to start MySQL80 service...
    net start MySQL80 2>nul
    if "%ERRORLEVEL%"=="5" (
        echo [WARNING] Access denied. Please run this script as Administrator if MySQL is not already running.
    )
) else (
    echo MySQL is running.
)
echo.

echo [2] Checking Ollama Service...
curl -s http://localhost:11434/api/tags >nul
if "%ERRORLEVEL%" NEQ "0" (
    echo [WARNING] Ollama is not responding on http://localhost:11434. 
    echo Please make sure Ollama is running for AI features to work.
) else (
    echo Ollama is running.
)
echo.

echo [3] Starting Spring Boot Backend...
start "Hirenza Backend" cmd /k "mvn spring-boot:run"
echo Backend starting in a new window...
echo.

echo [4] Starting React Frontend...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
start "Hirenza Frontend" cmd /k "npm run dev"
cd ..
echo Frontend starting in a new window...
echo.

echo Waiting for services to start...
timeout /t 8 /nobreak >nul

echo [5] Opening Application in Browser...
start http://localhost:5173

echo.
echo ========================================================
echo Startup Complete!
echo - Backend is running in a separate window (Port 8081).
echo - Frontend is running in a separate window (Port 5173).
echo.
echo Please leave the two command prompt windows open.
echo Close them when you want to stop the application.
echo ========================================================
pause
