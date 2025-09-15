import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Textarea,
  Button,
  Text,
  VStack as ChatVStack,
  Box as ChatBox,
  HStack as ChatHStack,
  Avatar,
  Badge,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Divider,
  IconButton,
  Tooltip,
  Link,
} from '@chakra-ui/react';
import { 
  FiPlay, 
  FiSquare, 
  FiPause, 
  FiPlayCircle, 
  FiTrash2, 
  FiCamera,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { useWebUI } from '../context/WebUIManager';

const RunAgentTab = () => {
  const { 
    currentTask, 
    isRunning, 
    isPaused, 
    chatHistory, 
    screenshots,
    startAgent, 
    stopAgent, 
    togglePause, 
    clearChat 
  } = useWebUI();

  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const toast = useToast();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!instruction.trim()) {
      toast({
        title: 'Please enter an instruction',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (isRunning) {
      toast({
        title: 'Agent is already running',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await startAgent(instruction);
      setInstruction('');
    } catch (error) {
      toast({
        title: 'Failed to start agent',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    stopAgent();
    toast({
      title: 'Agent stopped',
      status: 'info',
      duration: 3000,
    });
  };

  const handlePauseResume = () => {
    togglePause();
    toast({
      title: isPaused ? 'Agent resumed' : 'Agent paused',
      status: 'info',
      duration: 3000,
    });
  };

  const handleClear = () => {
    clearChat();
    toast({
      title: 'Chat cleared',
      status: 'info',
      duration: 3000,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <VStack spacing={6} align="stretch" h="full">
      {/* Status Bar */}
      {currentTask && (
        <Alert status={isRunning ? (isPaused ? 'warning' : 'info') : 'success'}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>
              {isRunning ? (isPaused ? 'Agent Paused' : 'Agent Running') : 'Agent Ready'}
            </AlertTitle>
            <AlertDescription>
              {currentTask.instruction}
            </AlertDescription>
          </Box>
          {isRunning && (
            <Badge colorScheme={isPaused ? 'yellow' : 'green'}>
              {isPaused ? 'Paused' : 'Active'}
            </Badge>
          )}
        </Alert>
      )}

      {/* Chat Interface */}
      <Box 
        borderWidth={1} 
        borderRadius="md" 
        p={4} 
        bg="white" 
        h="500px" 
        overflowY="auto"
        position="relative"
      >
        <ChatVStack spacing={4} align="stretch" h="full">
          {chatHistory.length === 0 ? (
            <Box textAlign="center" py={8} color="gray.500">
              <Text fontSize="lg" mb={2}>🤖 Browser Use Agent</Text>
              <Text>Enter an instruction below to start automating your browser tasks.</Text>
              <Text fontSize="sm" mt={2}>
                Example: "Open Gmail and check my inbox"
              </Text>
            </Box>
          ) : (
            chatHistory.map((message, index) => (
              <ChatBox key={index}>
                <ChatHStack spacing={3} align="flex-start">
                  <Avatar
                    size="sm"
                    name={message.role === 'user' ? 'You' : 'Agent'}
                    bg={message.role === 'user' ? 'blue.500' : 'green.500'}
                  />
                  <Box flex="1">
                    <HStack spacing={2} mb={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        {message.role === 'user' ? 'You' : 'Agent'}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </HStack>
                    <Text whiteSpace="pre-wrap">{message.content}</Text>
                    
                    {/* Manual execution steps with clickable link */}
                    {message.content.includes('Manual execution required') && message.content.includes('http://') && (
                      <Box mt={3} p={3} bg="yellow.50" borderRadius="md" borderLeft="4px" borderColor="yellow.400">
                        <Text fontSize="sm" fontWeight="bold" mb={2}>Quick Action:</Text>
                        <Link 
                          href="http://127.0.0.1:7788" 
                          isExternal
                          color="blue.500"
                          fontWeight="bold"
                        >
                          🔗 Open Web-UI Backend →
                        </Link>
                        <Text fontSize="xs" color="gray.600" mt={1}>
                          This will open your Gradio interface where you can execute the instruction manually
                        </Text>
                      </Box>
                    )}
                    
                    {/* Screenshots */}
                    {message.screenshots && message.screenshots.length > 0 && (
                      <VStack spacing={2} mt={3} align="stretch">
                        {message.screenshots.map((screenshot, idx) => (
                          <Box key={idx} borderWidth={1} borderRadius="md" p={2}>
                            <Image
                              src={screenshot}
                              alt={`Screenshot ${idx + 1}`}
                              maxW="100%"
                              borderRadius="md"
                            />
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Box>
                </ChatHStack>
                {index < chatHistory.length - 1 && <Divider mt={3} />}
              </ChatBox>
            ))
          )}
          <div ref={chatEndRef} />
        </ChatVStack>
      </Box>

      {/* Input Area */}
      <VStack spacing={4} align="stretch">
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your instruction here... (e.g., 'Open Gmail and check my inbox')"
          rows={3}
          resize="vertical"
          isDisabled={isRunning && !isPaused}
        />
        
        <HStack spacing={2} justify="space-between">
          <HStack spacing={2}>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Starting..."
              isDisabled={isRunning && !isPaused}
              leftIcon={<FiPlay />}
            >
              {isRunning ? 'Running...' : 'Start Agent'}
            </Button>
            
            {isRunning && (
              <>
                <Button
                  colorScheme={isPaused ? 'green' : 'yellow'}
                  onClick={handlePauseResume}
                  leftIcon={isPaused ? <FiPlayCircle /> : <FiPause />}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button
                  colorScheme="red"
                  onClick={handleStop}
                  leftIcon={<FiSquare />}
                >
                  Stop
                </Button>
              </>
            )}
          </HStack>
          
          <HStack spacing={2}>
            <Tooltip label="Clear Chat">
              <IconButton
                icon={<FiTrash2 />}
                onClick={handleClear}
                variant="ghost"
                size="sm"
              />
            </Tooltip>
            
            <Tooltip label="Take Screenshot">
              <IconButton
                icon={<FiCamera />}
                variant="ghost"
                size="sm"
                isDisabled={!isRunning}
              />
            </Tooltip>
            
            <Tooltip label="Refresh">
              <IconButton
                icon={<FiRefreshCw />}
                variant="ghost"
                size="sm"
              />
            </Tooltip>
          </HStack>
        </HStack>
      </VStack>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255, 255, 255, 0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10}
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Starting agent...</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default RunAgentTab;
