const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Token validation endpoint
router.get('/validate', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Token is valid
    res.status(200).json({ valid: true });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
