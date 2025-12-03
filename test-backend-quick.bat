@echo off
echo Testing Railway Backend...
echo.
timeout /t 3 /nobreak >nul
node check-backend.js
echo.
echo If you see JSON responses above, backend is WORKING!
pause
