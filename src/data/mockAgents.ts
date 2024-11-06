import { Agent } from '../types/database';

export const mockAgents: Agent[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Research Assistant',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are a dedicated research assistant focused on gathering and analyzing information...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't2', name: 'Calculator', description: 'Perform calculations' },
    ],
    vector_store: {
      name: 'Pinecone DB',
      size: 1000000,
      lastUpdated: '2024-01-20',
    },
    parameters: {
      temperature: { value: 0.7, description: 'Controls randomness' },
      maxTokens: { value: 2048, description: 'Maximum response length' }
    },
  },
  {
    id: 'writer',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Creative Writer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are a creative writing assistant specializing in storytelling...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
    ],
    vector_store: {
      name: 'Pinecone DB',
      size: 500000,
      lastUpdated: '2024-01-19',
    },
    parameters: {
      temperature: { value: 0.9, description: 'Controls randomness' },
      maxTokens: { value: 1024, description: 'Maximum response length' }
    },
  },
  {
    id: 'analyst',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Data Analyst',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are a data analysis expert focused on finding insights...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't3', name: 'Code Interpreter', description: 'Execute code' },
    ],
    vector_store: {
      name: 'Weaviate',
      size: 750000,
      lastUpdated: '2024-01-18',
    },
    parameters: {
      temperature: { value: 0.3, description: 'Controls randomness' },
      maxTokens: { value: 1500, description: 'Maximum response length' }
    },
  },
  {
    id: 'teacher',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Educational Tutor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are an educational tutor specializing in personalized learning...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't4', name: 'Image Analysis', description: 'Analyze images' },
    ],
    vector_store: {
      name: 'Milvus',
      size: 600000,
      lastUpdated: '2024-01-17',
    },
    parameters: {
      temperature: { value: 0.6, description: 'Controls randomness' },
      maxTokens: { value: 2000, description: 'Maximum response length' }
    },
  },
  {
    id: 'assistant',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Personal Assistant',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are a helpful personal assistant focused on organization and productivity...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't5', name: 'File Manager', description: 'Manage files' },
    ],
    vector_store: {
      name: 'Qdrant',
      size: 450000,
      lastUpdated: '2024-01-16',
    },
    parameters: {
      temperature: { value: 0.7, description: 'Controls randomness' },
      maxTokens: { value: 1800, description: 'Maximum response length' }
    },
  },
  {
    id: 'coder',
    user_id: '123e4567-e89b-12d3-a456-426614174111',
    name: 'Code Assistant',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    system_prompt: 'You are a specialized programming assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't6', name: 'Code Analysis', description: 'Analyze and debug code' },
    ],
    vector_store: {
      name: 'ChromaDB',
      size: 300000,
      lastUpdated: '2024-01-15',
    },
    parameters: {
      temperature: { value: 0.5, description: 'Controls randomness' },
      maxTokens: { value: 1600, description: 'Maximum response length' }
    },
  }
];
