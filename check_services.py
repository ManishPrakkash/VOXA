#!/usr/bin/env python3
"""
Quick status check for VOXA services
"""

import requests
import time

def check_service(name, url, timeout=5):
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            print(f"✅ {name}: Running on {url}")
            return True
        else:
            print(f"❌ {name}: Status {response.status_code} on {url}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {name}: Not running ({e})")
        return False

def main():
    print("🔍 Checking VOXA Services Status...")
    print("=" * 50)
    
    services = [
        ("Web-UI Backend", "http://127.0.0.1:7788"),
        ("Web-UI API Server", "http://127.0.0.1:7789"),
        ("Python Bridge Server", "http://localhost:8001"),
        ("React Frontend", "http://localhost:5174"),
    ]
    
    running_services = 0
    for name, url in services:
        if check_service(name, url):
            running_services += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Status: {running_services}/{len(services)} services running")
    
    if running_services == len(services):
        print("🎉 All services are running! You can now test the integration.")
        print("\n📋 Next steps:")
        print("1. Open http://localhost:5174 in your browser")
        print("2. Go to 'Run Agent' tab")
        print("3. Enter: 'Open Gmail'")
        print("4. Click 'Start Agent'")
    else:
        print("⚠️ Some services are not running. Please start them first.")
        print("\n🚀 To start all services:")
        print("Run: start_complete_system.bat")

if __name__ == "__main__":
    main()
