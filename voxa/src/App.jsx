import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Icon,
  useColorMode,
  useColorModeValue,
  ColorModeScript,
  theme,
} from '@chakra-ui/react';
import { FiSettings, FiGlobe, FiPlay, FiGift, FiFolder } from 'react-icons/fi';
import AgentSettingsTab from './components/AgentSettingsTab';
import BrowserSettingsTab from './components/BrowserSettingsTab';
import RunAgentTab from './components/RunAgentTab';
import AgentMarketplaceTab from './components/AgentMarketplaceTab';
import LoadSaveConfigTab from './components/LoadSaveConfigTab';
import { WebUIManager } from './context/WebUIManager';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />
      <Box minH="100vh" bg={bgColor}>
        {/* Header */}
        <Box bg={headerBg} shadow="sm" borderBottom="1px" borderColor="gray.200">
          <Container maxW="70%" py={4}>
            <VStack spacing={2}>
              <Heading size="lg" textAlign="center" color="blue.500">
                🌐 Browser Use WebUI
              </Heading>
              <Text textAlign="center" color="gray.600" fontSize="lg">
                Control your browser with AI assistance
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="70%" py={8}>
          <Tabs variant="enclosed" colorScheme="blue" size="lg">
            <TabList>
              <Tab>
                <Icon as={FiSettings} mr={2} />
                Agent Settings
              </Tab>
              <Tab>
                <Icon as={FiGlobe} mr={2} />
                Browser Settings
              </Tab>
              <Tab>
                <Icon as={FiPlay} mr={2} />
                Run Agent
              </Tab>
              <Tab>
                <Icon as={FiGift} mr={2} />
                Agent Marketplace
              </Tab>
              <Tab>
                <Icon as={FiFolder} mr={2} />
                Load & Save Config
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} py={6}>
                <AgentSettingsTab />
              </TabPanel>
              <TabPanel px={0} py={6}>
                <BrowserSettingsTab />
              </TabPanel>
              <TabPanel px={0} py={6}>
                <RunAgentTab />
              </TabPanel>
              <TabPanel px={0} py={6}>
                <AgentMarketplaceTab />
              </TabPanel>
              <TabPanel px={0} py={6}>
                <LoadSaveConfigTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;