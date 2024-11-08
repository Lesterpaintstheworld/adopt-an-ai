const { formatResponse } = require('./responses');

const { formatResponse } = require('./responses');
const logger = require('./logger');

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse() {
    return formatResponse(false, null, this);
  }

  getPublicMessage() {
    const messages = {
      400: 'Invalid request',
      401: 'Unauthorized', 
      403: 'Forbidden',
      404: 'Not found',
      429: 'Too many requests',
      500: 'Internal server error'
    };
    return messages[this.statusCode] || 'Internal server error';
  }

  static handleError(err, req) {
    logger.error('Error caught', err, {
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body,
      user: req.user?.userId
    });

    return err instanceof AppError ? err : new AppError(err.message);
  }
}

class ValidationError extends AppError {
  constructor(details) {
    super('Validation failed', 400, details);
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class AccessDeniedError extends AppError {
  constructor(resource) {
    super(`Access denied to ${resource}`, 403);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  NotFoundError,
  AccessDeniedError
};
