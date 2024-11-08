class QueryBuilder {
  static buildPaginatedQuery(baseQuery, orderBy = 'created_at DESC') {
    return `
      ${baseQuery}
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;
  }

  static buildUpdateQuery(table, fields, conditions) {
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
  }

  static buildInsertQuery(table, fields) {
    const columns = Object.keys(fields).join(', ');
    const values = Object.keys(fields)
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    return `
      INSERT INTO ${table} (${columns})
      VALUES (${values})
      RETURNING *
    `;
  }
}

module.exports = QueryBuilder;
