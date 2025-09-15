# VOXA - Voice Web Automation

A modern React frontend that replicates and enhances the functionality of your existing Gradio WebUI for browser automation with AI assistance.

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for web-ui backend)
- **Node.js 16+** (for React frontend)
- **Your existing web-ui** (working with Gemini API)

### 1. Start Your Web-UI Backend

First, make sure your existing web-ui is running:

```bash
cd web-ui
.venv\Scripts\activate
python webui.py --ip 127.0.0.1 --port 7788
```

### 2. Start the React Frontend

Run the development startup script:

```bash
start_dev.bat
```

This will:
- Install React dependencies
- Install Python server dependencies  
- Start both the React frontend (port 5173) and Python server (port 8000)

### 3. Access the Application

- **React Frontend**: http://localhost:5173
- **Python Server**: http://localhost:8000
- **Web-UI Backend**: http://localhost:7788 (your existing Gradio UI)

## 📁 Project Structure

```
VOXA(Voice Web Automation)/
├── web-ui/                 # Your existing working Gradio UI
│   ├── src/
│   ├── webui.py
│   └── requirements.txt
├── voxa/                   # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # State Management
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── server/                 # Simple Python Server
│   ├── main.py
│   └── requirements.txt
└── start_dev.bat          # Development startup script
```

## 🎯 Features

### React Frontend (voxa/)

- **🤖 Agent Settings**: Configure LLM providers, models, temperature, and other parameters
- **🌐 Browser Settings**: Configure browser behavior, window size, file paths
- **▶️ Run Agent**: Interactive chat interface for running browser automation tasks
- **🎁 Agent Marketplace**: Discover and use specialized agents
- **💾 Load & Save Config**: Manage configuration presets

### Key Components

1. **AgentSettingsTab**: Replicates your Gradio agent settings with modern UI
2. **BrowserSettingsTab**: Browser configuration matching your web-ui
3. **RunAgentTab**: Chat interface for agent interaction
4. **AgentMarketplaceTab**: Showcase of available agents
5. **LoadSaveConfigTab**: Configuration management

## 🔧 Development

### Frontend Development

```bash
cd voxa
npm install
npm run dev
```

### Backend Development

```bash
cd server
py -m pip install -r requirements.txt
py main.py
```

### Manual Setup

If you prefer to run components separately:

1. **Start Web-UI Backend**:
   ```bash
   cd web-ui
   .venv\Scripts\activate
   python webui.py --ip 127.0.0.1 --port 7788
   ```

2. **Start Python Server**:
   ```bash
   cd server
   py main.py
   ```

3. **Start React Frontend**:
   ```bash
   cd voxa
   npm run dev
   ```

## 🎨 UI/UX Features

- **Dark Mode**: Automatic dark theme matching your Gradio UI
- **Responsive Design**: Works on desktop and mobile
- **Real-time Chat**: Interactive agent communication
- **Configuration Management**: Save/load settings
- **Modern Components**: Built with Chakra UI for consistency

## 🔌 Integration

The React frontend is designed to work with your existing web-ui backend:

- **API Communication**: Connects to your Gradio web-ui on port 7788
- **State Management**: WebUIManager context handles all state
- **Real-time Updates**: WebSocket support for live agent updates
- **Configuration Sync**: Settings sync with your web-ui

## 📋 Configuration

### Frontend Configuration

Edit `voxa/src/context/WebUIManager.jsx` to modify:
- API endpoints
- Default settings
- Agent configurations

### Backend Configuration

The Python server (`server/main.py`) provides:
- CORS support for frontend
- API endpoints for agent control
- Health checks and status monitoring

## 🚀 Production Deployment

### Build Frontend

```bash
cd voxa
npm run build
```

### Deploy

1. Serve the built frontend from a web server
2. Run the Python server as a service
3. Ensure your web-ui backend is accessible

## 🛠️ Technologies

- **Frontend**: React 19, Chakra UI, Axios, React Icons
- **Backend**: FastAPI, Uvicorn
- **Integration**: WebSocket, REST API
- **Development**: Vite, ESLint

## 📝 Notes

- The React frontend replicates your Gradio UI functionality
- All settings and configurations match your web-ui structure
- The Python server provides a simple API layer
- Your existing web-ui with Gemini API integration remains unchanged
- The frontend can be customized to match your specific needs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of your VOXA Voice Web Automation system.