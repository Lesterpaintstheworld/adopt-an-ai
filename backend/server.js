const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

    // Vérifier le token Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    // Créer un token JWT
    const token = jwt.sign(
      { 
        userId: payload.sub,
        email: payload.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Envoyer la réponse
    res.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      },
      token
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
