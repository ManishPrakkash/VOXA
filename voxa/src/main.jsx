import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import { WebUIManager } from './context/WebUIManager.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <WebUIManager>
        <App />
      </WebUIManager>
    </ChakraProvider>
  </StrictMode>,
)
