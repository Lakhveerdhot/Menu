# Restaurant Menu System Startup Script
Write-Host "`n🚀 Starting Restaurant Menu System...`n" -ForegroundColor Green

# Start Backend in background
Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; node server.js"

# Wait 3 seconds for backend to start
Start-Sleep -Seconds 3

# Start Frontend in background
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npx http-server -p 8080 -c-1"

# Wait 2 seconds
Start-Sleep -Seconds 2

Write-Host "`n✅ Servers Started Successfully!`n" -ForegroundColor Green
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "`n🌐 Opening browser..." -ForegroundColor Cyan

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:8080"

Write-Host "`n✅ All Done! Close the server windows to stop.`n" -ForegroundColor Green
