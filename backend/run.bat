@echo off
echo Starting Net Banking Backend...
echo.

REM Check if dependencies exist
if not exist "lib" (
    echo Dependencies not found. Please run download-deps.bat first.
    echo.
    pause
    exit /b 1
)

echo Please make sure MySQL is running with these credentials:
echo   Database: netbanking
echo   Username: root
echo   Password: Ananth.2003
echo.
echo If MySQL is not installed, please:
echo 1. Install MySQL 8.0 from: https://dev.mysql.com/downloads/mysql/
echo 2. Create database 'netbanking'
echo 3. Ensure MySQL service is running
echo.
echo Starting Spring Boot application...
echo.

REM Run with Java using the compiled classes and downloaded dependencies
java -cp "target/classes;lib/*" com.netbanking.NetBankingApplication

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to start the application. Please check:
    echo 1. MySQL is running and accessible
    echo 2. Database 'netbanking' exists
    echo 3. All dependencies are downloaded
    echo.
    echo You can also try running: download-deps.bat
)

pause
