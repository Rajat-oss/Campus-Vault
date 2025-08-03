@echo off
echo Starting development servers...

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd fronetend && npm run dev -- --port 3000"

echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
pause