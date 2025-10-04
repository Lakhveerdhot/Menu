@echo off
echo.
echo 🚀 Starting Restaurant Menu System...
echo.

start /B cmd /c "cd backend && node server.js" 2>nul
timeout /t 3 /nobreak > nul
start /B cmd /c "cd frontend && npx http-server -p 8080 -c-1" 2>nul
timeout /t 2 /nobreak > nul

echo ✅ Backend running on: http://localhost:5000
echo ✅ Frontend running on: http://localhost:8080
echo.
echo 🌐 Open this link: http://localhost:8080
echo.
echo Press Ctrl+C to stop servers
echo.

pause
