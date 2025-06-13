@echo off

REM Install dependencies in IntegrationTests folder
call npm install
if errorlevel 1 (
    echo npm install failed!
    pause
    exit /b %errorlevel%
)

REM Change to root folder
cd ..\

REM Start DynamoDB in Docker
start "docker_dynamodb" cmd /c "docker compose up dynamodb"
timeout /t 5 /nobreak

REM Change to backend folder and start backend
cd backend
start "backend" cmd /c "node local.js"
timeout /t 2 /nobreak

REM Change back to IntegrationTests folder
cd ..\IntegrationTests

REM Run integration tests in current window (so you see results)
call npm run test
set TEST_RESULT=%ERRORLEVEL%

timeout /t 5 /nobreak

REM stop backend
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3001" ^| find "LISTENING"') do taskkill /PID %%a /F

REM Change back to root folder
cd ..\

REM Stop docker dynamodb containers
docker compose down

REM Show test result and pause
if %TEST_RESULT%==0 (
    echo.
    echo ===========================
    echo        TESTS PASSED
    echo ===========================
) else (
    echo.
    echo ===========================
    echo        TESTS FAILED
    echo ===========================
)

exit /b %TEST_RESULT%
