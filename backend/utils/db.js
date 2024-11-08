const pool = require('../config/db');
const logger = require('./logger');

const dbUtils = {
  async executeQuery(query, params = [], options = {}) {
    const start = Date.now();
    try {
      const result = await pool.query(query, params);
      logger.info('Query executed', {
        duration: Date.now() - start,
        rowCount: result.rowCount,
        ...options.logExtra
      });
      return result;
    } catch (error) {
      logger.error('Database error', error, {
        query,
        params,
        duration: Date.now() - start,
        ...options.logExtra
      });
      throw error;
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
  }
};

module.exports = dbUtils;
