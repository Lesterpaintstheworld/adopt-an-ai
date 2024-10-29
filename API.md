# raise-an.ai API Specification

## Authentication

### POST /api/auth/login
Request:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "access_token": "string",
  "refresh_token": "string"
}
```

### POST /api/auth/register
Request:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```
Response:
```json
{
  "user_id": "string",
  "access_token": "string"
}
```

### POST /api/auth/refresh
Request:
```json
{
  "refresh_token": "string"
}
```
Response:
```json
{
  "access_token": "string"
}
```

## User Service

### GET /api/users/{id}
Response:
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "created_at": "timestamp",
  "subscription_tier": "string"
}
```

### PUT /api/users/{id}
Request:
```json
{
  "name": "string",
  "email": "string"
}
```

### GET /api/users/{id}/profile
Response:
```json
{
  "user_id": "string",
  "ai_count": "number",
  "subscription": {
    "tier": "string",
    "limits": {
      "compute": "number",
      "storage": "number"
    }
  }
}
```

## AI Core Service

### POST /api/ai/chat
Request:
```json
{
  "ai_id": "string",
  "message": "string",
  "context": {
    "history_id": "string"
  }
}
```
Response:
```json
{
  "message_id": "string",
  "response": "string",
  "tokens_used": "number"
}
```

### GET /api/ai/techtree
Response:
```json
{
  "nodes": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "requirements": ["string"],
      "unlocked": "boolean"
    }
  ]
}
```

### POST /api/ai/prompt
Request:
```json
{
  "ai_id": "string",
  "system_prompt": "string",
  "parameters": {
    "temperature": "number",
    "max_tokens": "number"
  }
}
```

## Memory Service

### GET /api/memory/{aiId}/history
Query Parameters:
- start_date: timestamp
- end_date: timestamp
- limit: number

Response:
```json
{
  "conversations": [
    {
      "id": "string",
      "timestamp": "timestamp",
      "summary": "string",
      "messages": []
    }
  ]
}
```

### POST /api/memory/{aiId}/store
Request:
```json
{
  "type": "string",
  "content": "string",
  "metadata": {}
}
```

### GET /api/memory/{aiId}/recall
Query Parameters:
- query: string
- limit: number

Response:
```json
{
  "memories": [
    {
      "id": "string",
      "content": "string",
      "relevance": "number"
    }
  ]
}
```

## Resource Service

### GET /api/resources/usage
Response:
```json
{
  "compute": {
    "used": "number",
    "total": "number"
  },
  "storage": {
    "used": "number",
    "total": "number"
  }
}
```

### POST /api/resources/allocate
Request:
```json
{
  "compute_units": "number",
  "storage_gb": "number"
}
```

### GET /api/resources/limits
Response:
```json
{
  "tier_limits": {
    "free": {
      "compute": "number",
      "storage": "number"
    },
    "standard": {
      "compute": "number",
      "storage": "number"
    },
    "professional": {
      "compute": "number",
      "storage": "number"
    }
  }
}
```

## WebSocket Endpoints

### /ws/ai/chat
Events:
- message
- typing_indicator
- status_update

### /ws/ai/status
Events:
- online_status
- resource_usage
- training_progress

## Error Responses
All error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common Error Codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
