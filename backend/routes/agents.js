const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const validate = require('../middleware/validate');
const { schemas } = require('../utils/validation');
const ResourceManager = require('../utils/resourceManager');
const eventEmitter = require('../utils/eventEmitter');

const agentManager = new ResourceManager('agents', 'agent');
const agentsController = new ResourceController(agentManager);

// Apply validation middleware
router.post('/', validate(schemas.agent));
router.put('/:id', validate(schemas.agent));

// CRUD routes
router.get('/', agentsController.list);
router.post('/', agentsController.create);
router.put('/:id', agentsController.update);
router.delete('/:id', agentsController.delete);

module.exports = router;
