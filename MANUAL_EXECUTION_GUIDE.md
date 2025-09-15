# 🚀 VOXA Manual Execution Guide

## When Links Don't Work - Manual Steps

If the automatic integration isn't working, here's how to manually execute browser automation:

### Step 1: Start All Services

Run this command to start everything:
```bash
start_complete_system.bat
```

Or start manually:
1. **Web-UI Backend**: `cd web-ui && .venv\Scripts\activate && python webui.py --ip 127.0.0.1 --port 7788`
2. **Web-UI API**: `cd web-ui && .venv\Scripts\activate && python api_server.py`
3. **Python Bridge**: `cd server && .venv\Scripts\activate && python main.py`
4. **React Frontend**: `cd voxa && npm run dev`

### Step 2: Check Service Status

Run this to verify all services are running:
```bash
python check_services.py
```

### Step 3: Manual Execution (If Automatic Fails)

1. **Open Web-UI Backend**: http://127.0.0.1:7788
2. **Go to "Run Agent" tab**
3. **Enter your instruction**: e.g., "Open Gmail"
4. **Click "Start Agent"**
5. **Watch browser automation happen!**

### Step 4: Test React Frontend

1. **Open React Frontend**: http://localhost:5174
2. **Go to "Run Agent" tab**
3. **Enter instruction**: e.g., "Open Gmail"
4. **Click "Start Agent"**
5. **If manual required**: Click the "🔗 Open Web-UI Backend →" link
6. **Execute in Web-UI**: Follow the manual steps

## 🔧 Troubleshooting

### Service Not Running?
- Check if ports are available
- Make sure virtual environments are activated
- Check for error messages in terminals

### Links Not Working?
- Copy and paste URLs manually
- Check if services are actually running
- Try different browsers

### Browser Automation Not Working?
- Make sure Gemini API key is set
- Check web-ui backend logs
- Verify browser settings

## 📞 Quick Fixes

### Restart Everything:
```bash
# Stop all terminals (Ctrl+C)
# Then run:
start_complete_system.bat
```

### Check Logs:
- Look at terminal outputs for error messages
- Check browser console (F12) for frontend errors
- Check Python server logs for backend errors

### Manual URLs:
- Web-UI: http://127.0.0.1:7788
- React Frontend: http://localhost:5174
- Python Server: http://localhost:8000
- Web-UI API: http://127.0.0.1:7789

