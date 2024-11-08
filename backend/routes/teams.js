const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const validate = require('../middleware/validate');
const { schemas } = require('../utils/validation');
const ResourceManager = require('../utils/resourceManager');
const eventEmitter = require('../utils/eventEmitter');

const teamManager = new ResourceManager('teams', 'team');
const teamsController = new ResourceController(teamManager);

// Apply validation middleware
router.post('/', validate(schemas.team));
router.put('/:id', validate(schemas.team));
router.post('/:teamId/members', validate(schemas.teamMember));
router.post('/:teamId/agents', validate(schemas.teamAgent));

// CRUD routes
router.get('/', teamsController.list);
router.post('/', teamsController.create);
router.put('/:id', teamsController.update);
router.delete('/:id', teamsController.delete);

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
