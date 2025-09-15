# Web Automation Agent API Server

This is the FastAPI backend server for the Web Automation Agent system. It provides REST APIs and WebSocket endpoints for controlling browser automation agents.

## Features

- **REST API**: Start, stop, pause, resume agent tasks
- **WebSocket Streaming**: Real-time updates from running agents
- **Agent Support**: Browser automation and deep research agents
- **Task Management**: Track and manage multiple concurrent tasks
- **Media Upload**: Support for audio file uploads (with transcription placeholder)

## API Endpoints

### Agent Management
- `POST /api/agent/start` - Start a new agent task
- `GET /api/agent/status/{task_id}` - Get task status
- `POST /api/agent/pause/{task_id}` - Pause a task
- `POST /api/agent/resume/{task_id}` - Resume a task
- `POST /api/agent/stop/{task_id}` - Stop a task
- `GET /api/agent/tasks` - List all tasks
- `GET /api/agent/history/{task_id}` - Get task history

### Media
- `POST /api/media/upload` - Upload audio files

### WebSocket
- `WS /ws/agent/{task_id}` - Real-time agent updates

## Quick Start

### Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python run.py
```

3. Access the API documentation at: http://localhost:8000/docs

### Docker

1. Build the image:
```bash
docker build -t web-automation-agent-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 web-automation-agent-api
```

## Configuration

The server can be configured using environment variables:

- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `RELOAD`: Enable auto-reload for development (default: true)

## Agent Types

### Browser Use Agent
Automates web browsers using Playwright. Supports:
- Web navigation and interaction
- Screenshot capture
- Form filling and clicking
- Custom browser configurations

### Deep Research Agent
Performs comprehensive research tasks:
- Multi-step research planning
- Parallel web searches
- Information synthesis
- Report generation

## WebSocket Protocol

The WebSocket endpoint streams real-time updates in JSON format:

```json
{
  "type": "status|message|screenshot|error",
  "content": "Update content",
  "timestamp": "2024-01-01T00:00:00Z",
  "task_id": "uuid"
}
```

## Integration with React Frontend

This server is designed to work with the React frontend client. The frontend:
1. Sends task requests via REST API
2. Connects to WebSocket for real-time updates
3. Displays agent progress and results
4. Provides controls for task management

## Development Notes

- The server uses asyncio for concurrent task execution
- Browser automation requires Playwright with system dependencies
- Task state is managed in-memory (can be extended to use databases)
- WebSocket connections are managed per task for real-time updates

