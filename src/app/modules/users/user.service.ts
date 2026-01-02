import pool from '../../../config/db';
import AppError from '../../utils/AppError';
import { TUser } from './user.interface';

const getAllUsers = async () => {
  const query =
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users';
  const result = await pool.query(query);
  return result.rows;
};

const getUserById = async (id: number) => {
  const query =
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  return result.rows[0];
};

const updateUser = async (id: number, payload: Partial<TUser>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const checkQuery = 'SELECT * FROM users WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    // Dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(payload).forEach(([key, value]) => {
      // Prevent updating password directly via this route if not intended, or handle hashing if intended.
      // API ref doesn't explicitly mention password update here, but SRS says "Update any user's role or details".
      // Usually password updates are separate, but if allowed, should be hashed.
      // For now, let's assume standard profile details. If password is passed, it should probably be hashed in controller/service.
      // Given the schema in validation doesn't include password, we are safe.

      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    // Add updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;

    const result = await client.query(query, values);
    await client.query('COMMIT');

    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteUser = async (id: number) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists
    const checkUser = await client.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    if (checkUser.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    // Check for active bookings
    const checkBooking = await client.query(
      "SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'",
      [id],
    );

    if (checkBooking.rows.length > 0) {
      throw new AppError(400, 'Cannot delete user with active bookings');
    }

    await client.query('DELETE FROM users WHERE id = $1', [id]);
    await client.query('COMMIT');
    return null;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
