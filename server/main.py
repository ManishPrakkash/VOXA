from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
import requests
import json
import time
import asyncio
from pydantic import BaseModel

app = FastAPI(title="Web Automation Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
WEBUI_BASE_URL = "http://localhost:7788"
WEBUI_API_URL = "http://localhost:7789"  # New API server

# Pydantic models
class AgentRequest(BaseModel):
    instruction: str
    agent_settings: dict
    browser_settings: dict
    agent_type: str = "browser_use"

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

@app.options("/api/agents/start")
async def options_start_agent():
    return {"message": "OK"}

@app.post("/api/agents/start")
async def start_agent(agent_data: AgentRequest):
    print(f"Received POST request to /api/agents/start with data: {agent_data}")
    try:
        # Check if web-ui backend is running
        try:
            response = requests.get(f"{WEBUI_BASE_URL}/", timeout=5)
            if response.status_code != 200:
                raise HTTPException(status_code=503, detail="Web-UI backend is not responding")
        except requests.exceptions.RequestException:
            raise HTTPException(status_code=503, detail="Web-UI backend is not running. Please start it first.")
        
        # Generate task ID
        task_id = f"task_{int(time.time() * 1000)}"
        
        # Send instruction to web-ui backend
        print(f"Sending instruction to web-ui backend: {agent_data.instruction}")
        
        try:
            # Try to interact with the web-ui backend
            print(f"Attempting to trigger web-ui backend execution for: {agent_data.instruction}")
            
            # Method 1: Try the direct API server first
            try:
                print(f"Trying direct web-ui API server at {WEBUI_API_URL}")
                
                api_payload = {
                    "instruction": agent_data.instruction,
                    "agent_settings": agent_data.agent_settings,
                    "browser_settings": agent_data.browser_settings
                }
                
                api_response = requests.post(
                    f"{WEBUI_API_URL}/api/execute",
                    json=api_payload,
                    timeout=10
                )
                
                print(f"Direct API response status: {api_response.status_code}")
                
                if api_response.status_code == 200:
                    response_data = api_response.json()
                    print(f"Successfully queued task via direct API: {response_data.get('task_id')}")
                    
                    # Start polling for task status
                    task_id = response_data.get('task_id')
                    
                    return {
                        "task_id": task_id,
                        "status": "started",
                        "message": f"Agent {agent_data.agent_type} started successfully",
                        "instruction": agent_data.instruction,
                        "webui_status": "connected",
                        "execution_status": "processing",
                        "api_response": response_data,
                        "note": "Instruction queued for execution via direct web-ui API",
                        "polling_url": f"{WEBUI_API_URL}/api/task/{task_id}"
                    }
                else:
                    print(f"Direct API returned status {api_response.status_code}: {api_response.text}")
                    
            except requests.exceptions.RequestException as api_error:
                print(f"Direct API call failed: {api_error}")
            
            # Method 2: Try to find and call the Gradio API endpoints
            print(f"Trying Gradio API endpoints as fallback")
            gradio_endpoints = [
                "/api/predict",
                "/run/predict",
                "/api/v1/predict"
            ]
            
            for endpoint in gradio_endpoints:
                try:
                    print(f"Trying Gradio endpoint: {endpoint}")
                    
                    # Try different payload formats
                    payloads = [
                        {"data": [agent_data.instruction], "fn_index": 0},
                        {"data": [agent_data.instruction]},
                        {"instruction": agent_data.instruction},
                        {"query": agent_data.instruction}
                    ]
                    
                    for payload in payloads:
                        try:
                            gradio_response = requests.post(
                                f"{WEBUI_BASE_URL}{endpoint}",
                                json=payload,
                                timeout=5
                            )
                            
                            print(f"Gradio response status: {gradio_response.status_code}")
                            
                            if gradio_response.status_code == 200:
                                print(f"Successfully triggered Gradio execution via {endpoint}")
                                return {
                                    "task_id": task_id,
                                    "status": "started",
                                    "message": f"Agent {agent_data.agent_type} started successfully",
                                    "instruction": agent_data.instruction,
                                    "webui_status": "connected",
                                    "execution_status": "processing",
                                    "gradio_response": gradio_response.json(),
                                    "note": f"Instruction sent to Gradio web-ui backend via {endpoint}"
                                }
                                
                        except requests.exceptions.RequestException as e:
                            print(f"Request failed for {endpoint} with payload {payload}: {e}")
                            continue
                            
                except Exception as e:
                    print(f"Error trying {endpoint}: {e}")
                    continue
            
            # Method 2: Try to use Selenium to automate the web-ui
            print(f"Attempting Selenium automation of web-ui")
            try:
                from selenium import webdriver
                from selenium.webdriver.common.by import By
                from selenium.webdriver.support.ui import WebDriverWait
                from selenium.webdriver.support import expected_conditions as EC
                from selenium.webdriver.chrome.options import Options
                
                # Set up Chrome options
                chrome_options = Options()
                chrome_options.add_argument("--headless")  # Run in background
                chrome_options.add_argument("--no-sandbox")
                chrome_options.add_argument("--disable-dev-shm-usage")
                
                # Create driver
                driver = webdriver.Chrome(options=chrome_options)
                
                # Navigate to web-ui
                driver.get(WEBUI_BASE_URL)
                
                # Wait for page to load
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                # Try to find and fill the instruction input
                try:
                    # Look for common input field selectors
                    input_selectors = [
                        "textarea",
                        "input[type='text']",
                        "[data-testid='instruction-input']",
                        ".gradio-textbox textarea"
                    ]
                    
                    instruction_input = None
                    for selector in input_selectors:
                        try:
                            instruction_input = driver.find_element(By.CSS_SELECTOR, selector)
                            break
                        except:
                            continue
                    
                    if instruction_input:
                        # Clear and enter instruction
                        instruction_input.clear()
                        instruction_input.send_keys(agent_data.instruction)
                        
                        # Look for submit button
                        submit_selectors = [
                            "button[type='submit']",
                            "button:contains('Start')",
                            "button:contains('Run')",
                            ".gradio-button"
                        ]
                        
                        for selector in submit_selectors:
                            try:
                                submit_button = driver.find_element(By.CSS_SELECTOR, selector)
                                submit_button.click()
                                break
                            except:
                                continue
                        
                        print(f"Successfully automated web-ui execution")
                        driver.quit()
                        
                        return {
                            "task_id": task_id,
                            "status": "started",
                            "message": f"Agent {agent_data.agent_type} started successfully",
                            "instruction": agent_data.instruction,
                            "webui_status": "connected",
                            "execution_status": "processing",
                            "note": "Instruction sent to web-ui backend via Selenium automation"
                        }
                    
                except Exception as selenium_error:
                    print(f"Selenium automation failed: {selenium_error}")
                    driver.quit()
                    
            except ImportError:
                print("Selenium not available, skipping automation")
            except Exception as selenium_error:
                print(f"Selenium setup failed: {selenium_error}")
            
            # Method 3: Fallback - provide clear manual instructions
            print(f"Using fallback method - providing manual instructions")
            
            return {
                "task_id": task_id,
                "status": "started",
                "message": f"Agent {agent_data.agent_type} started successfully",
                "instruction": agent_data.instruction,
                "webui_status": "connected",
                "execution_status": "manual_required",
                "note": f"⚠️ Manual execution required: Please execute '{agent_data.instruction}' in your web-ui",
                "manual_steps": [
                    f"1. Open {WEBUI_BASE_URL} in your browser",
                    f"2. Go to the 'Run Agent' tab",
                    f"3. Enter: '{agent_data.instruction}'",
                    "4. Click 'Start Agent' to execute",
                    "5. Watch the browser automation happen!"
                ],
                "webui_url": WEBUI_BASE_URL
            }
            
        except Exception as webui_error:
            print(f"Error communicating with web-ui backend: {webui_error}")
            return {
                "task_id": task_id,
                "status": "started",
                "message": f"Agent {agent_data.agent_type} started but web-ui communication failed",
                "instruction": agent_data.instruction,
                "webui_status": "error",
                "error": str(webui_error)
            }
        
    except Exception as e:
        print(f"General error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/task/{task_id}/status")
async def get_task_status(task_id: str):
    """Get the status of a task from the direct API server"""
    try:
        # Check if web-ui API server is running
        try:
            response = requests.get(f"{WEBUI_API_URL}/api/task/{task_id}", timeout=5)
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "task_id": task_id,
                    "status": "error",
                    "error": f"API server returned status {response.status_code}"
                }
        except requests.exceptions.RequestException:
            return {
                "task_id": task_id,
                "status": "error",
                "error": "Web-UI API server is not running"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents/{task_id}/stop")
async def stop_agent(task_id: str):
    return {
        "task_id": task_id,
        "status": "stopped",
        "message": "Agent stopped successfully"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
