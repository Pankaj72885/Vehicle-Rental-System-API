import pool from '../../../config/db';
import AppError from '../../utils/AppError';
import { TVehicle } from './vehicle.interface';

const createVehicle = async (payload: TVehicle) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check duplicate registration
    const checkQuery = 'SELECT * FROM vehicles WHERE registration_number = $1';
    const checkResult = await client.query(checkQuery, [
      payload.registration_number,
    ]);

    if (checkResult.rows.length > 0) {
      throw new AppError(
        400,
        'Vehicle with this registration number already exists',
      );
    }

    const query = `
      INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      payload.vehicle_name,
      payload.type,
      payload.registration_number,
      payload.daily_rent_price,
      payload.availability_status || 'available',
    ];

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

const getAllVehicles = async () => {
  const query = 'SELECT * FROM vehicles ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

const getVehicleById = async (id: number) => {
  const query = 'SELECT * FROM vehicles WHERE id = $1';
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, 'Vehicle not found');
  }

  return result.rows[0];
};

const updateVehicle = async (id: number, payload: Partial<TVehicle>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const checkQuery = 'SELECT * FROM vehicles WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new AppError(404, 'Vehicle not found');
    }

    // Dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    // Add updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 1) {
      // Only updated_at
      // Nothing to update from payload, but continue to return the vehicle
    }

    values.push(id);
    const query = `
      UPDATE vehicles
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
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

const deleteVehicle = async (id: number) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if vehicle exists
    const checkVehicle = await client.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [id],
    );
    if (checkVehicle.rows.length === 0) {
      throw new AppError(404, 'Vehicle not found');
    }

    // Check for active bookings
    // Status 'active' means currently booked or upcoming. 'returned' or 'cancelled' allows deletion.
    const checkBooking = await client.query(
      "SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
      [id],
    );

    if (checkBooking.rows.length > 0) {
      throw new AppError(400, 'Cannot delete vehicle with active bookings');
    }

    await client.query('DELETE FROM vehicles WHERE id = $1', [id]);
    await client.query('COMMIT');

    return null;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const VehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
