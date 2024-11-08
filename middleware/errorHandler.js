const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const errorContext = {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    user: req.user?.userId,
    timestamp: new Date().toISOString()
  };

  logger.error('Error caught by handler', err, errorContext);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.details : undefined
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.details
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
