const dbUtils = require('./db');
const { AppError } = require('./errors');

class ResourceManager {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async checkOwnership(resourceId, userId) {
    const exists = await dbUtils.checkExists(this.tableName, resourceId, userId);
    if (!exists) {
      throw new AppError('Resource not found or access denied', 404);
    }
    return true;
  }

  async getResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 AND user_id = $2`;
    const result = await dbUtils.executeQuery(query, [resourceId, userId]);
    return result.rows[0];
  }

  async deleteResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 AND user_id = $2`;
    await dbUtils.executeQuery(query, [resourceId, userId]);
  }
}

module.exports = ResourceManager;
