const dbUtils = require('./db');
const { NotFoundError, AccessDeniedError } = require('./errors');
const logger = require('./logger');
const QueryBuilder = require('./queryBuilder');

class ResourceManager {
  constructor(tableName, resourceName) {
    this.tableName = tableName;
    this.resourceName = resourceName || tableName;
  }

  async create(userId, data) {
    try {
      const qb = new QueryBuilder();
      const query = qb
        .insert(this.tableName, {
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date()
        })
        .build();

      const result = await dbUtils.executeQuery(query.text, query.values);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating ${this.resourceName}`, error);
      throw error;
    }
  }

  async list(userId, options = {}) {
    try {
      const qb = new QueryBuilder();
      const query = qb
        .select('*')
        .from(this.tableName)
        .where({ user_id: userId })
        .orderBy('created_at', 'DESC')
        .build();

      const result = await dbUtils.executeQuery(query.text, query.values);
      return result.rows;
    } catch (error) {
      logger.error(`Error listing ${this.resourceName}s`, error);
      throw error;
    }
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
    if (this.tableName === 'teams') {
      const result = await dbUtils.executeQuery(
        `SELECT EXISTS(
          SELECT 1 FROM teams t
          LEFT JOIN team_members tm ON t.id = tm.team_id
          WHERE t.id = $1 AND (t.owner_id = $2 OR tm.user_id = $2)
        )`,
        [resourceId, userId]
      );
      return result.rows[0].exists;
    }
    return true;
  }

  async getResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    
    const qb = new QueryBuilder();
    const query = qb
      .select('*')
      .from(this.tableName)
      .where({ id: resourceId })
      .build();

    const result = await dbUtils.executeQuery(query.text, query.values);
    return result.rows[0];
  }

  async deleteResource(resourceId, userId) {
    await this.checkOwnership(resourceId, userId);
    
    const qb = new QueryBuilder();
    const query = qb
      .delete()
      .from(this.tableName)
      .where({ id: resourceId })
      .returning('id')
      .build();

    const result = await dbUtils.executeQuery(query.text, query.values);
    return result.rows[0];
  }

  async updateResource(resourceId, userId, data) {
    await this.checkOwnership(resourceId, userId);

    const qb = new QueryBuilder();
    const query = qb
      .update(this.tableName, data, {
        id: resourceId,
        user_id: userId
      })
      .build();

    const result = await dbUtils.executeQuery(query.text, query.values);
    return result.rows[0];
  }
}

module.exports = ResourceManager;
