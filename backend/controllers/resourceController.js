const BaseController = require('./baseController');

class ResourceController {
  constructor(resourceManager) {
    this.resourceManager = resourceManager;
    this.baseController = new BaseController();
  }

  async list(req, res, next) {
    return this.baseController.execute(req, res, next, async (req) => {
      return await this.resourceManager.list(req.user.userId);
    });
  }

  async create(req, res, next) {
    return this.baseController.execute(req, res, next, async (req) => {
      return await this.resourceManager.create(req.user.userId, req.validated);
    });
  }

  async update(req, res, next) {
    return this.baseController.execute(req, res, next, async (req) => {
      return await this.resourceManager.updateResource(
        req.params.id,
        req.user.userId, 
        req.validated
      );
    });
  }

  async delete(req, res, next) {
    return this.baseController.execute(req, res, next, async (req) => {
      await this.resourceManager.deleteResource(req.params.id, req.user.userId);
      return { message: 'Resource deleted successfully' };
    });
  }
}

module.exports = ResourceController;
