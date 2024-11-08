const { ValidationError } = require('../utils/errors');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      req.validated = validated;
      next();
    } catch (error) {
      next(new ValidationError('Invalid request data', error.errors));
    }
  };
};

module.exports = validateRequest;
