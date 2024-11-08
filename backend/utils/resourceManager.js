const dbUtils = require('./db');
const { NotFoundError, AccessDeniedError } = require('./errors');
const logger = require('./logger');

class ResourceManager {
  constructor(tableName, resourceName) {
    this.tableName = tableName;
    this.resourceName = resourceName;
  }

  async checkOwnership(resourceId, userId) {
    try {
      const result = await dbUtils.executeQuery(
        `SELECT EXISTS(
          SELECT 1 FROM ${this.tableName}
          WHERE id = $1 AND user_id = $2
        )`,
        [resourceId, userId]
      );
      
      if (!result.rows[0].exists) {
        throw new NotFoundError(`${this.resourceName} not found`);
      }

      const hasAccess = await this.checkAccess(resourceId, userId);
      if (!hasAccess) {
        throw new AccessDeniedError(`Access denied to ${this.resourceName}`);
      }

      return true;
    } catch (error) {
      logger.error(`Error checking ownership for ${this.resourceName}`, error);
      throw error;
    }
  }

  async checkAccess(resourceId, userId) {
    // Override this method in child classes to implement custom access logic
    return true;
  }

  async getResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    
    const result = await dbUtils.executeQuery(
      `SELECT * FROM ${this.tableName}
       WHERE id = $1`,
      [resourceId]
    );
    
    return result.rows[0];
  }

  async deleteResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    
    return dbUtils.executeQuery(
      `DELETE FROM ${this.tableName}
       WHERE id = $1
       RETURNING id`,
      [resourceId]
    );
  }
}

module.exports = ResourceManager;