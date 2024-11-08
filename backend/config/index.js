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
module.exports = {
  api: {
    timeout: 30000, // 30 seconds
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
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};
