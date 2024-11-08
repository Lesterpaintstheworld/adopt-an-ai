const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error caught by handler', err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    user: req.user?.userId,
    timestamp: new Date().toISOString()
  });

  const error = err instanceof AppError ? err : new AppError(err.message);
  res.status(error.statusCode).json(error.toResponse());
};
