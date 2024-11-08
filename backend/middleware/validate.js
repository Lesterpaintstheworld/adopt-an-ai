const { schemas } = require('../utils/validation');
const { ValidationError } = require('../utils/errors');

const validate = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!schemas[resourceType]) {
        throw new ValidationError(`No validation schema found for resource type: ${resourceType}`);
      }
      req.validated = schemas[resourceType].parse(req.body);
      next();
    } catch (error) {
      next(new ValidationError(error.message, error.errors));
    }
  };
};

module.exports = validate;
