# raise-an.ai Backend Documentation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- OpenAI API key
- Google OAuth credentials

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see .env.example)
4. Initialize database: `npm run db:init`
5. Start development server: `npm run dev`

## Core Components

### ResourceManager
Generic resource management system that handles CRUD operations with built-in validation, access control, and event tracking.

#### Methods

```javascript
const manager = new ResourceManager('table_name', 'resource_name');

// Create a new resource
await manager.create(userId, {
  name: 'Resource Name',
  description: 'Resource Description'
});

// List resources with options
await manager.list(userId, {
  sort: 'created_at',
  order: 'DESC',
  limit: 10,
  offset: 0
});

// Get single resource
await manager.getResource(resourceId, userId);

// Update resource
await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
});

// Delete resource
await manager.deleteResource(resourceId, userId);
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

- **Ownership Validation**: Automatically verifies resource ownership
- **Access Control**: Team-based and role-based access management  
- **Event System**: Emits events for all resource changes
- **Query Building**: Safe SQL construction with QueryBuilder
- **Error Handling**: Standardized error responses
- **Transaction Support**: Automatic rollback on failures

#### Usage Example

```javascript
// Initialize manager for a resource type
const manager = new ResourceManager('agents', 'agent');

// Create resource with validation
const agent = await manager.create(userId, {
  name: 'My Agent',
  system_prompt: 'You are a helpful assistant'
});
// Emits: resource.created

// List resources with filtering
const agents = await manager.list(userId, {
  status: 'active',
  orderBy: 'created_at',
  direction: 'DESC'
});

// Get single resource with access check
const agent = await manager.getResource(agentId, userId);
// Throws: NotFoundError or AccessDeniedError

// Update with validation
const updated = await manager.updateResource(agentId, userId, {
  name: 'Updated Name'
});
// Emits: resource.updated

// Delete with cascading
await manager.deleteResource(agentId, userId);
// Emits: resource.deleted
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

#### Error Handling

Standardized error handling:

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

#### Using ResourceManager

```javascript
// Create a resource manager instance
const manager = new ResourceManager('table_name', 'resource_name');

// Create with validation
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Resource Description'
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

// Delete with cascading
await manager.deleteResource(resourceId, userId);
// Handles related records cleanup
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

#### Using ResourceManager
```javascript
// Create a resource manager instance
const manager = new ResourceManager('table_name', 'resource_name');

// Create a new resource
const resource = await manager.create(userId, {
  name: 'Resource Name',
  description: 'Resource Description'
});

// List resources with options
const resources = await manager.list(userId, {
  sort: 'created_at',
  order: 'DESC',
  limit: 10,
  offset: 0
});

// Get single resource
const resource = await manager.getResource(resourceId, userId);

// Update resource
const updated = await manager.updateResource(resourceId, userId, {
  name: 'Updated Name'
});

// Delete resource
await manager.deleteResource(resourceId, userId);
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
