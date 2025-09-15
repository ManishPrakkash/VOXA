# VOXA - Voice Web Automation Frontend

A React-based frontend that replicates the functionality of the Gradio WebUI for browser automation with AI assistance.

## Features

- **Agent Settings**: Configure LLM providers, models, and parameters
- **Browser Settings**: Configure browser behavior, window size, and file paths
- **Run Agent**: Interactive chat interface for running browser automation tasks
- **Agent Marketplace**: Discover and use specialized agents
- **Load & Save Config**: Manage configuration presets

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── AgentSettingsTab.jsx
│   ├── BrowserSettingsTab.jsx
│   ├── RunAgentTab.jsx
│   ├── AgentMarketplaceTab.jsx
│   └── LoadSaveConfigTab.jsx
├── context/             # React context for state management
│   └── WebUIManager.jsx
├── App.jsx              # Main app component
└── main.jsx             # App entry point
```

## Integration with Web-UI Backend

This frontend is designed to work with your existing Gradio web-ui backend. The WebUIManager context handles:

- State management for agent and browser settings
- API communication with the backend
- Real-time updates and chat history
- Configuration management

## Configuration

The app connects to your web-ui backend running on `http://localhost:7788` by default. You can modify this in the `WebUIManager.jsx` file.

## Technologies Used

- React 19
- Chakra UI for components
- Axios for API calls
- React Icons for icons
- Framer Motion for animations

## Development

The app uses Vite for fast development and building. All components are built with Chakra UI for consistency and accessibility.