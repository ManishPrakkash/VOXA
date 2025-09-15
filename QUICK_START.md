# 🚀 Quick Start Guide

## Step-by-Step Instructions

### 1. Start Your Web-UI Backend (MOST IMPORTANT)

Open **Terminal 1** and run:
```bash
cd web-ui
.venv\Scripts\activate
python webui.py --ip 127.0.0.1 --port 7788
```

Wait for it to show: "Running on local URL: http://127.0.0.1:7788"

### 2. Start the React Frontend

Open **Terminal 2** and run:
```bash
cd voxa
npm install
npm run dev
```

Wait for it to show: "Local: http://localhost:5173/"

### 3. Start the Python Server (Optional)

Open **Terminal 3** and run:
```bash
cd server
py -m pip install -r requirements.txt
py main.py
```

Wait for it to show: "Uvicorn running on http://0.0.0.0:8000"

## 🎯 Access Your Application

- **React Frontend**: http://localhost:5173
- **Your Web-UI Backend**: http://localhost:7788
- **Python Server**: http://localhost:8000

## 🔧 Alternative: Use the Startup Script

Instead of manual steps, you can run:
```bash
start_dev.bat
```

This will start the React frontend and Python server automatically, but you still need to start the web-ui backend manually.

## ❗ Important Notes

1. **Web-UI Backend MUST be running first** - this is your main backend with Gemini API
2. **React Frontend** - this is your new modern UI
3. **Python Server** - this is just a simple API layer (optional)

## 🐛 Troubleshooting

### If npm run dev fails:
```bash
cd voxa
npm install
npm run dev
```

### If Python server fails:
```bash
cd server
py -m pip install -r requirements.txt
py main.py
```

### If web-ui fails:
```bash
cd web-ui
.venv\Scripts\activate
python webui.py --ip 127.0.0.1 --port 7788
```

## ✅ Success Indicators

- Web-UI Backend: "Running on local URL: http://127.0.0.1:7788"
- React Frontend: "Local: http://localhost:5173/"
- Python Server: "Uvicorn running on http://0.0.0.0:8000"

All three should be running for full functionality!
