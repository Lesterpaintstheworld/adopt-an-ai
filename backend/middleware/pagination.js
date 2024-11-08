const config = require('../config');

const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(
    parseInt(req.query.limit) || config.api.defaultPageSize,
    config.api.maxPageSize
  );
  const offset = (page - 1) * limit;

  req.pagination = { limit, offset, page };
  next();
};

module.exports = paginationMiddleware;
