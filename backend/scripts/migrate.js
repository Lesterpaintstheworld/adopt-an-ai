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
    // Read migration file
    const sql = await fs.readFile(
      path.join(__dirname, '..', 'migrations', '001_create_users_table.sql'),
      'utf8'
    );

    // Run migration
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
