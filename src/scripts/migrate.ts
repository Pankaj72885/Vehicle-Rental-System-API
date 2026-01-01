import pool from '../config/db';

const createTables = async () => {
  const query = `
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
    CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
    CREATE TYPE availability_status AS ENUM ('available', 'booked');
    CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role user_role NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type vehicle_type NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price DECIMAL(10, 2) NOT NULL,
      availability_status availability_status DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES users(id),
      vehicle_id INTEGER REFERENCES vehicles(id),
      rent_start_date TIMESTAMP NOT NULL,
      rent_end_date TIMESTAMP NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status booking_status DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query('BEGIN');

    // Check if types exist before creating to avoid errors on re-run (simplified for now)
    // NOTE: In a real migration tool, this would be handled better.
    // For this simple setup, we'll assume a fresh DB or ignore "type already exists" errors via exception handling if needed,
    // but the cleanest way for "dev" is to drop common schemas or handle conditionally.
    // However, PostgreSQL doesn't support "CREATE TYPE IF NOT EXISTS" natively in older versions or simply.
    // We will wrap types in a simpler block or just let it fail if they exist for now,
    // OR we can drop them first if we want a fresh start.

    // Let's drop tables/types first to ensure clean state for init (optional behavior, but good for "Setup" phase)
    await pool.query(`
      DROP TABLE IF EXISTS bookings;
      DROP TABLE IF EXISTS vehicles;
      DROP TABLE IF EXISTS users;
      DROP TYPE IF EXISTS booking_status;
      DROP TYPE IF EXISTS availability_status;
      DROP TYPE IF EXISTS vehicle_type;
      DROP TYPE IF EXISTS user_role;
    `);

    await pool.query(query);
    await pool.query('COMMIT');
    console.log('Tables created successfully');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    // pool.end(); // Keep pool open for seeding if we chain, or close here.
    // If run as standalone script:
  }
};

export default createTables;
