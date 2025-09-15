import React from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  Input,
  Text,
  Divider,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useWebUI } from '../context/WebUIManager';

const AgentSettingsTab = () => {
  const { agentSettings, updateAgentSettings } = useWebUI();
  const toast = useToast();

  const handleInputChange = (field, value) => {
    updateAgentSettings({ [field]: value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mcpConfig = JSON.parse(e.target.result);
          updateAgentSettings({ 
            mcpServerConfig: JSON.stringify(mcpConfig, null, 2),
            mcpJsonFile: file 
          });
          toast({
            title: 'MCP Configuration loaded',
            status: 'success',
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: 'Invalid JSON file',
            status: 'error',
            duration: 3000,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const llmProviders = [
    'openai', 'azure_openai', 'anthropic', 'deepseek', 'google',
    'alibaba', 'moonshot', 'unbound', 'ibm', 'grok', 'ollama'
  ];

  const modelNames = {
    openai: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo', 'o3-mini'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-20240620', 'claude-3-opus-20240229'],
    google: ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b-latest'],
    ollama: ['qwen2.5:7b', 'qwen2.5:14b', 'qwen2.5:32b', 'llama2:7b'],
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* System Prompts */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Override System Prompt</FormLabel>
            <Textarea
              value={agentSettings.overrideSystemPrompt}
              onChange={(e) => handleInputChange('overrideSystemPrompt', e.target.value)}
              placeholder="Enter custom system prompt..."
              rows={4}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Extend System Prompt</FormLabel>
            <Textarea
              value={agentSettings.extendSystemPrompt}
              onChange={(e) => handleInputChange('extendSystemPrompt', e.target.value)}
              placeholder="Enter additional system prompt..."
              rows={4}
            />
          </FormControl>
        </VStack>
      </Box>

      {/* MCP Configuration */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>MCP Server JSON</FormLabel>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              mb={2}
            />
            {agentSettings.mcpServerConfig && (
              <Textarea
                value={agentSettings.mcpServerConfig}
                onChange={(e) => handleInputChange('mcpServerConfig', e.target.value)}
                rows={6}
                fontFamily="mono"
                fontSize="sm"
              />
            )}
          </FormControl>
        </VStack>
      </Box>

      {/* LLM Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>LLM Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>LLM Provider</FormLabel>
              <Select
                value={agentSettings.llmProvider}
                onChange={(e) => handleInputChange('llmProvider', e.target.value)}
              >
                {llmProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>LLM Model Name</FormLabel>
              <Select
                value={agentSettings.llmModelName}
                onChange={(e) => handleInputChange('llmModelName', e.target.value)}
              >
                {(modelNames[agentSettings.llmProvider] || []).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Temperature: {agentSettings.llmTemperature}</FormLabel>
              <Slider
                value={agentSettings.llmTemperature}
                onChange={(value) => handleInputChange('llmTemperature', value)}
                min={0}
                max={2}
                step={0.1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl flex={1}>
              <Checkbox
                isChecked={agentSettings.useVision}
                onChange={(e) => handleInputChange('useVision', e.target.checked)}
              >
                Use Vision
              </Checkbox>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Base URL</FormLabel>
              <Input
                value={agentSettings.llmBaseUrl}
                onChange={(e) => handleInputChange('llmBaseUrl', e.target.value)}
                placeholder="API endpoint URL (if required)"
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>API Key</FormLabel>
              <Input
                type="password"
                value={agentSettings.llmApiKey}
                onChange={(e) => handleInputChange('llmApiKey', e.target.value)}
                placeholder="Your API key (leave blank to use .env)"
              />
            </FormControl>
          </HStack>

          {agentSettings.llmProvider === 'ollama' && (
            <FormControl>
              <FormLabel>Ollama Context Length: {agentSettings.ollamaNumCtx}</FormLabel>
              <Slider
                value={agentSettings.ollamaNumCtx}
                onChange={(value) => handleInputChange('ollamaNumCtx', value)}
                min={256}
                max={65536}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          )}
        </VStack>
      </Box>

      {/* Planner LLM Settings */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Planner LLM Settings</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Planner LLM Provider</FormLabel>
              <Select
                value={agentSettings.plannerLlmProvider}
                onChange={(e) => handleInputChange('plannerLlmProvider', e.target.value)}
              >
                <option value="">None</option>
                {llmProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Planner LLM Model Name</FormLabel>
              <Select
                value={agentSettings.plannerLlmModelName}
                onChange={(e) => handleInputChange('plannerLlmModelName', e.target.value)}
                isDisabled={!agentSettings.plannerLlmProvider}
              >
                <option value="">Select Model</option>
                {(modelNames[agentSettings.plannerLlmProvider] || []).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Planner Temperature: {agentSettings.plannerLlmTemperature}</FormLabel>
              <Slider
                value={agentSettings.plannerLlmTemperature}
                onChange={(value) => handleInputChange('plannerLlmTemperature', value)}
                min={0}
                max={2}
                step={0.1}
                isDisabled={!agentSettings.plannerLlmProvider}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl flex={1}>
              <Checkbox
                isChecked={agentSettings.plannerUseVision}
                onChange={(e) => handleInputChange('plannerUseVision', e.target.checked)}
                isDisabled={!agentSettings.plannerLlmProvider}
              >
                Use Vision (Planner LLM)
              </Checkbox>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Planner Base URL</FormLabel>
              <Input
                value={agentSettings.plannerLlmBaseUrl}
                onChange={(e) => handleInputChange('plannerLlmBaseUrl', e.target.value)}
                placeholder="API endpoint URL (if required)"
                isDisabled={!agentSettings.plannerLlmProvider}
              />
            </FormControl>
            
            <FormControl flex={1}>
              <FormLabel>Planner API Key</FormLabel>
              <Input
                type="password"
                value={agentSettings.plannerLlmApiKey}
                onChange={(e) => handleInputChange('plannerLlmApiKey', e.target.value)}
                placeholder="Your API key (leave blank to use .env)"
                isDisabled={!agentSettings.plannerLlmProvider}
              />
            </FormControl>
          </HStack>
        </VStack>
      </Box>

      {/* Agent Configuration */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Agent Configuration</Text>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Max Run Steps: {agentSettings.maxSteps}</FormLabel>
              <Slider
                value={agentSettings.maxSteps}
                onChange={(value) => handleInputChange('maxSteps', value)}
                min={1}
                max={1000}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>Max Number of Actions: {agentSettings.maxActions}</FormLabel>
              <Slider
                value={agentSettings.maxActions}
                onChange={(value) => handleInputChange('maxActions', value)}
                min={1}
                max={100}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl flex={1}>
              <FormLabel>Max Input Tokens</FormLabel>
              <NumberInput
                value={agentSettings.maxInputTokens}
                onChange={(value) => handleInputChange('maxInputTokens', parseInt(value))}
                min={1000}
                max={1000000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>Tool Calling Method</FormLabel>
              <Select
                value={agentSettings.toolCallingMethod}
                onChange={(e) => handleInputChange('toolCallingMethod', e.target.value)}
              >
                <option value="function_calling">Function Calling</option>
                <option value="json_mode">JSON Mode</option>
                <option value="raw">Raw</option>
                <option value="auto">Auto</option>
                <option value="tools">Tools</option>
                <option value="None">None</option>
              </Select>
            </FormControl>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default AgentSettingsTab;
