# Backend Documentation

## File Organization

### Config Files
- `config/index.js`: Global configuration settings
- `config/cors.js`: CORS configuration
- `config/db.js`: Database configuration

### Middleware
- `middleware/auth.js`: JWT authentication
- `middleware/errorHandler.js`: Error processing
- `middleware/rateLimiter.js`: Request limiting
- `middleware/requestValidator.js`: Input validation

### Database
- `migrations/*.sql`: Database schema changes
- `utils/db.js`: Database operations
- `utils/queryBuilder.js`: SQL query construction

### Utils
- `utils/responses.js`: HTTP response formatting
- `utils/validation.js`: Data validation
- `utils/eventEmitter.js`: Event handling
- `utils/logger.js`: Logging utilities
- `utils/resourceManager.js`: Resource CRUD

## Features

### Authentication
- Google OAuth integration
- JWT token management
- Session handling
- User management

### Resource Management
- Teams CRUD operations
- Agent management
- User profiles
- Tutorial progress

### AI Integration
- OpenAI API integration
- Chat completions
- System prompts
- Tool management

## User Guides

### Setting Up Development Environment
1. Install dependencies
2. Configure environment variables
3. Initialize database
4. Start development server

### Database Management
1. Creating migrations
2. Running migrations
3. Database backup
4. Data restoration

### Adding New Features
1. Creating routes
2. Implementing validation
3. Adding middleware
4. Testing endpoints

## Workflows

### Development Workflow
1. Feature branch creation
2. Local development
3. Testing
4. Pull request
5. Code review
6. Deployment

### Deployment Workflow
1. Environment preparation
2. Database migration
3. Code deployment
4. Service restart
5. Health verification

### Maintenance Procedures
1. Log rotation
2. Database backup
3. Performance monitoring
4. Security updates

## Troubleshooting

### Common Issues
- Database connection errors
- Authentication failures
- Rate limit issues
- Validation errors

### Debugging Tools
- PM2 logs
- Database queries
- API testing
- Error tracking

### Maintenance Tasks
- Log cleanup
- Database optimization
- Cache clearing
- Security updates

## API Documentation

### Authentication Endpoints
- POST /api/auth/google
- GET /api/auth/validate
- POST /api/auth/logout

### Team Endpoints
- GET /api/teams
- POST /api/teams
- PUT /api/teams/:id
- DELETE /api/teams/:id

### Agent Endpoints
- GET /api/agents
- POST /api/agents
- PUT /api/agents/:id
- DELETE /api/agents/:id

### Tutorial Endpoints
- GET /api/users/:userId/tutorial-status
- POST /api/users/:userId/tutorial-status
