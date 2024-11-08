const { AppError } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  const error = AppError.handleError(err, req);
  res.status(error.statusCode).json(error.toResponse());
};
