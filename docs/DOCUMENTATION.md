# raise-an.ai Backend Documentation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ 
- OpenAI API key
- Google OAuth credentials
- Redis (optional, for caching)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see .env.example)
4. Initialize database: `npm run db:init`
5. Start development server: `npm run dev`

## Core Components

### Resource Management System

The ResourceManager provides a standardized way to handle CRUD operations with built-in validation, access control, and event tracking.

#### Core Features
- Generic resource CRUD operations with type safety
- Ownership and access control with team support
- Event-driven architecture with real-time tracking
- Query building with SQL injection protection
- Transaction support with automatic rollback
- Schema validation using Zod
- Audit logging and metrics
- Cascading deletions and cleanup

#### Usage Example
```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: { temperature: 0.7 }
}); // Emits: resource.created

// List with filtering and pagination
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup
```

#### Event System Integration
```javascript
// Resource lifecycle events with full context
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Query Builder Integration
```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Validation System
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### ResourceManager Usage

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling System

#### Custom Error Classes

```javascript
// Base application error
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }
}

// Specific errors
class ValidationError extends AppError {
  constructor(details) {
    super('Validation failed', 400, details);
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}
```

#### Error Handling Middleware

```javascript
app.use((err, req, res, next) => {
  logger.error('Error caught', err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    user: req.user?.userId
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.details : undefined
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});
```

#### Error Handling Example

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### Request Validation

All requests are validated using Zod schemas before processing. The validation system provides:

- Type safety with Zod schemas
- Custom validation rules
- Standardized error messages
- Request sanitization

#### Available Schemas

```typescript
// Agent Schema
const agentSchema = z.object({
  name: z.string().min(1).max(255),
  system_prompt: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  parameters: z.record(z.any()).optional(),
  tools: z.array(z.any()).optional()
});

// Team Schema
const teamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional()
});

// Team Member Schema
const teamMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['owner', 'admin', 'member']).default('member')
});

// Team Agent Schema 
const teamAgentSchema = z.object({
  agentId: z.string().uuid()
});
```

#### Using Validation

```javascript
// In route handlers
router.post('/', validate(schemas.agent), async (req, res) => {
  // req.validated contains the validated data
  const agent = await agentManager.create(req.user.id, req.validated);
  res.json(agent);
});

// Manual validation
const result = schemas.agent.safeParse(data);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

### API Endpoints

All endpoints require authentication via Bearer token.

Common Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Teams

#### GET /api/teams
Get teams for authenticated user.

Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string", 
    "memberCount": "number",
    "userRole": "owner|admin|member"
  }
]
```

#### POST /api/teams
Create new team.

Request:
```json
{
  "name": "string",
  "description": "string"
}
```

#### POST /api/teams/:teamId/members
Add member to team.

Request:
```json
{
  "userId": "string",
  "role": "admin|member"
}
```

#### POST /api/teams/:teamId/agents
Add agent to team.

Request:
```json
{
  "agentId": "uuid"
}
```

### Agents

#### GET /api/agents
Get AI agents for authenticated user.

Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "systemPrompt": "string",
    "status": "active|inactive",
    "parameters": {}
  }
]
```

#### POST /api/agents
Create new AI agent.

Request:
```json
{
  "name": "string",
  "systemPrompt": "string",
  "parameters": {
    "temperature": number,
    "maxTokens": number
  }
}
```

### AI Interactions

#### POST /api/ai/chat
Send messages to AI model.

Request:
```json
{
  "messages": [
    {
      "role": "system|user|assistant",
      "content": "string"
    }
  ],
  "temperature": number,
  "max_tokens": number
}
```

### Tutorial Progress

#### GET /api/users/:userId/tutorial-status
Get user's tutorial progress.

Response:
```json
{
  "isComplete": "boolean",
  "progress": {
    "lastStep": "number",
    "completedSteps": "string[]"
  }
}
```

#### POST /api/users/:userId/tutorial-status
Update tutorial progress.

Request:
```json
{
  "isComplete": "boolean",
  "progress": {
    "lastStep": "number",
    "completedSteps": "string[]"
  }
}
```

Standard Response Format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "HTTP status code",
  "type": "Error type",
  "details": "Error details object",
  "timestamp": "ISO-8601",
  "requestId": "Unique request ID"
}
```

Common HTTP status codes:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

### Authentication 

#### POST /api/auth/google
Authenticate user with Google OAuth token.

Headers:
```
Content-Type: application/json
Authorization: Bearer <google_token>
```

Request:
```json
{
  "googleToken": "string",  // Valid Google OAuth token
  "userData": {
    "googleId": "string",   // Google user ID
    "email": "string",      // User email address
    "name": "string",       // User display name
    "picture": "string",    // Profile picture URL
    "locale": "string"      // User locale
  }
}
```

Response:
```json
{
  "user": {
    "id": "string",         // Internal user ID
    "email": "string",      // User email
    "name": "string",       // User name
    "tutorial_completed": boolean,
    "tutorial_progress": {
      "lastStep": number,
      "completedSteps": string[]
    }
  },
  "token": "string"         // JWT token for authentication
}
```

Error Responses:
- 400: Invalid request data
- 401: Invalid Google token
- 500: Server error

Rate Limiting:
- 100 requests per 15 minutes per IP
- Real-time event tracking
- Cascading deletions
- Team-based access control
- Automatic timestamps

### ResourceManager Usage

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```
- Event-driven architecture
- Real-time updates
- Cascading deletions
- Audit trail generation

### ResourceManager Usage

```javascript
// Initialize a resource manager
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation and events
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Description'
}); // Validates against schema, emits resource.created

// List with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation and events
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Validates changes, emits resource.updated

// Delete with cascading and events
await manager.deleteResource(resourceId, userId);
// Handles related cleanup, emits resource.deleted
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### ResourceManager Usage

```javascript
// Initialize a resource manager
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Description'
}); // Validates against schema, emits resource.created

// List with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Validates changes, emits resource.updated

// Delete with cascading cleanup
await manager.deleteResource(resourceId, userId);
// Handles related cleanup, emits resource.deleted
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

```javascript
// Initialize a resource manager
const manager = new ResourceManager('agents', 'agent');

// Create with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: { temperature: 0.7 }
}); // Validates against schema

// List with filtering and pagination
const agents = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Validates changes

// Delete with cascading cleanup
await manager.deleteResource(agentId, userId);
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Creating a Resource Manager
```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Description'
}); // Validates against schema

// List with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Validates changes

// Delete with cascading cleanup
await manager.deleteResource(resourceId, userId);
```

### Caching System

#### Cache Configuration

```javascript
const NodeCache = require('node-cache');

class Cache {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = 3600) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  stats() {
    return this.cache.getStats();
  }
}
```

#### Cache Usage Example

```javascript
const cache = new Cache();

// In controllers
async function getResource(req, res) {
  const cacheKey = `resource:${req.params.id}`;
  
  // Check cache first
  let data = cache.get(cacheKey);
  
  if (!data) {
    // Get from database if not in cache
    data = await db.getResource(req.params.id);
    // Cache for 1 hour
    cache.set(cacheKey, data, 3600);
  }
  
  return res.json(data);
}
```

### Logging System

#### Logger Configuration

```javascript
const logger = {
  info: (message, data = {}) => {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...data
    });
  },

  error: (message, error, data = {}) => {
    console.error({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      ...data
    });
  }
};
```

#### Logging Usage Examples

```javascript
// Info logging
logger.info('Request received', {
  path: req.path,
  method: req.method,
  userId: req.user.id
});

// Error logging
logger.error('Processing error', error, {
  resourceId: req.params.id,
  userId: req.user.id
});

// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  logger.info('Resource created', { id, type, userId });
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
  // Last chance to access data
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Query Builder Usage
```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Validation System
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

#### Usage Example

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  },
  tools: ['search', 'calculator']
});
// Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
});
// Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});
```

### Query Builder

Safe SQL query construction with parameterization:

```javascript
const qb = new QueryBuilder();

// SELECT query
const query = qb
  .select(['id', 'name'])
  .from('agents')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

// INSERT query
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId
  })
  .returning('*')
  .build();

// UPDATE query
const update = qb
  .update('agents', 
    { name: 'Updated' },
    { id: agentId }
  )
  .returning('*')
  .build();

// DELETE query
const del = qb
  .delete()
  .from('agents')
  .where({ id: agentId })
  .returning('id')
  .build();
```

### Event System

Resource changes emit events that can be monitored:

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
  // Last chance to access data
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});

// Error events
events.on('resource.error', ({ error, context }) => {
  // Handle operation errors
  // Access full error context
});
```

#### Features

- **Ownership Validation**: Automatically checks if user owns or has access to resource
- **Access Control**: Configurable access rules per resource type
- **Event Emission**: Emits events for all CRUD operations
- **Error Handling**: Standardized error responses
- **Query Building**: Uses QueryBuilder for safe SQL operations
- **Transaction Support**: Wraps operations in transactions when needed

#### Events Emitted

```javascript
// Resource created
resource.created: { id, type, userId }

// Resource updated  
resource.updated: { id, type, userId, changes }

// Resource deleted
resource.deleted: { id, type, userId }

// Access denied
resource.accessDenied: { id, type, userId, action }
```

#### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  // NotFoundError: Resource not found
  // AccessDeniedError: User does not have access
  // ValidationError: Invalid data
  // DatabaseError: Database operation failed
}
```

### QueryBuilder
SQL query builder with protection against injection:
```javascript
const qb = new QueryBuilder();
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
```

### Event System
Application-wide event handling:
```javascript
const events = require('./utils/eventEmitter');
events.emit('resource.created', { id, type });
events.onWithLog('resource.created', handleCreate);
```

## API Documentation

### Resource Management System

The ResourceManager provides a standardized way to handle CRUD operations with built-in validation, access control, and event tracking.

#### Core Features

- **Generic Resource Operations**
  - Type-safe CRUD operations with validation
  - Automatic timestamps and audit trails
  - Transaction support with automatic rollback
  - Query building with SQL injection protection
  - Cascading deletions and cleanup

- **Access Control & Security**
  - Ownership validation per resource
  - Team-based access control
  - Role-based permissions
  - Resource sharing rules
  - Access audit logging
  - Rate limiting integration

#### Usage Example

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: { temperature: 0.7 }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted, handles related cleanup
```

#### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Event System

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Validation System

```javascript
// Resource schemas
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

#### Usage Example

```javascript
// Initialize a resource manager
const manager = new ResourceManager('agents', 'agent');

// Create with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: { temperature: 0.7 }
}); // Validates against schema, emits resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Validates changes, emits resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits resource.deleted, handles related cleanup
```

#### Event System

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Validation System

```javascript
// Resource schemas
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Query Builder Usage

```javascript
const qb = new QueryBuilder();

// SELECT with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

- **Event System Integration**
  - Real-time event emission
  - Operation tracking and metrics
  - Audit trail generation
  - Error event handling
  - Custom event subscribers
  - Async operation support

- **Query Building & Data Access**
  - Safe SQL construction via QueryBuilder
  - Parameterized queries
  - Transaction management
  - Connection pooling
  - Query optimization
  - Index utilization

#### Usage Examples

```typescript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
}); // Emits: resource.created

// List with advanced filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at', 
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});
```

#### Event System

```typescript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});

// Error events
events.on('resource.error', ({ error, context }) => {
  // Handle operation errors
  // Access full error context
});
```

#### Query Builder Usage

```typescript
const qb = new QueryBuilder();

// SELECT with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Validation System

```typescript
// Resource schemas
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.object({
      temperature: z.number().min(0).max(1),
      max_tokens: z.number().positive()
    }).optional(),
    tools: z.array(z.string()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling

```typescript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### API Endpoints

All resource endpoints follow this pattern:

```
GET    /api/resources          - List resources
POST   /api/resources          - Create resource
GET    /api/resources/:id      - Get resource
PUT    /api/resources/:id      - Update resource  
DELETE /api/resources/:id      - Delete resource
```

Common Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

Standard Response Format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "code": 400,
  "type": "ValidationError", 
  "details": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create resource with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  },
  tools: ['search', 'calculator']
});
// Emits: resource.created with full context

// List resources with advanced filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword',
  filters: {
    created_after: '2024-01-01',
    has_tools: true
  }
});

// Get single resource with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError with context

// Update with validation and partial updates
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
});
// Emits: resource.updated with change tracking

// Delete with cascading and cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted with cleanup details
// Handles: Related record cleanup, file deletion, cache invalidation

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});

// Event handling
manager.on('resource.created', ({ resource, user, context }) => {
  // Handle resource creation
  // Access full audit context
  // Trigger side effects
});
```

#### Validation System

```javascript
// Resource schemas
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.object({
      temperature: z.number().min(0).max(1),
      max_tokens: z.number().positive()
    }).optional(),
    tools: z.array(z.string()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Event System

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});

// Error events
events.on('resource.error', ({ error, context }) => {
  // Handle operation errors
  // Access full error context
});
```

#### Query Builder Usage

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .offset(20)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();

// DELETE with cascade
const del = qb
  .delete()
  .from('agents')
  .where({ id: agentId })
  .returning('id')
  .build();
```

#### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  } else {
    // Unexpected error
    // Full error context available
  }
}
```

#### Event System

The ResourceManager emits events for all operations:

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

#### Query Builder Integration

Uses QueryBuilder for safe SQL operations:

```javascript
const qb = new QueryBuilder();

// SELECT query
const query = qb
  .select(['id', 'name'])
  .from('agents')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

// INSERT query
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId
  })
  .returning('*')
  .build();
```

#### Validation System

Integrated with Zod schemas:

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Validation middleware
app.post('/api/agents',
  validate(schemas.agent),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### Event System

The event system provides real-time tracking of all resource operations:

#### Event Emitter Configuration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

#### Query Builder Usage

```javascript
const qb = new QueryBuilder();

// SELECT query
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

// INSERT query
const insert = qb
  .insert('users', {
    name: 'John',
    email: 'john@example.com'
  })
  .returning('*')
  .build();

// UPDATE query
const update = qb
  .update('users', 
    { name: 'Updated' },
    { id: userId }
  )
  .returning('*')
  .build();

// DELETE query
const del = qb
  .delete()
  .from('users')
  .where({ id: userId })
  .returning('id')
  .build();
```

#### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Rate Limiting

```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: 900 // 15 minutes in seconds
  }
});

// Apply rate limiting to routes
app.use('/api', rateLimiter);
```

#### Creating a Resource Manager
```javascript
// Initialize a resource manager for a specific table
const manager = new ResourceManager('table_name', 'resource_name');

// Create a new resource with validation
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Resource Description'
}); // Validates against schema

// List resources with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get resource with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Validates changes

// Delete with cascading
await manager.deleteResource(resourceId, userId);
// Handles related records cleanup
```

#### Event System Integration
```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

#### Query Builder Usage
```javascript
const qb = new QueryBuilder();

// SELECT query
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

// INSERT query  
const insert = qb
  .insert('users', {
    name: 'John',
    email: 'john@example.com'
  })
  .returning('*')
  .build();

// UPDATE query
const update = qb
  .update('users', 
    { name: 'Updated' },
    { id: userId }
  )
  .returning('*')
  .build();

// DELETE query
const del = qb
  .delete()
  .from('users')
  .where({ id: userId })
  .returning('id')
  .build();
```

#### Validation System
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
  } else if (error instanceof ValidationError) {
    // Invalid data
  } else {
    // Unexpected error
  }
}
```

#### Access Control
The ResourceManager automatically handles:
- Resource ownership verification
- Team-based access control
- Role-based permissions
- Cross-resource access rules

```javascript
// Ownership checking
await manager.checkOwnership(resourceId, userId);

// Access control for teams
await manager.checkAccess(resourceId, userId);
```

#### Event System Integration
Resource changes emit events that can be monitored:

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

#### Query Builder Integration
The ResourceManager uses QueryBuilder for safe SQL operations:

```javascript
const qb = new QueryBuilder();
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
  } else if (error instanceof ValidationError) {
    // Invalid data
  }
}
```

#### Using ResourceManager

```javascript
// Create a resource manager instance
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation and events
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Resource Description'
}); // Validates against schema, emits resource.created

// List with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation and events
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Validates changes, emits resource.updated

// Delete with cascading and events
await manager.deleteResource(resourceId, userId);
// Handles related records cleanup, emits resource.deleted
```

#### Event System
Resource changes emit events that can be monitored:

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});

// Error events
events.on('resource.error', ({ error, context }) => {
  // Handle operation error
});
```

#### Query Builder
Safe SQL query construction:

```javascript
const qb = new QueryBuilder();

// SELECT query
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

// INSERT query
const insert = qb
  .insert('users', {
    name: 'John',
    email: 'john@example.com'
  })
  .returning('*')
  .build();

// UPDATE query
const update = qb
  .update('users', 
    { name: 'Updated' },
    { id: userId }
  )
  .returning('*')
  .build();

// DELETE query
const del = qb
  .delete()
  .from('users')
  .where({ id: userId })
  .returning('id')
  .build();
```

#### Validation System
Schema-based validation using Zod:

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Rate Limiting
Request rate limiting configuration:

```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: 900 // 15 minutes in seconds
  }
});

// Apply rate limiting to routes
app.use('/api', rateLimiter);
```

#### Core Components

##### QueryBuilder
Provides safe SQL query construction:
```javascript
const qb = new QueryBuilder();
const query = qb
  .select(['id', 'name'])
  .from('users')
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
```

##### Event System
Resource changes emit events that can be monitored:
```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update  
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events  
events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

##### Validation System
Schema-based validation using Zod:
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100), 
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  })
};
```

### Resource Management System

The ResourceManager provides a standardized way to handle CRUD operations with built-in validation, access control, and event tracking.

### Core Features

- **Generic Resource Operations**
  - Type-safe CRUD operations
  - Automatic timestamps
  - Transaction support with rollback
  - Cascading deletions
  - Bulk operations support

- **Access Control**
  - Ownership validation
  - Team-based permissions
  - Role-based access control
  - Resource sharing rules
  - Access audit logging

- **Event System Integration** 
  - Real-time event emission
  - Operation tracking
  - Audit trail generation
  - Error event handling
  - Custom event subscribers

- **Data Validation**
  - Schema-based validation using Zod
  - Custom validation rules
  - Input sanitization
  - Error aggregation
  - Type inference

### ResourceManager API

#### Constructor
```javascript
const manager = new ResourceManager(tableName, resourceName);
```

#### Methods
- `create(userId, data)` - Create new resource
- `list(userId, options)` - List resources with filtering
- `getResource(resourceId, userId)` - Get single resource
- `updateResource(resourceId, userId, data)` - Update resource
- `deleteResource(resourceId, userId)` - Delete resource
- `checkOwnership(resourceId, userId)` - Verify ownership
- `checkAccess(resourceId, userId)` - Check access rights

#### Events Emitted
- `resource.created` - When resource is created
- `resource.updated` - When resource is updated  
- `resource.deleted` - When resource is deleted
- `resource.accessDenied` - When access check fails

#### Usage Example
```javascript
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  },
  tools: ['search', 'calculator']
});
// Emits: resource.created

// List with advanced filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
});
// Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});
```

#### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

### ResourceManager Usage
```javascript
// Initialize a resource manager
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation and events
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Description'
}); // Emits: resource.created

// List with filtering and pagination
const resources = await manager.list(userId, {
  filter: { status: 'active' },
  sort: '-created_at',
  page: 1,
  limit: 20
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation and events
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cascading cleanup
await manager.deleteResource(resourceId, userId);
// Emits: resource.deleted
// Handles related cleanup
```

#### Event System Integration
```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

#### Query Builder Integration
```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

#### Validation System
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```

#### Usage Example
```javascript
// Initialize a resource manager
const manager = new ResourceManager('agents', 'agent');

// Create with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: { temperature: 0.7 }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC'
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
```

#### Event System Integration
```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

#### Validation System
```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional()
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

#### Error Handling
```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
  } else if (error instanceof AccessDeniedError) {
    // Access denied
  } else if (error instanceof ValidationError) {
    // Invalid data
  }
}
```

### ResourceManager Usage

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0
});

// Get with ownership check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup
```

### Event System Integration

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId, resource }) => {
  // Handle resource creation
  // Full resource data available
});

events.on('resource.updated', ({ id, type, userId, changes, previous }) => {
  // Handle resource update
  // Access what changed
});

events.on('resource.deleted', ({ id, type, userId, resource }) => {
  // Handle resource deletion
  // Last chance to access data
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
  // Audit security events
});
```

### Query Builder Integration

```javascript
const qb = new QueryBuilder();

// SELECT query with joins
const query = qb
  .select(['a.*', 't.name as team_name'])
  .from('agents a')
  .leftJoin('team_agents ta', 'a.id = ta.agent_id')
  .leftJoin('teams t', 'ta.team_id = t.id')
  .where({ 'a.status': 'active' })
  .orderBy('a.created_at', 'DESC')
  .limit(10)
  .build();

// INSERT with returning
const insert = qb
  .insert('agents', {
    name: 'New Agent',
    user_id: userId,
    parameters: { temperature: 0.7 }
  })
  .returning('*')
  .build();

// UPDATE with conditions
const update = qb
  .update('agents', 
    { status: 'inactive' },
    { id: agentId, user_id: userId }
  )
  .returning('*')
  .build();
```

### Validation System

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Error Handling

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
    // Access error.details for context
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
    // Access error.context for audit
  } else if (error instanceof ValidationError) {
    // Invalid data
    // Access error.errors for details
  }
}
```
- Real-time event tracking
- Cascading deletions
- Team-based access control
- Automatic timestamps

#### Usage Example

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  },
  tools: ['search', 'calculator']
});
// Emits: resource.created

// List with advanced filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
});
// Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});
```

#### Error Handling

The ResourceManager provides standardized error handling:

```javascript
try {
  await manager.getResource(id, userId);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Resource not found
  } else if (error instanceof AccessDeniedError) {
    // User does not have access
  } else if (error instanceof ValidationError) {
    // Invalid data
  } else {
    // Unexpected error
  }
}
```

#### Middleware Integration

The system includes middleware for validation and rate limiting:

```javascript
// Validation middleware
app.post('/api/resources', 
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);

// Rate limiting middleware
app.use('/api', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
}));
```

#### Event System
Resource changes emit events that can be monitored:

```javascript
// Resource lifecycle events
resourceManager.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

resourceManager.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

resourceManager.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

// Access control events
resourceManager.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});

// Error events
resourceManager.on('resource.error', ({ error, context }) => {
  // Handle operation error
});
```

#### Common Resource Endpoints
All resources follow this pattern:
```
GET    /api/{resource}          - List resources
POST   /api/{resource}          - Create resource  
GET    /api/{resource}/:id      - Get resource
PUT    /api/{resource}/:id      - Update resource
DELETE /api/{resource}/:id      - Delete resource
```

## Resource Management System

### Overview
Le ResourceManager fournit une interface standardisée pour gérer les opérations CRUD avec :
- Validation automatique
- Contrôle d'accès  
- Suivi des événements
- Protection contre les injections SQL
- Support des transactions

### Usage
```javascript
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Description'
}); // Émet: resource.created

// List with filtering
const resources = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC'
});

// Get with ownership check
const resource = await manager.getResource(resourceId, userId);
// Throws NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
}); // Émet: resource.updated

// Delete with cleanup
await manager.deleteResource(resourceId, userId);
// Émet: resource.deleted
```

### Event System
```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});
```

#### Usage Examples

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create with validation and events
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
}); // Emits: resource.created

// List with advanced filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at', 
  direction: 'DESC',
  limit: 20,
  offset: 0,
  search: 'keyword'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name',
  parameters: {
    ...agent.parameters,
    temperature: 0.8
  }
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
// Handles: Related cleanup

// Transaction example
await manager.withTransaction(async (transaction) => {
  const agent = await manager.create(userId, data, { transaction });
  await manager.addToTeam(teamId, agent.id, { transaction });
});
```

#### Event System
Resource changes emit events that can be monitored:

```javascript
// Resource created
resource.created: { id, type, userId }

// Resource updated
resource.updated: { id, type, userId, changes }

// Resource deleted
resource.deleted: { id, type, userId }

// Access denied
resource.accessDenied: { id, type, userId, action }
```

### Request Validation

All requests are validated using Zod schemas before processing. The validation system provides:

- Type safety with Zod schemas
- Custom validation rules
- Standardized error messages
- Request sanitization

#### Available Schemas

```typescript
// Agent Schema
const agentSchema = z.object({
  name: z.string().min(1).max(255),
  system_prompt: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  parameters: z.record(z.any()).optional(),
  tools: z.array(z.any()).optional()
});

// Team Schema
const teamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional()
});

// Team Member Schema
const teamMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['owner', 'admin', 'member']).default('member')
});

// Team Agent Schema 
const teamAgentSchema = z.object({
  agentId: z.string().uuid()
});
```

#### Using Validation

```javascript
// In route handlers
router.post('/', validate(schemas.agent), async (req, res) => {
  // req.validated contains the validated data
  const agent = await agentManager.create(req.user.id, req.validated);
  res.json(agent);
});

// Manual validation
const result = schemas.agent.safeParse(data);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

#### Event System
Resource changes emit events that can be monitored:

```javascript
// Resource created
resource.created: { id, type, userId }

// Resource updated
resource.updated: { id, type, userId, changes }

// Resource deleted  
resource.deleted: { id, type, userId }

// Access denied
resource.accessDenied: { id, type, userId, action }
```

### Authentication 

#### POST /api/auth/google
Authenticate user with Google OAuth token.

Headers:
```
Content-Type: application/json
Authorization: Bearer <google_token>
```

Request:
```json
{
  "googleToken": "string",  // Valid Google OAuth token
  "userData": {
    "googleId": "string",   // Google user ID
    "email": "string",      // User email address
    "name": "string",       // User display name
    "picture": "string",    // Profile picture URL
    "locale": "string"      // User locale
  }
}
```

### Resource Endpoints

All resource endpoints follow this pattern:
```
GET    /api/{resource}          - List resources
POST   /api/{resource}          - Create resource
GET    /api/{resource}/:id      - Get resource
PUT    /api/{resource}/:id      - Update resource
DELETE /api/{resource}/:id      - Delete resource
```

Common Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

Standard Response Format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "code": 400,
  "type": "ValidationError",
  "details": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

Response:
```json
{
  "user": {
    "id": "string",         // Internal user ID
    "email": "string",      // User email
    "name": "string",       // User name
    "tutorial_completed": boolean,
    "tutorial_progress": {
      "lastStep": number,
      "completedSteps": string[]
    }
  },
  "token": "string"         // JWT token for authentication
}
```

Error Responses:
- 400: Invalid request data
- 401: Invalid Google token
- 500: Server error

Rate Limiting:
- 100 requests per 15 minutes per IP

### Teams

#### GET /api/teams
Get teams for authenticated user.

Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "memberCount": "number",
    "userRole": "owner|admin|member"
  }
]
```

#### POST /api/teams
Create new team.

Request:
```json
{
  "name": "string",
  "description": "string"
}
```

### Agents

#### GET /api/agents
Get AI agents for authenticated user.

Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "systemPrompt": "string",
    "status": "active|inactive",
    "parameters": {}
  }
]
```

#### POST /api/agents
Create new AI agent.

Request:
```json
{
  "name": "string",
  "systemPrompt": "string",
  "parameters": {}
}
```

### Tutorial Progress

#### GET /api/users/:userId/tutorial-status
Get user's tutorial progress.

Response:
```json
{
  "isComplete": "boolean",
  "progress": {
    "lastStep": "number",
    "completedSteps": "string[]"
  }
}
```

## Error Handling

All error responses follow this format:
```json
{
  "error": "string",
  "details": "string|object"
}
```

Common HTTP status codes:
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Resource Management System

The system uses a generic `ResourceManager` class to handle CRUD operations on resources with:

### Core Features

- Automatic data validation
- Access control and ownership verification  
- Event emission for tracking
- Transaction support
- Standardized error handling

### Usage Example

```javascript
// Initialize a resource manager
const manager = new ResourceManager('agents', 'agent');

// Create with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are an assistant',
  parameters: { temperature: 0.7 }
}); // Emits: resource.created

// List with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC'
});

// Get with access check
const agent = await manager.getResource(agentId, userId);
// Throws NotFoundError or AccessDeniedError if not authorized

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'New Name'
}); // Emits: resource.updated

// Delete with cleanup
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
```

### Event System

```javascript
// Resource lifecycle events
events.on('resource.created', ({ id, type, userId }) => {
  // Handle resource creation
});

events.on('resource.updated', ({ id, type, userId, changes }) => {
  // Handle resource update
});

events.on('resource.deleted', ({ id, type, userId }) => {
  // Handle resource deletion
});

events.on('resource.accessDenied', ({ id, type, userId, action }) => {
  // Handle access denial
});
```

### Request Validation

All requests are validated using Zod schemas:

```javascript
const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived'])
  })
};

// Using validation middleware
app.post('/api/resources',
  validate(schemas.resource),
  async (req, res) => {
    // req.validated contains validated data
  }
);
```

### Standard API Endpoints

All resource endpoints follow this pattern:

```
GET    /api/resources          - List resources
POST   /api/resources          - Create resource
GET    /api/resources/:id      - Get resource
PUT    /api/resources/:id      - Update resource  
DELETE /api/resources/:id      - Delete resource
```

Common Headers:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

Standard Response Format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "HTTP status code",
  "type": "Error type",
  "details": {},
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

## Development Guide

### Adding New Features
1. Create route handler in `routes/`
2. Add validation schema in `utils/validation.js`
3. Implement business logic
4. Add tests
5. Update documentation

### Database Migrations
1. Create migration file in `migrations/`
2. Test locally: `npm run migrate`
3. Deploy: Migration runs automatically on deploy

### Deployment
1. Push to main branch
2. CI/CD pipeline runs tests
3. Deploy script executes:
   - Install dependencies
   - Run migrations
   - Restart PM2 processes

## Troubleshooting

### Common Issues

#### Database Connection Errors
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check connection pool settings

#### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Validate Google OAuth credentials

#### Rate Limiting
- Default: 100 requests per 15 minutes
- Increase limits in config/index.js
- Check client IP address handling

## Maintenance

### Regular Tasks
1. Monitor error logs
2. Check resource usage
3. Backup database
4. Update dependencies

### Performance Optimization
1. Review slow queries
2. Optimize indexes
3. Adjust connection pools
4. Cache frequently accessed data

## Related Documentation
- [README](README.md) - Project overview and setup
- [Technical Architecture](ARCHITECTURE.md) - System design and components
