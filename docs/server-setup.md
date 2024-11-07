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
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/raise_an_ai

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_API_KEY=sk-your-api-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
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

1. Install production dependencies:
```bash
cd backend
npm ci --only=production
```

2. Set up PM2 process manager:
```bash
# Install PM2 globally
npm install -g pm2

# Start the backend with PM2
pm2 start ecosystem.config.js

# Useful PM2 commands
pm2 status                    # Check status
pm2 logs raise-an-ai-backend  # View logs
pm2 restart raise-an-ai-backend
pm2 stop raise-an-ai-backend
```

3. Configure nginx as reverse proxy:
```nginx
# /etc/nginx/sites-available/raise-an-ai
server {
    listen 80;
    server_name api.raise-an.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Set OpenAI API key header
        proxy_set_header X-OPENAI-API-KEY "${OPENAI_API_KEY}";
    }
}
```

4. Enable and start nginx:
```bash
sudo ln -s /etc/nginx/sites-available/raise-an-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. For nginx deployment, use this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    root /var/www/raise-an.ai/dist;  # Path to your dist folder
    index index.html;

    # Handle Single Page Application routing
    location / {
        try_files $uri $uri/ /index.html?$args;  # Modified to preserve query parameters
        add_header Cache-Control "no-cache";      # Added for SPA routes
    }

    # Specific handling for Vite assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }

    # Handle Vite's SVG favicon
    location = /vite.svg {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";
}
```

6. Ensure your production server:
   - Has HTTPS configured
   - Has proper CORS settings
   - Serves the correct environment variables
   - Has proper cache headers for static assets

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
