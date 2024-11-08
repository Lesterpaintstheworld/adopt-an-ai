const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const timeout = require('connect-timeout');
const pool = require('./config/db');
const config = require('./config');
const verifyToken = require('./middleware/auth');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
require('dotenv').config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Debug database configuration
console.log('Database config:', {
  connectionString: process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@'), // Hide password
  ssl: true,
  max: 20
});

// Import routes
const agentsRouter = require(path.join(__dirname, 'routes', 'agents'));
const authRouter = require(path.join(__dirname, 'routes', 'auth'));
const teamsRouter = require(path.join(__dirname, 'routes', 'teams'));


// Test database connection and handle errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // Tentative de reconnexion
  setTimeout(() => {
    console.log('Attempting to reconnect to database...');
    pool.connect();
  }, 5000);
});

// Test de connexion initial
pool.connect()
  .then(client => {
    console.log('Database connection established');
    client.release();
  })
  .catch(err => {
    console.error('Initial database connection error:', err);
    process.exit(1);
  });

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(timeout(config.api.timeout));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`
    });
  });
  next();
});



// Import AI router
const aiRouter = require('./routes/ai');

// Register routes with auth middleware
app.use('/api/agents', verifyToken, agentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/teams', verifyToken, teamsRouter);
app.use('/api/ai', verifyToken, aiRouter);

// Log registered routes
console.log('Registered routes:', app._router.stack
  .filter(r => r.route)
  .map(r => ({
    path: r.route.path,
    methods: Object.keys(r.route.methods)
  }))
);

// Configuration Google OAuth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route d'authentification Google

app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleToken, userData } = req.body;
    console.log('Received auth request for:', userData?.email);

    if (!userData?.googleId || !userData?.email) {
      console.error('Invalid user data received:', userData);
      return res.status(400).json({ 
        error: 'Missing required user data',
        details: 'Both googleId and email are required'
      });
    }

    // Create/update user in database
    const query = `
      INSERT INTO users (
        id, 
        email, 
        name,
        username,
        picture, 
        google_id,
        tutorial_completed,
        tutorial_progress
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (google_id)
      DO UPDATE SET 
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        picture = EXCLUDED.picture,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userData.googleId,
      userData.email,
      userData.name,
      userData.email.split('@')[0], // Use email local part as username
      userData.picture,
      userData.googleId,
      false,
      '{"lastStep": 0, "completedSteps": []}'
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000)
      }, 
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    console.log('Authentication successful for user:', user.email);
    res.json({ user, token });

  } catch (error) {
    console.error('Auth error details:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

// Tutorial status endpoints
app.get('/api/users/:userId/tutorial-status', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT tutorial_completed, tutorial_progress
      FROM users
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        details: `No user found with ID: ${userId}`
      });
    }

    const { tutorial_completed, tutorial_progress } = result.rows[0];
    
    res.json({
      isComplete: tutorial_completed,
      progress: tutorial_progress
    });

  } catch (error) {
    console.error('Error fetching tutorial status:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

app.post('/api/users/:userId/tutorial-status', async (req, res) => {
  const { userId } = req.params;
  const { isComplete, progress } = req.body;

  try {
    const query = `
      UPDATE users
      SET 
        tutorial_completed = $1,
        tutorial_progress = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING tutorial_completed, tutorial_progress
    `;
    
    const result = await pool.query(query, [
      isComplete, 
      progress || JSON.stringify({
        lastStep: 0, 
        completedSteps: [],
        dismissedPages: []
      }),
      userId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        details: `No user found with ID: ${userId}`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating tutorial status:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

// Add rate limiting
app.use(rateLimiter);

// Add timeout middleware
app.use(timeout(config.api.timeout));
app.use((req, res, next) => {
  if (!req.timedout) {
    next();
  } else {
    console.error('Request timeout:', {
      method: req.method,
      path: req.path,
      duration: '30s'
    });
    res.status(503).json({
      error: 'Request timeout',
      message: 'The request took too long to process'
    });
  }
});

// Error handling
app.use(errorHandler);

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end();
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
