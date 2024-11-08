# Backend Documentation

## Architecture Overview

The backend is built with Node.js/Express and follows a modular architecture pattern with clear separation of concerns.

## Core Components

### Database Layer (`utils/db.js`)
Handles all database interactions with PostgreSQL.

```javascript
dbUtils {
  executeQuery()      // Executes SQL queries with logging and error handling
  checkExists()       // Verifies if a record exists for given table/id/userId
  transaction()       // Manages database transactions
}
```

### Error Handling (`utils/errors.js`) 
Custom error classes for consistent error handling.

```javascript
AppError            // Base error class
ValidationError     // 400 Bad Request errors
NotFoundError       // 404 Not Found errors
AuthError          // 401/403 Authentication errors
```

### Response Handling (`utils/responseHandler.js`)
Standardizes API responses.

```javascript
ResponseHandler {
  success()         // Returns successful responses (200-299)
  error()           // Returns error responses with proper status codes
  paginated()       // Returns paginated responses with metadata
}
```

### Resource Management (`utils/resourceManager.js`)
Generic CRUD operations for resources.

```javascript
ResourceManager {
  checkOwnership()  // Verifies resource ownership
  getResource()     // Retrieves a resource with ownership check
  deleteResource()  // Deletes a resource with ownership check
}
```

### Event System (`utils/eventEmitter.js`)
Handles application events with logging.

```javascript
AppEventEmitter {
  emit()           // Emits events with logging
  onWithLog()      // Subscribes to events with logging
}
```

### Query Builder (`utils/queryBuilder.js`)
Builds SQL queries dynamically.

```javascript
QueryBuilder {
  buildPaginatedQuery()  // Builds queries with pagination
  buildUpdateQuery()     // Builds UPDATE queries
  buildInsertQuery()     // Builds INSERT queries
}
```

## Middleware

### Authentication (`middleware/auth.js`)
Verifies JWT tokens and adds user info to requests.

### Request Validation (`middleware/requestValidator.js`)
Validates request data against schemas.

### Error Handler (`middleware/errorHandler.js`)
Global error handling middleware.

### Rate Limiting (`middleware/rateLimiter.js`)
Implements API rate limiting.

## Routes

### Authentication Routes (`routes/auth.js`)
- POST /api/auth/google - Google OAuth authentication
- GET /api/auth/validate - Token validation

### Agent Routes (`routes/agents.js`)
- GET /api/agents - List user's agents
- POST /api/agents - Create new agent
- PUT /api/agents/:id - Update agent
- DELETE /api/agents/:id - Delete agent

### Team Routes (`routes/teams.js`)
- GET /api/teams - List user's teams
- POST /api/teams - Create team
- PUT /api/teams/:id - Update team
- DELETE /api/teams/:id - Delete team
- POST /api/teams/:id/agents - Add agent to team
- DELETE /api/teams/:id/agents/:agentId - Remove agent from team

### AI Routes (`routes/ai.js`)
- POST /api/ai/chat - Send messages to OpenAI

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  tutorial_completed BOOLEAN DEFAULT FALSE,
  tutorial_progress JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Agents Table
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT,
  status VARCHAR(50) DEFAULT 'active',
  parameters JSONB DEFAULT '{}'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Configuration

Environment variables required:
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Secret for JWT signing
- GOOGLE_CLIENT_ID - Google OAuth client ID
- OPENAI_API_KEY - OpenAI API key
- NODE_ENV - Environment (development/production)
- PORT - Server port (default: 3001)

## Error Handling

All errors extend the base `AppError` class and include:
- statusCode: HTTP status code
- message: User-friendly error message
- details: Technical details (only in development)

## Logging

Logging is handled by the `logger` utility which:
- Logs all requests with duration
- Logs database queries with execution time
- Logs errors with stack traces
- Logs events for debugging

## Security

- JWT authentication
- Request validation
- Rate limiting
- SQL injection prevention
- CORS configuration
- Secure headers

## Development

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Run tests
npm test

# Deploy
./deploy.sh
```

## Best Practices

1. Always use parameterized queries
2. Validate all request data
3. Use transactions for multi-step operations
4. Log meaningful information
5. Handle errors appropriately
6. Check resource ownership
7. Use proper HTTP status codes
8. Keep routes thin, logic in services
9. Use TypeScript types where possible
10. Write tests for critical paths
