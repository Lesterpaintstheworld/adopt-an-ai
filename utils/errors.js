class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }

  toResponse() {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      success: false,
      error: isProduction ? this.getPublicMessage() : this.message,
      details: isProduction ? undefined : this.details,
      statusCode: this.statusCode
    };
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
