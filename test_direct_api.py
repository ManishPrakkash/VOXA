#!/usr/bin/env python3
"""
Test script for VOXA Direct API Integration
"""

import requests
import time
import json

def test_direct_api():
    """Test the direct API server"""
    print("🧪 Testing VOXA Direct API Integration")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing Direct API Health Check...")
    try:
        response = requests.get("http://127.0.0.1:7789/health", timeout=5)
        if response.status_code == 200:
            print("✅ Direct API Server is running")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Direct API Server returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Direct API Server is not running: {e}")
        return False
    
    # Test 2: Execute instruction
    print("\n2. Testing Instruction Execution...")
    test_instruction = "Open Google and search for 'browser automation'"
    
    try:
        payload = {
            "instruction": test_instruction,
            "agent_settings": {
                "llmProvider": "google",
                "llmModelName": "gemini-2.0-flash",
                "llmTemperature": 0.6,
                "maxSteps": 10,
                "maxActions": 5,
                "useVision": True
            },
            "browser_settings": {
                "headless": False,
                "windowWidth": 1280,
                "windowHeight": 1100,
                "keepBrowserOpen": True
            }
        }
        
        print(f"   Sending instruction: '{test_instruction}'")
        response = requests.post("http://127.0.0.1:7789/api/execute", json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Instruction queued successfully")
            print(f"   Task ID: {result.get('task_id')}")
            print(f"   Status: {result.get('status')}")
            
            # Test 3: Poll task status
            task_id = result.get('task_id')
            if task_id:
                print(f"\n3. Polling Task Status for {task_id}...")
                
                for attempt in range(5):  # Poll 5 times
                    time.sleep(3)
                    try:
                        status_response = requests.get(f"http://127.0.0.1:7789/api/task/{task_id}", timeout=5)
                        if status_response.status_code == 200:
                            status_data = status_response.json()
                            print(f"   Attempt {attempt + 1}: {status_data.get('status')} - {status_data.get('progress', 'No progress info')}")
                            
                            if status_data.get('status') in ['completed', 'error']:
                                print(f"   Final status: {status_data.get('status')}")
                                if status_data.get('result'):
                                    print(f"   Result: {status_data.get('result')}")
                                if status_data.get('error'):
                                    print(f"   Error: {status_data.get('error')}")
                                break
                        else:
                            print(f"   Status check failed: {status_response.status_code}")
                    except requests.exceptions.RequestException as e:
                        print(f"   Status check error: {e}")
            
            return True
        else:
            print(f"❌ Instruction execution failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Instruction execution error: {e}")
        return False

def test_python_bridge():
    """Test the Python bridge server"""
    print("\n4. Testing Python Bridge Server...")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            print("✅ Python Bridge Server is running")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Python Bridge Server returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Python Bridge Server is not running: {e}")
        return False

def test_react_frontend():
    """Test the React frontend"""
    print("\n5. Testing React Frontend...")
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        if response.status_code == 200:
            print("✅ React Frontend is running")
            return True
        else:
            print(f"❌ React Frontend returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ React Frontend is not running: {e}")
        return False

def main():
    print("🚀 VOXA Direct API Integration Test")
    print("This test verifies that all components are working together")
    print("=" * 60)
    
    # Test all components
    tests = [
        ("Direct API Server", test_direct_api),
        ("Python Bridge Server", test_python_bridge),
        ("React Frontend", test_react_frontend)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Your VOXA system is working correctly.")
        print("\n📋 Next steps:")
        print("1. Open http://localhost:5174 in your browser")
        print("2. Go to 'Run Agent' tab")
        print("3. Enter: 'Open Gmail'")
        print("4. Click 'Start Agent'")
        print("5. Watch the browser automation happen!")
    else:
        print("\n⚠️ Some tests failed. Please check the services:")
        print("1. Make sure all services are running")
        print("2. Check for error messages in terminal windows")
        print("3. Verify API keys and settings")

if __name__ == "__main__":
    main()
