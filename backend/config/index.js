const config = {
  db: {
    poolConfig: {
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  auth: {
    jwtExpiry: '24h',
    tokenAlgorithm: 'HS256'
  },
  api: {
    defaultPageSize: 20,
    maxPageSize: 100,
    timeout: '30s'
  },
  openai: {
    defaultModel: 'gpt-4',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000
  }
};

module.exports = config;
