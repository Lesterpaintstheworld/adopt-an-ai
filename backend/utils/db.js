const { Pool } = require('pg');
const logger = require('./logger');
const config = require('../config');
const { DatabaseError } = require('./errors');

const pool = new Pool(config.db.poolConfig);

// Monitor the pool events
pool.on('connect', () => {
  logger.info('New database connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error on idle client', err);
});

const dbUtils = {
  pool,

  async executeQuery(query, params = [], options = {}) {
    const start = Date.now();
    const client = await pool.connect();
    
    try {
      const result = await client.query(query, params);
      const duration = Date.now() - start;

      logger.info('Query executed', {
        duration,
        rowCount: result.rowCount,
        ...options.logExtra
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error('Database error', error, {
        query,
        params,
        duration,
        ...options.logExtra
      });
      
      throw new DatabaseError(
        'Database query failed',
        error.message,
        { query, params, duration }
      );
    } finally {
      client.release();
    }
  },

  async withTransaction(callback) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async findById(table, id, userId) {
    const query = `
      SELECT * FROM ${table} 
      WHERE id = $1 
      AND user_id = $2
    `;
    const result = await this.executeQuery(query, [id, userId]);
    return result.rows[0];
  },

  async checkExists(table, id, userId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM ${table} 
        WHERE id = $1 AND user_id = $2
      )
    `;
    const result = await this.executeQuery(query, [id, userId]);
    return result.rows[0].exists;
  },

  async insert(table, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.executeQuery(query, values);
    return result.rows[0];
  },

  async update(table, id, data, userId) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2}
      RETURNING *
    `;
    
    const result = await this.executeQuery(query, [...values, id, userId]);
    return result.rows[0];
  }
};

module.exports = dbUtils;
