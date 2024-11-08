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
