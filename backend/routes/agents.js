const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../utils/validation');
const ResourceManager = require('../utils/resourceManager');
const ResourceController = require('../controllers/resourceController');
const eventEmitter = require('../utils/eventEmitter');

const agentManager = new ResourceManager('agents', 'agent');
const controller = new ResourceController(agentManager);

// Apply validation middleware
router.post('/', validate(schemas.agent));
router.put('/:id', validate(schemas.agent));

// CRUD routes
router.get('/', controller.list.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

module.exports = router;
