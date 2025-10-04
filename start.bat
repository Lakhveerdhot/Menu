@echo off
echo Starting Restaurant Menu System...
echo.

start "Backend Server" cmd /k "cd backend && node server.js"
timeout /t 2 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npx http-server -p 8080 -c-1"

echo.
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:8080
echo.
echo Press Ctrl+C to stop servers
