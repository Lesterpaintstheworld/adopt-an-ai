const { validate } = require('../utils/validation');
const { AppError } = require('../utils/errors');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { body, query, params } = req;
      
      if (schema.body) {
        req.validatedBody = validate(schema.body, body);
      }
      if (schema.query) {
        req.validatedQuery = validate(schema.query, query);
      }
      if (schema.params) {
        req.validatedParams = validate(schema.params, params);
      }
      
      next();
    } catch (error) {
      next(new AppError('Validation failed', 400, error.details));
    }
  };
};

module.exports = validateRequest;
