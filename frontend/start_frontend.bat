@echo off
title CloudWise AI - Frontend (Vite Dev Server)
echo =========================================
echo  CloudWise AI - React Frontend (Port 5173)
echo =========================================
echo.

cd /d "%~dp0"

echo [1/2] Installing npm packages...
npm install --silent
echo [INFO] Packages ready.
echo.

echo [2/2] Starting Vite dev server on http://localhost:5173 ...
echo [INFO] Press Ctrl+C to stop
echo.
npm run dev

pause
