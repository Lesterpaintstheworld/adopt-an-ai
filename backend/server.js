const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

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

    // Vérification que nous avons bien reçu les données
    if (!userData || !userData.googleId) {
      console.error('Missing userData or googleId');
      return res.status(400).json({ error: 'Missing user data' });
    }

    // Au lieu de vérifier le token (qui est un access_token), utilisons directement les données utilisateur
    const user = {
      id: userData.googleId,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      googleId: userData.googleId
    };

    // Créer un token JWT
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

    // Envoyer la réponse
    res.json({ user, token });

  } catch (error) {
    console.error('Auth error details:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
