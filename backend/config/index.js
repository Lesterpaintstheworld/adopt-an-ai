const CORS_ORIGINS = process.env.NODE_ENV === 'production'
  ? ['https://raise-an.ai', 'https://www.raise-an.ai']
  : ['http://localhost:3000', 'http://localhost:5173'];

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
  },
  cors: {
    origins: CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }
};
