@echo off
echo Starting Restaurant Menu System...
echo.

start "Backend Server" cmd /k "cd backend && node server.js"
timeout /t 2 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && python -m http.server 8080"

echo.
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:8080
echo.
echo Press any key to open website...
pause > nul
start http://localhost:8080
