const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method
  });

  const error = err instanceof AppError ? err : new AppError(err.message);
  res.status(error.statusCode).json(error.toResponse());
};

module.exports = errorHandler;
