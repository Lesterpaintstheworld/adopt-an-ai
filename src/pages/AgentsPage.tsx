import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import AgentSideMenu from '../components/agents/AgentSideMenu';
import SystemPrompt from '../components/agents/SystemPrompt';
import AgentChat from '../components/agents/AgentChat';

// Example data - replace with real data
const models = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    systemPrompt: 'You are a helpful AI assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't2', name: 'Calculator', description: 'Perform calculations' },
    ],
    vectorStore: {
      name: 'Pinecone DB',
      size: 1000000,
      lastUpdated: '2024-01-20',
    },
    parameters: [
      { name: 'Temperature', value: 0.7, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 2048, description: 'Maximum response length' },
    ],
  },
  {
    id: 'gpt35',
    name: 'GPT-3.5',
    systemPrompt: 'You are a fast and efficient AI assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
    ],
    vectorStore: {
      name: 'Pinecone DB',
      size: 500000,
      lastUpdated: '2024-01-19',
    },
    parameters: [
      { name: 'Temperature', value: 0.5, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1024, description: 'Maximum response length' },
    ],
  },
  {
    id: 'claude2',
    name: 'Claude 2',
    systemPrompt: 'You are Claude, an AI assistant by Anthropic...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't3', name: 'Code Interpreter', description: 'Execute code' },
    ],
    vectorStore: {
      name: 'Weaviate',
      size: 750000,
      lastUpdated: '2024-01-18',
    },
    parameters: [
      { name: 'Temperature', value: 0.6, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1500, description: 'Maximum response length' },
    ],
  },
  {
    id: 'llama2',
    name: 'Llama 2',
    systemPrompt: 'You are Llama 2, an open source AI model...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't4', name: 'Image Analysis', description: 'Analyze images' },
    ],
    vectorStore: {
      name: 'Milvus',
      size: 600000,
      lastUpdated: '2024-01-17',
    },
    parameters: [
      { name: 'Temperature', value: 0.8, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 2000, description: 'Maximum response length' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    systemPrompt: 'You are Mistral, a powerful open source AI...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't5', name: 'File Manager', description: 'Manage files' },
    ],
    vectorStore: {
      name: 'Qdrant',
      size: 450000,
      lastUpdated: '2024-01-16',
    },
    parameters: [
      { name: 'Temperature', value: 0.7, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1800, description: 'Maximum response length' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Model',
    systemPrompt: 'You are a specialized AI assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't6', name: 'Custom Tool', description: 'Custom functionality' },
    ],
    vectorStore: {
      name: 'ChromaDB',
      size: 300000,
      lastUpdated: '2024-01-15',
    },
    parameters: [
      { name: 'Temperature', value: 0.9, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1600, description: 'Maximum response length' },
    ],
  }
];

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(models[0].id);
  const selectedAgent = models.find(m => m.id === selectedAgentId);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>
      <AgentSideMenu 
        agents={models}
        selectedAgent={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 4,
        overflow: 'auto',
        transition: 'all 0.3s ease',
      }}>
        <TutorialHighlight pageKey="os" />
        
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {/* System Prompt - Left half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <SystemPrompt 
              prompt={selectedAgent?.systemPrompt || ''}
              readOnly
            />
          </Grid>

          {/* Chat - Right half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <AgentChat />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
