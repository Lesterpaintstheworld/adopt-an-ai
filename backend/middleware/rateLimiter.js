const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

const limiter = rateLimit({
  windowMs: config.security.rateLimits.windowMs,
  max: config.security.rateLimits.max,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(config.security.rateLimits.windowMs / 1000)
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      headers: req.headers
    });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(config.security.rateLimits.windowMs / 1000)
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

module.exports = limiter;
