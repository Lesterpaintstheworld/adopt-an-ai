const express = require('express');
const { validate } = require('../utils/validation');
const ResourceController = require('../controllers/resourceController');
const ResourceManager = require('../utils/resourceManager');

function createResourceRouter(resourceName, schema) {
  const router = express.Router();
  const manager = new ResourceManager(resourceName);
  const controller = new ResourceController(manager);

  // Apply validation middleware
  if (schema) {
    router.post('/', validate(schema));
    router.put('/:id', validate(schema));
  }

  // CRUD routes
  router.get('/', controller.list.bind(controller));
  router.post('/', controller.create.bind(controller));
  router.put('/:id', controller.update.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  return router;
}

module.exports = createResourceRouter;
