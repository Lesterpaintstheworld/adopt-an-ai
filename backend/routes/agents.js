const express = require('express');
const router = express.Router();
const dbUtils = require('../utils/db');
const httpResponses = require('../utils/responses');
const validation = require('../utils/validation');
const QueryBuilder = require('../utils/queryBuilder');

router.get('/', async (req, res) => {
  try {
    if (!req.user?.userId) {
      return httpResponses.unauthorized(res, 'No user data found in request');
    }

    const userExists = await dbUtils.checkExists('users', req.user.userId, req.user.userId);
    if (!userExists) {
      return httpResponses.notFound(res, 'User not found');
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

    httpResponses.success(res, result.rows);
  } catch (error) {
    httpResponses.serverError(res, error);
  }
});

// POST /api/agents
router.post('/', async (req, res) => {
  try {
    const { name, system_prompt, status, parameters, tools } = req.body;
    
    const query = `
      INSERT INTO agents (
        user_id, 
        name, 
        system_prompt, 
        status, 
        parameters, 
        tools
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const values = [
      req.user.userId,
      name,
      system_prompt,
      status || 'active',
      parameters || {},
      tools || []
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// PUT /api/agents/:id
router.put('/:id', async (req, res) => {
  try {
    const existingAgent = await pool.query(
      'SELECT * FROM agents WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (existingAgent.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const { name, system_prompt, status, parameters, tools } = req.body;
    
    const query = `
      UPDATE agents 
      SET 
        name = COALESCE($1, name),
        system_prompt = COALESCE($2, system_prompt),
        status = COALESCE($3, status),
        parameters = COALESCE($4, parameters),
        tools = COALESCE($5, tools),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    
    const values = [
      name,
      system_prompt,
      status,
      parameters,
      tools,
      req.params.id,
      req.user.userId
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// DELETE /api/agents/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM agents WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

module.exports = router;
