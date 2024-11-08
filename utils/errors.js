class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }

  toResponse() {
    return {
      error: process.env.NODE_ENV === 'production' 
        ? this.getPublicMessage()
        : this.message,
      details: this.details
    };
  }

  getPublicMessage() {
    switch(this.statusCode) {
      case 400: return 'Invalid request';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not found';
      default: return 'Internal server error';
    }
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
