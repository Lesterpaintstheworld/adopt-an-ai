module.exports = {
  CORS_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000'
  ],
  DEFAULT_TUTORIAL_PROGRESS: {
    lastStep: 0,
    completedSteps: [],
    dismissedPages: []
  },
  JWT_EXPIRY: '24h',
  REQUEST_TIMEOUT: '30s',
  OPENAI_DEFAULTS: {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 1000
  }
};
