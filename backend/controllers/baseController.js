const httpResponses = require('../utils/responses');

class BaseController {
  async execute(req, res, next, action) {
    try {
      const result = await action(req);
      httpResponses.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BaseController;
