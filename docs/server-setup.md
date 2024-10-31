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
```

## Starting the Development Server

1. Run the development server:
```bash
npm run dev
```
This will:
- Start the Vite development server
- Enable hot module replacement (HMR)
- Show the local URL in the terminal

2. Alternative development commands:
```bash
# Preview production build
npm run preview

# Preview on a specific host/port
npm run preview -- --host 0.0.0.0 --port 3000
```

## Production Deployment

1. Build the production-ready application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Common Issues and Solutions

### Port Already in Use
```bash
# Find process using port 5173 (Vite's default port)
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory
- Restart the development server
- Check Vite's environment variable format (VITE_ prefix)

## Monitoring and Logs

- Development logs appear in the terminal running the server
- Access the React Developer Tools in your browser
- Check browser console for frontend errors
- Build logs are in the terminal during build process

## Security Considerations

1. Never commit `.env` files to version control
2. Keep dependencies updated:
```bash
npm audit
npm update
```

3. Use HTTPS in production
4. Configure CORS appropriately

## Additional Configuration

### Custom Port
```bash
# In vite.config.js
export default defineConfig({
  server: {
    port: 4000
  }
})
```

### SSL in Development
```typescript
// In vite.config.js
export default defineConfig({
  server: {
    https: true
  }
})
```

## Development Tools

### Recommended Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- Apollo DevTools (if using GraphQL)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate-icons` - Generate AI perk icons using DALL-E
- `npm run test-openai` - Test OpenAI integration
- `npm run test-icon-generation` - Test icon generation

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