const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'raise_an_ai',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// GET /api/teams
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
             COUNT(tm.user_id) as member_count,
             CASE 
               WHEN t.owner_id = $1 THEN 'owner'
               ELSE tm.role 
             END as user_role
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      WHERE t.owner_id = $1 
         OR tm.user_id = $1
      GROUP BY t.id, tm.role
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, [req.user.userId]);
    console.log('Teams found:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      error: 'Failed to fetch teams',
      details: error.message 
    });
  }
});

// POST /api/teams
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const teamResult = await client.query(
      `INSERT INTO teams (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, req.user.userId]
    );
    
    await client.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [teamResult.rows[0].id, req.user.userId]
    );

    await client.query('COMMIT');
    
    const team = {
      ...teamResult.rows[0],
      member_count: 1,
      user_role: 'owner'
    };
    
    res.status(201).json(team);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating team:', error);
    res.status(500).json({ 
      error: 'Failed to create team',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
             COUNT(tm.user_id) as member_count,
             CASE 
               WHEN t.owner_id = $1 THEN 'owner'
               ELSE tm2.role 
             END as user_role
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN team_members tm2 ON t.id = tm2.team_id AND tm2.user_id = $1
      WHERE t.id = $2 AND (t.owner_id = $1 OR tm2.user_id = $1)
      GROUP BY t.id, tm2.role
    `;
    
    const result = await pool.query(query, [req.user.userId, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
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
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM teams WHERE id = $1 AND owner_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this team' });
    }
    
    res.status(204).send();
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

// GET /api/teams/:teamId/members
router.get('/:teamId/members', async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, u.picture, tm.role
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = $1
      ORDER BY tm.role DESC, u.name ASC
    `;
    
    const result = await pool.query(query, [req.params.teamId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      error: 'Failed to fetch team members',
      details: error.message 
    });
  }
});

module.exports = router;