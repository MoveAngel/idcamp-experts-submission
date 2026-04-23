import pool from './src/Infrastructures/database/postgres/pool.js';
import config from './src/Commons/config.js';

console.info('Environment PGSSL:', process.env.PGSSL);
console.info('Resolved database config:', config.database);

async function testConnection() {
  try {
    const res = await pool.query('SELECT 1 as result');
    console.info('Connection successful:', res.rows[0]);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    pool.end();
  }
}

testConnection();
