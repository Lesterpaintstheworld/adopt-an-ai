module.exports = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://raise-an.ai', 'https://www.raise-an.ai']
    : ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 heures
};
