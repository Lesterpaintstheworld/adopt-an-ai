# Backend Architecture Overview

## Directory Structure
```
/backend
├── config/                 # Configuration files
│   ├── cors.js            # CORS configuration
│   ├── db.js              # Database configuration
│   └── index.js           # Global configuration
│
├── middleware/            # Express middlewares
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handling
│   ├── rateLimiter.js     # API rate limiting
│   └── requestValidator.js # Request validation
│
├── migrations/           # Database migrations
│   ├── 001_create_users_table.sql
│   ├── 002_create_agents_table.sql
│   └── 003_create_teams_table.sql
│
├── routes/              # API routes
│   ├── agents.js        # Agent management
│   ├── ai.js           # AI interactions
│   ├── auth.js         # Authentication
│   └── teams.js        # Team management
│
├── utils/              # Utility functions
│   ├── cache.js        # Caching utilities
│   ├── db.js          # Database operations
│   ├── errors.js      # Error classes
│   ├── eventEmitter.js # Event handling
│   ├── logger.js      # Logging utilities
│   ├── metrics.js     # Performance metrics
│   ├── queryBuilder.js # SQL query builder
│   ├── responses.js   # HTTP response formatting
│   ├── resourceManager.js # Resource CRUD operations
│   └── validation.js  # Data validation
│
├── deploy.sh          # Deployment script
├── ecosystem.config.js # PM2 configuration
├── package.json       # Dependencies
└── server.js         # Application entry point
```

## Key Files and Their Purposes

### Core Files
- `server.js`: Application entry point, sets up Express and middleware
- `ecosystem.config.js`: PM2 process manager configuration  
- `deploy.sh`: Deployment automation script

### Configuration Files
- `config/cors.js`: CORS settings for different environments
- `config/db.js`: Database connection configuration
- `config/index.js`: Global application settings

### Middleware
- `middleware/auth.js`: JWT token verification
- `middleware/errorHandler.js`: Centralized error handling
- `middleware/rateLimiter.js`: Request rate limiting
- `middleware/requestValidator.js`: Request data validation

### Database
- `migrations/*.sql`: Database schema evolution
- `utils/db.js`: Database query execution
- `utils/queryBuilder.js`: SQL query construction

### Routes
- `routes/agents.js`: Agent CRUD operations
- `routes/ai.js`: OpenAI API integration
- `routes/auth.js`: Authentication endpoints
- `routes/teams.js`: Team management

### Utilities
- `utils/cache.js`: Application-level caching
- `utils/errors.js`: Custom error classes
- `utils/eventEmitter.js`: Event handling system
- `utils/logger.js`: Application logging
- `utils/metrics.js`: Performance monitoring
- `utils/responses.js`: Standardized HTTP responses
- `utils/resourceManager.js`: Generic resource management
- `utils/validation.js`: Data validation schemas

## Common Operations

### Database Operations
Database queries are handled through `utils/db.js`:
```javascript
const dbUtils = require('./utils/db');
await dbUtils.executeQuery(query, params);
```

### Error Handling
Custom errors are defined in `utils/errors.js`:
```javascript
throw new AppError('Resource not found', 404);
```

### Response Formatting
Standard responses through `utils/responses.js`:
```javascript
httpResponses.success(res, data);
httpResponses.error(res, error);
```

### Request Validation
Validation schemas in `utils/validation.js`:
```javascript
const { schemas, validate } = require('./utils/validation');
router.post('/', validate(schemas.team));
```
