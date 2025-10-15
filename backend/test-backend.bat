@echo off
echo Testing Backend Connection...
echo.

REM Wait a moment for the backend to start
timeout /t 3 /nobreak >nul

echo Testing if backend is responding...
curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"test\"}"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Backend is responding! (Even if login fails, this means the server is running)
    echo You can now try logging in from the frontend.
) else (
    echo.
    echo Backend is not responding. Please check:
    echo 1. Backend is running (run run.bat)
    echo 2. MySQL is running
    echo 3. No firewall blocking port 8080
)

echo.
pause
