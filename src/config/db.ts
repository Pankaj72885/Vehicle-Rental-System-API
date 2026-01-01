import { Pool } from 'pg';
import config from './index';

const pool = new Pool({
  connectionString: config.database_url,
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
