const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:rUMxgjeqHCVskCedvnnIIVaxgMszuVWK@mainline.proxy.rlwy.net:11405/railway',
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync('./schema.sql', 'utf8');
    await client.query(sql);
    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
