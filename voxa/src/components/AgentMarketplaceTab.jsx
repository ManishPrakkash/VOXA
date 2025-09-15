import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FiPlay, FiInfo, FiDownload } from 'react-icons/fi';
import { useWebUI } from '../context/WebUIManager';

const AgentMarketplaceTab = () => {
  const { startAgent } = useWebUI();
  const toast = useToast();

  const agents = [
    {
      id: 'deep-research',
      name: 'Deep Research Agent',
      description: 'Performs comprehensive research on any topic using multiple sources and provides detailed analysis.',
      features: ['Web Search', 'Content Analysis', 'Report Generation', 'Multi-source Verification'],
      status: 'available',
      category: 'Research',
    },
    {
      id: 'data-extraction',
      name: 'Data Extraction Agent',
      description: 'Extracts structured data from websites, forms, and documents automatically.',
      features: ['Form Filling', 'Data Scraping', 'Document Processing', 'CSV Export'],
      status: 'available',
      category: 'Automation',
    },
    {
      id: 'social-media',
      name: 'Social Media Agent',
      description: 'Manages social media accounts, posts content, and engages with followers.',
      features: ['Post Scheduling', 'Content Creation', 'Engagement Tracking', 'Analytics'],
      status: 'coming-soon',
      category: 'Social Media',
    },
    {
      id: 'e-commerce',
      name: 'E-commerce Agent',
      description: 'Handles online shopping tasks, price comparison, and order management.',
      features: ['Price Monitoring', 'Order Tracking', 'Product Comparison', 'Checkout Automation'],
      status: 'coming-soon',
      category: 'E-commerce',
    },
  ];

  const handleRunAgent = async (agent) => {
    if (agent.status !== 'available') {
      toast({
        title: 'Agent not available',
        description: 'This agent is coming soon!',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    const instruction = `Use the ${agent.name} to help with my task. Please start by explaining what you can do and ask for specific requirements.`;
    
    try {
      await startAgent(instruction);
      toast({
        title: `${agent.name} started`,
        description: 'The agent is now ready to help you!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to start agent',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'coming-soon': return 'yellow';
      case 'maintenance': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'coming-soon': return 'Coming Soon';
      case 'maintenance': return 'Under Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center" py={4}>
        <Heading size="lg" mb={2}>🎁 Agent Marketplace</Heading>
        <Text color="gray.600">
          Discover and use specialized agents built on Browser-Use
        </Text>
      </Box>

      <VStack spacing={4} align="stretch">
        {agents.map((agent) => (
          <Card key={agent.id} variant="outline" size="lg">
            <CardHeader>
              <HStack justify="space-between" align="flex-start">
                <VStack align="flex-start" spacing={2}>
                  <HStack spacing={3}>
                    <Heading size="md">{agent.name}</Heading>
                    <Badge colorScheme={getStatusColor(agent.status)}>
                      {getStatusText(agent.status)}
                    </Badge>
                    <Badge variant="outline" colorScheme="blue">
                      {agent.category}
                    </Badge>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    {agent.description}
                  </Text>
                </VStack>
                
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiInfo />}
                    isDisabled={agent.status !== 'available'}
                  >
                    Info
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<FiPlay />}
                    onClick={() => handleRunAgent(agent)}
                    isDisabled={agent.status !== 'available'}
                  >
                    Run Agent
                  </Button>
                </HStack>
              </HStack>
            </CardHeader>
            
            <CardBody pt={0}>
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="medium" fontSize="sm" color="gray.700">
                  Key Features:
                </Text>
                <HStack spacing={2} wrap="wrap">
                  {agent.features.map((feature, index) => (
                    <Badge key={index} variant="subtle" colorScheme="blue">
                      {feature}
                    </Badge>
                  ))}
                </HStack>
                
                {agent.status === 'coming-soon' && (
                  <Box bg="yellow.50" p={3} borderRadius="md" borderLeft="4px" borderColor="yellow.400">
                    <Text fontSize="sm" color="yellow.800">
                      This agent is under development and will be available soon. 
                      Check back later for updates!
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Deep Research Agent Special Section */}
      <Box p={6} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="flex-start">
            <VStack align="flex-start" spacing={2}>
              <Heading size="md" color="blue.700">Deep Research Agent</Heading>
              <Text color="blue.600" fontSize="sm">
                Our flagship research agent that can perform comprehensive research on any topic.
              </Text>
            </VStack>
            <Button
              colorScheme="blue"
              leftIcon={<FiPlay />}
              onClick={() => handleRunAgent(agents[0])}
            >
              Try Deep Research
            </Button>
          </HStack>
          
          <Divider borderColor="blue.200" />
          
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="medium" fontSize="sm" color="blue.700">
              What it can do:
            </Text>
            <Text fontSize="sm" color="blue.600">
              • Search multiple sources and websites for information<br/>
              • Analyze and synthesize findings into comprehensive reports<br/>
              • Verify information across different sources<br/>
              • Generate detailed research summaries with citations<br/>
              • Export results in various formats (PDF, Word, etc.)
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Coming Soon Section */}
      <Box p={4} bg="gray.50" borderRadius="md">
        <VStack align="stretch" spacing={3}>
          <Heading size="sm" color="gray.700">More Agents Coming Soon</Heading>
          <Text fontSize="sm" color="gray.600">
            We're constantly developing new specialized agents. Stay tuned for updates on:
          </Text>
          <HStack spacing={2} wrap="wrap">
            <Badge variant="outline">Email Automation</Badge>
            <Badge variant="outline">Calendar Management</Badge>
            <Badge variant="outline">File Organization</Badge>
            <Badge variant="outline">Web Testing</Badge>
            <Badge variant="outline">Content Creation</Badge>
            <Badge variant="outline">API Integration</Badge>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default AgentMarketplaceTab;
