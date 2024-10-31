# Server Setup Guide

This guide explains how to set up and run the raise-an.ai web server.

## Prerequisites

Before starting the server, ensure you have:

1. Node.js (v16 or higher) installed
2. npm (v7 or higher) installed
3. All project dependencies installed (`npm install`)
4. Environment variables configured (`.env` file)

## Environment Configuration

1. Create a `.env` file in the root directory:
```bash
touch .env
```

2. Add the required environment variables:
```env
# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (if applicable)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raise_an_ai
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## Starting the Development Server

1. Run the development server:
```bash
npm start
```
This will:
- Start the React development server
- Enable hot reloading
- Open your default browser to `http://localhost:3000`

2. Alternative development commands:
```bash
# Start without opening browser
npm start -- --no-open

# Start on a specific port
PORT=4000 npm start
```

## Production Deployment

1. Build the production-ready application:
```bash
npm run build
```

2. Serve the production build:
```bash
# Using serve package
npx serve -s build

# Or using a production server like nginx
# Configure nginx to serve the /build directory
```

## Common Issues and Solutions

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory
- Verify variable names start with `REACT_APP_`
- Restart the development server

### Database Connection Issues
1. Check database service is running:
```bash
# PostgreSQL
sudo service postgresql status

# Or for macOS
brew services list
```

2. Verify database credentials in `.env`

## Monitoring and Logs

- Development logs appear in the terminal running the server
- Access the React Developer Tools in your browser
- Check browser console for frontend errors
- Server logs are in `npm-debug.log` if the server crashes

## Security Considerations

1. Never commit `.env` files to version control
2. Keep dependencies updated:
```bash
npm audit
npm update
```

3. Use HTTPS in production
4. Implement rate limiting for API endpoints
5. Configure CORS appropriately

## Additional Configuration

### Custom Port
```bash
# In .env
PORT=4000

# Or via command line
PORT=4000 npm start
```

### Proxy Configuration
Add to `package.json` for API proxying:
```json
{
  "proxy": "http://localhost:5000"
}
```

### SSL in Development
```bash
# In .env
HTTPS=true
SSL_CRT_FILE=path/to/cert.crt
SSL_KEY_FILE=path/to/cert.key
```

## Development Tools

### Recommended Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- Apollo DevTools (if using GraphQL)

### Debugging
1. Use Chrome DevTools with React Developer Tools
2. Enable source maps in development
3. Use browser console for frontend debugging
4. Check terminal for server-side logs

## Need Help?

1. Check the [troubleshooting guide](./troubleshooting.md)
2. Review [common issues](./common-issues.md)
3. Open an issue on GitHub
4. Contact the development team
