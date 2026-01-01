import bcrypt from 'bcrypt';
import pool from '../config/db';
import createTables from './migrate';

async function seed() {
  try {
    // Run migrations first to ensure fresh DB
    await createTables();

    const hashedPassword = await bcrypt.hash('password123', 12);

    // Seed Admin
    const query = `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      'Admin User',
      'admin@example.com',
      hashedPassword,
      '01700000000',
      'admin',
    ];

    const res = await pool.query(query, values);

    console.log('Admin user seeded:', res.rows[0]);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
