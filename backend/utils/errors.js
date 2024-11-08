class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
  }
}

class NotFoundError extends AppError {
  constructor(message, details = null) {
    super(message, 404, details);
  }
}

class AuthorizationError extends AppError {
  constructor(message, details = null) {
    super(message, 401, details);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  AuthorizationError
};
