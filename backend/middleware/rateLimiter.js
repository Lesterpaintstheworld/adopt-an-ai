const rateLimit = require('express-rate-limit');
const config = require('../config');

const limiter = rateLimit({
  windowMs: config.security.rateLimits.windowMs,
  max: config.security.rateLimits.max,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(config.security.rateLimits.windowMs / 1000)
  }
});

module.exports = limiter;
