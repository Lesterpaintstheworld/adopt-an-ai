const { AppError } = require('./errors');

class QueryBuilder {
  constructor() {
    this.query = '';
    this.values = [];
    this.currentParam = 1;
  }

  select(fields = '*') {
    this.query = `SELECT ${Array.isArray(fields) ? fields.join(', ') : fields}`;
    return this;
  }

  from(table) {
    if (!table) throw new AppError('Table name is required', 400);
    this.query += ` FROM ${table}`;
    return this;
  }

  where(conditions) {
    if (conditions && Object.keys(conditions).length > 0) {
      const clauses = [];
      for (const [key, value] of Object.entries(conditions)) {
        clauses.push(`${key} = $${this.currentParam}`);
        this.values.push(value);
        this.currentParam++;
      }
      this.query += ` WHERE ${clauses.join(' AND ')}`;
    }
    return this;
  }

  orderBy(field, direction = 'ASC') {
    if (field) {
      this.query += ` ORDER BY ${field} ${direction}`;
    }
    return this;
  }

  limit(limit) {
    if (limit) {
      this.query += ` LIMIT $${this.currentParam}`;
      this.values.push(limit);
      this.currentParam++;
    }
    return this;
  }

  offset(offset) {
    if (offset) {
      this.query += ` OFFSET $${this.currentParam}`;
      this.values.push(offset);
      this.currentParam++;
    }
    return this;
  }

  insert(table, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    this.query = `
      INSERT INTO ${table} (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    this.values = values;
    return this;
  }

  update(table, data, conditions) {
    const updates = Object.keys(data).map((key, i) => {
      this.values.push(data[key]);
      return `${key} = $${i + 1}`;
    });

    this.query = `UPDATE ${table} SET ${updates.join(', ')}`;
    
    if (conditions) {
      const whereClauses = Object.keys(conditions).map(key => {
        this.values.push(conditions[key]);
        return `${key} = $${this.values.length}`;
      });
      this.query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    this.query += ' RETURNING *';
    return this;
  }

  build() {
    return {
      text: this.query,
      values: this.values
    };
  }
}

module.exports = QueryBuilder;
