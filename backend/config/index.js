module.exports = {
  db: {
    poolConfig: {
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      min: 2
    }
  },
  auth: {
    jwtExpiry: '24h',
    tokenAlgorithm: 'HS256'
  },
  api: {
    timeout: 30000,
    version: 'v1',
    defaultPageSize: 20,
    maxPageSize: 100
  },
  openai: {
    defaultModel: 'gpt-4',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000
  },
  security: {
    rateLimits: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};
