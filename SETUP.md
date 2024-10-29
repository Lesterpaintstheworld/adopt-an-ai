# Development Environment Setup

## Prerequisites

- Node.js 18+ 
- Docker Desktop
- Kubernetes (minikube for local development)
- PostgreSQL 14+
- Redis 6+
- Python 3.10+
- Git
- pnpm (preferred package manager)

## Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/ubclaunchpad/raise-an.ai.git
cd raise-an.ai
```

2. Install dependencies
```bash
# Install pnpm if not already installed
npm install -g pnpm

# Frontend
cd frontend
pnpm install

# Backend services
cd ../backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies for each service
cd user-service
pip install -r requirements.txt

cd ../ai-service
pip install -r requirements.txt

cd ../memory-service
pip install -r requirements.txt

cd ../resource-service
pip install -r requirements.txt
```

3. Configure environment variables
```bash
# Copy example env files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Start local services
```bash
# Start Docker containers
docker-compose up -d

# Start minikube
minikube start
kubectl apply -f k8s/dev/
```

5. Run development servers
```bash
# Frontend
cd frontend
npm run dev

# Backend services (in separate terminals)
cd backend/user-service
python run.py

cd backend/ai-service
python run.py

cd backend/memory-service
python run.py
```

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket server URL
- `VITE_ENVIRONMENT`: Development environment

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `OPENAI_API_KEY`: OpenAI API key
- `S3_BUCKET`: Asset storage bucket
- `VECTOR_DB_URL`: Vector database connection

## Database Setup

1. Create PostgreSQL databases
```bash
createdb raise_an_ai_dev
createdb raise_an_ai_test

# Run migrations
cd backend
alembic upgrade head
```

2. Initialize Vector Database
```bash
# Start Weaviate
docker-compose up -d weaviate

# Initialize schemas
python scripts/init_vector_db.py
```

## Running Tests

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Development Tools

### Recommended VSCode Extensions
- ESLint
- Prettier
- Python
- Docker
- Kubernetes
- GitLens
- REST Client

### IDE Setup
```json
{
  "editor.formatOnSave": true,
  "python.formatting.provider": "black",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### Common Issues

1. Database Connection Issues
- Check PostgreSQL is running: `pg_isready`
- Verify connection string in .env
- Ensure database exists

2. Docker Issues
- Reset Docker Desktop
- Clean unused images: `docker system prune`
- Check logs: `docker-compose logs`

3. Kubernetes Issues
- Reset minikube: `minikube delete && minikube start`
- Check pods: `kubectl get pods`
- View logs: `kubectl logs <pod-name>`

4. API Connection Issues
- Verify API is running
- Check CORS settings
- Confirm environment variables

### Getting Help
- Check project documentation
- Search GitHub issues
- Ask in #dev-help Slack channel
