@echo off
echo.
echo ========================================
echo   Restaurant Menu System
echo ========================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npx http-server -p 8080 -c-1"

timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Opening browser...
timeout /t 2 /nobreak > nul
start http://localhost:8080

echo.
echo Close the server windows to stop.
echo.
pause
