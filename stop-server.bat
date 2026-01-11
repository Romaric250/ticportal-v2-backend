@echo off
REM Stop TIC Portal server on Windows

echo Stopping TIC Portal server...

REM Kill all Node.js processes
taskkill /F /IM node.exe 2>nul

if %ERRORLEVEL% EQU 0 (
    echo Server stopped successfully!    taskkill /F /IM node.exe && npm run dev
) else (
    echo No server running or already stopped
)

pause
