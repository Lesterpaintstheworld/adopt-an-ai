const logger = require('./logger');

class QueryBuilder {
  static validateInput(input) {
    if (typeof input !== 'string' || input.trim().length === 0) {
      throw new Error('Invalid input parameter');
    }
    // Basic SQL injection prevention
    if (input.toLowerCase().includes('--') || input.includes(';')) {
      throw new Error('Potential SQL injection detected');
    }
    return input.trim();
  }

  static buildPaginatedQuery(baseQuery, orderBy = 'created_at DESC') {
    try {
      baseQuery = this.validateInput(baseQuery);
      orderBy = this.validateInput(orderBy);
      return `
      ${baseQuery}
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;
    } catch (error) {
      logger.error('Error building paginated query:', error);
      throw error;
    }
  }

  static buildUpdateQuery(table, fields, conditions) {
    try {
      table = this.validateInput(table);
      const updates = Object.keys(fields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
      
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + Object.keys(fields).length + 1}`)
        .join(' AND ');

      return `
        UPDATE ${table}
        SET ${updates}, updated_at = CURRENT_TIMESTAMP
        WHERE ${whereClause}
        RETURNING *
      `;
    } catch (error) {
      logger.error('Error building update query:', error);
      throw error;
    }
  }

  static buildInsertQuery(table, fields) {
    try {
      table = this.validateInput(table);
      const columns = Object.keys(fields).join(', ');
      const values = Object.keys(fields)
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      return `
        INSERT INTO ${table} (${columns})
        VALUES (${values})
        RETURNING *
      `;
    } catch (error) {
      logger.error('Error building insert query:', error);
      throw error;
    }
  }
}

module.exports = QueryBuilder;
