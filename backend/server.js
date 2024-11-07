const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');
const path = require('path');
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

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for RDS connections
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection and handle errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

pool.connect()
  .then(client => {
    console.log('Database connection established');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if we can't connect to database
  });

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from localhost development ports
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Add CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Auth middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No token provided in request');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      details: error.message
    });
  }
};

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
