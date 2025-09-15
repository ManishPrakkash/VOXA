@echo off
echo Checking if ports are available...

echo Checking port 7788 (Web-UI Backend)...
netstat -ano | findstr :7788 >nul
if %errorlevel% == 0 (
    echo ❌ Port 7788 is already in use
    echo Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7788 ^| findstr LISTENING') do taskkill /PID %%a /F
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ Port 7788 is available
)

echo Checking port 7789 (Web-UI API Server)...
netstat -ano | findstr :7789 >nul
if %errorlevel% == 0 (
    echo ❌ Port 7789 is already in use
    echo Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7789 ^| findstr LISTENING') do taskkill /PID %%a /F
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ Port 7789 is available
)

echo Checking port 8001 (Python Bridge Server)...
netstat -ano | findstr :8001 >nul
if %errorlevel% == 0 (
    echo ❌ Port 8001 is already in use
    echo Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do taskkill /PID %%a /F
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ Port 8001 is available
)

echo Checking port 5174 (React Frontend)...
netstat -ano | findstr :5174 >nul
if %errorlevel% == 0 (
    echo ❌ Port 5174 is already in use
    echo Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174 ^| findstr LISTENING') do taskkill /PID %%a /F
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ Port 5174 is available
)

echo.
echo All ports checked. Starting services...
echo.

