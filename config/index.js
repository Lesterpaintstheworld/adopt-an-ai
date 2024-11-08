module.exports = {
  api: {
    timeout: 30000,
    version: 'v1',
  },
  openai: {
    defaultModel: 'gpt-4',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000,
  },
  db: {
    poolMin: 2,
    poolMax: 10,
    idleTimeoutMillis: 30000,
  },
  security: {
    rateLimits: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};
