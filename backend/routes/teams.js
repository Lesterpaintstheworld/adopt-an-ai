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
    
    httpResponses.success(res, result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/teams
router.post('/', validateResource('team'), async (req, res, next) => {
  try {
    const result = await dbUtils.withTransaction(async (client) => {
      const teamResult = await dbUtils.executeQuery(
        `INSERT INTO teams (name, description, owner_id, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.validated.name, req.validated.description, req.user.userId, 'active'],
        { client }
      );

      await dbUtils.executeQuery(
        `INSERT INTO team_members (team_id, user_id, role)
         VALUES ($1, $2, 'owner')`,
        [teamResult.rows[0].id, req.user.userId],
        { client }
      );

      return {
        ...teamResult.rows[0],
        member_count: 1,
        user_role: 'owner'
      };
    });

    eventEmitter.emit('team:created', { 
      teamId: result.id,
      userId: req.user.userId 
    });

    httpResponses.success(res, result, 201);
    
    httpResponses.success(res, team, 201);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

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
    httpResponses.success(res, result.rows);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ 
      error: 'Failed to fetch team',
      details: error.message 
    });
  }
});

// PUT /api/teams/:id
router.put('/:id', async (req, res) => {
  const { name, description, status } = req.body;
  
  try {
    const team = await pool.query(
      'SELECT * FROM teams WHERE id = $1 AND owner_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (team.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this team' });
    }
    
    const result = await pool.query(
      `UPDATE teams 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, description, status, req.params.id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ 
      error: 'Failed to update team',
      details: error.message 
    });
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

    httpResponses.success(res, null, 204);
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ 
      error: 'Failed to delete team',
      details: error.message 
    });
  }
});

// Add agent to team
router.post('/:teamId/agents', async (req, res) => {
  const { teamId } = req.params;
  const { agentId } = req.body;
  
  try {
    // Check user has rights on the team
    const teamCheck = await pool.query(
      `SELECT * FROM teams t
       LEFT JOIN team_members tm ON t.id = tm.team_id
       WHERE t.id = $1 AND (t.owner_id = $2 OR tm.user_id = $2)`,
      [teamId, req.user.userId]
    );

    if (teamCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to modify this team' });
    }

    // Add agent to team
    await pool.query(
      `INSERT INTO team_agents (team_id, agent_id)
       VALUES ($1, $2)
       ON CONFLICT (team_id, agent_id) DO NOTHING`,
      [teamId, agentId]
    );

    res.status(201).json({ message: 'Agent added to team successfully' });
  } catch (error) {
    console.error('Error adding agent to team:', error);
    res.status(500).json({ 
      error: 'Failed to add agent to team',
      details: error.message 
    });
  }
});

// DELETE agent from team
router.delete('/:teamId/agents/:agentId', async (req, res) => {
  const { teamId, agentId } = req.params;
  
  try {
    // Check user has rights on the team
    const teamCheck = await pool.query(
      `SELECT * FROM teams t
       LEFT JOIN team_members tm ON t.id = tm.team_id
       WHERE t.id = $1 AND (t.owner_id = $2 OR tm.user_id = $2)`,
      [teamId, req.user.userId]
    );

    if (teamCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to modify this team' });
    }

    // Remove agent from team
    await pool.query(
      `DELETE FROM team_agents 
       WHERE team_id = $1 AND agent_id = $2`,
      [teamId, agentId]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error removing agent from team:', error);
    res.status(500).json({ 
      error: 'Failed to remove agent from team',
      details: error.message 
    });
  }
});

// GET /api/teams/:teamId/members
router.get('/:teamId/members', async (req, res) => {
  try {
    const query = `
      SELECT a.*
      FROM team_agents ta
      JOIN agents a ON ta.agent_id = a.id
      WHERE ta.team_id = $1
      ORDER BY a.name ASC
    `;
    
    const result = await pool.query(query, [req.params.teamId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team agents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch team agents',
      details: error.message 
    });
  }
});

module.exports = router;
