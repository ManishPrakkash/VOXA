import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiSave, 
  FiUpload, 
  FiDownload, 
  FiTrash2, 
  FiRefreshCw,
  FiCopy,
  FiEdit
} from 'react-icons/fi';
import { useWebUI } from '../context/WebUIManager';

const LoadSaveConfigTab = () => {
  const { agentSettings, browserSettings, saveConfig, loadConfig } = useWebUI();
  const [configName, setConfigName] = useState('');
  const [savedConfigs, setSavedConfigs] = useState([
    {
      id: '1',
      name: 'Default Configuration',
      description: 'Standard settings for general use',
      timestamp: '2024-01-15 10:30:00',
      type: 'system'
    },
    {
      id: '2',
      name: 'Research Agent Config',
      description: 'Optimized for research tasks',
      timestamp: '2024-01-14 15:45:00',
      type: 'user'
    },
    {
      id: '3',
      name: 'Browser Automation',
      description: 'Settings for browser automation tasks',
      timestamp: '2024-01-13 09:20:00',
      type: 'user'
    }
  ]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const toast = useToast();

  const handleSaveConfig = async () => {
    if (!configName.trim()) {
      toast({
        title: 'Please enter a configuration name',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      const result = await saveConfig(configName);
      if (result.success) {
        // Add to saved configs list
        const newConfig = {
          id: Date.now().toString(),
          name: configName,
          description: 'User saved configuration',
          timestamp: new Date().toLocaleString(),
          type: 'user'
        };
        setSavedConfigs(prev => [newConfig, ...prev]);
        setConfigName('');
        
        toast({
          title: 'Configuration saved',
          description: `"${configName}" has been saved successfully`,
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Failed to save configuration',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleLoadConfig = async (config) => {
    try {
      const result = await loadConfig(config.name);
      if (result.success) {
        setSelectedConfig(config);
        toast({
          title: 'Configuration loaded',
          description: `"${config.name}" has been loaded successfully`,
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Failed to load configuration',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteConfig = (configId) => {
    setSavedConfigs(prev => prev.filter(config => config.id !== configId));
    if (selectedConfig?.id === configId) {
      setSelectedConfig(null);
    }
    toast({
      title: 'Configuration deleted',
      status: 'info',
      duration: 3000,
    });
  };

  const handleExportConfig = () => {
    const config = {
      agentSettings,
      browserSettings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-use-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Configuration exported',
      description: 'Configuration has been downloaded as JSON file',
      status: 'success',
      duration: 3000,
    });
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          // Here you would update the settings with the imported config
          console.log('Imported config:', config);
          toast({
            title: 'Configuration imported',
            description: 'Configuration has been loaded from file',
            status: 'success',
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: 'Invalid configuration file',
            description: 'Please select a valid JSON configuration file',
            status: 'error',
            duration: 5000,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Save Configuration */}
      <Card>
        <CardHeader>
          <Heading size="md">💾 Save Current Configuration</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Input
                placeholder="Enter configuration name..."
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                flex={1}
              />
              <Button
                colorScheme="blue"
                leftIcon={<FiSave />}
                onClick={handleSaveConfig}
                isDisabled={!configName.trim()}
              >
                Save Config
              </Button>
            </HStack>
            
            <Alert status="info" size="sm">
              <AlertIcon />
              <AlertDescription>
                Save your current agent and browser settings for quick access later.
              </AlertDescription>
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <Heading size="md">📁 Import/Export Configuration</Heading>
        </CardHeader>
        <CardBody>
          <HStack spacing={4}>
            <Input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              display="none"
              id="import-config"
            />
            <Button
              as="label"
              htmlFor="import-config"
              leftIcon={<FiUpload />}
              variant="outline"
              cursor="pointer"
            >
              Import Config
            </Button>
            
            <Button
              leftIcon={<FiDownload />}
              onClick={handleExportConfig}
              variant="outline"
            >
              Export Config
            </Button>
            
            <Button
              leftIcon={<FiRefreshCw />}
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reset to Default
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Saved Configurations */}
      <Card>
        <CardHeader>
          <Heading size="md">📋 Saved Configurations</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {savedConfigs.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                No saved configurations found. Save your first configuration above!
              </Text>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Type</Th>
                    <Th>Last Modified</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {savedConfigs.map((config) => (
                    <Tr key={config.id}>
                      <Td>
                        <VStack align="flex-start" spacing={1}>
                          <Text fontWeight="medium">{config.name}</Text>
                          {selectedConfig?.id === config.id && (
                            <Badge colorScheme="green" size="sm">Active</Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {config.description}
                        </Text>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={config.type === 'system' ? 'blue' : 'green'}
                          variant="subtle"
                        >
                          {config.type}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.500">
                          {config.timestamp}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label="Load Configuration">
                            <IconButton
                              icon={<FiCopy />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLoadConfig(config)}
                            />
                          </Tooltip>
                          
                          {config.type === 'user' && (
                            <>
                              <Tooltip label="Edit Configuration">
                                <IconButton
                                  icon={<FiEdit />}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                              
                              <Tooltip label="Delete Configuration">
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => handleDeleteConfig(config.id)}
                                />
                              </Tooltip>
                            </>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <Heading size="md">⚙️ Current Settings Summary</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Agent Settings:</Text>
              <Text fontSize="sm" color="gray.600">
                {agentSettings.llmProvider} / {agentSettings.llmModelName}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Browser Settings:</Text>
              <Text fontSize="sm" color="gray.600">
                {browserSettings.headless ? 'Headless' : 'Visible'} / 
                {browserSettings.windowWidth}x{browserSettings.windowHeight}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Max Steps:</Text>
              <Text fontSize="sm" color="gray.600">
                {agentSettings.maxSteps}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Temperature:</Text>
              <Text fontSize="sm" color="gray.600">
                {agentSettings.llmTemperature}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default LoadSaveConfigTab;
