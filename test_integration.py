#!/usr/bin/env python3
"""
Test script to verify the integration between React frontend, Python server, and Web-UI backend
"""

import requests
import time
import json

def test_servers():
    print("🧪 Testing VOXA Integration...")
    print("=" * 50)
    
    # Test 1: Check React Frontend
    print("1. Testing React Frontend...")
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        if response.status_code == 200:
            print("   ✅ React Frontend is running on http://localhost:5174")
        else:
            print(f"   ❌ React Frontend returned status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ React Frontend is not running: {e}")
    
    # Test 2: Check Python Server
    print("\n2. Testing Python Server...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ Python Server is running on http://localhost:8000")
            print(f"   📊 Response: {response.json()}")
        else:
            print(f"   ❌ Python Server returned status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Python Server is not running: {e}")
    
    # Test 3: Check Web-UI Backend
    print("\n3. Testing Web-UI Backend...")
    try:
        response = requests.get("http://localhost:7788", timeout=5)
        if response.status_code == 200:
            print("   ✅ Web-UI Backend is running on http://localhost:7788")
        else:
            print(f"   ❌ Web-UI Backend returned status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Web-UI Backend is not running: {e}")
    
    # Test 4: Test Agent Start API
    print("\n4. Testing Agent Start API...")
    try:
        test_data = {
            "instruction": "Open Gmail and check my inbox",
            "agent_settings": {
                "llmProvider": "openai",
                "llmModelName": "gpt-4o",
                "llmTemperature": 0.6
            },
            "browser_settings": {
                "headless": False,
                "windowWidth": 1280,
                "windowHeight": 1100
            },
            "agent_type": "browser_use"
        }
        
        response = requests.post("http://localhost:8000/api/agents/start", 
                               json=test_data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Agent Start API is working")
            print(f"   📊 Task ID: {result.get('task_id')}")
            print(f"   📊 Status: {result.get('status')}")
            print(f"   📊 Message: {result.get('message')}")
        else:
            print(f"   ❌ Agent Start API returned status {response.status_code}")
            print(f"   📊 Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Agent Start API failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Integration Test Complete!")
    print("\n📋 Next Steps:")
    print("1. Open http://localhost:5174 in your browser")
    print("2. Go to the 'Run Agent' tab")
    print("3. Enter an instruction like 'Open Gmail'")
    print("4. Click 'Start Agent' to test the full workflow")

if __name__ == "__main__":
    test_servers()
