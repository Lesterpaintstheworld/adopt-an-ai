const express = require('express');
const router = express.Router();
const dbUtils = require('../utils/db');
const httpResponses = require('../utils/responses');
const { schemas, validate } = require('../utils/validation');
const QueryBuilder = require('../../backend/utils/queryBuilder');
const ResourceManager = require('../utils/resourceManager');
const eventEmitter = require('../utils/eventEmitter');

const teamManager = new ResourceManager('teams');

// Apply auth middleware to all routes
router.use(verifyToken);

// Apply validation middleware to relevant routes
router.post('/', validate(schemas.team));
router.put('/:id', validate(schemas.team));
router.post('/:teamId/members', validate(schemas.teamMember));
router.post('/:teamId/agents', validate(schemas.teamAgent));

// GET /api/teams
router.get('/', async (req, res, next) => {
  try {
    const qb = new QueryBuilder();
    const query = qb
      .select([
        't.*',
        'COUNT(tm.user_id) as member_count',
        `CASE 
          WHEN t.owner_id = $1 THEN 'owner'
          ELSE tm.role 
        END as user_role`
      ])
      .from('teams t')
      .join('LEFT JOIN team_members tm ON t.id = tm.team_id')
      .where('t.owner_id = $1 OR tm.user_id = $1')
      .groupBy(['t.id', 'tm.role'])
      .orderBy('t.created_at', 'DESC')
      .build();

    const result = await dbUtils.executeQuery(query.text, [req.user.userId]);
    eventEmitter.emit('teams:listed', { userId: req.user.userId, count: result.rows.length });
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/teams
router.post('/', validateResource('team'), async (req, res, next) => {
  try {
    const result = await teamManager.create(req.user.userId, {
      ...req.validated,
      status: 'active'
    });

    await dbUtils.executeQuery(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [result.id, req.user.userId]
    );

    eventEmitter.emit('team:created', {
      teamId: result.id,
      userId: req.user.userId
    });

    httpResponses.success(res, {
      ...result,
      member_count: 1,
      user_role: 'owner'
    }, 201);
  } catch (error) {
    next(error);
  }
});


// PUT /api/teams/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    
    const result = await teamManager.updateResource(
      req.params.id,
      req.user.userId,
      {
        name,
        description,
        status,
        updated_at: new Date()
      }
    );

    httpResponses.success(res, result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/teams/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await teamManager.checkOwnership(req.params.id, req.user.userId);
    await teamManager.deleteResource(req.params.id, req.user.userId);
    
    eventEmitter.emit('team:deleted', {
      teamId: req.params.id,
      userId: req.user.userId
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Add agent to team
router.post('/:teamId/agents', validateResource('teamAgent'), async (req, res, next) => {
  const { teamId } = req.params;
  const { agentId } = req.validated;
  
  try {
    await teamManager.checkOwnership(teamId, req.user.userId);
    
    await dbUtils.executeQuery(
      `INSERT INTO team_agents (team_id, agent_id)
       VALUES ($1, $2)
       ON CONFLICT (team_id, agent_id) DO NOTHING`,
      [teamId, agentId]
    );

    httpResponses.success(res, { message: 'Agent added to team successfully' }, 201);
  } catch (error) {
    next(error);
  }
});

// DELETE agent from team
router.delete('/:teamId/agents/:agentId', async (req, res, next) => {
  const { teamId, agentId } = req.params;
  
  try {
    await teamManager.checkOwnership(teamId, req.user.userId);
    
    await dbUtils.executeQuery(
      `DELETE FROM team_agents 
       WHERE team_id = $1 AND agent_id = $2`,
      [teamId, agentId]
    );

    httpResponses.noContent(res);
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/:teamId/members
router.get('/:teamId/members', async (req, res, next) => {
  try {
    await teamManager.checkOwnership(req.params.teamId, req.user.userId);

    const result = await dbUtils.executeQuery(
      `SELECT a.*
       FROM team_agents ta
       JOIN agents a ON ta.agent_id = a.id
       WHERE ta.team_id = $1
       ORDER BY a.name ASC`,
      [req.params.teamId]
    );
    
    httpResponses.success(res, result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
