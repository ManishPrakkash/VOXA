@echo off
echo ========================================
echo    VOXA Complete System Startup
echo ========================================
echo.

call check_ports.bat

echo [STEP 1/4] Starting Web-UI Backend...
echo This is your main backend with Gemini API
echo.
start "Web-UI Backend" cmd /k "cd web-ui && .venv\Scripts\activate && python webui.py --ip 127.0.0.1 --port 7788"
echo Web-UI Backend starting on http://127.0.0.1:7788
echo.

echo [STEP 2/4] Starting Web-UI Direct API Server...
echo This provides direct API access to browser automation functions
echo.
timeout /t 5 /nobreak >nul
start "Web-UI Direct API Server" cmd /k "cd web-ui && .venv\Scripts\activate && python direct_api_server.py"
echo Web-UI API Server starting on http://127.0.0.1:7789
echo.

echo [STEP 3/4] Starting Python Bridge Server...
echo This bridges frontend to web-ui backend
echo.
timeout /t 3 /nobreak >nul
start "Python Bridge Server" cmd /k "cd server && .venv\Scripts\activate && python main.py"
echo Python Bridge Server starting on http://localhost:8001
echo.

echo [STEP 4/4] Starting React Frontend...
echo This is your modern UI interface
echo.
timeout /t 3 /nobreak >nul
start "React Frontend" cmd /k "cd voxa && npm run dev"
echo React Frontend starting on http://localhost:5174
echo.

echo ========================================
echo    All Services Starting...
echo ========================================
echo.
echo Web-UI Backend:     http://127.0.0.1:7788
echo Web-UI API Server:  http://127.0.0.1:7789
echo Python Bridge:      http://localhost:8001
echo React Frontend:     http://localhost:5174
echo.
echo Wait for all services to fully start, then:
echo 1. Open http://localhost:5174 in your browser
echo 2. Go to "Run Agent" tab
echo 3. Enter instruction like "Open Gmail"
echo 4. Click "Start Agent"
echo 5. Watch the browser automation happen!
echo.
echo Press any key to exit...
pause >nul
