# raise-an.ai Backend Documentation

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- OpenAI API key

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see .env.example)
4. Initialize database: `npm run db:init`
5. Start development server: `npm run dev`

## API Documentation

### Authentication

#### POST /api/auth/google
Authenticate user with Google OAuth token.

Request:
```json
{
  "googleToken": "string",
  "userData": {
    "googleId": "string",
    "email": "string",
    "name": "string",
    "picture": "string"
  }
}
```

Response:
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
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
