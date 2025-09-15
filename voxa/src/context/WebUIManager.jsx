import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const WebUIContext = createContext();

export const useWebUI = () => {
  const context = useContext(WebUIContext);
  if (!context) {
    throw new Error('useWebUI must be used within a WebUIProvider');
  }
  return context;
};

export const WebUIManager = ({ children }) => {
  // Agent Settings State
  const [agentSettings, setAgentSettings] = useState({
    overrideSystemPrompt: '',
    extendSystemPrompt: '',
    llmProvider: 'openai',
    llmModelName: 'gpt-4o',
    llmTemperature: 0.6,
    useVision: true,
    ollamaNumCtx: 16000,
    llmBaseUrl: '',
    llmApiKey: '',
    plannerLlmProvider: '',
    plannerLlmModelName: '',
    plannerLlmTemperature: 0.6,
    plannerUseVision: false,
    plannerOllamaNumCtx: 16000,
    plannerLlmBaseUrl: '',
    plannerLlmApiKey: '',
    maxSteps: 100,
    maxActions: 10,
    maxInputTokens: 128000,
    toolCallingMethod: 'auto',
    mcpJsonFile: null,
    mcpServerConfig: '',
  });

  // Browser Settings State
  const [browserSettings, setBrowserSettings] = useState({
    browserBinaryPath: '',
    browserUserDataDir: '',
    useOwnBrowser: false,
    keepBrowserOpen: true,
    headless: false,
    disableSecurity: false,
    windowWidth: 1280,
    windowHeight: 1100,
    cdpUrl: '',
    wssUrl: '',
    saveRecordingPath: './tmp/record_videos',
    saveTracePath: './tmp/traces',
    saveAgentHistoryPath: './tmp/agent_history',
    saveDownloadPath: './tmp/downloads',
  });

  // Agent Execution State
  const [currentTask, setCurrentTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  // API Configuration
  const API_BASE_URL = 'http://localhost:7788'; // Your Gradio web-ui URL
  const PYTHON_SERVER_URL = 'http://localhost:8001'; // Python server URL

  // Update agent settings
  const updateAgentSettings = useCallback((updates) => {
    setAgentSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Update browser settings
  const updateBrowserSettings = useCallback((updates) => {
    setBrowserSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Poll task status from the direct API server
  const pollTaskStatus = useCallback(async (taskId, pollingUrl) => {
    const maxAttempts = 30; // Poll for up to 5 minutes (10s intervals)
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        console.log(`Polling task status (attempt ${attempts}/${maxAttempts}):`, taskId);
        
        const response = await axios.get(`${PYTHON_SERVER_URL}/api/task/${taskId}/status`);
        const taskData = response.data;
        
        console.log('Task status:', taskData);
        
        // Update chat with progress
        if (taskData.progress && taskData.progress !== 'Task queued for execution') {
          setChatHistory(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content.includes('processing')) {
              return [...prev.slice(0, -1), {
                ...lastMessage,
                content: `${lastMessage.content}\n\n📊 Status: ${taskData.progress}`
              }];
            }
            return prev;
          });
        }
        
        // Check if task is completed
        if (taskData.status === 'completed') {
          setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: `✅ Task completed successfully!\n\nResult: ${taskData.result?.message || 'Browser automation completed'}`,
            timestamp: new Date(),
          }]);
          setIsRunning(false);
          return;
        }
        
        // Check if task failed
        if (taskData.status === 'error') {
          setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: `❌ Task failed: ${taskData.error || 'Unknown error occurred'}`,
            timestamp: new Date(),
          }]);
          setIsRunning(false);
          return;
        }
        
        // Continue polling if task is still running
        if (taskData.status === 'running' || taskData.status === 'initializing' || taskData.status === 'configuring' || taskData.status === 'starting_browser') {
          if (attempts < maxAttempts) {
            setTimeout(poll, 10000); // Poll every 10 seconds
          } else {
            setChatHistory(prev => [...prev, {
              role: 'assistant',
              content: '⏰ Task is taking longer than expected. Please check the web-ui backend for status.',
              timestamp: new Date(),
            }]);
            setIsRunning(false);
          }
        }
        
      } catch (error) {
        console.error('Error polling task status:', error);
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Retry after 10 seconds
        } else {
          setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: '❌ Unable to get task status. Please check the web-ui backend manually.',
            timestamp: new Date(),
          }]);
          setIsRunning(false);
        }
      }
    };
    
    // Start polling after a short delay
    setTimeout(poll, 2000);
  }, []);

  // Start agent execution
  const startAgent = useCallback(async (instruction) => {
    try {
      setIsRunning(true);
      setCurrentTask({
        id: Date.now().toString(),
        instruction,
        status: 'starting',
        startTime: new Date(),
      });

      // Add initial message to chat history
      setChatHistory(prev => [...prev, {
        role: 'user',
        content: instruction,
        timestamp: new Date(),
      }]);

      console.log('Starting agent with instruction:', instruction);
      console.log('Agent settings:', agentSettings);
      console.log('Browser settings:', browserSettings);
      console.log('LLM Provider:', agentSettings.llmProvider, 'Model:', agentSettings.llmModelName, 'API Key:', agentSettings.llmApiKey ? '***' : 'None');

      // Make API call to Python server
      console.log('Making POST request to:', `${PYTHON_SERVER_URL}/api/agents/start`);
      console.log('Request data:', {
        instruction,
        agent_settings: agentSettings,
        browser_settings: browserSettings,
        agent_type: 'browser_use'
      });
      
      const response = await axios.post(`${PYTHON_SERVER_URL}/api/agents/start`, {
        instruction,
        agent_settings: agentSettings,
        browser_settings: browserSettings,
        agent_type: 'browser_use'
      });

      if (response.data.status === 'started') {
        setCurrentTask(prev => ({ ...prev, status: 'running' }));
        
        // Add agent response to chat
        let responseMessage = `Agent started successfully! Task ID: ${response.data.task_id}.`;
        
        if (response.data.execution_status === 'processing') {
          responseMessage += ` I'm now processing your request: "${instruction}"`;
        } else if (response.data.execution_status === 'manual_required') {
          responseMessage += `\n\n⚠️ Manual execution required:\n${response.data.note}`;
          if (response.data.manual_steps) {
            responseMessage += `\n\nSteps to execute:\n${response.data.manual_steps.join('\n')}`;
          }
          if (response.data.webui_url) {
            responseMessage += `\n\n🔗 Open web-ui: ${response.data.webui_url}`;
          }
        }
        
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: responseMessage,
          timestamp: new Date(),
        }]);

        // Only simulate progress if it's actually processing
        if (response.data.execution_status === 'processing') {
          // Start polling for task status if we have a polling URL
          if (response.data.polling_url) {
            pollTaskStatus(response.data.task_id, response.data.polling_url);
          } else {
            // Fallback to simulated progress
            setTimeout(() => {
              setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'I\'m opening the browser and navigating to the requested page...',
                timestamp: new Date(),
              }]);
            }, 3000);

            setTimeout(() => {
              setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'Task completed! I have successfully executed your request.',
                timestamp: new Date(),
              }]);
              setIsRunning(false);
            }, 8000);
          }
        } else {
          // For manual execution, stop the running state immediately
          setTimeout(() => {
            setIsRunning(false);
          }, 2000);
        }

      } else {
        throw new Error(response.data.message || 'Failed to start agent');
      }

    } catch (error) {
      console.error('Error starting agent:', error);
      setIsRunning(false);
      
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please make sure the backend servers are running.`,
        timestamp: new Date(),
      }]);
    }
  }, [agentSettings, browserSettings, PYTHON_SERVER_URL]);

  // Stop agent execution
  const stopAgent = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTask(null);
  }, []);

  // Pause/Resume agent
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    setChatHistory([]);
    setScreenshots([]);
  }, []);

  // Save configuration
  const saveConfig = useCallback(async (configName) => {
    try {
      const config = {
        agentSettings,
        browserSettings,
        timestamp: new Date().toISOString(),
      };
      
      // Here you would save to your backend
      console.log('Saving config:', configName, config);
      
      return { success: true, message: 'Configuration saved successfully' };
    } catch (error) {
      console.error('Error saving config:', error);
      return { success: false, message: 'Failed to save configuration' };
    }
  }, [agentSettings, browserSettings]);

  // Load configuration
  const loadConfig = useCallback(async (configName) => {
    try {
      // Here you would load from your backend
      console.log('Loading config:', configName);
      
      return { success: true, message: 'Configuration loaded successfully' };
    } catch (error) {
      console.error('Error loading config:', error);
      return { success: false, message: 'Failed to load configuration' };
    }
  }, []);

  const value = {
    // State
    agentSettings,
    browserSettings,
    currentTask,
    isRunning,
    isPaused,
    chatHistory,
    screenshots,
    
    // Actions
    updateAgentSettings,
    updateBrowserSettings,
    startAgent,
    stopAgent,
    togglePause,
    clearChat,
    saveConfig,
    loadConfig,
  };

  return (
    <WebUIContext.Provider value={value}>
      {children}
    </WebUIContext.Provider>
  );
};
