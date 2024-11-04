const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'raise_an_ai',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connection established');
  }
});

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configuration Google OAuth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route d'authentification Google
app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleToken, userData } = req.body;
    console.log('Received request with userData:', userData);

    if (!userData || !userData.googleId) {
      console.error('Missing userData or googleId');
      return res.status(400).json({ error: 'Missing user data' });
    }

    // Create/update user in database
    const query = `
      INSERT INTO users (
        id, 
        email, 
        name, 
        picture, 
        google_id,
        tutorial_completed,
        tutorial_progress
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (google_id)
      DO UPDATE SET 
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        picture = EXCLUDED.picture,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userData.googleId,
      userData.email,
      userData.name,
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
      progress || JSON.stringify({"lastStep": 0, "completedSteps": []}),
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
});
