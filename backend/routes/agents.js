const express = require('express');
const router = express.Router();
const dbUtils = require('../utils/db');
const httpResponses = require('../utils/responses');
const validate = require('../middleware/validate');
const QueryBuilder = require('../utils/queryBuilder');
const validateRequest = require('../middleware/requestValidator');
const ResourceManager = require('../utils/resourceManager');
const eventEmitter = require('../utils/eventEmitter');

const agentManager = new ResourceManager('agents');

router.get('/', async (req, res) => {
  try {
    if (!req.user?.userId) {
      throw new AppError('No user data found in request', 401);
    }

    const userExists = await dbUtils.checkExists('users', req.user.userId, req.user.userId);
    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const qb = new QueryBuilder();
    const query = qb
      .select('*')
      .from('agents')
      .where({ user_id: req.user.userId })
      .orderBy('created_at', 'DESC')
      .build();

    const result = await dbUtils.executeQuery(
      query.text,
      query.values,
      { logExtra: { route: 'GET /agents' }}
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/agents
router.post('/', validate('agent'), async (req, res, next) => {
  try {
    const result = await agentManager.create(req.user.userId, {
      ...req.validated,
      status: req.validated.status || 'active',
      parameters: req.validated.parameters || {},
      tools: req.validated.tools || []
    });

    httpResponses.success(res, result, 201);
  } catch (error) {
    next(error);
  }
});

// PUT /api/agents/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, system_prompt, status, parameters, tools } = req.body;
    
    const result = await agentManager.updateResource(
      req.params.id,
      req.user.userId,
      {
        name,
        system_prompt,
        status,
        parameters,
        tools,
        updated_at: new Date()
      }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/agents/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await agentManager.deleteResource(req.params.id, req.user.userId);
    eventEmitter.emit('agent:deleted', { id: req.params.id, userId: req.user.userId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
