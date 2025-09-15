import React from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useWebUI } from '../context/WebUIManager';

const BrowserSettingsTab = () => {
  const { browserSettings, updateBrowserSettings } = useWebUI();
  const toast = useToast();

  const handleInputChange = (field, value) => {
    updateBrowserSettings({ [field]: value });
  };

  const handleCloseBrowser = () => {
    toast({
      title: 'Browser closed',
      description: 'Browser context has been closed due to configuration changes',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Browser Path Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Browser Path Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Browser Binary Path</FormLabel>
              <Input
                value={browserSettings.browserBinaryPath}
                onChange={(e) => handleInputChange('browserBinaryPath', e.target.value)}
                placeholder="e.g. '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'"
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Browser User Data Dir</FormLabel>
              <Input
                value={browserSettings.browserUserDataDir}
                onChange={(e) => handleInputChange('browserUserDataDir', e.target.value)}
                placeholder="Leave it empty if you use your default user data"
              />
            </FormControl>
          </HStack>
        </VStack>
      </Box>

      {/* Browser Behavior Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Browser Behavior Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={6} wrap="wrap">
            <Checkbox
              isChecked={browserSettings.useOwnBrowser}
              onChange={(e) => {
                handleInputChange('useOwnBrowser', e.target.checked);
                if (e.target.checked) handleCloseBrowser();
              }}
            >
              Use Own Browser
            </Checkbox>
            
            <Checkbox
              isChecked={browserSettings.keepBrowserOpen}
              onChange={(e) => {
                handleInputChange('keepBrowserOpen', e.target.checked);
                if (!e.target.checked) handleCloseBrowser();
              }}
            >
              Keep Browser Open
            </Checkbox>
            
            <Checkbox
              isChecked={browserSettings.headless}
              onChange={(e) => {
                handleInputChange('headless', e.target.checked);
                handleCloseBrowser();
              }}
            >
              Headless Mode
            </Checkbox>
            
            <Checkbox
              isChecked={browserSettings.disableSecurity}
              onChange={(e) => {
                handleInputChange('disableSecurity', e.target.checked);
                handleCloseBrowser();
              }}
            >
              Disable Security
            </Checkbox>
          </HStack>
        </VStack>
      </Box>

      {/* Window Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Window Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Window Width</FormLabel>
              <NumberInput
                value={browserSettings.windowWidth}
                onChange={(value) => handleInputChange('windowWidth', parseInt(value))}
                min={800}
                max={2560}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Window Height</FormLabel>
              <NumberInput
                value={browserSettings.windowHeight}
                onChange={(value) => handleInputChange('windowHeight', parseInt(value))}
                min={600}
                max={1440}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </HStack>
        </VStack>
      </Box>

      {/* Remote Debugging Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Remote Debugging Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>CDP URL</FormLabel>
              <Input
                value={browserSettings.cdpUrl}
                onChange={(e) => handleInputChange('cdpUrl', e.target.value)}
                placeholder="CDP URL for browser remote debugging"
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>WSS URL</FormLabel>
              <Input
                value={browserSettings.wssUrl}
                onChange={(e) => handleInputChange('wssUrl', e.target.value)}
                placeholder="WSS URL for browser remote debugging"
              />
            </FormControl>
          </HStack>
        </VStack>
      </Box>

      {/* File Path Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>File Path Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Recording Path</FormLabel>
              <Input
                value={browserSettings.saveRecordingPath}
                onChange={(e) => handleInputChange('saveRecordingPath', e.target.value)}
                placeholder="e.g. ./tmp/record_videos"
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Trace Path</FormLabel>
              <Input
                value={browserSettings.saveTracePath}
                onChange={(e) => handleInputChange('saveTracePath', e.target.value)}
                placeholder="e.g. ./tmp/traces"
              />
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Agent History Save Path</FormLabel>
              <Input
                value={browserSettings.saveAgentHistoryPath}
                onChange={(e) => handleInputChange('saveAgentHistoryPath', e.target.value)}
                placeholder="e.g. ./tmp/agent_history"
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Download Path</FormLabel>
              <Input
                value={browserSettings.saveDownloadPath}
                onChange={(e) => handleInputChange('saveDownloadPath', e.target.value)}
                placeholder="e.g. ./tmp/downloads"
              />
            </FormControl>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default BrowserSettingsTab;
