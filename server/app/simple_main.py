from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os

app = FastAPI(title="Web Automation Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Web Automation Agent API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Server is healthy"}

@app.get("/api/status")
async def api_status():
    return {
        "status": "running",
        "version": "1.0.0",
        "services": {
            "browser_automation": "available",
            "websocket": "available",
            "file_upload": "available"
        }
    }

@app.get("/api/agents")
async def list_agents():
    return {
        "agents": [
            {
                "id": "browser_use",
                "name": "Browser Use Agent",
                "description": "Automate browser tasks with AI",
                "status": "available"
            },
            {
                "id": "deep_research",
                "name": "Deep Research Agent", 
                "description": "Perform deep research tasks",
                "status": "available"
            }
        ]
    }

@app.post("/api/agents/start")
async def start_agent(agent_data: dict):
    return {
        "task_id": "demo_task_123",
        "status": "started",
        "message": f"Agent {agent_data.get('agent_type', 'unknown')} started successfully"
    }

@app.get("/api/agents/{task_id}/status")
async def get_agent_status(task_id: str):
    return {
        "task_id": task_id,
        "status": "running",
        "progress": 50,
        "message": "Agent is processing your request"
    }

@app.post("/api/agents/{task_id}/stop")
async def stop_agent(task_id: str):
    return {
        "task_id": task_id,
        "status": "stopped",
        "message": "Agent stopped successfully"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
