const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function runMigration() {
  try {
    // Read and execute migrations in order
    const migrations = [
      '001_create_users_table.sql',
      '002_create_agents_table.sql',
      '003_create_teams_table.sql'
    ];

    for (const migration of migrations) {
      const sql = await fs.readFile(
        path.join(__dirname, '..', 'migrations', migration),
        'utf8'
      );
      await pool.query(sql);
      console.log(`Migration ${migration} completed successfully`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
