class ResourceController {
  constructor(manager) {
    this.manager = manager;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.manager.list(req.user.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  create = async (req, res, next) => {
    try {
      const result = await this.manager.create(req.user.userId, req.validated);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  update = async (req, res, next) => {
    try {
      const result = await this.manager.updateResource(
        req.params.id,
        req.user.userId,
        req.validated
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req, res, next) => {
    try {
      await this.manager.deleteResource(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ResourceController;
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
