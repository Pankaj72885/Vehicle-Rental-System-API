import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import pool from '../../../config/db';
import AppError from '../../utils/AppError';
import { TUser } from '../users/user.interface';

const signup = async (payload: TUser) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserResult = await client.query(checkUserQuery, [payload.email]);

    if (checkUserResult.rows.length > 0) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      payload.password!,
      Number(config.bcrypt_salt_rounds),
    );

    // Create user
    const createUserQuery = `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;
    const createUserValues = [
      payload.name,
      payload.email,
      hashedPassword,
      payload.phone,
      payload.role,
    ];

    const result = await client.query(createUserQuery, createUserValues);
    await client.query('COMMIT');

    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const signin = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [payload.email]);

  if (result.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  const user = result.rows[0];

  const isPasswordMatched = await bcrypt.compare(
    payload.password!,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  const { password, ...userWithoutPassword } = user;

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    config.jwt_secret as string,
    { expiresIn: '1d' }, // Basic expiry
  );

  return {
    token,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  signup,
  signin,
};
