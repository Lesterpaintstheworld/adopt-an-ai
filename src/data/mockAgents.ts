export const mockAgents = [
  {
    id: 'researcher',
    name: 'Research Assistant',
    systemPrompt: 'You are a dedicated research assistant focused on gathering and analyzing information...',
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
    id: 'writer',
    name: 'Creative Writer', 
    systemPrompt: 'You are a creative writing assistant specializing in storytelling...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
    ],
    vectorStore: {
      name: 'Pinecone DB',
      size: 500000,
      lastUpdated: '2024-01-19',
    },
    parameters: [
      { name: 'Temperature', value: 0.9, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1024, description: 'Maximum response length' },
    ],
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    systemPrompt: 'You are a data analysis expert focused on finding insights...',
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
      { name: 'Temperature', value: 0.3, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1500, description: 'Maximum response length' },
    ],
  },
  {
    id: 'teacher',
    name: 'Educational Tutor',
    systemPrompt: 'You are an educational tutor specializing in personalized learning...',
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
      { name: 'Temperature', value: 0.6, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 2000, description: 'Maximum response length' },
    ],
  },
  {
    id: 'assistant',
    name: 'Personal Assistant',
    systemPrompt: 'You are a helpful personal assistant focused on organization and productivity...',
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
    id: 'coder',
    name: 'Code Assistant',
    systemPrompt: 'You are a specialized programming assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't6', name: 'Code Analysis', description: 'Analyze and debug code' },
    ],
    vectorStore: {
      name: 'ChromaDB',
      size: 300000,
      lastUpdated: '2024-01-15',
    },
    parameters: [
      { name: 'Temperature', value: 0.5, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 1600, description: 'Maximum response length' },
    ],
  }
];
